const mongoose = require('mongoose')

const licenseSchema = new mongoose.Schema({
    license_key: { type: String, required: true, unique: true, index: true },
    prev_license_key: { type: String },
    parent_license_key: { type: String, index: true },
    partner_plan_name: { type: String },
    unit_quantity: { type: Number },
    tier: { type: Number, default: 1 },
    status: { type: String, enum: ['inactive', 'active', 'deactivated'], default: 'inactive' },
    merchant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', default: null },
    event_log: [{
        event: String,
        event_timestamp: Number,
        reason: String,
        received_at: { type: Date, default: Date.now }
    }],
}, { timestamps: true })

module.exports = mongoose.model('License', licenseSchema)
