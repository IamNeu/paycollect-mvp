import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import API from '../apiConfig'

//const API = 'http://localhost:10000'

function StatusPill({ status }) {
  const map = {
    pending:   { bg: '#fff3cd', color: '#856404', label: 'Pending' },
    partial:   { bg: '#cfe2ff', color: '#084298', label: 'Partial' },
    paid:      { bg: '#d1e7dd', color: '#0a3622', label: 'Paid' },
    expired:   { bg: '#f8d7da', color: '#842029', label: 'Expired' },
    cancelled: { bg: '#e2e3e5', color: '#41464b', label: 'Cancelled' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: '700' }}>
      {s.label}
    </span>
  )
}

export default function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('requests')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const [custRes, reqRes] = await Promise.all([
        axios.get(`${API}/api/customers/${id}`, { headers }),
        axios.get(`${API}/api/requests`, { headers, params: { customer_id: id } })
      ])
      setCustomer(custRes.data.customer || custRes.data)
      setRequests(reqRes.data.requests || [])
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      else toast.error('Failed to load customer')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#aaa' }}>
        Loading...
      </div>
    </Layout>
  )

  if (!customer) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '64px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
        <div style={{ fontWeight: '700', color: '#0f3460' }}>Customer not found</div>
        <button onClick={() => navigate('/customers')} style={{ marginTop: '16px', padding: '10px 20px', background: '#0f3460', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Back to Customers
        </button>
      </div>
    </Layout>
  )

  const name = customer.name || customer.customer_name || '—'
  const mobile = customer.mobile || customer.customer_mobile || '—'
  const email = customer.email || customer.customer_email || '—'
  const totalPaid = Number(customer.total_paid || 0)
  const outstanding = Number(customer.outstanding || 0)
  const since = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-PH', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Layout>
      <div style={{ padding: '0 24px 24px' }}>

        {/* Header */}
        <div style={{ padding: '18px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/customers')} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#fff', color: '#0f3460', border: '1.5px solid #e2e8f0' }}>
              ← Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#0f3460', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                {initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e' }}>{name}</span>
                  {customer.tag && (
                    <span style={{ background: '#f0f4ff', color: '#0f3460', fontSize: '0.7rem', fontWeight: '700', padding: '2px 9px', borderRadius: '20px' }}>
                      {customer.tag}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>
                  {mobile} · {email} · Since {since}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/requests/new')} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>
              + New Request
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Total Paid', value: `₱${totalPaid.toLocaleString()}`, color: '#0a3622', bg: '#f0fff6' },
            { label: 'Outstanding', value: `₱${outstanding.toLocaleString()}`, color: outstanding > 0 ? '#856404' : '#888', bg: '#fff8e6' },
            { label: 'Total Requests', value: customer.total_requests || requests.length, color: '#0f3460', bg: '#f0f4ff' },
            { label: 'Avg Days to Pay', value: customer.avg_days_to_pay ? `${customer.avg_days_to_pay} days` : '—', color: '#7c3aed', bg: '#f5f3ff' },
          ].map(k => (
            <div key={k.label} style={{ flex: 1, background: k.bg, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.74rem', color: '#666', marginTop: '2px' }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>

          {/* Left */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1.5px solid #e2e8f0', padding: '0 16px' }}>
              {['requests', 'timeline'].map(t => (
                <div key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 16px', fontSize: '0.83rem', fontWeight: '600', color: activeTab === t ? '#0f3460' : '#666', cursor: 'pointer', borderBottom: activeTab === t ? '2px solid #e94560' : '2px solid transparent', marginBottom: '-1.5px', textTransform: 'capitalize' }}>
                  {t === 'requests' ? 'Payment Requests' : 'Activity Timeline'}
                </div>
              ))}
            </div>

            {activeTab === 'requests' && (
              requests.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                  <div style={{ fontSize: '0.84rem', color: '#aaa', marginBottom: '12px' }}>No requests yet</div>
                  <button onClick={() => navigate('/requests/new')} style={{ padding: '7px 16px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}>
                    + Create Request
                  </button>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f8faff' }}>
                      {['Ref ID', 'Amount Due', 'Amount Paid', 'Status', 'Due Date', ''].map(h => (
                        <th key={h} style={{ padding: '9px 14px', textAlign: 'left', borderBottom: '1.5px solid #e2e8f0', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={r._id} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff' }}>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#0f3460', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate(`/requests/${r._id}`)}>
                          {r.reference_id || `REQ-${r._id.slice(-6).toUpperCase()}`}
                        </td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', fontWeight: '700' }}>₱{Number(r.amount_due).toLocaleString()}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#0a3622', fontWeight: '700' }}>₱{Number(r.amount_paid || 0).toLocaleString()}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7' }}><StatusPill status={r.status} /></td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#666' }}>
                          {r.due_date ? new Date(r.due_date).toLocaleDateString('en-PH') : '—'}
                        </td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7' }}>
                          <button onClick={() => navigate(`/requests/${r._id}`)} style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {activeTab === 'timeline' && (
              <div style={{ padding: '16px 20px' }}>
                {requests.length === 0 ? (
                  <div style={{ color: '#aaa', fontSize: '0.84rem', textAlign: 'center', padding: '24px' }}>No activity yet</div>
                ) : requests.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.status === 'paid' ? '#22c55e' : '#0f3460', marginTop: '4px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#333', fontWeight: '600' }}>
                        {r.reference_id || `REQ-${r._id.slice(-6).toUpperCase()}`} — ₱{Number(r.amount_due).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#aaa' }}>
                        {new Date(r.createdAt).toLocaleDateString('en-PH')} · {r.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — details */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '18px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#e94560', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Customer Details</h4>
            {[
              { k: 'Full Name', v: name },
              { k: 'Mobile', v: mobile },
              { k: 'Email', v: email },
              { k: 'Tag', v: customer.tag || '—' },
              { k: 'Customer Since', v: since },
              { k: 'Total Requests', v: customer.total_requests || requests.length },
              { k: 'Total Paid', v: `₱${totalPaid.toLocaleString()}` },
              { k: 'Outstanding', v: `₱${outstanding.toLocaleString()}` },
            ].map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.82rem' }}>
                <span style={{ color: '#888' }}>{row.k}</span>
                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{row.v}</span>
              </div>
            ))}
            {customer.notes && (
              <div style={{ marginTop: '14px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#aaa', marginBottom: '4px' }}>NOTES</div>
                <div style={{ fontSize: '0.82rem', color: '#555', background: '#f8f9ff', padding: '8px 10px', borderRadius: '7px' }}>{customer.notes}</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  )
}