import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Support() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Message sent! We\'ll respond within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ background: '#0f3460', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', background: '#e94560', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>P</div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>PayCollect</span>
        </div>
        <button onClick={() => navigate('/login')} style={{ padding: '8px 18px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Login</button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f3460', marginBottom: '8px' }}>Support Center</h1>
        <p style={{ color: '#888', marginBottom: '48px', fontSize: '15px' }}>We're here to help. Reach out and we'll get back to you within 24 hours.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

          {/* Contact form */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1.5px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f3460', marginBottom: '24px' }}>Send us a message</h2>
            <form onSubmit={handleSubmit}>
              {[
                { label: 'Full Name *', key: 'name', placeholder: 'Your name', type: 'text' },
                { label: 'Email Address *', key: 'email', placeholder: 'you@company.com', type: 'email' },
                { label: 'Subject', key: 'subject', placeholder: 'How can we help?', type: 'text' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f3460', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0f3460', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message *</label>
                <textarea
                  placeholder="Describe your issue in detail..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', height: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                Send Message →
              </button>
            </form>
          </div>

          {/* Contact info + FAQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Contact methods */}
            {[
              { icon: '✉️', title: 'Email Support', desc: 'support@get-pay-collect.com', sub: 'Response within 24 hours' },
              { icon: '💬', title: 'Live Chat', desc: 'Available on the dashboard', sub: 'Mon–Fri, 9am–6pm EST' },
              { icon: '📚', title: 'Documentation', desc: 'docs.get-pay-collect.com', sub: 'Guides, API reference, tutorials' },
            ].map((c, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ fontSize: '24px' }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>{c.title}</div>
                  <div style={{ fontSize: '14px', color: '#e94560', fontWeight: '600', marginBottom: '2px' }}>{c.desc}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>{c.sub}</div>
                </div>
              </div>
            ))}

            {/* FAQ */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1.5px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f3460', marginBottom: '14px' }}>Frequently Asked Questions</h3>
              {[
                { q: 'How do I cancel my trial?', a: 'Go to Settings → Billing → Cancel Subscription before Day 7.' },
                { q: 'Which payment methods are supported?', a: 'Stripe, with support for cards, Apple Pay, and Google Pay.' },
                { q: 'Can I export my data?', a: 'Yes — go to Reports → Export CSV to download all your data.' },
                { q: 'Is my data secure?', a: 'Yes. All data is encrypted with AES-256 and TLS 1.2+.' },
              ].map((faq, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid #f0f2f7' : 'none' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>{faq.q}</div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#0f3460', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>© 2026 PayCollect. All rights reserved.</p>
      </div>
    </div>
  )
}
