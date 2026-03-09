import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f6fa' }}>
      <Sidebar />
      {/* Main content — pushed right to make room for sidebar */}
      <div style={{ marginLeft: '240px', flex: 1, padding: '32px' }}>
        {children}
      </div>
    </div>
  )
}