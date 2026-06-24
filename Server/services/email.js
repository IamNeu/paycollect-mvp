const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

const sendPaymentRequestEmail = async({ customerEmail, customerName, merchantName, amount, dueDate, paymentLink, description }) => {
        const formattedAmount = Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })
        const formattedDate = new Date(dueDate).toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })

        await resend.emails.send({
                    from: 'payments@get-pay-collect.com',

                    to: customerEmail,
                    subject: `Payment Request — ₱${formattedAmount} due ${formattedDate}`,
                    html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0; padding:0; font-family: 'Segoe UI', Arial, sans-serif; background:#f5f6fa;">
            <div style="max-width:560px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#0f3460,#1e3a6e); padding:32px; text-align:center;">
                    <div style="display:inline-block; background:#e94560; border-radius:10px; width:44px; height:44px; line-height:44px; text-align:center; font-size:20px; font-weight:bold; color:white; margin-bottom:12px;">P</div>
                    <div style="color:white; font-size:22px; font-weight:800;">PayCollect</div>
                    <div style="color:rgba(255,255,255,0.5); font-size:12px; margin-top:4px;">Secure Payment Request</div>
                </div>
                <div style="padding:32px;">
                    <p style="color:#1a1a2e; font-size:16px; margin:0 0 8px;">Hi ${customerName},</p>
                    <p style="color:#555; font-size:14px; line-height:1.6; margin:0 0 24px;">
                        <strong>${merchantName}</strong> has sent you a payment request. Please review the details below and complete your payment.
                    </p>
                    <div style="background:linear-gradient(135deg,#0f3460,#1a5ca8); border-radius:12px; padding:24px; text-align:center; margin-bottom:24px;">
                        <div style="color:rgba(255,255,255,0.6); font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:8px;">Amount Due</div>
                        <div style="color:white; font-size:36px; font-weight:800;">₱${formattedAmount}</div>
                        <div style="color:rgba(255,255,255,0.6); font-size:13px; margin-top:8px;">Due by ${formattedDate}</div>
                    </div>
                    ${description ? `
                    <div style="background:#f8f9ff; border-left:3px solid #0f3460; padding:12px 16px; border-radius:0 8px 8px 0; margin-bottom:24px;">
                        <div style="font-size:11px; color:#aaa; font-weight:700; margin-bottom:4px;">NOTE FROM ${merchantName.toUpperCase()}</div>
                        <div style="font-size:14px; color:#333;">${description}</div>
                    </div>
                    ` : ''}
                    <div style="text-align:center; margin-bottom:24px;">
                        <a href="${paymentLink}" style="display:inline-block; background:#e94560; color:white; text-decoration:none; padding:16px 40px; border-radius:10px; font-size:16px; font-weight:700;">
                            Pay Now →
                        </a>
                    </div>
                    <p style="color:#aaa; font-size:12px; text-align:center; margin:0;">
                        Or copy this link: <a href="${paymentLink}" style="color:#0f3460;">${paymentLink}</a>
                    </p>
                </div>
                <div style="background:#f8f9ff; padding:20px 32px; text-align:center; border-top:1px solid #eee;">
                    <p style="color:#aaa; font-size:11px; margin:0;">
                        🔒 Secured by PayCollect · PCI DSS Compliant
                    </p>
                </div>
            </div>
        </body>
        </html>
        `
    })
    console.log('✅ Email sent to ' + customerEmail)
}

module.exports = { sendPaymentRequestEmail }