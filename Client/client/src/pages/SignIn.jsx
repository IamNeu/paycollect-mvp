import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useGoogleLogin } from '@react-oauth/google'
import API from '../apiConfig'

export default function SignIn() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        const res = await axios.post(`${API}/api/auth/google`, {
          access_token: tokenResponse.access_token,
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('merchant', JSON.stringify(res.data.merchant))
        toast.success('Welcome back! 👋')
        navigate('/dashboard')
      } catch (err) {
        toast.error(err.response?.data?.message || 'Google login failed')
      } finally {
        setLoading(false)
      }
    },
    onError: () => toast.error('Google login failed'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Email and password are required')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API}/api/auth/login`, form)
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #0f3460 50%, #0d2545 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(233,69,96,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(233,69,96,0.05)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: '#fff',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#e94560', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', fontSize: '16px', color: '#fff',
          }}>P</div>
          <span style={{ fontSize: '20px', fontWeight: '800', color: '#0f3460' }}>PayCollect</span>
        </div>

        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f3460', marginBottom: '6px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '28px' }}>
          Sign in to your merchant account
        </p>

        {/* Google */}
        <button
          type="button"
          onClick={() => googleLogin()}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', background: '#fff',
            border: '1.5px solid #e2e8f0', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '16px', color: '#333',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)', opacity: loading ? 0.7 : 1,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={() => toast('Apple login coming soon!')}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', background: '#000',
            border: '1.5px solid #000', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', marginBottom: '20px', color: '#fff',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 814 1000" fill="white">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-42.4-150.3-87.7c-52.3-52-100.3-134.6-100.3-212.3C.3 375.7 168.4 174.6 364.4 174.6c76.9 0 142.9 37.4 190.4 37.4 45.6 0 121.2-40.2 207.4-40.2 32 0 118.1 2.6 179.5 82.1z"/>
            <path d="M500.8 75.4c27.9-33.2 48.2-79.1 48.2-124.9 0-6.3-.6-12.7-1.9-17.6-45.6 1.9-99.2 30.4-131.8 67.6-25.7 28.5-49.4 74.4-49.4 121 0 7 1.3 14 1.9 16.3 3.2.6 8.3 1.3 13.4 1.3 40.9 0 92.4-27.2 119.6-63.7z"/>
          </svg>
          Continue with Apple
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '12px', color: '#aaa', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              style={{
                width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
                borderRadius: '9px', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box', background: '#f8faff',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              style={{
                width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0',
                borderRadius: '9px', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box', background: '#f8faff',
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span
              onClick={() => navigate('/forgot-password')}
              style={{ fontSize: '13px', color: '#e94560', fontWeight: '600', cursor: 'pointer' }}
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#ccc' : '#e94560',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', marginTop: '20px' }}>
          Don&apos;t have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ color: '#e94560', fontWeight: '600', cursor: 'pointer' }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  )
}
