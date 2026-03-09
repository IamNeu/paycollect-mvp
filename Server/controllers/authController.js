const Merchant = require('../models/Merchant')
const jwt = require('jsonwebtoken')

// Helper — creates a JWT token for a merchant
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

// ── LOGIN ──
// POST /api/auth/login
const login = async(req, res) => {
    const { email, password } = req.body

    try {
        // 1. Check if merchant exists
        const merchant = await Merchant.findOne({ email })
        if (!merchant) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // 2. Check if password is correct
        const isMatch = await merchant.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        // 3. Check if account is active
        if (merchant.status === 'suspended') {
            return res.status(403).json({ message: 'Your account has been suspended. Contact support.' })
        }

        // 4. All good — send back token and merchant info
        res.json({
            token: generateToken(merchant._id),
            merchant: {
                id: merchant._id,
                company_name: merchant.company_name,
                email: merchant.email,
                plan: merchant.plan,
                currency: merchant.currency
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

// ── REGISTER (for testing only) ──
// POST /api/auth/register
const register = async(req, res) => {
    const { company_name, email, password } = req.body

    try {
        // Check if email already exists
        const exists = await Merchant.findOne({ email })
        if (exists) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        // Create new merchant
        const merchant = await Merchant.create({
            company_name,
            email,
            password_hash: password, // will be hashed automatically by the model
            status: 'active'
        })

        res.status(201).json({
            token: generateToken(merchant._id),
            merchant: {
                id: merchant._id,
                company_name: merchant.company_name,
                email: merchant.email,
                plan: merchant.plan
            }
        })

    } catch (error) {
        console.error('Register error DETAILS:', error)
        res.status(500).json({ message: 'Server error. Please try again.' })
    }
}

module.exports = { login, register }