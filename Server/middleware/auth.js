const jwt = require('jsonwebtoken')
const Merchant = require('../models/Merchant')

const protect = async(req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized. Please log in.' })
        }

        const token = authHeader.split(' ')[1]

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Find merchant and attach to request
        req.merchant = await Merchant.findById(decoded.id).select('-password_hash')
        if (!req.merchant) {
            return res.status(401).json({ message: 'Merchant not found' })
        }

        next()
    } catch (error) {
        res.status(401).json({ message: 'Token invalid or expired. Please log in again.' })
    }
}

module.exports = protect