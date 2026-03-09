import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '📊' },
  { label: 'Collect Payments', path: '/requests', icon: '💳' },
  { label: 'Customers', path: '/customers', icon: '👥' },
  { label: 'Reports', path: '/reports', icon: '📈' },
  { label: 'Settings', path: '/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('merchant')
    navigate('/login')
  }

  return (
    <div style={{
      width: '240px',
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f3460 0%, #0d2545 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      zIndex: 100
    }}>

      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            backgroundColor: '#e94560',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800', color: 'white', fontSize: '16px'
          }}>P</div>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '16px' }}>PayCollect</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Merchant Portal</div>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 20px',
                cursor: 'pointer',
                borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
                backgroundColor: isActive ? 'rgba(233,69,96,0.12)' : 'transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Merchant info + logout */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
            {merchant.company_name || 'My Business'}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
            {merchant.email || ''}
          </div>
          <div style={{
            display: 'inline-block',
            marginTop: '4px',
            background: '#e94560',
            color: 'white',
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '20px',
            textTransform: 'uppercase'
          }}>
            {merchant.plan || 'starter'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Sign out
        </button>
      </div>

    </div>
  )
}