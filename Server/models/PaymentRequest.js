const mongoose = require('mongoose')

const paymentRequestSchema = new mongoose.Schema({
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
    },
    customer_name: { type: String, required: true },
    customer_mobile: { type: String, required: true },
    customer_email: { type: String },
    reference_id: { type: String },
    amount_due: { type: Number, required: true },
    amount_paid: { type: Number, default: 0 },
    currency: { type: String, default: 'PHP' },
    due_date: { type: Date, required: true },
    payment_type: {
        type: String,
        enum: ['one_time', 'weekly', 'fortnightly', 'monthly'],
        default: 'one_time'
    },
    allow_partial: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'expired', 'cancelled'],
        default: 'pending'
    },
    description: { type: String },
    payment_link: { type: String },
    sent_at: { type: Date },
    paid_at: { type: Date },
    cancelled_at: { type: Date },
    last_reminded_at: { type: Date },
    reminder_count: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema)