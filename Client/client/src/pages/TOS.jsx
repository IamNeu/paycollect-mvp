import { useNavigate } from 'react-router-dom'

export default function TOS() {
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
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f3460', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ color: '#888', marginBottom: '40px', fontSize: '14px' }}>Last updated: June 1, 2026</p>

        {[
          { title: '1. Acceptance of Terms', content: 'By accessing or using PayCollect ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all users, including merchants and their customers.' },
          { title: '2. Description of Service', content: 'PayCollect is a payment collection platform that enables merchants to send payment requests to their customers and collect payments through various payment methods including credit/debit cards, digital wallets, and bank transfers.' },
          { title: '3. Account Registration', content: 'To use PayCollect, you must create an account and provide accurate, complete information. You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorized use of your account.' },
          { title: '4. Subscription and Billing', content: 'PayCollect offers a 7-day free trial. After the trial period, you will be charged $10 USD or €10 EUR per month depending on your location. Subscriptions automatically renew unless cancelled before the renewal date. All fees are non-refundable except as outlined in our Cancellation Policy.' },
          { title: '5. Acceptable Use', content: 'You agree not to use PayCollect for any unlawful purpose or in violation of these terms. Prohibited uses include processing fraudulent transactions, selling illegal goods or services, violating any applicable laws or regulations, and attempting to gain unauthorized access to our systems.' },
          { title: '6. Payment Processing', content: 'PayCollect integrates with third-party payment processors including Stripe, Adyen, and PayPal. By using these integrations, you also agree to their respective terms of service. PayCollect is not responsible for any issues arising from third-party payment processor services.' },
          { title: '7. Data and Privacy', content: 'Your use of PayCollect is also governed by our Privacy Policy, which is incorporated into these Terms by reference. We take data security seriously and implement industry-standard measures to protect your information.' },
          { title: '8. Limitation of Liability', content: 'PayCollect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.' },
          { title: '9. Termination', content: 'We reserve the right to suspend or terminate your account at any time for violations of these terms. You may terminate your account at any time in accordance with our Cancellation Policy.' },
          { title: '10. Contact Us', content: 'If you have any questions about these Terms of Service, please contact us at legal@get-pay-collect.com.' },
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
