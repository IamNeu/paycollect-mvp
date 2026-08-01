import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import API from '../apiConfig'

export default function ConnectPG() {
  const navigate = useNavigate()

  const handleStripeOAuth = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/stripe-connect-url`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      window.location.href = res.data.url
    } catch (err) {
      toast.error('Something went wrong starting Stripe Connect. Please try again.')
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
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(233,69,96,0.08)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '680px',
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f3460, #1a5ca8)', padding: '32px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '32px', height: '32px', background: '#e94560', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#fff' }}>P</div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>PayCollect</span>
          </div>

          {/* Step indicator — now 2 steps: Account, Connect Stripe */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            {[
              { n: 1, label: 'Account' },
              { n: 2, label: 'Connect Stripe' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: s.n < 2 ? '#e94560' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', border: s.n === 2 ? '2px solid #e94560' : 'none'
                }}>{s.n < 2 ? '✓' : s.n}</div>
                <span style={{ fontSize: '11px', color: s.n === 2 ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: s.n === 2 ? '600' : '400' }}>{s.label}</span>
                {i < 1 && <div style={{ width: '20px', height: '2px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />}
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>Connect your Stripe account</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>One click to securely connect Stripe and start accepting payments.</p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 40px' }}>
          <div style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f3460', marginBottom: '8px' }}>Connect via Stripe</h3>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', lineHeight: 1.6 }}>
              Click below to authorize PayCollect to access your Stripe account securely.
            </p>

            {/* Permissions list */}
            <div style={{ background: '#f8f9ff', border: '1.5px solid #c7d2f0', borderRadius: '10px', padding: '14px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#0f3460', marginBottom: '8px', fontSize: '13px' }}>PayCollect will be able to:</div>
              {['View your account details', 'Create payment links', 'Receive webhook notifications', 'View payment history'].map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '13px', color: '#555' }}>
                  <span style={{ color: '#22c55e', fontWeight: '700' }}>✓</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleStripeOAuth}
              style={{
                width: '100%', padding: '13px', background: '#635bff', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '15px',
                fontWeight: '700', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              ⚡ Connect with Stripe
            </button>
          </div>

          {/* Bottom actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', paddingTop: '20px', borderTop: '1px solid #f0f2f7' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ flex: 1, padding: '12px', background: '#f0f2f7', color: '#666', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}