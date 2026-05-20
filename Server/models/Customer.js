const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    merchant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Merchant',
        required: true
    },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    tag: { type: String, default: 'Customer' },
    notes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Customer', customerSchema)