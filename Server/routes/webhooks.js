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
        return res.status(400).json({ message: `Webhook Error: ${err.message}` })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        console.log('✅ Payment completed:', session.id)
        console.log('Payment link ID:', session.payment_link)
        console.log('Session metadata:', session.metadata)

        try {
            const paymentLinkId = session.payment_link
            let request = null

            if (paymentLinkId) {
                request = await PaymentRequest.findOne({
                    stripe_payment_link_id: paymentLinkId
                })
                console.log('Found by stripe_payment_link_id:', request ? request._id : null)
            }

            if (!request && session.metadata && session.metadata.request_id) {
                request = await PaymentRequest.findOne({
                    payment_link: { $regex: session.metadata.request_id }
                })
                console.log('Found by metadata request_id:', request ? request._id : null)
            }

            if (request) {
                request.status = 'paid'
                request.amount_paid = session.amount_total / 100
                request.paid_at = new Date()
                await request.save()
                console.log(`✅ Request ${request._id} marked as paid`)
            } else {
                console.log('❌ No matching request found for payment link:', paymentLinkId)
            }
        } catch (err) {
            console.error('Error updating request:', err.message)
        }
    }

    res.json({ received: true })
})

module.exports = router