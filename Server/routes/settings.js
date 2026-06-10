const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')

router.post('/test-stripe', protect, async(req, res) => {
    try {
        const { secret_key } = req.body
        const Stripe = require('stripe')
        const stripe = Stripe(secret_key, { timeout: 5000 })
        await stripe.accounts.retrieve()
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ message: 'Invalid API key' })
    }
})

module.exports = router