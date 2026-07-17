const PaymentRequest = require('../models/PaymentRequest')
const Customer = require('../models/Customer')

// FEATURE 1 — Payment Aging Analysis
const getAgingReport = async(req, res) => {
    try {
        const merchantId = req.merchant._id
        const today = new Date()

        const pendingRequests = await PaymentRequest.find({
            merchant_id: merchantId,
            status: { $in: ['pending', 'partial'] }
        })

        const buckets = {
            current: { label: 'Not yet due', requests: [], total: 0 },
            days_1_30: { label: '1-30 days overdue', requests: [], total: 0 },
            days_31_60: { label: '31-60 days overdue', requests: [], total: 0 },
            days_61_90: { label: '61-90 days overdue', requests: [], total: 0 },
            days_90_plus: { label: '90+ days overdue', requests: [], total: 0 },
        }

        let totalOutstanding = 0

        for (const req of pendingRequests) {
            const dueDate = new Date(req.due_date)
            const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
            const remaining = req.amount_due - (req.amount_paid || 0)

            totalOutstanding += remaining

            const entry = {
                _id: req._id,
                customer_name: req.customer_name,
                customer_mobile: req.customer_mobile,
                amount_due: req.amount_due,
                amount_paid: req.amount_paid || 0,
                remaining,
                due_date: req.due_date,
                days_overdue: daysOverdue,
                payment_link: req.payment_link
            }

            if (daysOverdue <= 0) {
                buckets.current.requests.push(entry)
                buckets.current.total += remaining
            } else if (daysOverdue <= 30) {
                buckets.days_1_30.requests.push(entry)
                buckets.days_1_30.total += remaining
            } else if (daysOverdue <= 60) {
                buckets.days_31_60.requests.push(entry)
                buckets.days_31_60.total += remaining
            } else if (daysOverdue <= 90) {
                buckets.days_61_90.requests.push(entry)
                buckets.days_61_90.total += remaining
            } else {
                buckets.days_90_plus.requests.push(entry)
                buckets.days_90_plus.total += remaining
            }
        }

        // Generate action summary
        const highRiskTotal = buckets.days_61_90.total + buckets.days_90_plus.total
        const highRiskCount = buckets.days_61_90.requests.length + buckets.days_90_plus.requests.length

        let actionSummary = `You have $${totalOutstanding.toFixed(2)} outstanding across ${pendingRequests.length} payment requests. `

        if (highRiskCount > 0) {
            actionSummary += `⚠️ $${highRiskTotal.toFixed(2)} is 60+ days overdue across ${highRiskCount} customers — prioritize these this week.`
        } else if (buckets.days_1_30.requests.length > 0) {
            actionSummary += `${buckets.days_1_30.requests.length} payment(s) are 1-30 days overdue — send reminders now.`
        } else {
            actionSummary += `✅ No high-risk overdue payments. Keep it up!`
        }

        res.json({
            buckets,
            totalOutstanding,
            totalRequests: pendingRequests.length,
            actionSummary
        })

    } catch (err) {
        console.error('Aging report error:', err.message)
        res.status(500).json({ message: 'Failed to generate aging report' })
    }
}

// FEATURE 2 — Customer Payment Intelligence
const getCustomerInsights = async(req, res) => {
    try {
        const merchantId = req.merchant._id

        const requests = await PaymentRequest.find({ merchant_id: merchantId })

        // Group by customer
        const customerMap = {}
        for (const req of requests) {
            const key = req.customer_mobile || req.customer_email || req.customer_name
            if (!customerMap[key]) {
                customerMap[key] = {
                    name: req.customer_name,
                    mobile: req.customer_mobile,
                    email: req.customer_email,
                    total: 0,
                    paid: 0,
                    late: 0,
                    onTime: 0,
                    totalAmount: 0,
                    paidAmount: 0,
                }
            }

            customerMap[key].total++
                customerMap[key].totalAmount += req.amount_due

            if (req.status === 'paid') {
                customerMap[key].paid++
                    customerMap[key].paidAmount += req.amount_due

                // Check if paid on time
                const paidDate = new Date(req.paid_at)
                const dueDate = new Date(req.due_date)
                if (paidDate <= dueDate) {
                    customerMap[key].onTime++
                } else {
                    customerMap[key].late++
                }
            }
        }

        // Classify each customer
        const insights = Object.values(customerMap).map(c => {
            const payRate = c.total > 0 ? c.paid / c.total : 0
            const onTimeRate = c.paid > 0 ? c.onTime / c.paid : 0

            let classification = 'new'
            let badge = '🆕'
            let insight = 'New customer — insufficient data to classify.'

            if (c.total >= 3) {
                if (payRate >= 0.8 && onTimeRate >= 0.8) {
                    classification = 'good'
                    badge = '🟢'
                    insight = `Reliable payer — paid ${c.paid} of ${c.total} invoices on time.`
                } else if (payRate >= 0.6 && onTimeRate >= 0.5) {
                    classification = 'slow'
                    badge = '🟡'
                    insight = `Slow payer — pays but often late. ${c.late} of ${c.paid} payments were overdue.`
                } else if (payRate >= 0.3) {
                    classification = 'at_risk'
                    badge = '🔴'
                    insight = `At risk — only paid ${c.paid} of ${c.total} invoices. Follow up urgently.`
                } else {
                    classification = 'bad'
                    badge = '⚫'
                    insight = `Bad payer — paid only ${c.paid} of ${c.total} invoices. Consider requiring upfront payment.`
                }
            }

            return {
                name: c.name,
                mobile: c.mobile,
                email: c.email,
                classification,
                badge,
                insight,
                stats: {
                    total: c.total,
                    paid: c.paid,
                    late: c.late,
                    onTime: c.onTime,
                    payRate: Math.round(payRate * 100),
                    totalAmount: c.totalAmount,
                    paidAmount: c.paidAmount,
                }
            }
        })

        res.json({ insights })

    } catch (err) {
        console.error('Customer insights error:', err.message)
        res.status(500).json({ message: 'Failed to generate customer insights' })
    }
}

// FEATURE 3 — Dashboard Insights (placeholder for now)
const getDashboardInsights = async(req, res) => {
    try {
        res.json({
            insights: [{
                type: 'info',
                icon: '📊',
                text: 'AI insights coming soon — aging analysis and customer intelligence are live now.',
                action: null
            }]
        })
    } catch (err) {
        res.status(500).json({ message: 'Failed to generate insights' })
    }
}

module.exports = { getAgingReport, getCustomerInsights, getDashboardInsights }