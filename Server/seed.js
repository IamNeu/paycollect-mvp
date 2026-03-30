require('dotenv').config();
const mongoose = require('mongoose');
const PaymentRequest = require('./models/PaymentRequest');
const Merchant = require('./models/Merchant');

mongoose.connect(process.env.MONGO_URI).then(async() => {
    const merchant = await Merchant.findOne({ email: 'admin@testgym.com' });
    if (!merchant) {
        console.log('No merchant found');
        process.exit();
    }

    await PaymentRequest.deleteMany({ merchant_id: merchant._id });

    const names = ['Maria Santos', 'Jose Reyes', 'Ana Cruz', 'Carlo Villanueva', 'Liza Mendoza', 'Rico Batista', 'Grace Aquino', 'Mark Fernandez', 'Joy Ramos', 'Ben Castillo'];
    const mobiles = ['+639171234567', '+639229876543', '+639354567890', '+639183210987', '+639357890123', '+639171111111', '+639222222222', '+639333333333', '+639444444444', '+639555555555'];
    const statuses = ['paid', 'paid', 'paid', 'pending', 'pending', 'partial', 'expired', 'paid', 'pending', 'paid'];
    const amounts = [25000, 50000, 18500, 12000, 35000, 8000, 42000, 15000, 9500, 28000];

    for (let i = 0; i < 10; i++) {
        const due = new Date();
        due.setDate(due.getDate() + (i % 3 === 0 ? -5 : i + 3));
        const paid = statuses[i] === 'paid' ? amounts[i] : statuses[i] === 'partial' ? amounts[i] * 0.5 : 0;
        const token = Math.random().toString(36).substring(2, 15);
        await PaymentRequest.create({
            merchant_id: merchant._id,
            customer_name: names[i],
            customer_mobile: mobiles[i],
            amount_due: amounts[i],
            amount_paid: paid,
            due_date: due,
            status: statuses[i],
            payment_type: 'one_time',
            reference_id: 'REF-' + String(i + 1).padStart(4, '0'),
            payment_link: token,
            sent_at: new Date(),
            paid_at: statuses[i] === 'paid' ? new Date() : null
        });
        console.log(names[i], '->', token);
    }
    console.log('Done - 10 requests created');
    process.exit();
}).catch(e => {
    console.log('Error:', e.message);
    process.exit();
});