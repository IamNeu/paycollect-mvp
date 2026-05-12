const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

// Create a Stripe payment link for a payment request
const createPaymentLink = async({ customerName, amount, currency = 'php', description, requestId }) => {
    // First create a price object
    const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: Math.round(amount * 100),
        product_data: {
            name: description || `Payment Request`,
        },
    })

    // Then create the payment link
    const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: {
            request_id: requestId,
            customer_name: customerName,
        },
        after_completion: {
            type: 'redirect',
            redirect: { url: `https://paycollect-mvp.vercel.app/pay/success` }
        }
    })

    return paymentLink
}

module.exports = { createPaymentLink }