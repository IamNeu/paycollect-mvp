const getStats = async(req, res) => {
    try {
        // For now return placeholder data
        // We will connect real data after we build payment requests
        res.json({
            total_collected: 0,
            outstanding: 0,
            collection_rate: 0,
            avg_days_to_pay: 0,
            active_customers: 0,
            collections_by_day: [],
            collections_by_channel: [],
            request_status_counts: {
                paid: 0,
                pending: 0,
                partial: 0,
                expired: 0
            }
        })
    } catch (error) {
        console.error('Dashboard stats error:', error)
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = { getStats }