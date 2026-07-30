const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const { getAgingReport, getCustomerInsights, getDashboardInsights, regenerateDashboardInsights } = require('../controllers/aiController')

router.get('/aging-report', protect, getAgingReport)
router.get('/customer-insights', protect, getCustomerInsights)
router.get('/dashboard-insights', protect, getDashboardInsights)
router.post('/dashboard-insights/regenerate', protect, regenerateDashboardInsights)

module.exports = router