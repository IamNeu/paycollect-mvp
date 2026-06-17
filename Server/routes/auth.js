const express = require('express')
const router = express.Router()
const { login, register, getProfile, updateProfile } = require('../controllers/authController')
const protect = require('../middleware/auth')

router.post('/login', login)
router.post('/register', register)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)


const Merchant = require('../models/Merchant')
const jwt = require('jsonwebtoken')

router.post('/google', async(req, res) => {
    try {
        const { access_token } = req.body

        // Get user info from Google
        const googleRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        })
        const googleUser = await googleRes.json()
        console.log('Google user data:', googleUser)
        if (!googleUser.email) {
            return res.status(400).json({ message: 'Failed to get Google user info' })
        }

        // Check if merchant exists
        let merchant = await Merchant.findOne({ email: googleUser.email })

        if (!merchant) {
            // Create new merchant
            merchant = await Merchant.create({
                company_name: googleUser.name || googleUser.email.split('@')[0],
                email: googleUser.email,
                password_hash: Math.random().toString(36),
                status: 'active',
                google_id: googleUser.id
            })
        }

        const token = jwt.sign({ id: merchant._id }, process.env.JWT_SECRET, { expiresIn: '90d' })

        res.json({
            token,
            merchant: {
                id: merchant._id,
                company_name: merchant.company_name,
                email: merchant.email,
                plan: merchant.plan
            }
        })
    } catch (error) {
        console.error('Google auth error:', error)
        res.status(500).json({ message: 'Server error' })
    }
})
router.post('/settings/test-stripe', protect, async(req, res) => {
    try {
        const { secret_key } = req.body
        const Stripe = require('stripe')
        const stripe = Stripe(secret_key, { timeout: 5000 })
        await stripe.accounts.retrieve()
        res.json({ success: true, message: 'Connection successful' })
    } catch (err) {
        res.status(400).json({ message: 'Invalid API key' })
    }
})

// Stripe OAuth — generate authorization URL
router.get('/stripe-connect-url', protect, (req, res) => {
    const clientId = process.env.STRIPE_CLIENT_ID
    const redirectUri = `${process.env.BACKEND_URL || 'https://paycollect-api.onrender.com'}/api/auth/stripe-callback`
    const state = req.merchant._id.toString()

    const url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`

    res.json({ url })
})

// Stripe OAuth callback
router.get('/stripe-callback', async(req, res) => {
    try {
        const { code, state } = req.query

        // Exchange code for access token
        const Stripe = require('stripe')
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

        const response = await stripe.oauth.token({
            grant_type: 'authorization_code',
            code,
        })

        const connectedAccountId = response.stripe_user_id

        // Save to merchant
        await Merchant.findByIdAndUpdate(state, {
            stripe_account_id: connectedAccountId,
            stripe_connected: true
        })

        // Redirect to setup complete
        res.redirect(`${process.env.FRONTEND_URL || 'https://get-pay-collect.com'}/setup-complete`)
    } catch (err) {
        console.error('Stripe OAuth error:', err)
        res.redirect(`${process.env.FRONTEND_URL || 'https://get-pay-collect.com'}/connect-pg?error=oauth_failed`)
    }
})

// Stripe OAuth — generate authorization URL
router.get('/stripe-connect-url', protect, (req, res) => {
    const clientId = process.env.STRIPE_CLIENT_ID
    const redirectUri = `${process.env.BACKEND_URL}/api/auth/stripe-callback`
    const state = req.merchant._id.toString()
    const url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    res.json({ url })
})

// Stripe OAuth callback
router.get('/stripe-callback', async(req, res) => {
    try {
        const { code, state } = req.query
        const Stripe = require('stripe')
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
        const response = await stripe.oauth.token({
            grant_type: 'authorization_code',
            code,
        })
        const connectedAccountId = response.stripe_user_id
        await Merchant.findByIdAndUpdate(state, {
            stripe_account_id: connectedAccountId,
            stripe_connected: true
        })
        res.redirect(`${process.env.FRONTEND_URL}/setup-complete`)
    } catch (err) {
        console.error('Stripe OAuth error:', err)
        res.redirect(`${process.env.FRONTEND_URL}/connect-pg?error=oauth_failed`)
    }
})
module.exports = router