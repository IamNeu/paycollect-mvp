import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import API from '../apiConfig'

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
    <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
      {s.label}
    </span>
  )
}

const TABS = ['All Requests', 'Pending', 'Partial', 'Paid', 'Failed']

export default function Requests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All Requests')
  const [search, setSearch] = useState('')
  const [counts, setCounts] = useState({ total: 0, pending: 0, partial: 0, paid: 0, failed: 0, outstanding: 0 })
  const [activePeriod, setActivePeriod] = useState('30 Days')

  const tabToStatus = { 'All Requests': '', 'Pending': 'pending', 'Partial': 'partial', 'Paid': 'paid', 'Failed': 'expired' }
const getDateRange = (period) => {
  const to = new Date()
  const from = new Date()
  if (period === 'Today') from.setDate(to.getDate())
  else if (period === '7 Days') from.setDate(to.getDate() - 7)
  else if (period === '30 Days') from.setDate(to.getDate() - 30)
  else if (period === '90 Days') from.setDate(to.getDate() - 90)
  else if (period === '6 Months') from.setMonth(to.getMonth() - 6)
  else if (period === '1 Year') from.setFullYear(to.getFullYear() - 1)
  return { from: from.toISOString(), to: to.toISOString() }
}
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchRequests()
  }, [activeTab, activePeriod])

  const fetchRequests = async () => {
    try {
      const params = {}
      const status = tabToStatus[activeTab]
      if (status) params.status = status
      if (search) params.search = search
      const { from, to } = getDateRange(activePeriod)
      params.from = from
      params.to = to

      const res = await axios.get(`${API}/api/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params
      })
      const reqs = res.data.requests || []
      setRequests(reqs)
      setCounts({
        total: reqs.length,
        pending: reqs.filter(r => r.status === 'pending').length,
        partial: reqs.filter(r => r.status === 'partial').length,
        paid: reqs.filter(r => r.status === 'paid').length,
        failed: reqs.filter(r => r.status === 'expired' || r.status === 'cancelled').length,
        outstanding: reqs.filter(r => r.status !== 'paid').reduce((s, r) => s + (r.amount_due - (r.amount_paid || 0)), 0)
      })
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date()
        const fmt = d => new Date(d).toLocaleDateString('en-PH', { day: 'numeric', month: 'short', year: 'numeric' })
        const { from: fromISO } = getDateRange(activePeriod)

  return (
    <Layout>
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
        {/* Page header */}
        <div style={{ padding: '18px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a1a2e' }}>Collect Payments</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 15px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>
              ⬆ Upload Excel
            </button>
            <button onClick={() => navigate('/requests/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 15px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>
              + New Request
            </button>
          </div>
        </div>

        {/* Time period bar */}
        <div style={{ padding: '14px 24px 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.7px' }}>Time Period:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['Today', '7 Days', '30 Days', '90 Days', '6 Months', '1 Year'].map(p => (
              <div key={p} onClick={() => setActivePeriod(p)} style={{ padding: '5px 13px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', background: p === activePeriod ? '#0f3460' : '#f5f7fb', color: p === activePeriod ? '#fff' : '#555', border: `1.5px solid ${p === activePeriod ? '#0f3460' : '#dde1ea'}`, cursor: 'pointer' }}>
                {p}
              </div>
            ))}
          </div>
        </div>

        {/* Active period */}
        <div style={{ padding: '8px 24px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: '#0f3460', fontWeight: '700' }}>📅 Showing data for:</span>
         <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#e94560', background: '#fff0f3', padding: '2px 10px', borderRadius: '20px', border: '1px solid #f5b8c4' }}>
            {fmt(fromISO)} — {fmt(today)} ({activePeriod})
          </span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '16px', padding: '14px 24px', flexWrap: 'wrap' }}>
          {[
            { val: counts.total, lbl: 'Total Requests', color: '#0f3460' },
            { val: counts.pending, lbl: 'Pending', color: '#856404' },
            { val: counts.partial, lbl: 'Partial Payments', color: '#084298' },
            { val: counts.paid, lbl: 'Fully Paid', color: '#0a3622' },
            { val: counts.failed, lbl: 'Failed / Expired', color: '#842029' },
            { val: `₱${Number(counts.outstanding).toLocaleString()}`, lbl: 'Total Outstanding', color: '#0f3460' },
          ].map(s => (
            <div key={s.lbl} style={{ flex: 1, minWidth: '130px', background: '#f5f7fb', borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '0.72rem', color: '#888', marginTop: '2px' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', padding: '0 24px', borderBottom: '1.5px solid #e9ecef' }}>
          {TABS.map(tab => (
            <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', fontSize: '0.83rem', fontWeight: '600', color: activeTab === tab ? '#0f3460' : '#666', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #e94560' : '2px solid transparent', marginBottom: '-1.5px' }}>
              {tab}
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '10px', padding: '14px 24px', alignItems: 'center' }}>
          <div style={{ flex: 1, background: '#f5f7fb', border: '1px solid #dde1ea', borderRadius: '8px', padding: '8px 14px', fontSize: '0.83rem', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="text"
              placeholder="🔍  Search by customer name, phone, reference…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchRequests()}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.83rem' }}
            />
          </div>
          <div style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', border: '1px solid #dde1ea', background: '#fff', color: '#555', cursor: 'pointer' }}>Amount ▾</div>
          <div style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600', border: '1px solid #0f3460', background: '#0f3460', color: '#fff', cursor: 'pointer' }}>Status ▾</div>
          <button style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '600', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', cursor: 'pointer' }}>Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: '0 24px 24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#f8faff' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1.5px solid #e2e8f0', fontSize: '0.75rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.6px' }}><input type="checkbox" /></th>
              {['Reference ID', 'Customer', 'Amount Due', 'Amount Paid', 'Payment Type', 'Status', 'Sent On', 'Due Date', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1.5px solid #e2e8f0', fontSize: '0.75rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.6px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ padding: '64px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
                  <div style={{ fontWeight: '700', color: '#0f3460', marginBottom: '6px' }}>No requests yet</div>
                  <button onClick={() => navigate('/requests/new')} style={{ marginTop: '8px', padding: '8px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600' }}>+ Create First Request</button>
                </td>
              </tr>
            ) : requests.map((req, i) => (
              <tr key={req._id} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f8faff'}
              >
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}><input type="checkbox" /></td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', fontWeight: '600', color: '#0f3460', cursor: 'pointer' }} onClick={() => navigate(`/requests/${req._id}`)}>
                  {req.reference_id || `REQ-${req._id.slice(-8).toUpperCase()}`}
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>
                  <div style={{ fontWeight: '600' }}>{req.customer_name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>{req.customer_mobile}</div>
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>₱{Number(req.amount_due).toLocaleString()}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>₱{Number(req.amount_paid || 0).toLocaleString()}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', color: '#666', textTransform: 'capitalize' }}>
                  {req.payment_type?.replace('_', ' ') || '—'}
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}><StatusPill status={req.status} /></td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', color: '#666' }}>
                  {req.sent_at ? new Date(req.sent_at).toLocaleDateString('en-PH') : '—'}
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7', color: '#666' }}>
                  {req.due_date ? new Date(req.due_date).toLocaleDateString('en-PH') : '—'}
                </td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #f0f2f7' }}>
                  <span onClick={() => navigate(`/requests/${req._id}`)} style={{ fontSize: '0.78rem', color: '#0f3460', cursor: 'pointer', marginRight: '8px', fontWeight: '600' }}>View</span>
                  {req.status !== 'paid' && <span style={{ fontSize: '0.78rem', color: '#e94560', cursor: 'pointer', fontWeight: '600' }}>Remind</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>Showing 1–{requests.length} of {requests.length} requests</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={{ padding: '5px 12px', fontSize: '0.78rem', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', borderRadius: '7px', cursor: 'pointer' }}>← Prev</button>
              <button style={{ padding: '5px 12px', fontSize: '0.78rem', background: '#e94560', color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer' }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}