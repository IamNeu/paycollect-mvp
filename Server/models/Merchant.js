const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const merchantSchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password_hash: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    currency: {
        type: String,
        default: 'PHP'
    },
    timezone: {
        type: String,
        default: 'Asia/Manila'
    },
    plan: {
        type: String,
        enum: ['starter', 'pro', 'enterprise'],
        default: 'starter'
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'trial'],
        default: 'trial'
    }
}, { timestamps: true })

// Automatically hash password before saving
merchantSchema.pre('save', async function() {
    if (!this.isModified('password_hash')) return
    this.password_hash = await bcrypt.hash(this.password_hash, 10)
})



// Method to check if password is correct
merchantSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash)
}

module.exports = mongoose.model('Merchant', merchantSchema)