const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { getAgingReport, getCustomerInsights, getDashboardInsights } = require('../controllers/aiController')

router.get('/aging-report', protect, getAgingReport)
router.get('/customer-insights', protect, getCustomerInsights)
router.get('/dashboard-insights', protect, getDashboardInsights)

module.exports = router