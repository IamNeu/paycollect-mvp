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

module.exports = router