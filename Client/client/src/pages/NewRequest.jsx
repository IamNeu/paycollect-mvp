import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import API from '../config'

const TABS = [
  { id: 'existing', label: '🔍 Existing Customer' },
  { id: 'new', label: '➕ New Customer + Link' },
  { id: 'bulk', label: '📋 Bulk Upload' },
  { id: 'multi', label: '📊 Quick Multi-Entry' },
]

function ExistingCustomerTab({ navigate }) {
  const [form, setForm] = useState({ amount_due: '', due_date: '', payment_type: 'one_time', reference_id: '', description: '', allow_partial: true })
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.post('https://paycollect-api.onrender.com/api/requests',
        { ...form, customer_name: 'Maria Santos', customer_mobile: '+63 917 1234' },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      toast.success('Payment request sent! 🎉')
      navigate('/requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '520px' }}>
      {/* Left: customer list */}
      <div style={{ width: '300px', flexShrink: 0, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontSize: '0.64rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>1 — Find Customer</div>
          <div style={{ position: 'relative' }}>
            <input type="text" placeholder="Name, mobile or account no." style={{ width: '100%', padding: '7px 10px 7px 28px', border: '1.5px solid #c7d2f0', borderRadius: '7px', fontSize: '0.78rem', background: '#f8f9ff', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}>🔍</span>
          </div>
        </div>
        {[
          { initials: 'MS', name: 'Maria Santos', mobile: '+63 917 1234 · ACC-0041', paid: '₱84,500 paid', pending: '2 pending', color: '#0f3460', active: true },
          { initials: 'JR', name: 'Jose Reyes', mobile: '+63 922 9876 · ACC-0092', paid: '₱120,000 paid', pending: '0 pending', color: '#8b5cf6' },
          { initials: 'AC', name: 'Ana Cruz', mobile: '+63 935 4567 · ACC-0158', paid: '₱35,000 paid', pending: '1 pending', color: '#e94560' },
          { initials: 'CV', name: 'Carlo V.', mobile: '+63 918 3210 · ACC-0203', paid: '₱62,000 paid', pending: '0 pending', color: '#22c55e' },
          { initials: 'LM', name: 'Liza Mendoza', mobile: '+63 935 7890 · ACC-0221', paid: '₱18,000 paid', pending: '3 pending', color: '#f59e0b' },
        ].map(c => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 14px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', background: c.active ? '#f0f4ff' : '#fff' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: c.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: '700', flexShrink: 0 }}>{c.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: c.active ? '700' : '600', color: '#1a1a2e' }}>{c.name}{c.active ? ' ✓' : ''}</div>
              <div style={{ fontSize: '0.62rem', color: '#aaa' }}>{c.mobile}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.62rem', color: '#22c55e', fontWeight: '700' }}>{c.paid}</div>
              <div style={{ fontSize: '0.58rem', color: '#aaa' }}>{c.pending}</div>
            </div>
          </div>
        ))}
        <div style={{ padding: '7px 14px', fontSize: '0.65rem', color: '#bbb', textAlign: 'center' }}>5 of 1,284 shown</div>
      </div>

      {/* Right: payment details form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee' }}>
          <div style={{ fontSize: '0.64rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>2 — Payment Details</div>
          <div style={{ background: '#f0f4ff', border: '1.5px solid #c7d2f0', borderRadius: '9px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0f3460', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '700' }}>MS</div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f3460' }}>Maria Santos</div>
              <div style={{ fontSize: '0.62rem', color: '#777' }}>+63 917 1234 · ACC-0041 · Last paid ₱25,000 on 20 Feb</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#aaa', textDecoration: 'underline', cursor: 'pointer' }}>Change</div>
          </div>
        </div>

        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Amount Due (₱) *</label>
              <input type="text" placeholder="e.g. 25,000" value={form.amount_due} onChange={e => setForm({ ...form, amount_due: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Due Date *</label>
              <input type="date" min={new Date().toISOString().split('T')[0]} value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Payment Type</label>
              <select value={form.payment_type} onChange={e => setForm({ ...form, payment_type: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', background: '#fff' }}>
                <option value="one_time">One-time</option>
                <option value="weekly">Recurring — Weekly</option>
                <option value="fortnightly">Recurring — Fortnightly</option>
                <option value="monthly">Recurring — Monthly</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Your Reference</label>
              <input type="text" placeholder="Invoice / account no." value={form.reference_id} onChange={e => setForm({ ...form, reference_id: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: '11px' }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Note to Customer</label>
            <textarea placeholder="Appears in SMS and email..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', height: '48px', resize: 'none', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.8rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', padding: '8px 10px', background: '#f8f9ff', border: '1px solid #e2e8f0', borderRadius: '7px' }}>
            <input type="checkbox" checked={form.allow_partial} onChange={e => setForm({ ...form, allow_partial: e.target.checked })} style={{ width: '12px', height: '12px' }} />
            <span style={{ fontSize: '0.75rem', color: '#444' }}>Allow partial payment</span>
            <span style={{ fontSize: '0.63rem', color: '#aaa' }}>(customer can pay less than full amount)</span>
          </div>

          {/* Payment link preview */}
          <div style={{ background: '#1a1a2e', borderRadius: '8px', padding: '9px 13px', marginBottom: '11px' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: '700', color: '#6b7fa4', marginBottom: '3px', letterSpacing: '0.5px' }}>PAYMENT LINK PREVIEW</div>
            <div style={{ fontSize: '0.75rem', color: '#4ade80', fontFamily: 'monospace' }}>https://pay.paycollect.ph/r/a7f3k9x2...</div>
            <div style={{ fontSize: '0.6rem', color: '#6b7fa4', marginTop: '2px' }}>Expires on due date · GCash, Maya, Card, OTC</div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '8px 15px', borderRadius: '7px', fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>
              {loading ? 'Sending...' : '📤 Send Payment Request'}
            </button>
            <button style={{ padding: '7px 10px', borderRadius: '7px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Preview SMS</button>
            <button style={{ padding: '7px 10px', borderRadius: '7px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewCustomerTab({ navigate }) {
  const [form, setForm] = useState({ customer_name: '', customer_mobile: '', customer_email: '', reference_id: '', amount_due: '', due_date: '', payment_type: 'one_time', description: '', allow_partial: true })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await axios.get(`${API}/api/requests`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      toast.success('Customer created and request sent! 🎉')
      navigate('/requests')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send')
    } finally {
      setLoading(false)
    }
  }

  const inp = (label, key, placeholder, type = 'text') => (
    <div>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', boxSizing: 'border-box' }} />
    </div>
  )

  return (
    <div style={{ padding: '14px 18px' }}>
      <div style={{ background: '#e6f7f0', border: '1.5px solid #6ee7b7', borderRadius: '8px', padding: '8px 12px', fontSize: '0.74rem', color: '#065f46', marginBottom: '13px', display: 'flex', gap: '8px' }}>
        <span>💡</span><span>Creates the customer record and sends the payment link in a single step.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1.5px solid #e2e8f0', borderRadius: '11px', overflow: 'hidden', background: '#fff' }}>
        <div style={{ padding: '14px 16px', borderRight: '1px solid #eee' }}>
          <div style={{ fontSize: '0.64rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '11px' }}>Customer Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inp('Full Name *', 'customer_name', 'e.g. Juan dela Cruz')}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>{inp('Mobile (PH) *', 'customer_mobile', '+63 9XX XXX XXXX')}</div>
              <div style={{ flex: 1 }}>{inp('Email', 'customer_email', 'juan@email.com', 'email')}</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Notification Language</label>
              <div style={{ display: 'flex', gap: '14px', marginTop: '5px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', cursor: 'pointer' }}><input type="radio" name="lang" defaultChecked /> English</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', cursor: 'pointer' }}><input type="radio" name="lang" /> Filipino</label>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '0.64rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '11px' }}>Payment Details</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>{inp('Amount (₱) *', 'amount_due', 'e.g. 15,000')}</div>
              <div style={{ flex: 1 }}>{inp('Due Date *', 'due_date', '', 'date')}</div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Payment Type</label>
              <select value={form.payment_type} onChange={e => setForm({ ...form, payment_type: e.target.value })} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.82rem', background: '#fff' }}>
                <option value="one_time">One-time</option>
                <option value="weekly">Recurring — Weekly</option>
                <option value="fortnightly">Recurring — Fortnightly</option>
                <option value="monthly">Recurring — Monthly</option>
              </select>
            </div>
            {inp('Invoice / Ref No.', 'reference_id', 'Optional')}
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '4px' }}>Note to Customer</label>
              <textarea placeholder="Appears in notification..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ height: '44px', resize: 'none', width: '100%', padding: '8px 10px', border: '1.5px solid #dde1ea', borderRadius: '7px', fontSize: '0.8rem', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input type="checkbox" checked={form.allow_partial} onChange={e => setForm({ ...form, allow_partial: e.target.checked })} style={{ width: '12px', height: '12px' }} />
              <span style={{ fontSize: '0.75rem', color: '#444' }}>Allow partial payment</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '11px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f9ff', border: '1.5px solid #e2e8f0', borderRadius: '9px', padding: '10px 14px' }}>
        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>Customer saved to directory automatically</div>
        <div style={{ display: 'flex', gap: '7px' }}>
          <button style={{ padding: '7px 12px', borderRadius: '7px', fontSize: '0.74rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Preview Notification</button>
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>
            {loading ? 'Sending...' : '✅ Create Customer & Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BulkUploadTab() {
  return (
    <div style={{ padding: '20px 24px' }}>
      <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f3460' }}>📄 Download Template</div>
          <div style={{ fontSize: '0.78rem', color: '#666', marginTop: '2px' }}>Use our pre-formatted Excel or CSV template to ensure correct column mapping.</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Download .xlsx</button>
          <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Download .csv</button>
        </div>
      </div>
      <div style={{ border: '2px dashed #c7d2f0', borderRadius: '11px', padding: '40px', textAlign: 'center', background: '#f8f9ff', cursor: 'pointer' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📂</div>
        <div style={{ fontWeight: '700', color: '#0f3460', fontSize: '0.9rem', marginBottom: '4px' }}>Drop Excel or CSV file here</div>
        <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '14px' }}>.xlsx or .csv · Max 5,000 rows · Max 10 MB</div>
        <button style={{ padding: '8px 18px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>Browse Files</button>
      </div>
    </div>
  )
}

function MultiEntryTab() {
  const rows = [
    { initials: 'MS', name: 'Maria Santos', mobile: '+63 917 1234', amount: '25,000.00', ref: 'INV-2024', color: '#0f3460', tag: 'Installment' },
    { initials: 'JR', name: 'Jose Reyes', mobile: '+63 922 9876', amount: '50,000.00', ref: 'ACC-0092', color: '#8b5cf6', tag: 'Loan' },
    { initials: 'AC', name: 'Ana Cruz', mobile: '+63 935 4567', amount: '18,500.00', ref: 'INV-2058', color: '#e94560', tag: 'Invoice' },
    { initials: 'CV', name: 'Carlo V.', mobile: '+63 918 3210', amount: '12,000.00', ref: 'RNT-041', color: '#22c55e', tag: 'Rental' },
    { initials: 'LM', name: 'Liza Mendoza', mobile: '+63 935 7890', amount: '', ref: '', color: '#f59e0b', tag: 'Installment', empty: true },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 20px 1.5fr 0.85fr 0.95fr 0.85fr 0.8fr 0.75fr 65px', fontSize: '0.58rem', fontWeight: '700', color: '#aaa', letterSpacing: '0.4px', padding: '5px 8px', borderBottom: '2px solid #e2e8f0', background: '#f8faff', textTransform: 'uppercase' }}>
        <span></span><span style={{ textAlign: 'center' }}><input type="checkbox" style={{ width: '12px', height: '12px' }} checked readOnly /></span>
        <span>Customer</span><span>Mobile</span><span>Amount (₱)*</span><span>Due Date*</span><span>Type</span><span>Reference</span><span>Status</span>
      </div>

      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 20px 1.5fr 0.85fr 0.95fr 0.85fr 0.8fr 0.75fr 65px', fontSize: '0.72rem', padding: '5px 8px', borderBottom: '1px solid #f0f2f7', alignItems: 'center', background: r.empty ? '#fafafa' : '' }}>
          <span style={{ fontSize: '0.57rem', color: '#ccc', textAlign: 'center' }}>{i + 1}</span>
          <span style={{ textAlign: 'center' }}><input type="checkbox" style={{ width: '12px', height: '12px' }} checked={!r.empty} readOnly /></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: r.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.57rem', fontWeight: '700', flexShrink: 0 }}>{r.initials}</div>
            <div>
              <div style={{ fontWeight: '700', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>{r.name}</div>
              <div style={{ fontSize: '0.57rem', color: '#bbb' }}>{r.tag}</div>
            </div>
          </span>
          <span style={{ fontSize: '0.67rem', color: '#777' }}>{r.mobile}</span>
          <span><input type="text" defaultValue={r.amount} placeholder="0.00" style={{ width: '100%', padding: '3px 6px', border: `1.5px solid ${r.empty ? '#fca5a5' : '#c7d2f0'}`, borderRadius: '5px', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', background: r.empty ? '#fff8f8' : '#f8f9ff', textAlign: 'right' }} /></span>
          <span><input type="date" defaultValue="2026-03-05" style={{ width: '100%', padding: '3px 6px', border: '1.5px solid #c7d2f0', borderRadius: '5px', fontSize: '0.66rem' }} /></span>
          <span><select style={{ width: '100%', padding: '3px 5px', border: '1.5px solid #c7d2f0', borderRadius: '5px', fontSize: '0.64rem' }}><option>One-time</option><option>Monthly</option><option>Weekly</option></select></span>
          <span><input type="text" defaultValue={r.ref} placeholder="Ref..." style={{ width: '100%', padding: '3px 6px', border: '1.5px solid #e2e8f0', borderRadius: '5px', fontSize: '0.64rem', color: '#888' }} /></span>
          <span><span style={{ fontSize: '0.57rem', fontWeight: '700', padding: '2px 5px', borderRadius: '20px', background: r.empty ? '#f0f2f7' : '#d1fae5', color: r.empty ? '#9ca3af' : '#065f46' }}>{r.empty ? 'Empty' : 'Ready'}</span></span>
        </div>
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '28px 20px 1.5fr 0.85fr 0.95fr 0.85fr 0.8fr 0.75fr 65px', fontSize: '0.72rem', padding: '6px 8px', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #f0f2f7' }}>
        <span></span><span></span>
        <span style={{ color: '#0f3460', fontWeight: '600', fontSize: '0.74rem' }}>+ Add a customer row...</span>
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>

      {/* Footer */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 20px 1.5fr 0.85fr 0.95fr 0.85fr 0.8fr 0.75fr 65px', fontSize: '0.72rem', padding: '7px 8px', borderTop: '2px solid #c7d2f0', background: 'linear-gradient(90deg,#f0f4ff,#f8f9ff)', fontWeight: '700', alignItems: 'center' }}>
        <span></span><span></span>
        <span style={{ color: '#0f3460' }}>4 ready · 1 empty</span>
        <span></span>
        <span style={{ color: '#0f3460', textAlign: 'right' }}>₱1,05,500</span>
        <span></span><span></span><span></span>
        <span style={{ color: '#22c55e', fontSize: '0.66rem' }}>4 ready</span>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: '600' }}>Notify via:</span>
          {['SMS', 'Email', 'WhatsApp'].map(ch => (
            <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked={ch !== 'WhatsApp'} style={{ width: '13px', height: '13px' }} /> {ch}
            </label>
          ))}
        </div>
        <button style={{ padding: '8px 18px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>
          📤 Send 4 Payment Requests
        </button>
      </div>
    </div>
  )
}

export default function NewRequest() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('existing')

  return (
    <Layout>
      <div style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <div style={{ padding: '9px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
            <div>
              <span onClick={() => navigate('/requests')} style={{ fontSize: '0.7rem', color: '#aaa', cursor: 'pointer' }}>← Back to Requests</span>
              <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1a1a2e', marginTop: '1px' }}>New Payment Request</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0' }}>
            {TABS.map(tab => (
              <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '6px 14px', fontSize: '0.77rem', fontWeight: activeTab === tab.id ? '700' : '500', color: activeTab === tab.id ? '#0f3460' : '#aaa', borderBottom: `3px solid ${activeTab === tab.id ? '#e94560' : 'transparent'}`, marginBottom: '-2px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '0 0 12px 12px' }}>
        {activeTab === 'existing' && <ExistingCustomerTab navigate={navigate} />}
        {activeTab === 'new' && <NewCustomerTab navigate={navigate} />}
        {activeTab === 'bulk' && <BulkUploadTab />}
        {activeTab === 'multi' && <MultiEntryTab />}
      </div>
    </Layout>
  )
}