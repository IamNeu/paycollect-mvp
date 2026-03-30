import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const API = 'https://paycollect-api.onrender.com'

const METHODS = [
  { id: 'gcash',    icon: '💚', label: 'GCash',      color: '#00b14f' },
  { id: 'maya',     icon: '🔵', label: 'Maya',       color: '#0087da' },
  { id: 'card',     icon: '💳', label: 'Card',       color: '#0f3460' },
  { id: 'instapay', icon: '🏦', label: 'InstaPay',   color: '#8b5cf6' },
  { id: 'otc',      icon: '🏪', label: '7-Eleven',   color: '#f59e0b' },
]

export default function PaymentPage() {
  const { token } = useParams()
  const [request, setRequest]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [method, setMethod]       = useState('gcash')
  const [amount, setAmount]       = useState('')
  const [paying, setPaying]       = useState(false)
  const [success, setSuccess]     = useState(false)

  useEffect(() => {
    loadRequest()
  }, [token])

  const loadRequest = async () => {
    try {
      const res = await axios.get(`${API}/api/pay/${token}`)
      setRequest(res.data.request)
      setAmount(String(res.data.request.amount_due - (res.data.request.amount_paid || 0)))
    } catch (err) {
      setError(err.response?.data?.message || 'Payment link not found')
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setError('Please enter a valid amount'); return }
    setPaying(true); setError(null)
    try {
      await axios.post(`${API}/api/pay/${token}`, {
        amount: amt,
        payment_mode: method
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setPaying(false) }
  }

  const fmt = (n) => Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 })
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-PH', { day: 'numeric', month: 'long', year: 'numeric' })

  // Loading
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f3460,#16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontSize: '1rem' }}>Loading payment...</div>
    </div>
  )

  // Error
  if (error && !request) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f3460,#16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '40px 32px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❌</div>
        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f3460', marginBottom: '8px' }}>Link Not Found</div>
        <div style={{ fontSize: '0.85rem', color: '#888' }}>{error}</div>
      </div>
    </div>
  )

  // Success
  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f3460,#16213e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '44px 32px', maxWidth: '420px', textAlign: 'center', width: '100%', margin: '0 20px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
        <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f3460', marginBottom: '8px' }}>Payment Received!</div>
        <div style={{ fontSize: '0.88rem', color: '#555', marginBottom: '20px', lineHeight: 1.6 }}>
          ₱{fmt(amount)} paid via <strong style={{ textTransform: 'capitalize' }}>{method}</strong>
        </div>
        <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '4px' }}>Payment for</div>
          <div style={{ fontWeight: '700', color: '#0f3460' }}>{request?.customer_name}</div>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#aaa' }}>🔒 Secured by PayCollect · PCI DSS Compliant</div>
      </div>
    </div>
  )

  const remaining = request.amount_due - (request.amount_paid || 0)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f3460 0%,#16213e 50%,#1a1a2e 100%)', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255,255,255,.1)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#fff' }}>
          Pay<span style={{ color: '#e94560' }}>Collect</span>
          <span style={{ background: '#e94560', color: '#fff', fontSize: '0.6rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', marginLeft: '8px', textTransform: 'uppercase' }}>Secure</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,.4)', fontFamily: 'monospace' }}>pay.paycollect.ph</div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px 60px', gap: '24px', flexWrap: 'wrap' }}>

        {/* Main card */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '32px 28px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 80px rgba(0,0,0,.35)' }}>

          {/* Merchant info */}
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1.5px solid #e2e8f0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#0f3460,#e94560)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 10px' }}>🏢</div>
            <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#1a1a2e' }}>Payment Request</div>
            <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '3px' }}>{request.reference_id || `REQ-${request._id?.slice(-8)}`}</div>
          </div>

          {/* Amount */}
          <div style={{ background: 'linear-gradient(135deg,#0f3460,#1e4080)', borderRadius: '14px', padding: '20px 22px', marginBottom: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginBottom: '6px' }}>Amount Due</div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>₱{fmt(remaining)}</div>
            <div style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: '700', padding: '3px 11px', borderRadius: '20px', marginTop: '8px' }}>
              Due {fmtDate(request.due_date)}
            </div>
          </div>

          {/* Customer */}
          <div style={{ background: '#f8faff', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#888' }}>For</span>
            <span style={{ fontWeight: '700', color: '#0f3460' }}>{request.customer_name}</span>
          </div>

          {/* Amount input */}
          {request.allow_partial && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Amount to Pay (₱)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                max={remaining}
                style={{ width: '100%', padding: '12px 14px', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '1.05rem', fontWeight: '700', color: '#0f3460', boxSizing: 'border-box' }}
              />
              <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '4px' }}>💡 You can pay a partial amount</div>
            </div>
          )}

          {/* Payment methods */}
          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>Choose Payment Method</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '8px' }}>
            {METHODS.slice(0, 3).map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)} style={{ border: `2px solid ${method === m.id ? m.color : '#e2e8f0'}`, background: method === m.id ? `${m.color}15` : '#fff', borderRadius: '11px', padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{m.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: method === m.id ? m.color : '#0f3460' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '20px' }}>
            {METHODS.slice(3).map(m => (
              <div key={m.id} onClick={() => setMethod(m.id)} style={{ border: `2px solid ${method === m.id ? m.color : '#e2e8f0'}`, background: method === m.id ? `${m.color}15` : '#fff', borderRadius: '11px', padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{m.icon}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: method === m.id ? m.color : '#0f3460' }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && <div style={{ background: '#fee2e2', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '10px 13px', marginBottom: '14px', fontSize: '0.78rem', color: '#991b1b' }}>{error}</div>}

          {/* Pay button */}
          <button onClick={handlePay} disabled={paying} style={{ width: '100%', padding: '15px', background: paying ? '#999' : '#e94560', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.95rem', fontWeight: '700', cursor: paying ? 'default' : 'pointer', transition: 'all .18s' }}>
            {paying ? '⏳ Processing...' : `Pay ₱${fmt(amount || 0)} Securely →`}
          </button>

          {/* Trust */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '0.68rem', color: '#aaa' }}>
            <span>🔒 256-bit SSL</span><span>·</span><span>PCI DSS</span><span>·</span><span>PayCollect Secured</span>
          </div>
        </div>
      </div>
    </div>
  )
}