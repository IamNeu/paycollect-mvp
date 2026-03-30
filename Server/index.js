require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware: CORS Configuration (Only once)

app.use(cors({
    origin: '*', // This allows all devices/phones to connect
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/pay', require('./routes/pay'));

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'PayCollect API is running! 🚀' });
});

// Port Handling for Render
const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB!');
        app.listen(PORT, () => {
            console.log('✅ Server running on port ' + PORT);
        });
    })
    .catch((error) => {
        console.log('❌ MongoDB connection failed:', error.message);
    });