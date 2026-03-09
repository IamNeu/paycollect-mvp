import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'

// Status pill component
function StatusPill({ status }) {
  const styles = {
    pending:   { bg: '#fffbeb', color: '#d97706', label: 'PENDING' },
    partial:   { bg: '#eff6ff', color: '#3b82f6', label: 'PARTIAL' },
    paid:      { bg: '#f0fdf4', color: '#059669', label: 'PAID' },
    expired:   { bg: '#fff0f3', color: '#e94560', label: 'EXPIRED' },
    cancelled: { bg: '#f3f4f6', color: '#6b7280', label: 'CANCELLED' },
  }
  const s = styles[status] || styles.pending
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.4px'
    }}>
      {s.label}
    </span>
  )
}

export default function Requests() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchRequests(token)
  }, [filter])

  const fetchRequests = async (token) => {
    try {
      const params = {}
      if (filter !== 'all') params.status = filter
      if (search) params.search = search

      const res = await axios.get('http://localhost:5000/api/requests', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params
      })
      setRequests(res.data.requests || [])
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      toast.error('Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchRequests(localStorage.getItem('token'))
  }

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Partial', value: 'partial' },
    { label: 'Paid', value: 'paid' },
    { label: 'Expired', value: 'expired' },
  ]

  return (
    <Layout>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f3460', marginBottom: '4px' }}>
            Collect Payments
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Manage and track all your payment requests
          </p>
        </div>
        <button
          onClick={() => navigate('/requests/new')}
          style={{
            backgroundColor: '#0f3460',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + New Request
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '16px 20px',
        border: '1px solid #dde3f0',
        marginBottom: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search by customer name, phone, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #dde3f0',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '9px 16px',
              backgroundColor: '#0f3460',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </form>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: filter === btn.value ? '#0f3460' : '#dde3f0',
                backgroundColor: filter === btn.value ? '#0f3460' : 'white',
                color: filter === btn.value ? 'white' : '#6b7280',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #dde3f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        overflow: 'hidden'
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr',
          padding: '12px 20px',
          backgroundColor: '#0f3460',
          color: 'white',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          <div>REFERENCE</div>
          <div>CUSTOMER</div>
          <div>AMOUNT DUE</div>
          <div>AMOUNT PAID</div>
          <div>TYPE</div>
          <div>STATUS</div>
          <div>DUE DATE</div>
        </div>

        {/* Table rows */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f3460', marginBottom: '8px' }}>
              No payment requests yet
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
              Create your first request to start collecting payments
            </div>
            <button
              onClick={() => navigate('/requests/new')}
              style={{
                backgroundColor: '#0f3460',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Create First Request
            </button>
          </div>
        ) : (
          requests.map((req, i) => (
            <div
              key={req._id}
              onClick={() => navigate(`/requests/${req._id}`)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 1fr 1fr 1fr',
                padding: '14px 20px',
                borderBottom: '1px solid #f3f4f6',
                fontSize: '13px',
                color: '#374151',
                cursor: 'pointer',
                backgroundColor: i % 2 === 0 ? 'white' : '#fafbff',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eef4ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#fafbff'}
            >
              <div style={{ fontWeight: '600', color: '#0f3460', fontFamily: 'monospace', fontSize: '12px' }}>
                {req.reference_id || req._id.slice(-8).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{req.customer_name}</div>
                <div style={{ color: '#9ca3af', fontSize: '11px' }}>{req.customer_mobile}</div>
              </div>
              <div style={{ fontWeight: '700' }}>₱{Number(req.amount_due).toLocaleString()}</div>
              <div style={{ color: '#059669', fontWeight: '600' }}>
                ₱{Number(req.amount_paid || 0).toLocaleString()}
              </div>
              <div style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                {req.payment_type?.replace('_', ' ') || 'One time'}
              </div>
              <div><StatusPill status={req.status} /></div>
              <div style={{ color: '#6b7280' }}>
                {req.due_date ? new Date(req.due_date).toLocaleDateString('en-PH') : '—'}
              </div>
            </div>
          ))
        )}
      </div>

    </Layout>
  )
}