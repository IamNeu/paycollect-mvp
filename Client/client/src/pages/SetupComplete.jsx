import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SetupComplete() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

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
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(233,69,96,0.05)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: '#fff',
        borderRadius: '20px',
        padding: '56px 48px',
        textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{ width: '36px', height: '36px', background: '#e94560', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px', color: '#fff' }}>P</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#0f3460' }}>PayCollect</div>
        </div>

        {/* Success animation */}
        <div style={{
          width: '80px', height: '80px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '36px',
          boxShadow: '0 8px 24px rgba(34,197,94,0.3)'
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f3460', marginBottom: '8px' }}>
          You're all set! 🎉
        </h1>
        <p style={{ fontSize: '15px', color: '#888', marginBottom: '32px', lineHeight: 1.6 }}>
          Welcome to PayCollect, <strong style={{ color: '#0f3460' }}>{merchant.company_name || 'there'}</strong>!<br />
          Your 7-day free trial has started. No charges until your trial ends.
        </p>

        {/* Checklist */}
        <div style={{ background: '#f8faff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '32px', textAlign: 'left' }}>
          {[
            { label: 'Account created', done: true },
            { label: 'Payment method added', done: true },
            { label: 'Payment processor connected', done: true },
            { label: 'Send your first payment request', done: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: i < 3 ? '1px solid #f0f2f7' : 'none' }}>
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%',
                background: item.done ? '#22c55e' : '#f0f2f7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '700',
                color: item.done ? '#fff' : '#aaa',
                flexShrink: 0
              }}>
                {item.done ? '✓' : '4'}
              </div>
              <span style={{ fontSize: '14px', color: item.done ? '#0f3460' : '#888', fontWeight: item.done ? '600' : '400' }}>
                {item.label}
              </span>
              {!item.done && (
                <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#fff8e6', color: '#856404', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>Next</span>
              )}
            </div>
          ))}
        </div>

        {/* Trial info */}
        <div style={{ background: '#f0f8ff', border: '1.5px solid #c7d2f0', borderRadius: '10px', padding: '14px', marginBottom: '28px', fontSize: '13px', color: '#555' }}>
          🎁 Your <strong>7-day free trial</strong> ends on <strong>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>. After that, you'll be charged <strong>$10/month</strong>.
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginBottom: '12px' }}
        >
          Go to Dashboard →
        </button>

        <p style={{ fontSize: '12px', color: '#aaa' }}>
          Redirecting automatically in {countdown} seconds...
        </p>
      </div>
    </div>
  )
}
