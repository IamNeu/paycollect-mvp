const PaymentRequest = require('../models/PaymentRequest')
const Customer = require('../models/Customer')
const AIInsight = require('../models/AIInsight')
const { generateDashboardInsights } = require('../services/anthropicService')

const CACHE_HOURS = 24
const REGEN_COOLDOWN_MINUTES = 60

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

// Builds a compact data summary to hand to Claude — reuses the same
// aggregation logic as getAgingReport / getCustomerInsights but condensed.
async function buildMerchantSummary(merchantId) {
    const today = new Date()
    const requests = await PaymentRequest.find({ merchant_id: merchantId })

    const buckets = { current: 0, days_1_30: 0, days_31_60: 0, days_61_90: 0, days_90_plus: 0 }
    let totalOutstanding = 0
    let overdueCount = 0

    const customerMap = {}

    for (const r of requests) {
        const key = r.customer_mobile || r.customer_email || r.customer_name
        if (!customerMap[key]) {
            customerMap[key] = { name: r.customer_name, total: 0, paid: 0, late: 0, totalAmount: 0 }
        }
        customerMap[key].total++
            customerMap[key].totalAmount += r.amount_due

        if (r.status === 'paid') {
            customerMap[key].paid++
                if (new Date(r.paid_at) > new Date(r.due_date)) customerMap[key].late++
                    continue
        }

        if (r.status === 'pending' || r.status === 'partial') {
            const remaining = r.amount_due - (r.amount_paid || 0)
            totalOutstanding += remaining
            const daysOverdue = Math.floor((today - new Date(r.due_date)) / (1000 * 60 * 60 * 24))

            if (daysOverdue <= 0) buckets.current += remaining
            else if (daysOverdue <= 30) buckets.days_1_30 += remaining
            else if (daysOverdue <= 60) buckets.days_31_60 += remaining
            else if (daysOverdue <= 90) buckets.days_61_90 += remaining
            else buckets.days_90_plus += remaining

            if (daysOverdue > 0) overdueCount++
        }
    }

    const atRiskCustomers = Object.values(customerMap)
        .filter(c => c.total >= 3 && c.paid / c.total < 0.6)
        .map(c => ({ name: c.name, totalOwed: c.totalAmount, payRate: Math.round((c.paid / c.total) * 100) }))
        .sort((a, b) => b.totalOwed - a.totalOwed)
        .slice(0, 5)

    return {
        totalOutstanding: Number(totalOutstanding.toFixed(2)),
        overdueRequestCount: overdueCount,
        agingBuckets: buckets,
        totalCustomers: Object.keys(customerMap).length,
        atRiskCustomers
    }
}

// Shared by the controller (on-demand/cache-miss) and the nightly cron.
async function generateInsightsForMerchant(merchantId, source = 'cron') {
    const summary = await buildMerchantSummary(merchantId)
    const insights = await generateDashboardInsights(summary)

    const doc = await AIInsight.findOneAndUpdate({ merchant_id: merchantId }, { insights, generated_at: new Date(), source }, { upsert: true, new: true })
    return doc
}

// FEATURE 3 — Dashboard Insights (cached, Claude-powered)
const getDashboardInsights = async(req, res) => {
    try {
        const merchantId = req.merchant._id
        const cached = await AIInsight.findOne({ merchant_id: merchantId })

        const isStale = !cached || (Date.now() - new Date(cached.generated_at).getTime()) > CACHE_HOURS * 60 * 60 * 1000

        if (!isStale) {
            return res.json({ insights: cached.insights, generated_at: cached.generated_at, cached: true })
        }

        // Cache miss or stale — generate fresh
        const doc = await generateInsightsForMerchant(merchantId, cached ? 'cron' : 'manual')
        res.json({ insights: doc.insights, generated_at: doc.generated_at, cached: false })

    } catch (err) {
        console.error('Dashboard insights error:', err.message)
            // Fall back to cached data if generation fails, so the widget doesn't break
        const cached = await AIInsight.findOne({ merchant_id: req.merchant._id }).catch(() => null)
        if (cached) return res.json({ insights: cached.insights, generated_at: cached.generated_at, cached: true, stale: true })
        res.status(500).json({ message: 'Failed to generate insights' })
    }
}

// Manual "Regenerate" button — rate limited to avoid spamming the API
const regenerateDashboardInsights = async(req, res) => {
    try {
        const merchantId = req.merchant._id
        const existing = await AIInsight.findOne({ merchant_id: merchantId })

        if (existing) {
            const minutesSinceLast = (Date.now() - new Date(existing.generated_at).getTime()) / 60000
            if (minutesSinceLast < REGEN_COOLDOWN_MINUTES) {
                return res.status(429).json({
                    message: `Please wait ${Math.ceil(REGEN_COOLDOWN_MINUTES - minutesSinceLast)} more minute(s) before regenerating.`,
                    insights: existing.insights,
                    generated_at: existing.generated_at
                })
            }
        }

        const doc = await generateInsightsForMerchant(merchantId, 'manual')
        res.json({ insights: doc.insights, generated_at: doc.generated_at, cached: false })

    } catch (err) {
        console.error('Regenerate insights error:', err.message)
        res.status(500).json({ message: 'Failed to regenerate insights' })
    }
}

module.exports = { getAgingReport, getCustomerInsights, getDashboardInsights, regenerateDashboardInsights, generateInsightsForMerchant }