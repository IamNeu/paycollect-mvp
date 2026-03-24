const PaymentRequest = require('../models/PaymentRequest')

const getStats = async(req, res) => {
    try {
        const merchant_id = req.merchant._id
        const requests = await PaymentRequest.find({ merchant_id })

        const paid = requests.filter(r => r.status === 'paid')
        const pending = requests.filter(r => r.status === 'pending')
        const partial = requests.filter(r => r.status === 'partial')
        const expired = requests.filter(r => r.status === 'expired')

        const total_collected = paid.reduce((s, r) => s + r.amount_paid, 0) +
            partial.reduce((s, r) => s + r.amount_paid, 0)

        const outstanding = pending.reduce((s, r) => s + (r.amount_due - r.amount_paid), 0) +
            partial.reduce((s, r) => s + (r.amount_due - r.amount_paid), 0)

        const collection_rate = requests.length > 0 ?
            Math.round((paid.length / requests.length) * 100) : 0

        const active_customers = new Set(requests.map(r => r.customer_mobile)).size

        res.json({
            total_collected,
            outstanding,
            collection_rate,
            avg_days_to_pay: 3,
            active_customers,
            collections_by_day: [],
            collections_by_channel: [],
            request_status_counts: {
                paid: paid.length,
                pending: pending.length,
                partial: partial.length,
                expired: expired.length
            }
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getStats }