import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'

export default function Customers() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://paycollect-api.onrender.com/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: search ? { search } : {}
      })
      setCustomers(res.data.customers || [])
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      // If endpoint doesn't exist yet, use empty array silently
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { val: customers.length || '1,284', lbl: 'Total Customers', bg: '#f0f4ff', color: '#0f3460' },
    { val: '342', lbl: 'Open Requests', bg: '#fff8e6', color: '#856404' },
    { val: '891', lbl: 'All-time Paid', bg: '#f0fff6', color: '#0a3622' },
    { val: '51', lbl: 'Never Paid', bg: '#fdecea', color: '#842029' },
  ]

  // Sample data for display when no real data yet
  const sampleCustomers = [
    { _id: '1', name: 'Priya Sharma', mobile: '98765 43210', email: 'priya@email.com', tag: 'VIP', tagBg: '#f0f4ff', tagColor: '#0f3460', requests: 8, total_paid: '1,84,500', outstanding: '25,000', outColor: '#856404', last_activity: '23 Feb 2026' },
    { _id: '2', name: 'Rajan Mehta', mobile: '91234 56789', email: 'rajan@email.com', tag: 'Wholesale', tagBg: '#f0fff6', tagColor: '#0a3622', requests: 3, total_paid: '62,000', outstanding: '50,000', outColor: '#e94560', last_activity: '18 Feb 2026' },
    { _id: '3', name: 'Anita Desai', mobile: '99887 76655', email: 'anita@email.com', tag: 'Retail', tagBg: '#fff8e6', tagColor: '#856404', requests: 12, total_paid: '3,20,750', outstanding: '0', outColor: '#888', last_activity: '21 Feb 2026' },
    { _id: '4', name: 'Suresh Iyer', mobile: '77665 54433', email: 'suresh@email.com', tag: 'VIP', tagBg: '#f0f4ff', tagColor: '#0f3460', requests: 5, total_paid: '98,000', outstanding: '8,000', outColor: '#856404', last_activity: '12 Feb 2026' },
  ]

  const displayList = customers.length > 0 ? customers : sampleCustomers

  return (
    <Layout>
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>

        {/* Page header */}
        <div style={{ padding: '18px 24px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a1a2e' }}>Customers</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>↓ Export CSV</button>
            <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>↑ Bulk Upload</button>
            <button onClick={() => navigate('/customers/new')} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>+ Add Customer</button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: '12px', padding: '0 24px 18px', flexWrap: 'wrap' }}>
          {stats.map(s => (
            <div key={s.lbl} style={{ flex: 1, minWidth: '130px', background: s.bg, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.74rem', color: '#666', marginTop: '2px' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Search + filter bar */}
        <div style={{ padding: '0 24px 14px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '200px', display: 'flex', alignItems: 'center', background: '#f5f7fb', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', gap: '8px' }}>
            <span style={{ color: '#aaa' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by name, mobile or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchCustomers()}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.82rem' }}
            />
          </div>
          <select style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', color: '#333', background: '#fff' }}>
            <option>All Tags</option>
            <option>VIP</option>
            <option>Wholesale</option>
            <option>Retail</option>
          </select>
          <select style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', color: '#333', background: '#fff' }}>
            <option>Sort: Name A–Z</option>
            <option>Most Recent</option>
            <option>Highest Balance</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '0 24px 24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8faff' }}>
              {['', 'Customer', 'Mobile', 'Email', 'Tags', 'Requests', 'Total Paid (₱)', 'Outstanding (₱)', 'Last Activity', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Total Paid (₱)' || h === 'Outstanding (₱)' ? 'right' : 'left', borderBottom: '1.5px solid #e2e8f0', fontSize: '0.75rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {h === '' ? <input type="checkbox" /> : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading...</td></tr>
            ) : displayList.map((c, i) => (
              <tr key={c._id} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f8faff'}
              >
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}><input type="checkbox" /></td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>{c.name || c.customer_name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Since {c.since || '12 Jan 2026'}</div>
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', fontSize: '0.8rem' }}>{c.mobile || c.customer_mobile}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', fontSize: '0.78rem', color: '#0f3460' }}>{c.email || c.customer_email || '—'}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>
                  <span style={{ background: c.tagBg || '#f0f4ff', color: c.tagColor || '#0f3460', fontSize: '0.68rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                    {c.tag || 'Customer'}
                  </span>
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', textAlign: 'center', fontWeight: '700' }}>{c.requests || 0}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', textAlign: 'right', fontWeight: '700', color: '#0a3622' }}>{c.total_paid || '0'}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', textAlign: 'right', fontWeight: '700', color: c.outColor || '#856404' }}>{c.outstanding || '0'}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', fontSize: '0.74rem', color: '#888' }}>{c.last_activity || '—'}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => navigate(`/customers/${c._id}`)} style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>View</button>
                    <button onClick={() => navigate(`/requests/new`)} style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>+ Request</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
          <div style={{ fontSize: '0.78rem', color: '#888' }}>Showing 1–{displayList.length} of {displayList.length} customers</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button style={{ padding: '5px 11px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>← Prev</button>
            <button style={{ background: '#0f3460', color: '#fff', border: 'none', borderRadius: '7px', padding: '5px 11px', fontSize: '0.74rem', fontWeight: '700' }}>1</button>
            <button style={{ padding: '5px 11px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>2</button>
            <button style={{ padding: '5px 11px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Next →</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}