import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import API from '../apiConfig'

export default function AppSumoActivate() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const licenseKey = searchParams.get('license_key')
  const error = searchParams.get('error')

  const [form, setForm] = useState({ company_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(error ? 'Something went wrong verifying your AppSumo purchase. Please try activating again from AppSumo.' : null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitError(null)
    setLoading(true)

    axios.post(`${API}/api/appsumo/complete-signup`, {
      license_key: licenseKey,
      ...form
    }).then(res => {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('merchant', JSON.stringify(res.data.merchant))
      navigate('/dashboard')
    }).catch(err => {
      setSubmitError(err.response?.data?.message || 'Failed to complete signup')
    }).finally(() => setLoading(false))
  }

  if (!licenseKey && !error) {
    return (
      <div style={{ maxWidth: 420, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Invalid activation link</h2>
        <p style={{ color: '#888' }}>Please activate your license from your AppSumo purchase page.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#0f3460', marginBottom: '6px' }}>Activate your PayCollect account</h2>
      <p style={{ color: '#888', marginBottom: '24px', fontSize: '0.9rem' }}>
        Your AppSumo license is verified — create your account to get started.
      </p>

      {submitError && (
        <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text" placeholder="Company Name" required
          value={form.company_name}
          onChange={e => setForm({ ...form, company_name: e.target.value })}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
        />
        <input
          type="email" placeholder="Email" required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
        />
        <input
          type="password" placeholder="Password" required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
        />
        <button
          type="submit" disabled={loading}
          style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
        >
          {loading ? 'Activating…' : 'Activate Account'}
        </button>
      </form>
    </div>
  )
}
