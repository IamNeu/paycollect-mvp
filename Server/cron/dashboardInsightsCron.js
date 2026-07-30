const cron = require('node-cron')
const Merchant = require('../models/Merchant')
const { generateInsightsForMerchant } = require('../controllers/aiController')

function startDashboardInsightsCron() {
    // Runs nightly at 2:00 AM server time
    cron.schedule('0 2 * * *', async() => {
        console.log('🤖 Running nightly AI dashboard insights generation...')
        const merchants = await Merchant.find({}, '_id')
        for (const m of merchants) {
            try {
                await generateInsightsForMerchant(m._id, 'cron')
            } catch (err) {
                console.error(`Insight generation failed for merchant ${m._id}:`, err.message)
            }
        }
        console.log(`✅ Nightly insights done for ${merchants.length} merchant(s).`)
    })
}

module.exports = startDashboardInsightsCron