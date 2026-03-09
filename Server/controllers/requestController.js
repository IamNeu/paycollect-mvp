const PaymentRequest = require('../models/PaymentRequest')

// GET all requests for this merchant
const getRequests = async(req, res) => {
    try {
        const filter = { merchant_id: req.merchant._id }

        // Filter by status if provided
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status
        }

        // Search by customer name or mobile
        if (req.query.search) {
            filter.$or = [
                { customer_name: { $regex: req.query.search, $options: 'i' } },
                { customer_mobile: { $regex: req.query.search, $options: 'i' } },
                { reference_id: { $regex: req.query.search, $options: 'i' } }
            ]
        }

        const requests = await PaymentRequest.find(filter)
            .sort({ createdAt: -1 })
            .limit(50)

        res.json({ requests })
    } catch (error) {
        console.error('Get requests error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

// POST create a new request
const createRequest = async(req, res) => {
    try {
        const {
            customer_name,
            customer_mobile,
            customer_email,
            amount_due,
            due_date,
            payment_type,
            allow_partial,
            description,
            reference_id
        } = req.body

        // Generate a payment link token
        const token = Math.random().toString(36).substring(2, 15)

        const request = await PaymentRequest.create({
            merchant_id: req.merchant._id,
            customer_name,
            customer_mobile,
            customer_email,
            amount_due,
            due_date,
            payment_type: payment_type || 'one_time',
            allow_partial: allow_partial !== false,
            description,
            reference_id,
            payment_link: `http://localhost:5173/pay/${token}`,
            sent_at: new Date()
        })

        res.status(201).json({ request })
    } catch (error) {
        console.error('Create request error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

// GET single request by ID
const getRequestById = async(req, res) => {
        try {
            const request = await PaymentRequest.findOne({
                _id: req.params.id,
                merchant_id: req.merchant._id
            })

            if (!request) {
                return res.status(404).json({ message: 'Request not found' })
            }

            res.json({ request })
        } catch (error) {
            console.error('Get request error:', error)
            res.status(500).json({ message: 'Server error' })
        }
    }
    // PATCH cancel a request
const cancelRequest = async(req, res) => {
    try {
        const request = await PaymentRequest.findOne({
            _id: req.params.id,
            merchant_id: req.merchant._id
        })

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (request.status === 'paid') {
            return res.status(400).json({ message: 'Cannot cancel a paid request' })
        }

        request.status = 'cancelled'
        request.cancelled_at = new Date()
        await request.save()

        res.json({ message: 'Request cancelled', request })
    } catch (error) {
        console.error('Cancel request error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}
module.exports = { getRequests, createRequest, getRequestById, cancelRequest }