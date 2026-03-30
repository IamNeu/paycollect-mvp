const express = require('express')
const router = express.Router()
const PaymentRequest = require('../models/PaymentRequest')

// GET /api/pay/:token
router.get('/:token', async(req, res) => {
    try {
        const token = req.params.token
        const request = await PaymentRequest.findOne({
            payment_link: { $regex: token, $options: 'i' }
        })
        if (!request) return res.status(404).json({ message: 'Payment link not found' })
        if (request.status === 'paid') return res.status(400).json({ message: 'This request has already been paid' })
        if (request.status === 'cancelled') return res.status(400).json({ message: 'This request has been cancelled' })
        res.json({ request })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

// POST /api/pay/:token
router.post('/:token', async(req, res) => {
    try {
        const token = req.params.token
        const { amount, payment_mode } = req.body
        const request = await PaymentRequest.findOne({
            payment_link: { $regex: token, $options: 'i' }
        })
        if (!request) return res.status(404).json({ message: 'Payment link not found' })
        if (request.status === 'paid') return res.status(400).json({ message: 'Already paid' })

        const payAmount = parseFloat(amount)
        request.amount_paid = (request.amount_paid || 0) + payAmount
        request.status = request.amount_paid >= request.amount_due ? 'paid' : 'partial'
        if (request.status === 'paid') request.paid_at = new Date()
        await request.save()

        res.json({ success: true, status: request.status, amount_paid: request.amount_paid })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router