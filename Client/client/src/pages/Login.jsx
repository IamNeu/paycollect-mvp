import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()
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
const res = await axios.post(`https://paycollect-api.onrender.com/api/auth/login`, formData);   
localStorage.setItem('token', res.data.token)

      toast.success('Welcome back! 👋')
      navigate('/dashboard')
    } catch (err) {
    
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* LEFT — Navy branding panel */}
      <div style={{
        width: '50%',
        background: 'linear-gradient(135deg, #0f3460 0%, #1e3a6e 50%, #0d2545 100%)',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white'
      }}>
        {/* Logo */}
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

        {/* Middle */}
        <div>
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: 1.2, marginBottom: '16px' }}>
            Collect every peso —<br />
            <span style={{ color: '#e94560' }}>on time.</span>
          </h1>
          <p style={{ opacity: 0.6, fontSize: '16px', marginBottom: '40px' }}>
            Send payment requests, track collections,<br />and reconcile — all in one place.
          </p>

          {/* Stats */}
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

        {/* Footer */}
        <div style={{ fontSize: '12px', opacity: 0.3 }}>
          © 2026 PayCollect · Philippines · PCI-DSS Compliant
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div style={{
        width: '50%',
        backgroundColor: '#f5f6fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          {/* Heading */}
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#0f3460', marginBottom: '4px' }}>
            Welcome back
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            Sign in to your merchant account
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f3460', marginBottom: '8px', fontSize: '14px' }}>
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
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid #dde3f0',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontWeight: '600', color: '#0f3460', fontSize: '14px' }}>
                  Password
                </label>
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
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #dde3f0',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: '13px'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#6b7280' : '#0f3460',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#dde3f0' }} />
            <span style={{ color: '#9ca3af', fontSize: '11px', fontWeight: '600' }}>SECURE LOGIN</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#dde3f0' }} />
          </div>

          {/* Security note */}
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
            🔒 Protected by 256-bit SSL encryption. Your data is safe.
          </p>

        </div>
      </div>
    </div>
  )
}