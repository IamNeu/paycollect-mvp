const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const {
    getRequests,
    createRequest,
    getRequestById,
    cancelRequest,
    remindRequest
} = require('../controllers/requestController')

router.get('/', protect, getRequests)
router.post('/', protect, createRequest)
router.get('/:id', protect, getRequestById)
router.patch('/:id/cancel', protect, cancelRequest)
router.post('/:id/remind', protect, remindRequest)

const { syncPendingPayments } = require('../services/stripeSync')

router.post('/sync', protect, async(req, res) => {
    try {
        const result = await syncPendingPayments(req.merchant._id)
        res.json(result)
    } catch (err) {
        res.status(500).json({ message: 'Sync failed' })
    }
})

module.exports = router