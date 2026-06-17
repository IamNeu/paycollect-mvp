import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import API from '../apiConfig'

export default function ConnectPG() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('stripe')
  const [apiKeys, setApiKeys] = useState({ publishable_key: '', secret_key: '' })
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const handleTestConnection = async () => {
    if (!apiKeys.secret_key || !apiKeys.publishable_key) {
      toast.error('Please enter both API keys')
      return
    }
    setTesting(true)
    try {
      const res = await axios.post(`${API}/api/settings/test-stripe`, {
        secret_key: apiKeys.secret_key
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('✅ Stripe connection successful!')
      setTested(true)
    } catch (err) {
      toast.error('❌ Invalid API keys. Please check and try again.')
      setTested(false)
    } finally {
      setTesting(false)
    }
  }

  const handleSaveAndContinue = async () => {
    if (activeTab === 'stripe' && !tested) {
      toast.error('Please test your connection first')
      return
    }
    setConnecting(true)
    try {
      await axios.put(`${API}/api/auth/profile`, {
        gateway_configs: [{
          gateway: 'stripe',
          api_key: apiKeys.publishable_key,
          secret_key: apiKeys.secret_key,
          connected: true
        }]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      navigate('/setup-complete')
    } catch (err) {
      toast.error('Failed to save. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const gateways = [
    { id: 'stripe', name: 'Stripe', logo: '⚡', color: '#635bff', available: true },
    { id: 'adyen', name: 'Adyen', logo: '🔷', color: '#0abf53', available: false },
    { id: 'paypal', name: 'PayPal', logo: '🅿️', color: '#003087', available: false },
  ]

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

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            {[
              { n: 1, label: 'Account' },
              { n: 2, label: 'Payment' },
              { n: 3, label: 'Connect PG' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: s.n < 3 ? '#e94560' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', border: s.n === 3 ? '2px solid #e94560' : 'none'
                }}>{s.n < 3 ? '✓' : s.n}</div>
                <span style={{ fontSize: '11px', color: s.n === 3 ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: s.n === 3 ? '600' : '400' }}>{s.label}</span>
                {i < 2 && <div style={{ width: '20px', height: '2px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }} />}
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>Connect your payment processor</h2>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Connect a payment gateway to start accepting payments from your customers.</p>
        </div>

        {/* Body */}
        <div style={{ padding: '32px 40px' }}>

          {/* Gateway tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
            {gateways.map(gw => (
              <button
                key={gw.id}
                onClick={() => gw.available && setActiveTab(gw.id)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', cursor: gw.available ? 'pointer' : 'not-allowed',
                  border: activeTab === gw.id ? `2px solid ${gw.color}` : '2px solid #e2e8f0',
                  background: activeTab === gw.id ? gw.color + '10' : '#f8f9fa',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  opacity: gw.available ? 1 : 0.5, position: 'relative'
                }}
              >
                <span style={{ fontSize: '22px' }}>{gw.logo}</span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: activeTab === gw.id ? gw.color : '#666' }}>{gw.name}</span>
                {!gw.available && (
                  <span style={{ position: 'absolute', top: '6px', right: '6px', fontSize: '9px', background: '#f0f2f7', color: '#888', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>Soon</span>
                )}
                {gw.available && (
                  <span style={{ fontSize: '9px', background: '#d1fae5', color: '#065f46', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>Available</span>
                )}
              </button>
            ))}
          </div>

          {/* Stripe tab content */}
          {activeTab === 'stripe' && (
            <div>
              <div style={{ background: '#fff8e6', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#856404', display: 'flex', gap: '8px' }}>
                <span>💡</span>
                <span>Find your API keys in your <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" style={{ color: '#635bff', fontWeight: '600' }}>Stripe Dashboard → API Keys</a></span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Publishable Key</label>
                <input
                  value={apiKeys.publishable_key}
                  onChange={e => { setApiKeys({ ...apiKeys, publishable_key: e.target.value }); setTested(false) }}
                  placeholder="pk_live_... or pk_test_..."
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Secret Key</label>
                <input
                  type="password"
                  value={apiKeys.secret_key}
                  onChange={e => { setApiKeys({ ...apiKeys, secret_key: e.target.value }); setTested(false) }}
                  placeholder="sk_live_... or sk_test_..."
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '9px', fontSize: '13px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box', background: '#f8faff' }}
                />
              </div>

              <button
                onClick={handleTestConnection}
                disabled={testing}
                style={{
                  width: '100%', padding: '11px', marginBottom: '12px',
                  background: tested ? '#d1fae5' : '#f0f4ff',
                  color: tested ? '#065f46' : '#0f3460',
                  border: tested ? '1.5px solid #6ee7b7' : '1.5px solid #c7d2f0',
                  borderRadius: '9px', fontSize: '14px', fontWeight: '600', cursor: testing ? 'not-allowed' : 'pointer'
                }}
              >
                {testing ? '🔄 Testing connection...' : tested ? '✅ Connection verified!' : '🔌 Test Connection'}
              </button>
            </div>
          )}

          {/* Adyen / PayPal coming soon */}
          {(activeTab === 'adyen' || activeTab === 'paypal') && (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{activeTab === 'adyen' ? '🔷' : '🅿️'}</div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f3460', marginBottom: '8px' }}>
                {activeTab === 'adyen' ? 'Adyen' : 'PayPal'} — Coming Soon
              </h3>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                We're working on this integration. In the meantime, please connect via Stripe.
              </p>
              <button onClick={() => setActiveTab('stripe')} style={{ padding: '10px 24px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                Use Stripe Instead
              </button>
            </div>
          )}

          {/* Bottom actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f0f2f7' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ flex: 1, padding: '12px', background: '#f0f2f7', color: '#666', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
            >
              Skip for now
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={connecting || (!tested && activeTab === 'stripe')}
              style={{
                flex: 2, padding: '12px',
                background: connecting ? '#ccc' : (!tested && activeTab === 'stripe') ? '#ccc' : '#e94560',
                color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700',
                cursor: connecting || (!tested && activeTab === 'stripe') ? 'not-allowed' : 'pointer'
              }}
            >
              {connecting ? 'Saving...' : 'Save & Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
