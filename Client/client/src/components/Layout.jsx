import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}')
  const initials = merchant.company_name
    ? merchant.company_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'MA'

  const navLinks = [
    { label: '⬛ Dashboard', path: '/dashboard' },
    { label: '💳 Collect Payments', path: '/requests' },
    { label: '👥 Customers', path: '/customers' },
    { label: '📊 Reports', path: '/reports' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('merchant')
    navigate('/login')
  }

  return (
    <div style={{
      background: '#0f3460',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '0 24px',
      height: '52px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <span style={{
        color: '#fff',
        fontWeight: '800',
        fontSize: '1rem',
        letterSpacing: '-0.5px',
        whiteSpace: 'nowrap',
        marginRight: '8px',
        cursor: 'pointer'
      }} onClick={() => navigate('/dashboard')}>
        PayCollect
      </span>

      {/* Nav links */}
      {navLinks.map((link) => {
        const isActive = location.pathname === link.path ||
          (link.path === '/requests' && location.pathname.startsWith('/requests'))
        return (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              color: isActive ? '#fff' : '#a8b4d0',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              paddingBottom: isActive ? '2px' : '0',
              borderBottom: isActive ? '2px solid #e94560' : 'none',
              textDecoration: 'none'
            }}
          >
            {link.label}
          </span>
        )
      })}

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Bell */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.9rem', color: '#a8b4d0' }}>🔔</span>
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: '6px', height: '6px',
            background: '#e94560', borderRadius: '50%',
            border: '1.5px solid #0f3460'
          }} />
        </div>

        {/* Merchant name */}
        <span style={{
          fontSize: '0.74rem', color: '#a8b4d0',
          padding: '0 10px',
          borderLeft: '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer'
        }} onClick={handleLogout}>
          {merchant.company_name?.split(' ')[0] || 'Merchant'} ▾
        </span>

        {/* Avatar */}
        <div style={{
          width: '30px', height: '30px',
          borderRadius: '50%',
          background: '#e94560',
          color: '#fff',
          fontSize: '0.72rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: '700', cursor: 'pointer'
        }}>
          {initials}
        </div>
      </div>
    </div>
  )
}

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f7', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '0' }}>
        {children}
      </div>
    </div>
  )
}