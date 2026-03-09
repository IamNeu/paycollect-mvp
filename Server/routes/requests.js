const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const {
    getRequests,
    createRequest,
    getRequestById,
    cancelRequest
} = require('../controllers/requestController')

router.get('/', protect, getRequests)
router.post('/', protect, createRequest)
router.get('/:id', protect, getRequestById)
router.patch('/:id/cancel', protect, cancelRequest)

module.exports = router