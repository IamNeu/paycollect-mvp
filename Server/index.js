require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware: CORS Configuration (Only once)

app.use(cors({
    origin: [
        'https://paycollect-mvp.vercel.app',
        'https://get-pay-collect.com',
        'https://www.get-pay-collect.com',
        'http://localhost:5173',
        'http://localhost:5174'

    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/pay', require('./routes/pay'));
app.use('/api/customers', require('./routes/customers'))
app.use('/api/webhooks', require('./routes/webhooks'))

// Flow C — Daily bulk sync cron job (runs every day at 8am PHT)
const cron = require('node-cron')
const { syncPendingPayments } = require('./services/stripeSync')
const Merchant = require('./models/Merchant')

cron.schedule('0 8 * * *', async() => {
    console.log('🕗 Running daily bulk payment sync...')
    try {
        const merchants = await Merchant.find({ status: 'active' })
        console.log('Syncing for', merchants.length, 'merchants')
        for (const merchant of merchants) {
            await syncPendingPayments(merchant._id)
        }
        console.log('✅ Daily bulk sync complete')
    } catch (err) {
        console.error('Daily sync error:', err.message)
    }
}, {
    timezone: 'Asia/Manila'
})

console.log('✅ Daily sync cron job scheduled for 8am PHT')

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'PayCollect API is running! 🚀' });
});

// Port Handling for Render
const PORT = process.env.PORT || 10000;

// Connect to MongoDB then start server (The ONLY listen block you need)
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI).then(() => {
        console.log('✅ Connected to MongoDB!');
        // This is the only place we should start the server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('❌ MongoDB connection failed:', error.message);
    });