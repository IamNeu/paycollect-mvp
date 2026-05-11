import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'
import API from '../apiConfig'

const TABS = ['Profile & Business', 'Payment Gateways', 'Notifications', 'Team & Roles', 'API Keys']

const GATEWAYS = [
  { id: 'gcash', name: 'GCash', desc: 'Philippines e-wallet', color: '#00b14f', logo: '💚' },
  { id: 'maya', name: 'Maya', desc: 'PayMaya / Maya Bank', color: '#0087da', logo: '💙' },
  { id: 'paymongo', name: 'PayMongo', desc: 'Cards + e-wallets', color: '#7c3aed', logo: '💜' },
  { id: 'xendit', name: 'Xendit', desc: 'Multi-channel PH', color: '#0f3460', logo: '🔷' },
  { id: 'dragonpay', name: 'DragonPay', desc: 'OTC + banks', color: '#e94560', logo: '🔴' },
]

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Profile & Business')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    company_name: '', email: '', phone: '',
    address: '', website: '', industry: ''
  })
  const [notifications, setNotifications] = useState({
    sms: true, email: true, whatsapp: false,
    payment_received: true, overdue_reminders: true, daily_summary: false
  })
  const [gatewayForm, setGatewayForm] = useState(null)
  const [gatewayKey, setGatewayKey] = useState({ api_key: '', secret_key: '' })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const m = res.data.merchant
      setProfile({
        company_name: m.company_name || '',
        email: m.email || '',
        phone: m.phone || '',
        address: m.address || '',
        website: m.website || '',
        industry: m.industry || ''
      })
      if (m.notification_preferences) {
        setNotifications(m.notification_preferences)
      }
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await axios.put(`${API}/api/auth/profile`, profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      // Update localStorage with new merchant data
      const existing = JSON.parse(localStorage.getItem('merchant') || '{}')
      localStorage.setItem('merchant', JSON.stringify({ ...existing, ...res.data.merchant }))
      toast.success('Profile updated! ✅')
    } catch (err) {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      await axios.put(`${API}/api/auth/profile`, {
        notification_preferences: notifications
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Notification preferences saved! ✅')
    } catch (err) {
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleConnectGateway = async (gatewayId) => {
    if (!gatewayKey.api_key) { toast.error('API key is required'); return }
    setSaving(true)
    try {
      await axios.put(`${API}/api/auth/profile`, {
        gateway_configs: [{ gateway: gatewayId, ...gatewayKey, connected: true }]
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success(`${gatewayId} connected! ✅`)
      setGatewayForm(null)
      setGatewayKey({ api_key: '', secret_key: '' })
      fetchProfile()
    } catch (err) {
      toast.error('Failed to connect gateway')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#aaa' }}>
        Loading...
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div style={{ padding: '0 24px 24px' }}>

        {/* Header */}
        <div style={{ padding: '18px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a1a2e' }}>Settings</div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #e9ecef', marginBottom: '24px', background: '#fff', borderRadius: '10px 10px 0 0', padding: '0 4px' }}>
          {TABS.map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 16px', fontSize: '0.83rem', fontWeight: '600', color: activeTab === tab ? '#0f3460' : '#666', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #e94560' : '2px solid transparent', marginBottom: '-1.5px', whiteSpace: 'nowrap' }}>
              {tab}
            </div>
          ))}
        </div>

        {/* ── Profile Tab ── */}
        {activeTab === 'Profile & Business' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460', marginBottom: '18px' }}>Business Profile</h3>
              {[
                { label: 'Company Name', key: 'company_name', placeholder: 'Your business name' },
                { label: 'Email Address', key: 'email', placeholder: 'business@email.com', type: 'email' },
                { label: 'Phone Number', key: 'phone', placeholder: '+63 9XX XXX XXXX' },
                { label: 'Business Address', key: 'address', placeholder: 'Full address' },
                { label: 'Website', key: 'website', placeholder: 'https://yourbusiness.com' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={profile[f.key]}
                    onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Industry</label>
                <select value={profile.industry} onChange={e => setProfile({ ...profile, industry: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', background: '#fff' }}>
                  <option value="">Select industry</option>
                  <option>Gym / Fitness</option>
                  <option>Lending / Finance</option>
                  <option>Real Estate</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
              <button onClick={handleSaveProfile} disabled={saving} style={{ padding: '9px 20px', background: saving ? '#ccc' : '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460', marginBottom: '18px' }}>Plan & Billing</h3>
              <div style={{ background: 'linear-gradient(135deg, #0f3460, #1a5ca8)', borderRadius: '12px', padding: '18px', color: '#fff', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Current Plan</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '4px' }}>Starter</div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)' }}>Up to 500 requests/month · 1 user · Basic reports</div>
                <div style={{ marginTop: '12px', display: 'inline-block', background: '#e94560', padding: '5px 14px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}>
                  Upgrade to Pro →
                </div>
              </div>
              {[
                { label: 'Monthly Requests Used', value: '142 / 500', pct: 28 },
                { label: 'Team Members', value: '1 / 1', pct: 100 },
                { label: 'Storage Used', value: '2.1 MB / 1 GB', pct: 1 },
              ].map(u => (
                <div key={u.label} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
                    <span style={{ color: '#666' }}>{u.label}</span>
                    <span style={{ fontWeight: '700', color: '#0f3460' }}>{u.value}</span>
                  </div>
                  <div style={{ height: '6px', background: '#f0f2f7', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${u.pct}%`, height: '100%', background: u.pct >= 100 ? '#e94560' : '#0f3460', borderRadius: '20px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Gateways Tab ── */}
        {activeTab === 'Payment Gateways' && (
          <div>
            <div style={{ background: '#fff8e6', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.82rem', color: '#856404', display: 'flex', gap: '8px' }}>
              <span>💡</span>
              <span>Connect at least one payment gateway to start accepting payments. GCash and Maya are recommended for Philippine merchants.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {GATEWAYS.map(gw => (
                <div key={gw.id} style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '18px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: gw.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{gw.logo}</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1a1a2e' }}>{gw.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>{gw.desc}</div>
                    </div>
                  </div>

                  {/* Show connect form if selected */}
                  {gatewayForm === gw.id ? (
                    <div>
                      <input
                        type="text"
                        placeholder="API Key"
                        value={gatewayKey.api_key}
                        onChange={e => setGatewayKey({ ...gatewayKey, api_key: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.78rem', marginBottom: '8px', boxSizing: 'border-box' }}
                      />
                      <input
                        type="password"
                        placeholder="Secret Key"
                        value={gatewayKey.secret_key}
                        onChange={e => setGatewayKey({ ...gatewayKey, secret_key: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.78rem', marginBottom: '8px', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleConnectGateway(gw.id)} disabled={saving} style={{ flex: 1, padding: '7px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '700', cursor: 'pointer', background: gw.color, color: '#fff', border: 'none' }}>
                          {saving ? 'Connecting...' : 'Connect'}
                        </button>
                        <button onClick={() => setGatewayForm(null)} style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#f0f2f7', color: '#666', border: 'none' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setGatewayForm(gw.id); setGatewayKey({ api_key: '', secret_key: '' }) }}
                      style={{ width: '100%', padding: '8px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', background: gw.color, color: '#fff', border: 'none' }}
                    >
                      Connect {gw.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Notifications Tab ── */}
        {activeTab === 'Notifications' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460', marginBottom: '18px' }}>Notification Preferences</h3>
            {[
              { key: 'sms', label: 'SMS Notifications', desc: 'Send payment link via SMS to customer' },
              { key: 'email', label: 'Email Notifications', desc: 'Send payment link via email to customer' },
              { key: 'whatsapp', label: 'WhatsApp Notifications', desc: 'Send via WhatsApp Business API' },
              { key: 'payment_received', label: 'Payment Received Alert', desc: 'Notify me when a customer pays' },
              { key: 'overdue_reminders', label: 'Overdue Reminders', desc: 'Auto-send reminders for overdue requests' },
              { key: 'daily_summary', label: 'Daily Summary Email', desc: 'Receive daily collections summary' },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#1a1a2e' }}>{n.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>{n.desc}</div>
                </div>
                <div
                  onClick={() => toggleNotification(n.key)}
                  style={{ width: '40px', height: '22px', borderRadius: '20px', background: notifications[n.key] ? '#0f3460' : '#e2e8f0', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: notifications[n.key] ? '20px' : '2px', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
            <button onClick={handleSaveNotifications} disabled={saving} style={{ marginTop: '16px', padding: '9px 20px', background: saving ? '#ccc' : '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        )}

        {/* ── API Keys Tab ── */}
        {activeTab === 'API Keys' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px', maxWidth: '700px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460', marginBottom: '6px' }}>API Keys</h3>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '18px' }}>Use these keys to integrate PayCollect into your own systems.</p>
            {[
              { label: 'Live Secret Key', value: 'sk_live_••••••••••••••••••••••••••••••••', env: 'LIVE' },
              { label: 'Live Public Key', value: 'pk_live_••••••••••••••••••••••••••••••••', env: 'LIVE' },
              { label: 'Test Secret Key', value: 'sk_test_••••••••••••••••••••••••••••••••', env: 'TEST' },
            ].map(k => (
              <div key={k.label} style={{ marginBottom: '14px', padding: '14px', background: '#f8faff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0f3460' }}>{k.label}</span>
                  <span style={{ fontSize: '0.62rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', background: k.env === 'LIVE' ? '#d1fae5' : '#fef3c7', color: k.env === 'LIVE' ? '#065f46' : '#92400e' }}>{k.env}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.78rem', color: '#666', background: '#fff', padding: '7px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.value}</div>
                  <button onClick={() => { navigator.clipboard.writeText(k.value); toast.success('Copied!') }} style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', whiteSpace: 'nowrap' }}>📋 Copy</button>
                  <button onClick={() => toast.success('Key rotated! ✅')} style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#fff0f3', color: '#e94560', border: '1px solid #fecdd3', whiteSpace: 'nowrap' }}>🔄 Rotate</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Team Tab ── */}
        {activeTab === 'Team & Roles' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px', maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460' }}>Team Members</h3>
              <button onClick={() => toast('Team management available on Pro plan 🔒')} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>+ Invite Member</button>
            </div>
            <div style={{ background: '#fff8e6', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.78rem', color: '#856404' }}>
              ⚠️ Team management is available on the Pro plan. Upgrade to add team members.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f3460', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.72rem', flexShrink: 0 }}>
                {profile.company_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AU'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.84rem', color: '#1a1a2e' }}>{profile.company_name || 'Admin'}</div>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>{profile.email}</div>
              </div>
              <span style={{ background: '#f0f4ff', color: '#0f3460', fontSize: '0.7rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>Owner</span>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}