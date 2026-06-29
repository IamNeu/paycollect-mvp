const PaymentRequest = require('../models/PaymentRequest')
const { createPaymentLink } = require('../services/stripe')
const { sendPaymentRequestEmail } = require('../services/email')
const { sendSMS } = require('../services/sms')

// GET all requests for this merchant
const getRequests = async(req, res) => {
    try {
        const filter = { merchant_id: req.merchant._id }

        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status
        }

        if (req.query.from && req.query.to) {
            filter.createdAt = {
                $gte: new Date(req.query.from),
                $lte: new Date(req.query.to)
            }
        }

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
        console.log('Create request body:', req.body)
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

        // Create Stripe payment link
        let stripeUrl = null
        let stripeLinkId = null
        console.log('Calling Stripe with amount:', amount_due, 'currency: usd')
        try {
            const stripeLink = await createPaymentLink({
                customerName: customer_name,
                amount: amount_due,
                currency: 'usd',
                description: description || `Payment request for ${customer_name}`,
                requestId: token
            })
            stripeUrl = stripeLink.url
            stripeLinkId = stripeLink.id
            console.log('Stripe link ID:', stripeLinkId)
        } catch (stripeErr) {
            console.error('Stripe error:', stripeErr.message)
        }

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
            payment_link: stripeUrl || token,
            stripe_payment_link_id: stripeLinkId || null,
            sent_at: new Date()
        })

        // Send email to customer if email provided
        console.log('Email check:', customer_email, request.payment_link)
        if (customer_email && request.payment_link) {
            try {
                const merchant = req.merchant
                await sendPaymentRequestEmail({
                    customerEmail: customer_email,
                    customerName: customer_name,
                    merchantName: merchant.company_name,
                    amount: amount_due,
                    dueDate: due_date,
                    paymentLink: request.payment_link,
                    description: description
                })
            } catch (emailErr) {
                console.error('Email error:', emailErr.message)
            }
        }

        // Send SMS to customer if mobile provided
        if (customer_mobile && request.payment_link) {
            try {
                const merchant = req.merchant
                await sendSMS({
                    phoneNumber: customer_mobile,
                    message: `Hi ${customer_name}, you have a payment request of $${amount_due} from ${merchant.company_name}. Pay here: ${request.payment_link}`
                })
                console.log('SMS sent to:', customer_mobile)
            } catch (smsErr) {
                console.error('SMS error:', smsErr.message)
            }
        }

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

// POST remind a customer
const remindRequest = async(req, res) => {
    try {
        const request = await PaymentRequest.findOne({
            _id: req.params.id,
            merchant_id: req.merchant._id
        })

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (request.status === 'paid') {
            return res.status(400).json({ message: 'Request is already paid' })
        }

        request.last_reminded_at = new Date()
        request.reminder_count = (request.reminder_count || 0) + 1
        await request.save()

        // Send SMS reminder
        if (request.customer_mobile && request.payment_link) {
            try {
                await sendSMS({
                    phoneNumber: request.customer_mobile,
                    message: `Reminder: Hi ${request.customer_name}, your payment of $${request.amount_due} is due. Pay here: ${request.payment_link}`
                })
                console.log(`SMS reminder sent to ${request.customer_name} at ${request.customer_mobile}`)
            } catch (smsErr) {
                console.error('SMS reminder error:', smsErr.message)
            }
        }

        // Send email reminder
        if (request.customer_email && request.payment_link) {
            try {
                await sendPaymentRequestEmail({
                    customerEmail: request.customer_email,
                    customerName: request.customer_name,
                    merchantName: req.merchant.company_name,
                    amount: request.amount_due,
                    dueDate: request.due_date,
                    paymentLink: request.payment_link,
                    description: `Reminder: ${request.description || 'Payment due'}`
                })
            } catch (emailErr) {
                console.error('Email reminder error:', emailErr.message)
            }
        }

        res.json({
            message: `Reminder sent to ${request.customer_name}`,
            request
        })
    } catch (error) {
        console.error('Remind error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getRequests, createRequest, getRequestById, cancelRequest, remindRequest }