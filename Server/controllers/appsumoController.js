const License = require('../models/License')
const Merchant = require('../models/Merchant')
const jwt = require('jsonwebtoken')
const { exchangeCodeForToken, fetchLicenseKey } = require('../services/appsumoService')

// TODO: confirm with client before shipping — placeholder mapping
const TIER_PLAN_MAP = { 1: 'starter', 2: 'pro', 3: 'enterprise' }

const handleWebhook = async(req, res) => {
    const { license_key, prev_license_key, parent_license_key, event, event_timestamp,
        tier, test, extra, partner_plan_name, unit_quantity } = req.body

    res.json({ event, success: true })

    if (test) return

    try {
        switch (event) {
            case 'purchase': {
                await License.findOneAndUpdate(
                    { license_key },
                    {
                        $setOnInsert: { license_key, status: 'inactive' },
                        $set: { tier: tier || 1, partner_plan_name, unit_quantity, parent_license_key },
                        $push: { event_log: { event, event_timestamp, reason: extra?.reason } }
                    },
                    { upsert: true }
                )
                break
            }
            case 'activate': {
                const license = await License.findOneAndUpdate(
                    { license_key },
                    {
                        $set: { status: 'active' },
                        $push: { event_log: { event, event_timestamp, reason: extra?.reason } }
                    },
                    { new: true }
                )
                if (license?.merchant_id) {
                    await Merchant.findByIdAndUpdate(license.merchant_id, { status: 'active' })
                }
                break
            }
            case 'upgrade':
            case 'downgrade': {
                const oldLicense = await License.findOne({ license_key: prev_license_key })
                await License.findOneAndUpdate(
                    { license_key },
                    {
                        $setOnInsert: { license_key, status: 'inactive' },
                        $set: {
                            tier: tier || 1,
                            prev_license_key,
                            merchant_id: oldLicense?.merchant_id || null
                        },
                        $push: { event_log: { event, event_timestamp, reason: extra?.reason } }
                    },
                    { upsert: true }
                )
                if (oldLicense?.merchant_id) {
                    await Merchant.findByIdAndUpdate(oldLicense.merchant_id, {
                        appsumo_license_key: license_key,
                        appsumo_tier: tier || 1,
                        plan: TIER_PLAN_MAP[tier] || 'starter'
                    })
                }
                break
            }
            case 'deactivate': {
                const license = await License.findOneAndUpdate(
                    { license_key },
                    {
                        $set: { status: 'deactivated' },
                        $push: { event_log: { event, event_timestamp, reason: extra?.reason } }
                    },
                    { new: true }
                )
                if (license?.merchant_id) {
                    await Merchant.findByIdAndUpdate(license.merchant_id, { status: 'suspended' })
                }
                break
            }
            case 'migrate': {
                await License.findOneAndUpdate(
                    { license_key },
                    {
                        $set: { parent_license_key },
                        $push: { event_log: { event, event_timestamp, reason: extra?.reason } }
                    }
                )
                break
            }
            default:
                console.log('Unhandled AppSumo event:', event)
        }
    } catch (err) {
        console.error('AppSumo webhook processing error:', err.message)
    }
}

const handleRedirect = async(req, res) => {
    const { code } = req.query
    if (!code) return res.status(200).send('OK')

    const frontendUrl = process.env.FRONTEND_URL || 'https://get-pay-collect.com'

    try {
        const { access_token } = await exchangeCodeForToken(code)
        const { license_key } = await fetchLicenseKey(access_token)
        return res.redirect(`${frontendUrl}/appsumo/activate?license_key=${license_key}`)
    } catch (err) {
        console.error('AppSumo OAuth redirect error:', err.message)
        return res.redirect(`${frontendUrl}/appsumo/activate?error=oauth_failed`)
    }
}

const completeSignup = async(req, res) => {
    try {
        const { license_key, company_name, email, password } = req.body
        if (!license_key || !company_name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const license = await License.findOne({ license_key })
        if (!license) return res.status(404).json({ message: 'License not found' })
        if (license.status === 'deactivated') return res.status(403).json({ message: 'This license is no longer active' })

        const existingMerchant = await Merchant.findOne({ email: email.toLowerCase() })
        if (existingMerchant) return res.status(400).json({ message: 'An account with this email already exists' })

        const merchant = await Merchant.create({
            company_name,
            email,
            password_hash: password,
            status: 'active',
            plan: TIER_PLAN_MAP[license.tier] || 'starter',
            appsumo_license_key: license_key,
            appsumo_tier: license.tier
        })

        license.merchant_id = merchant._id
        await license.save()

        const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.json({
            token,
            merchant: {
                _id: merchant._id,
                company_name: merchant.company_name,
                email: merchant.email,
                plan: merchant.plan
            }
        })
    } catch (err) {
        console.error('AppSumo complete-signup error:', err.message)
        res.status(500).json({ message: 'Failed to complete signup' })
    }
}

module.exports = { handleWebhook, handleRedirect, completeSignup }
