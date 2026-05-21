const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const PaymentRequest = require('../models/PaymentRequest')

router.post('/stripe', express.raw({ type: 'application/json' }), async(req, res) => {
    const sig = req.headers['stripe-signature']
    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.error('Webhook signature error:', err.message)
        return res.status(400).json({ message: 'Webhook Error: ' + err.message })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        console.log('✅ Payment completed:', session.id)
        console.log('Payment link ID:', session.payment_link)
        console.log('Session metadata:', session.metadata)

        try {
            const paymentLinkId = session.payment_link
            const requestId = session.metadata && session.metadata.request_id

            let request = null

            // Try 1: match by stripe_payment_link_id
            if (paymentLinkId) {
                request = await PaymentRequest.findOne({
                    stripe_payment_link_id: paymentLinkId
                })
                console.log('Try 1 - stripe_payment_link_id:', request ? request._id : 'not found')
            }

            // Try 2: match by request_id in payment_link field
            if (!request && requestId) {
                console.log('Try 2 - searching for request_id:', requestId)
                const allRequests = await PaymentRequest.find({}).limit(200)
                console.log('Total requests found:', allRequests.length)
                request = allRequests.find(function(r) {
                    return r.payment_link && r.payment_link.indexOf(requestId) !== -1
                })
                console.log('Try 2 result:', request ? request._id : 'not found')
            }

            // Try 3: match by payment_link containing the Stripe link ID
            if (!request && paymentLinkId) {
                console.log('Try 3 - searching by plink in payment_link field')
                const allRequests = await PaymentRequest.find({}).limit(200)
                request = allRequests.find(function(r) {
                    return r.payment_link && r.payment_link.indexOf(paymentLinkId) !== -1
                })
                console.log('Try 3 result:', request ? request._id : 'not found')
            }

            if (request) {
                request.status = 'paid'
                request.amount_paid = session.amount_total / 100
                request.paid_at = new Date()
                await request.save()
                console.log('✅ Request ' + request._id + ' marked as paid!')
            } else {
                console.log('❌ No matching request found')
                    // Log all payment links for debugging
                const allReqs = await PaymentRequest.find({}).limit(10).select('payment_link stripe_payment_link_id')
                console.log('Recent payment links:', JSON.stringify(allReqs))
            }
        } catch (err) {
            console.error('Error updating request:', err.message)
        }
    }

    res.json({ received: true })
})

module.exports = router