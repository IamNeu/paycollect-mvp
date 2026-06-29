const express = require('express')
const router = express.Router()
const multer = require('multer')
const XLSX = require('xlsx')
const protect = require('../middleware/auth')
const Customer = require('../models/Customer')
const PaymentRequest = require('../models/PaymentRequest')
const { createPaymentLink } = require('../services/stripe')
const { sendPaymentRequestEmail } = require('../services/email')
const { sendSMS } = require('../services/sms')

// Store file in memory
const upload = multer({ storage: multer.memoryStorage() })

// POST /api/upload/customers — bulk upload customers from Excel
router.post('/customers', protect, upload.single('file'), async(req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet)

        if (rows.length === 0) return res.status(400).json({ message: 'Excel file is empty' })

        let created = 0
        let skipped = 0
        const errors = []

        for (const row of rows) {
            try {
                const name = row['Name'] || row['name'] || row['Customer Name'] || row['customer_name']
                const email = row['Email'] || row['email'] || row['Customer Email'] || row['customer_email']
                const mobile = row['Mobile'] || row['mobile'] || row['Phone'] || row['phone'] || row['Mobile Number']

                if (!name) { skipped++; continue }

                // Check if customer already exists
                const existing = await Customer.findOne({
                    merchant_id: req.merchant._id,
                    $or: [
                        email ? { email } : null,
                        mobile ? { mobile } : null
                    ].filter(Boolean)
                })

                if (existing) { skipped++; continue }

                await Customer.create({
                    merchant_id: req.merchant._id,
                    name,
                    email: email || '',
                    mobile: mobile || '',
                })
                created++
            } catch (err) {
                errors.push(`Row error: ${err.message}`)
            }
        }

        res.json({
            message: `Upload complete! Created ${created} customers, skipped ${skipped} duplicates.`,
            created,
            skipped,
            errors
        })
    } catch (err) {
        console.error('Customer upload error:', err)
        res.status(500).json({ message: 'Upload failed: ' + err.message })
    }
})

// POST /api/upload/payments — bulk upload payment requests from Excel
router.post('/payments', protect, upload.single('file'), async(req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet)

        if (rows.length === 0) return res.status(400).json({ message: 'Excel file is empty' })

        let created = 0
        let failed = 0
        const errors = []

        for (const row of rows) {
            try {
                const customer_name = row['Customer Name'] || row['Name'] || row['name'] || row['customer_name']
                const customer_email = row['Email'] || row['email'] || row['customer_email']
                const customer_mobile = row['Mobile'] || row['mobile'] || row['Phone'] || row['phone']
                const amount_due = parseFloat(row['Amount'] || row['amount'] || row['Amount Due'] || row['amount_due'] || 0)
                const due_date = row['Due Date'] || row['due_date'] || row['DueDate']
                const description = row['Description'] || row['description'] || row['Note'] || ''

                if (!customer_name || !amount_due) { failed++; continue }

                const token = Math.random().toString(36).substring(2, 15)
                let stripeUrl = null
                let stripeLinkId = null

                try {
                    const stripeLink = await createPaymentLink({
                        customerName: customer_name,
                        amount: amount_due,
                        currency: 'usd',
                        description: description || `Payment request for ${customer_name}`,
                        requestId: token
                    })
                    stripeUrl = stripeLink.url
                    stripeLinkId = stripeLink.id
                } catch (stripeErr) {
                    console.error('Stripe error for row:', stripeErr.message)
                }

                const request = await PaymentRequest.create({
                    merchant_id: req.merchant._id,
                    customer_name,
                    customer_email: customer_email || '',
                    customer_mobile: customer_mobile || '',
                    amount_due,
                    due_date: due_date ? new Date(due_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    payment_type: 'one_time',
                    allow_partial: true,
                    description,
                    payment_link: stripeUrl || token,
                    stripe_payment_link_id: stripeLinkId || null,
                    sent_at: new Date()
                })

                // Send email
                if (customer_email && request.payment_link) {
                    try {
                        await sendPaymentRequestEmail({
                            customerEmail: customer_email,
                            customerName: customer_name,
                            merchantName: req.merchant.company_name,
                            amount: amount_due,
                            dueDate: due_date,
                            paymentLink: request.payment_link,
                            description
                        })
                    } catch (emailErr) {
                        console.error('Email error:', emailErr.message)
                    }
                }

                // Send SMS
                if (customer_mobile && request.payment_link) {
                    try {
                        await sendSMS({
                            phoneNumber: customer_mobile,
                            message: `Hi ${customer_name}, you have a payment request of $${amount_due} from ${req.merchant.company_name}. Pay here: ${request.payment_link}`
                        })
                    } catch (smsErr) {
                        console.error('SMS error:', smsErr.message)
                    }
                }

                created++
            } catch (err) {
                failed++
                errors.push(`Row error: ${err.message}`)
            }
        }

        res.json({
            message: `Upload complete! Created ${created} payment requests, ${failed} failed.`,
            created,
            failed,
            errors
        })
    } catch (err) {
        console.error('Payment upload error:', err)
        res.status(500).json({ message: 'Upload failed: ' + err.message })
    }
})

module.exports = router