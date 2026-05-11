const express = require('express')
const router = express.Router()
const { login, register, getProfile, updateProfile } = require('../controllers/authController')
const protect = require('../middleware/auth')

router.post('/login', login)
router.post('/register', register)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

module.exports = router