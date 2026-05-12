import { useNavigate } from 'react-router-dom'

export default function PaymentSuccess() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f3460, #1e3a6e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 40px', maxWidth: '440px', width: '100%', textAlign: 'center', margin: '0 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f3460', marginBottom: '10px' }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        <div style={{ background: '#f0fff6', border: '1.5px solid #6ee7b7', borderRadius: '10px', padding: '14px', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: '#065f46', fontWeight: '600' }}>
            ✅ Payment confirmed · Receipt sent to your email
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#aaa' }}>
          🔒 Secured by PayCollect · Powered by Stripe
        </div>
      </div>
    </div>
  )
}