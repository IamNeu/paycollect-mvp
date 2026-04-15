import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'

const API = 'http://localhost:10000'

export default function AddCustomer() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', mobile: '', email: '',
    tag: 'Customer', notes: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.mobile) {
      toast.error('Name and mobile are required')
      return
    }
    setLoading(true)
    try {
      await axios.post(`${API}/api/customers`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Customer added! 🎉')
      navigate('/customers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add customer')
    } finally {
      setLoading(false)
    }
  }

  const inp = (label, key, placeholder, type = 'text') => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #dde1ea', borderRadius: '8px', fontSize: '0.84rem', boxSizing: 'border-box' }}
      />
    </div>
  )

  return (
    <Layout>
      <div style={{ padding: '24px', maxWidth: '560px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span
            onClick={() => navigate('/customers')}
            style={{ fontSize: '0.75rem', color: '#aaa', cursor: 'pointer' }}
          >
            ← Back to Customers
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e', marginTop: '4px' }}>
            Add New Customer
          </div>
        </div>

        {/* Form card */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '24px' }}>

          {inp('Full Name *', 'name', 'e.g. Juan dela Cruz')}
          {inp('Mobile (PH) *', 'mobile', '+63 9XX XXX XXXX')}
          {inp('Email', 'email', 'juan@email.com', 'email')}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>
              Tag
            </label>
            <select
              value={form.tag}
              onChange={e => setForm({ ...form, tag: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #dde1ea', borderRadius: '8px', fontSize: '0.84rem', background: '#fff' }}
            >
              <option value="Customer">Customer</option>
              <option value="VIP">VIP</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>
              Notes
            </label>
            <textarea
              placeholder="Any notes about this customer..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              style={{ width: '100%', height: '80px', resize: 'none', padding: '9px 12px', border: '1.5px solid #dde1ea', borderRadius: '8px', fontSize: '0.84rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/customers')}
              style={{ flex: 1, padding: '10px', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ flex: 2, padding: '10px', background: loading ? '#ccc' : '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Saving...' : '+ Add Customer'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}