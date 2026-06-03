import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import API from '../apiConfig'

export default function SignUp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = account details, 2 = payment
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  })
  const [card, setCard] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleCardChange = (e) => setCard({ ...card, [e.target.name]: e.target.value })

  const formatCardNumber = (val) => {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    if (!form.company_name || !form.email || !form.password) {
      toast.error('All fields are required')
      return
    }
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setStep(2)
  }

  const handleStep2 = async (e) => {
    e.preventDefault()
console.log('Card state:', card)
if (!card.number || !card.name || !card.expiry || !card.cvc) {
	      toast.error('All card fields are required')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        company_name: form.company_name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('merchant', JSON.stringify(res.data.merchant))
      toast.success('Welcome to PayCollect! Your 7-day trial has started 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const cardDisplay = card.number
    ? card.number.replace(/\s/g, '').padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim()
    : '•••• •••• •••• ••••'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #0f3460 50%, #0d2545 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(233,69,96,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(233,69,96,0.05)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '960px',
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateColumns: step === 1 ? '1fr 1fr' : '1fr',
      }}>

        {/* ── LEFT PANEL (Step 1 only) ── */}
        {step === 1 && (
          <div style={{
            background: 'linear-gradient(135deg, #0f3460 0%, #1a5ca8 100%)',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(233,69,96,0.12)' }} />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(233,69,96,0.08)' }} />

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: '36px', height: '36px', background: '#e94560', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: '#fff' }}>P</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>PayCollect</div>
            </div>

            {/* Trial badge */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-block', background: '#e94560', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '5px 14px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>
                7-Day Free Trial
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#fff', lineHeight: 1.2, marginBottom: '8px' }}>
                Start collecting<br />
                payments <span style={{ color: '#e94560' }}>today.</span>
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px', lineHeight: 1.6 }}>
                No charges for 7 days. Cancel anytime.
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  'Send payment requests via SMS & email',
                  'Accept GCash, Maya, Visa & Mastercard',
                  'Real-time dashboard & KPI tracking',
                  'Automated reminders for overdue payments',
                  'Full reconciliation & settlement reports',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(233,69,96,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: '#e94560', fontSize: '10px', fontWeight: '700' }}>✓</span>
                    </div>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>After trial</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff' }}>$10 <span style={{ fontSize: '13px', fontWeight: '400', color: 'rgba(255,255,255,0.5)' }}>/month</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>or</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>€10 <span style={{ fontSize: '12px', fontWeight: '400', color: 'rgba(255,255,255,0.4)' }}>/mo</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RIGHT PANEL ── */}
        <div style={{ padding: step === 1 ? '56px 48px' : '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: step === 2 ? '520px' : 'none', margin: step === 2 ? '0 auto' : '0', width: '100%' }}>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: s <= step ? '#e94560' : '#f0f2f7',
                  color: s <= step ? '#fff' : '#aaa',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700'
                }}>{s <= step - 1 ? '✓' : s}</div>
                <span style={{ fontSize: '12px', color: s === step ? '#0f3460' : '#aaa', fontWeight: s === step ? '600' : '400' }}>
                  {s === 1 ? 'Account' : 'Payment'}
                </span>
                {s < 2 && <div style={{ width: '24px', height: '2px', background: step > 1 ? '#e94560' : '#f0f2f7', borderRadius: '2px' }} />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f3460', marginBottom: '6px' }}>Create your account</h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>Start your 7-day free trial — no credit card needed yet.</p>

              <form onSubmit={handleStep1}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Business / Company Name</label>
                  <input name="company_name" value={form.company_name} onChange={handleChange} placeholder="Your business name" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Work Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+63 9XX XXX XXXX" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Password</label>
                    <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Confirm Password</label>
                    <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="Repeat password" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }} />
                  </div>
                </div>

                <button type="submit" style={{ width: '100%', padding: '13px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                  Continue to Payment →
                </button>

                <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '14px', lineHeight: 1.6 }}>
                  By signing up you agree to our <a href="#" style={{ color: '#0f3460' }}>Terms</a> and <a href="#" style={{ color: '#0f3460' }}>Privacy Policy</a>
                </p>

                <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginTop: '16px' }}>
                  Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#e94560', fontWeight: '600', cursor: 'pointer' }}>Sign in</span>
                </p>
              </form>
            </>
          ) : (
            <>
              {/* Trial info bar */}
              <div style={{ background: '#f0f8ff', border: '1.5px solid #c7d2f0', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: '#e94560', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>🎁</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f3460' }}>7-day free trial — no charge today</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Your card will be charged $10/month after your trial ends on {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f3460', marginBottom: '4px' }}>Add payment method</h2>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Your card won't be charged until your trial ends.</p>

              {/* Virtual card preview */}
              <div style={{
                background: 'linear-gradient(135deg, #0f3460 0%, #1a5ca8 100%)',
                borderRadius: '14px',
                padding: '22px 24px',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '120px'
              }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(233,69,96,0.15)' }} />
                <div style={{ position: 'absolute', bottom: '-15px', left: '10px', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ width: '28px', height: '20px', background: 'linear-gradient(135deg, #f0c040, #d4a020)', borderRadius: '3px', marginBottom: '14px', position: 'relative', zIndex: 1 }} />
                <div style={{ fontFamily: 'monospace', fontSize: '15px', color: card.number ? '#fff' : 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                  {cardDisplay}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  <div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cardholder</div>
                    <div style={{ fontSize: '13px', color: card.name ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: '500' }}>{card.name || 'YOUR NAME'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expires</div>
                    <div style={{ fontSize: '13px', color: card.expiry ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: '500' }}>{card.expiry || 'MM/YY'}</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#e94560', opacity: 0.8, alignSelf: 'flex-end' }}>PAY</div>
                </div>
              </div>

              <form onSubmit={handleStep2}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Card Number</label>
                  <input
                    name="number"
                    value={card.number}
                    onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', background: '#f8faff', letterSpacing: '0.1em' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Cardholder Name</label>
                  <input
                    name="name"
                    value={card.name}
                    onChange={handleCardChange}
                    placeholder="Name on card"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Expiry Date</label>
                    <input
                      name="expiry"
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>CVC</label>
                    <input
                      name="cvc"
                      value={card.cvc}
                      onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                      placeholder="123"
                      maxLength={3}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#ccc' : '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Starting your trial...' : '🚀 Start 7-Day Free Trial'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>🔒 Secured by Stripe · PCI DSS Compliant</span>
                </div>

                <p style={{ fontSize: '12px', color: '#aaa', textAlign: 'center', marginTop: '8px' }}>
                  <span onClick={() => setStep(1)} style={{ color: '#0f3460', cursor: 'pointer', fontWeight: '600' }}>← Back to account details</span>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
