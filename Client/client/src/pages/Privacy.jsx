import { useNavigate } from 'react-router-dom'

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: '#0f3460', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', background: '#e94560', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>P</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>PayCollect</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f3460', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '14px' }}>Last updated: June 1, 2026</p>

        {[
          { title: '1. Information We Collect', content: 'We collect information you provide directly to us, including your name, email address, business name, phone number, and payment information when you register for an account. We also collect information about your use of our services, including payment requests created, customers added, and transaction data.' },
          { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, respond to your comments and questions, and send you information about products and services.' },
          { title: '3. Information Sharing', content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our platform, including Stripe for payment processing, Resend for email delivery, and MongoDB for data storage.' },
          { title: '4. Data Security', content: 'We implement industry-standard security measures to protect your personal information. All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption. Payment card data is handled exclusively by PCI DSS Level 1 certified processors and is never stored on our servers.' },
          { title: '5. Cookies', content: 'We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.' },
          { title: '6. Data Retention', content: 'We retain your personal information for as long as your account is active or as needed to provide you services. If you cancel your account, we will retain your data for 30 days before permanent deletion, unless required by law to retain it longer.' },
          { title: '7. Your Rights', content: 'You have the right to access, update, or delete your personal information at any time. You may also opt out of marketing communications by clicking the unsubscribe link in any email we send. To exercise these rights, contact us at privacy@get-pay-collect.com.' },
          { title: '8. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at privacy@get-pay-collect.com or write to us at PayCollect, get-pay-collect.com.' },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f3460', marginBottom: '10px' }}>{section.title}</h2>
            <p style={{ color: '#555', lineHeight: '1.8', fontSize: '15px' }}>{section.content}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#0f3460', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>© 2026 PayCollect. All rights reserved.</p>
      </div>
    </div>
  )
}
