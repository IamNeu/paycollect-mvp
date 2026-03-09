import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'

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
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '700',
      letterSpacing: '0.4px'
    }}>
      {s.label}
    </span>
  )
}

export default function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchRequest()
  }, [id])

  const fetchRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/requests/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setRequest(res.data.request)
    } catch (err) {
      if (err.response?.status === 401) navigate('/login')
      toast.error('Failed to load request')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return
    setCancelling(true)
    try {
      await axios.patch(
        `http://localhost:5000/api/requests/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      toast.success('Request cancelled')
      fetchRequest()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    } finally {
      setCancelling(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(request.payment_link)
    toast.success('Payment link copied! 📋')
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ color: '#6b7280' }}>Loading...</div>
        </div>
      </Layout>
    )
  }

  if (!request) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '64px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f3460' }}>Request not found</div>
          <button onClick={() => navigate('/requests')} style={{
            marginTop: '16px', padding: '10px 20px',
            backgroundColor: '#0f3460', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}>
            Back to Requests
          </button>
        </div>
      </Layout>
    )
  }

  // Calculate progress percentage
  const progress = request.amount_due > 0
    ? Math.min((request.amount_paid / request.amount_due) * 100, 100)
    : 0

  const remaining = request.amount_due - (request.amount_paid || 0)
  const isPaid = request.status === 'paid'
  const isCancelled = request.status === 'cancelled'
  const isExpired = request.status === 'expired'

  return (
    <Layout>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/requests')}
            style={{
              background: 'white', border: '1px solid #dde3f0',
              borderRadius: '8px', padding: '8px 14px',
              cursor: 'pointer', fontSize: '14px', color: '#6b7280'
            }}
          >
            ← Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f3460' }}>
                {request.reference_id || `REQ-${request._id.slice(-6).toUpperCase()}`}
              </h1>
              <StatusPill status={request.status} />
            </div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '2px' }}>
              Created {new Date(request.createdAt).toLocaleDateString('en-PH', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            style={{
              padding: '10px 16px',
              backgroundColor: 'white',
              border: '1px solid #dde3f0',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            🔗 Copy Payment Link
          </button>

          {/* Cancel button */}
          {!isPaid && !isCancelled && !isExpired && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              style={{
                padding: '10px 16px',
                backgroundColor: '#fff0f3',
                border: '1px solid #fecdd3',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#e94560'
              }}
            >
              {cancelling ? 'Cancelling...' : '✕ Cancel Request'}
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

        {/* Left column */}
        <div style={{ flex: 2 }}>

          {/* Payment Progress Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
              💰 Payment Progress
            </h2>

            {/* Amount row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Amount Due', value: `₱${Number(request.amount_due).toLocaleString()}`, color: '#0f3460' },
                { label: 'Amount Paid', value: `₱${Number(request.amount_paid || 0).toLocaleString()}`, color: '#059669' },
                { label: 'Remaining', value: `₱${Number(remaining).toLocaleString()}`, color: remaining > 0 ? '#d97706' : '#059669' },
              ].map((item) => (
                <div key={item.label} style={{
                  flex: 1, backgroundColor: '#f9fafb',
                  borderRadius: '10px', padding: '16px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: item.color }}>
                    {item.value}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>Payment progress</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f3460' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div style={{
              width: '100%', height: '10px',
              backgroundColor: '#f3f4f6', borderRadius: '10px', overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: isPaid ? '#059669' : '#0f3460',
                borderRadius: '10px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Request Details Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
              📋 Request Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Customer Name', value: request.customer_name },
                { label: 'Mobile', value: request.customer_mobile },
                { label: 'Email', value: request.customer_email || '—' },
                { label: 'Payment Type', value: request.payment_type?.replace('_', ' ') },
                { label: 'Due Date', value: new Date(request.due_date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { label: 'Partial Payments', value: request.allow_partial ? 'Allowed' : 'Not allowed' },
                { label: 'Sent At', value: request.sent_at ? new Date(request.sent_at).toLocaleString('en-PH') : '—' },
                { label: 'Paid At', value: request.paid_at ? new Date(request.paid_at).toLocaleString('en-PH') : '—' },
              ].map((row) => (
                <div key={row.label}>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>
                    {row.label.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: '500' }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {request.description && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', marginBottom: '6px' }}>
                  NOTE TO CUSTOMER
                </div>
                <div style={{
                  fontSize: '14px', color: '#374151',
                  backgroundColor: '#f9fafb', borderRadius: '8px',
                  padding: '12px'
                }}>
                  {request.description}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right column */}
        <div style={{ flex: 1 }}>

          {/* Payment Link Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '16px' }}>
              🔗 Payment Link
            </h2>
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              color: '#6b7280',
              wordBreak: 'break-all',
              marginBottom: '12px',
              fontFamily: 'monospace'
            }}>
              {request.payment_link || '—'}
            </div>
            <button
              onClick={handleCopyLink}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#eef4ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                color: '#0f3460'
              }}
            >
              📋 Copy Link
            </button>
          </div>

          {/* Timeline Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
              📅 Activity Timeline
            </h2>

            {/* Timeline events */}
            {[
              {
                event: 'Request Created',
                time: request.createdAt,
                icon: '✅',
                color: '#059669'
              },
              {
                event: 'SMS/Email Sent',
                time: request.sent_at,
                icon: '📤',
                color: '#3b82f6'
              },
              {
                event: 'Payment Received',
                time: request.paid_at,
                icon: '💰',
                color: '#059669'
              },
              {
                event: 'Cancelled',
                time: request.cancelled_at,
                icon: '✕',
                color: '#e94560'
              },
            ].filter(e => e.time).map((event, i) => (
              <div key={i} style={{
                display: 'flex', gap: '12px',
                marginBottom: '16px', alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  backgroundColor: `${event.color}20`,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '14px',
                  flexShrink: 0
                }}>
                  {event.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>
                    {event.event}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {new Date(event.time).toLocaleString('en-PH')}
                  </div>
                </div>
              </div>
            ))}

            {/* If no events yet */}
            {!request.sent_at && !request.paid_at && (
              <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
                No activity yet
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  )
}