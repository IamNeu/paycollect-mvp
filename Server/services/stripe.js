const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, { timeout: 10000 })

const createPaymentLink = async({ customerName, amount, currency = 'usd', description, requestId }) => {
    console.log('Creating Stripe payment link for:', customerName, amount, currency)

    const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: Math.round(amount * 100),
        product_data: {
            name: description || `Payment Request for ${customerName}`,
        },
    })

    console.log('Price created:', price.id)

    const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: price.id, quantity: 1 }],
        metadata: {
            request_id: requestId,
            customer_name: customerName,
        },
        after_completion: {
            type: 'redirect',
            redirect: { url: `https://get-pay-collect.com/pay/success` }
        }
    })

    console.log('Payment link created:', paymentLink.id, paymentLink.url)
    return paymentLink
}

module.exports = { createPaymentLink }