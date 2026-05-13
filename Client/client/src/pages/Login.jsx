import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import API from '../apiConfig'
import useIsMobile from '../hooks/useIsMobile'

export default function Login() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, formData)
      localStorage.setItem('token', res.data.token)
      if (res.data.merchant) {
        localStorage.setItem('merchant', JSON.stringify(res.data.merchant))
      } else if (res.data.user) {
        localStorage.setItem('merchant', JSON.stringify(res.data.user))
      }
      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: isMobile ? 'column' : 'row' }}>

      {/* LEFT — Navy branding panel — hidden on mobile */}
      {!isMobile && (
        <div style={{
          width: '50%',
          background: 'linear-gradient(135deg, #0f3460 0%, #1e3a6e 50%, #0d2545 100%)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              backgroundColor: '#e94560',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '18px'
            }}>P</div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: '800' }}>PayCollect</div>
              <div style={{ fontSize: '12px', opacity: 0.5 }}>Merchant Portal</div>
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1.2, marginBottom: '16px' }}>
              Collect every peso —<br />
              <span style={{ color: '#e94560' }}>on time.</span>
            </h1>
            <p style={{ opacity: 0.6, fontSize: '16px', marginBottom: '40px' }}>
              Send payment requests, track collections,<br />and reconcile — all in one place.
            </p>
            <div style={{ display: 'flex', gap: '40px' }}>
              {[
                { value: '98%', label: 'Collection rate' },
                { value: '5,000+', label: 'Active merchants' },
                { value: '₱2B+', label: 'Collected monthly' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontSize: '28px', fontWeight: '800' }}>{stat.value}</div>
                  <div style={{ fontSize: '13px', opacity: 0.5 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12px', opacity: 0.3 }}>
            © 2026 PayCollect · Philippines · PCI-DSS Compliant
          </div>
        </div>
      )}

      {/* RIGHT — Login form */}
      <div style={{
        width: isMobile ? '100%' : '50%',
        backgroundColor: isMobile ? '#0f3460' : '#f5f6fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 24px' : '48px',
        minHeight: isMobile ? '100vh' : 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Mobile logo */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', justifyContent: 'center' }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#e94560', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>P</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'white' }}>PayCollect</div>
            </div>
          )}

          <h2 style={{ fontSize: '32px', fontWeight: '800', color: isMobile ? 'white' : '#0f3460', marginBottom: '4px' }}>
            Welcome back
          </h2>
          <p style={{ color: isMobile ? 'rgba(255,255,255,0.6)' : '#6b7280', marginBottom: '32px' }}>
            Sign in to your merchant account
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: isMobile ? 'rgba(255,255,255,0.8)' : '#0f3460', marginBottom: '8px', fontSize: '14px' }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '1px solid #dde3f0', fontSize: '14px', outline: 'none',
                  backgroundColor: 'white', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: '600', color: isMobile ? 'rgba(255,255,255,0.8)' : '#0f3460', fontSize: '14px' }}>Password</label>
                <a href="/forgot-password" style={{ color: '#e94560', fontSize: '13px', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '12px 48px 12px 16px', borderRadius: '10px',
                    border: '1px solid #dde3f0', fontSize: '14px', outline: 'none',
                    backgroundColor: 'white', boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '13px'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                backgroundColor: loading ? '#6b7280' : '#e94560',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: isMobile ? 'rgba(255,255,255,0.2)' : '#dde3f0' }} />
            <span style={{ color: isMobile ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontSize: '11px', fontWeight: '600' }}>SECURE LOGIN</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: isMobile ? 'rgba(255,255,255,0.2)' : '#dde3f0' }} />
          </div>

          <p style={{ textAlign: 'center', color: isMobile ? 'rgba(255,255,255,0.4)' : '#9ca3af', fontSize: '12px' }}>
            🔒 Protected by 256-bit SSL encryption. Your data is safe.
          </p>
        </div>
      </div>
    </div>
  )
}