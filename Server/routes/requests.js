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

module.exports = router