const mongoose = require('mongoose')

const insightItemSchema = new mongoose.Schema({
    type: { type: String, enum: ['warning', 'info', 'success', 'opportunity'], default: 'info' },
    icon: { type: String, default: '💡' },
    text: { type: String, required: true },
    action: {
        label: String,
        route: String
    }
}, { _id: false })

const aiInsightSchema = new mongoose.Schema({
    merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true, unique: true, index: true },
    insights: [insightItemSchema],
    generated_at: { type: Date, default: Date.now },
    source: { type: String, enum: ['cron', 'manual'], default: 'cron' }
}, { timestamps: true })

module.exports = mongoose.model('AIInsight', aiInsightSchema)