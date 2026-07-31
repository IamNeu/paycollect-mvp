const express = require('express')
const router = express.Router()
const { handleWebhook, handleRedirect, completeSignup } = require('../controllers/appsumoController')

router.post('/webhook', handleWebhook)
router.get('/redirect', handleRedirect)
router.post('/complete-signup', completeSignup)

module.exports = router
