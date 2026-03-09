const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/requests', require('./routes/requests'))


// Test route
app.get('/', (req, res) => {
    res.json({ message: 'PayCollect API is running! 🚀' })
})

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB!')
        app.listen(process.env.PORT, () => {
            console.log(`✅ Server running on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log('❌ MongoDB connection failed:', error.message)
    })