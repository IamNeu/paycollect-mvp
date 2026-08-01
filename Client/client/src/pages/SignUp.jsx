import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import API from '../apiConfig'

export default function SignUp() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const origins = ['https://accounts.google.com', 'https://apis.google.com']
    const links = origins.map((href) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = href
      document.head.appendChild(link)
      return link
    })
    return () => links.forEach((link) => link.remove())
  }, [])

  const [form, setForm] = useState({
    company_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const googleLogin = useGoogleLogin({
    prompt: 'select_account',
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await axios.post(`${API}/api/auth/google`, {
          access_token: tokenResponse.access_token
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('merchant', JSON.stringify(res.data.merchant))
        toast.success('Welcome to PayCollect! 🎉')
        navigate('/connect-pg')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Google login failed')
      } finally {
        setLoading(false)
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setGoogleLoading(false)
      toast.error('Google login failed')
    },
  })

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    googleLogin()
  }

  const handleStep1 = async (e) => {
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
      navigate('/connect-pg')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

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

      {/* Loading overlay */}
      {(loading || googleLoading) && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 22, 40, 0.88)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            border: '4px solid rgba(233, 69, 96, 0.25)',
            borderTop: '4px solid #e94560',
            borderRadius: '50%',
            animation: 'signupSpin 0.8s linear infinite',
            marginBottom: '20px',
          }} />
          <p style={{ color: '#fff', fontSize: '16px', fontWeight: '700', margin: 0 }}>
            {googleLoading && !loading ? 'Connecting to Google...' : 'Setting up your account...'}
          </p>
          <style>{`
            @keyframes signupSpin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '960px',
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}>

        {/* LEFT PANEL */}
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

          {/* Trial badge + features */}
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

            {[
              'Send payment requests via SMS & email',
              'Accept cards, Apple Pay & Google Pay',
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

        {/* RIGHT PANEL */}
        <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f3460', marginBottom: '6px' }}>Create your account</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>Start your 7-day free trial — connect Stripe next, no credit card needed here.</p>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            style={{
              width: '100%', padding: '12px', background: '#fff',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600', cursor: (loading || googleLoading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', marginBottom: '16px', color: '#333',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)', opacity: (loading || googleLoading) ? 0.7 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            {(loading || googleLoading) ? 'Signing in...' : 'Continue with Google'}
          </button>


          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '12px', color: '#aaa', fontWeight: '500' }}>or continue with email</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

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
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 XXX XXX XXXX" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }} />
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

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? '#ccc' : '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>

            <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '14px', lineHeight: 1.6 }}>
              By signing up you agree to our <a href="/tos" style={{ color: '#0f3460' }}>Terms</a> and <a href="/privacy" style={{ color: '#0f3460' }}>Privacy Policy</a>
            </p>

            <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginTop: '16px' }}>
              Already have an account? <span onClick={() => navigate('/login')} style={{ color: '#e94560', fontWeight: '600', cursor: 'pointer' }}>Sign in</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}