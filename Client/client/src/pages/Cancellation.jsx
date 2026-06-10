import { useNavigate } from 'react-router-dom'

export default function Cancellation() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Navbar */}
      <div style={{ background: '#0f3460', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', background: '#e94560', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>P</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>PayCollect</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f3460', marginBottom: '8px' }}>Cancellation Policy</h1>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '14px' }}>Last updated: June 1, 2026</p>

        {[
          { title: '1. Free Trial Cancellation', content: 'You may cancel your PayCollect account at any time during the 7-day free trial period without any charge. To cancel during your trial, go to Settings → Billing → Cancel Subscription before your trial period ends. No payment will be processed if you cancel before Day 7.' },
          { title: '2. Subscription Cancellation', content: 'You may cancel your paid subscription at any time. Upon cancellation, your account will remain active until the end of your current billing period. You will not be charged for the following month. We do not provide prorated refunds for partial months of service.' },
          { title: '3. How to Cancel', content: 'To cancel your subscription: (1) Log in to your PayCollect account, (2) Go to Settings → Billing, (3) Click "Cancel Subscription", (4) Follow the confirmation steps. You will receive a cancellation confirmation email within 24 hours.' },
          { title: '4. Refund Policy', content: 'PayCollect operates on a no-refund policy for completed billing periods. If you believe you have been charged in error, please contact our support team at support@get-pay-collect.com within 7 days of the charge and we will review your case.' },
          { title: '5. Data After Cancellation', content: 'Upon cancellation, your data will be retained for 30 days, during which you may request an export. After 30 days, all data associated with your account will be permanently deleted from our systems.' },
          { title: '6. Reactivation', content: 'You may reactivate your account at any time within the 30-day retention period by re-subscribing. Your data and settings will be restored. After 30 days, you will need to start a new account.' },
          { title: '7. Contact Us', content: 'If you have any questions about our cancellation policy, please contact us at support@get-pay-collect.com or visit https://get-pay-collect.com/support.' },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f3460', marginBottom: '10px' }}>{section.title}</h2>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>{section.content}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ background: '#0f3460', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>© 2026 PayCollect. All rights reserved.</p>
      </div>
    </div>
  )
}
