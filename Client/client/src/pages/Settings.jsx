import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import axios from 'axios'

const TABS = ['Profile & Business', 'Payment Gateways', 'Notifications', 'Team & Roles', 'API Keys']

const gateways = [
  { id: 'gcash', name: 'GCash', desc: 'Philippines e-wallet', color: '#00b14f', logo: '💚', connected: true },
  { id: 'maya', name: 'Maya', desc: 'PayMaya / Maya Bank', color: '#0087da', logo: '💙', connected: true },
  { id: 'paymongo', name: 'PayMongo', desc: 'Cards + e-wallets', color: '#7c3aed', logo: '💜', connected: false },
  { id: 'xendit', name: 'Xendit', desc: 'Multi-channel PH', color: '#0f3460', logo: '🔷', connected: false },
  { id: 'dragonpay', name: 'DragonPay', desc: 'OTC + banks', color: '#e94560', logo: '🔴', connected: false },
]

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Profile & Business')
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}')
  const [profile, setProfile] = useState({
    company_name: merchant.company_name || '',
    email: merchant.email || '',
    phone: merchant.phone || '',
    address: merchant.address || '',
    website: merchant.website || '',
    industry: merchant.industry || '',
  })

  const handleSaveProfile = async () => {
    try {
      toast.success('Profile updated! ✅')
    } catch (err) {
      toast.error('Failed to save')
    }
  }

  return (
    <Layout>
      <div style={{ padding: '0 24px 24px' }}>

        {/* Header */}
        <div style={{ padding: '18px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a1a2e' }}>Settings</div>
          <a href="#" style={{ fontSize: '0.8rem', color: '#0f3460', display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', border: '1.5px solid #c7d2f0', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
            🔑 API Keys & Docs →
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1.5px solid #e9ecef', marginBottom: '24px', background: '#fff', borderRadius: '10px 10px 0 0', padding: '0 4px' }}>
          {TABS.map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 16px', fontSize: '0.83rem', fontWeight: '600', color: activeTab === tab ? '#0f3460' : '#666', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #e94560' : '2px solid transparent', marginBottom: '-1.5px', whiteSpace: 'nowrap' }}>
              {tab}
            </div>
          ))}
        </div>

        {/* Profile Tab */}
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
                  <input type={f.type || 'text'} placeholder={f.placeholder} value={profile[f.key]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
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
              <button onClick={handleSaveProfile} style={{ padding: '9px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer' }}>
                Save Changes
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

        {/* Gateways Tab */}
        {activeTab === 'Payment Gateways' && (
          <div>
            <div style={{ background: '#fff8e6', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.82rem', color: '#856404', display: 'flex', gap: '8px' }}>
              <span>💡</span>
              <span>Connect at least one payment gateway to start accepting payments. GCash and Maya are recommended for Philippine merchants.</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {gateways.map(gw => (
                <div key={gw.id} style={{ background: '#fff', borderRadius: '12px', border: `1.5px solid ${gw.connected ? gw.color + '40' : '#e2e8f0'}`, padding: '18px', position: 'relative' }}>
                  {gw.connected && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#d1fae5', color: '#065f46', fontSize: '0.62rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                      ✓ Connected
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: gw.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{gw.logo}</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1a1a2e' }}>{gw.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>{gw.desc}</div>
                    </div>
                  </div>
                  {gw.connected ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ flex: 1, padding: '7px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Configure</button>
                      <button style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#fff0f3', color: '#e94560', border: '1px solid #fecdd3' }}>Disconnect</button>
                    </div>
                  ) : (
                    <button style={{ width: '100%', padding: '8px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', background: gw.color, color: '#fff', border: 'none' }}>
                      Connect {gw.name}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'Notifications' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px', maxWidth: '600px' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460', marginBottom: '18px' }}>Notification Preferences</h3>
            {[
              { label: 'SMS Notifications', desc: 'Send payment link via SMS to customer', defaultOn: true },
              { label: 'Email Notifications', desc: 'Send payment link via email to customer', defaultOn: true },
              { label: 'WhatsApp Notifications', desc: 'Send via WhatsApp Business API', defaultOn: false },
              { label: 'Payment Received Alert', desc: 'Notify me when a customer pays', defaultOn: true },
              { label: 'Overdue Reminders', desc: 'Auto-send reminders for overdue requests', defaultOn: true },
              { label: 'Daily Summary Email', desc: 'Receive daily collections summary', defaultOn: false },
            ].map(n => (
              <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#1a1a2e' }}>{n.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>{n.desc}</div>
                </div>
                <div style={{ width: '40px', height: '22px', borderRadius: '20px', background: n.defaultOn ? '#0f3460' : '#e2e8f0', position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: n.defaultOn ? '20px' : '2px', transition: 'left 0.2s' }} />
                </div>
              </div>
            ))}
            <button onClick={() => toast.success('Notification preferences saved!')} style={{ marginTop: '16px', padding: '9px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer' }}>
              Save Preferences
            </button>
          </div>
        )}

        {/* API Keys Tab */}
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
                  <button onClick={() => toast.success('Copied!')} style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', whiteSpace: 'nowrap' }}>📋 Copy</button>
                  <button style={{ padding: '7px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#fff0f3', color: '#e94560', border: '1px solid #fecdd3', whiteSpace: 'nowrap' }}>🔄 Rotate</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'Team & Roles' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '22px', maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f3460' }}>Team Members</h3>
              <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>+ Invite Member</button>
            </div>
            <div style={{ background: '#fff8e6', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.78rem', color: '#856404' }}>
              ⚠️ Team management is available on the Pro plan. Upgrade to add team members.
            </div>
            {[
              { name: merchant.company_name || 'Admin User', email: merchant.email || 'admin@business.com', role: 'Owner', initials: 'AU', color: '#0f3460' },
            ].map(m => (
              <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.72rem', flexShrink: 0 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.84rem', color: '#1a1a2e' }}>{m.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>{m.email}</div>
                </div>
                <span style={{ background: '#f0f4ff', color: '#0f3460', fontSize: '0.7rem', fontWeight: '700', padding: '3px 10px', borderRadius: '20px' }}>{m.role}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  )
}