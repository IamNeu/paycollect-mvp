const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, { timeout: 10000 })
const PaymentRequest = require('../models/PaymentRequest')

const syncPendingPayments = async(merchantId) => {
    try {
        console.log('🔄 Syncing pending payments for merchant:', merchantId)

        const pendingRequests = await PaymentRequest.find({
            merchant_id: merchantId,
            status: { $in: ['pending', 'partial'] },
            stripe_payment_link_id: { $exists: true, $ne: null }
        })

        // Debug — log first few requests
        pendingRequests.slice(0, 3).forEach(r => {
            console.log('Request:', r._id, 'stripe_payment_link_id:', r.stripe_payment_link_id)
        })

        console.log('Pending requests to sync:', pendingRequests.length)

        let updatedCount = 0

        for (const request of pendingRequests) {
            try {
                // The stripe_payment_link_id might be a URL suffix or a plink_ ID
                // Try both approaches
                let paidSession = null

                if (request.stripe_payment_link_id.startsWith('plink_')) {
                    // Correct format - use payment_link filter
                    const sessions = await stripe.checkout.sessions.list({
                        payment_link: request.stripe_payment_link_id,
                        limit: 10
                    })
                    paidSession = sessions.data.find(s => s.payment_status === 'paid')
                } else {
                    // Old format - URL suffix stored, skip these
                    console.log('Skipping old format request:', request._id)
                    continue
                }

                if (paidSession) {
                    request.status = 'paid'
                    request.amount_paid = paidSession.amount_total / 100
                    request.paid_at = new Date()
                    await request.save()
                    updatedCount++
                    console.log('✅ Synced request ' + request._id + ' to paid')
                }
            } catch (err) {

                if (err.message.includes('similar object exists in test mode')) {
                    // Skip silently — old test mode requests
                } else {
                    console.error('Error syncing request ' + request._id + ':', err.message)
                }
            }
        }

        console.log('✅ Sync complete. Updated:', updatedCount, 'of', pendingRequests.length)
        return { synced: updatedCount, total: pendingRequests.length }
    } catch (err) {
        console.error('Sync error:', err.message)
        return { synced: 0, total: 0 }
    }
}

module.exports = { syncPendingPayments }