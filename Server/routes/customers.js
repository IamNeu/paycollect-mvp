const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const PaymentRequest = require('../models/PaymentRequest')

// GET /api/customers — get unique customers from payment requests
router.get('/', protect, async(req, res) => {
    try {
        const { search } = req.query

        const match = { merchant_id: req.merchant._id }
        if (search) {
            match.$or = [
                { customer_name: { $regex: search, $options: 'i' } },
                { customer_mobile: { $regex: search, $options: 'i' } },
                { customer_email: { $regex: search, $options: 'i' } }
            ]
        }

        const customers = await PaymentRequest.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$customer_mobile',
                    name: { $first: '$customer_name' },
                    mobile: { $first: '$customer_mobile' },
                    email: { $first: '$customer_email' },
                    total_requests: { $sum: 1 },
                    total_paid: { $sum: '$amount_paid' },
                    outstanding: {
                        $sum: {
                            $cond: [
                                { $in: ['$status', ['pending', 'partial']] },
                                { $subtract: ['$amount_due', '$amount_paid'] },
                                0
                            ]
                        }
                    },
                    last_activity: { $max: '$updatedAt' },
                    statuses: { $push: '$status' }
                }
            },
            { $sort: { last_activity: -1 } }
        ])

        res.json({ customers })
    } catch (err) {
        console.error('Customers error:', err)
        res.status(500).json({ message: 'Server error' })
    }
})

// GET /api/customers/:mobile — get single customer with all requests
router.get('/:mobile', protect, async(req, res) => {
    try {
        const mobile = decodeURIComponent(req.params.mobile)

        const requests = await PaymentRequest.find({
            merchant_id: req.merchant._id,
            customer_mobile: mobile
        }).sort({ createdAt: -1 })

        if (requests.length === 0) {
            return res.status(404).json({ message: 'Customer not found' })
        }

        const customer = {
            name: requests[0].customer_name,
            mobile: requests[0].customer_mobile,
            email: requests[0].customer_email,
            total_requests: requests.length,
            total_paid: requests.reduce((s, r) => s + (r.amount_paid || 0), 0),
            outstanding: requests
                .filter(r => ['pending', 'partial'].includes(r.status))
                .reduce((s, r) => s + (r.amount_due - (r.amount_paid || 0)), 0),
            requests
        }

        res.json({ customer })
    } catch (err) {
        console.error('Customer detail error:', err)
        res.status(500).json({ message: 'Server error' })
    }
})

module.exports = router