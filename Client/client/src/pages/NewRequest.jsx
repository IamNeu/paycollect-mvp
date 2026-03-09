import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'

export default function NewRequest() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_mobile: '',
    customer_email: '',
    amount_due: '',
    due_date: '',
    payment_type: 'one_time',
    allow_partial: true,
    description: '',
    reference_id: ''
  })

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(
        'http://localhost:5000/api/requests',
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      toast.success('Payment request created! 🎉')
      navigate('/requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request')
    } finally {
      setLoading(false)
    }
  }

  // Get today's date for min due date
  const today = new Date().toISOString().split('T')[0]

  return (
    <Layout>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button
          onClick={() => navigate('/requests')}
          style={{
            background: 'white',
            border: '1px solid #dde3f0',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#6b7280'
          }}
        >
          ← Back
        </button>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f3460', marginBottom: '2px' }}>
            New Payment Request
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Fill in the details and we'll send a payment link to the customer
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        {/* Left — Main form */}
        <div style={{ flex: 2 }}>

          {/* Customer Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
              👤 Customer Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Customer Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Juan dela Cruz"
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Mobile */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="customer_mobile"
                  value={formData.customer_mobile}
                  onChange={handleChange}
                  placeholder="09XXXXXXXXX"
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Email Address (optional)
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

            </div>
          </div>

          {/* Payment Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
              💳 Payment Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              {/* Amount */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Amount Due (₱) *
                </label>
                <input
                  type="number"
                  name="amount_due"
                  value={formData.amount_due}
                  onChange={handleChange}
                  placeholder="1500.00"
                  required
                  min="1"
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Due Date */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Due Date *
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  min={today}
                  required
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Payment Type */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Payment Type
                </label>
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="one_time">One Time</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Reference ID */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Reference ID (optional)
                </label>
                <input
                  type="text"
                  name="reference_id"
                  value={formData.reference_id}
                  onChange={handleChange}
                  placeholder="INV-001"
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Note to Customer (optional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Monthly gym membership fee for March 2026"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 14px',
                    borderRadius: '8px', border: '1px solid #dde3f0',
                    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    resize: 'vertical', fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Allow Partial */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="allow_partial"
                  id="allow_partial"
                  checked={formData.allow_partial}
                  onChange={handleChange}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="allow_partial" style={{ fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
                  Allow partial payments — customer can pay in installments
                </label>
              </div>

            </div>
          </div>

        </div>

        {/* Right — Summary card */}
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #dde3f0',
            position: 'sticky',
            top: '24px'
          }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
              📋 Summary
            </h2>

            {/* Preview */}
            <div style={{ marginBottom: '20px' }}>
              {[
                { label: 'Customer', value: formData.customer_name || '—' },
                { label: 'Mobile', value: formData.customer_mobile || '—' },
                { label: 'Amount', value: formData.amount_due ? `₱${Number(formData.amount_due).toLocaleString()}` : '—' },
                { label: 'Due Date', value: formData.due_date || '—' },
                { label: 'Type', value: formData.payment_type.replace('_', ' ') },
                { label: 'Partial OK', value: formData.allow_partial ? 'Yes' : 'No' },
              ].map((row) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid #f3f4f6',
                  fontSize: '13px'
                }}>
                  <span style={{ color: '#6b7280' }}>{row.label}</span>
                  <span style={{ fontWeight: '600', color: '#0f3460' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* What happens next */}
            <div style={{
              backgroundColor: '#eef4ff',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#374151'
            }}>
              <div style={{ fontWeight: '700', marginBottom: '6px' }}>What happens next:</div>
              <div>✉️ Customer gets an SMS with payment link</div>
              <div style={{ marginTop: '4px' }}>📧 Email sent if address provided</div>
              <div style={{ marginTop: '4px' }}>📊 Request appears in your dashboard</div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#6b7280' : '#0f3460',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating...' : '🚀 Send Payment Request'}
            </button>

            <button
              onClick={() => navigate('/requests')}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #dde3f0',
                borderRadius: '10px',
                fontSize: '14px',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Cancel
            </button>

          </div>
        </div>

      </div>
    </Layout>
  )
}