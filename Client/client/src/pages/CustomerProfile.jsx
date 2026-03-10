import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'

function StatusPill({ status }) {
  const map = {
    pending: { bg: '#fff3cd', color: '#856404', label: 'Pending' },
    partial: { bg: '#cfe2ff', color: '#084298', label: 'Partial' },
    paid:    { bg: '#d1e7dd', color: '#0a3622', label: 'Paid' },
    expired: { bg: '#f8d7da', color: '#842029', label: 'Expired' },
  }
  const s = map[status] || map.pending
  return <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: '700' }}>{s.label}</span>
}

export default function CustomerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('requests')

  const customer = {
    name: 'Priya Sharma', mobile: '+91 98765 43210', email: 'priya@email.com',
    since: '12 Jan 2026', tag: 'VIP', tagBg: '#f0f4ff', tagColor: '#0f3460',
    total_paid: '₱2,09,500', outstanding: '₱25,000', requests: 8, avg_days: '3.2 days',
    initials: 'PS', color: '#0f3460'
  }

  const requests = [
    { ref: 'REQ-20240008', type: 'Monthly', amount_due: '₱25,000', amount_paid: '₱0', status: 'pending', sent: '20 Feb 2026', due: '28 Feb 2026', days: '—' },
    { ref: 'REQ-20240007', type: 'Monthly', amount_due: '₱25,000', amount_paid: '₱25,000', status: 'paid', sent: '1 Feb 2026', due: '29 Jan 2026', days: '−3 days early' },
    { ref: 'REQ-20240006', type: 'One-time', amount_due: '₱50,000', amount_paid: '₱50,000', status: 'paid', sent: '15 Jan 2026', due: '14 Jan 2026', days: '−1 day early' },
    { ref: 'REQ-20240005', type: 'Monthly', amount_due: '₱25,000', amount_paid: '₱25,000', status: 'paid', sent: '1 Jan 2026', due: '3 Jan 2026', days: '+2 days late' },
    { ref: 'REQ-20240004', type: 'One-time', amount_due: '₱18,500', amount_paid: '₱10,000', status: 'partial', sent: '20 Dec 2025', due: '18 Dec 2025', days: '—' },
    { ref: 'REQ-20240003', type: 'One-time', amount_due: '₱35,000', amount_paid: '—', status: 'expired', sent: '30 Nov 2025', due: '—', days: 'Never paid' },
  ]

  const timeline = [
    { dot: '🟢', time: '20 Feb 2026, 9:00 AM', text: 'Monthly payment request sent (REQ-20240008). Due: 28 Feb 2026.' },
    { dot: '🟢', time: '1 Feb 2026, 9:00 AM', text: 'Payment of ₱25,000 received via GCash. REQ-20240007 marked Paid.' },
    { dot: '⚪', time: '1 Feb 2026, 8:00 AM', text: 'Monthly payment request sent (REQ-20240007). Due: 1 Feb 2026.' },
    { dot: '🟢', time: '14 Jan 2026, 2:15 PM', text: 'Payment of ₱50,000 received via Maya. REQ-20240006 marked Paid.' },
    { dot: '⚪', time: '15 Jan 2026, 9:00 AM', text: 'One-time payment request sent (REQ-20240006). Due: 14 Jan.' },
    { dot: '🔵', time: '12 Jan 2026', text: 'Customer profile created. Tag: VIP.' },
  ]

  return (
    <Layout>
      <div style={{ padding: '0 24px 24px' }}>

        {/* Back + header */}
        <div style={{ padding: '18px 0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/customers')} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#fff', color: '#0f3460', border: '1.5px solid #e2e8f0' }}>← Back</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: customer.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>{customer.initials}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1a1a2e' }}>{customer.name}</span>
                  <span style={{ background: customer.tagBg, color: customer.tagColor, fontSize: '0.7rem', fontWeight: '700', padding: '2px 9px', borderRadius: '20px' }}>{customer.tag}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px' }}>{customer.mobile} · {customer.email} · Since {customer.since}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>✏️ Edit</button>
            <button onClick={() => navigate('/requests/new')} style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>+ New Request</button>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Paid', value: customer.total_paid, color: '#0a3622', bg: '#f0fff6' },
            { label: 'Outstanding', value: customer.outstanding, color: '#856404', bg: '#fff8e6' },
            { label: 'Total Requests', value: customer.requests, color: '#0f3460', bg: '#f0f4ff' },
            { label: 'Avg Days to Pay', value: customer.avg_days, color: '#7c3aed', bg: '#f5f3ff' },
          ].map(k => (
            <div key={k.label} style={{ flex: 1, minWidth: '130px', background: k.bg, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.74rem', color: '#666', marginTop: '2px' }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px' }}>

          {/* Left — Requests + Timeline tabs */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1.5px solid #e2e8f0', padding: '0 16px' }}>
              {['requests', 'timeline'].map(t => (
                <div key={t} onClick={() => setActiveTab(t)} style={{ padding: '10px 16px', fontSize: '0.83rem', fontWeight: '600', color: activeTab === t ? '#0f3460' : '#666', cursor: 'pointer', borderBottom: activeTab === t ? '2px solid #e94560' : '2px solid transparent', marginBottom: '-1.5px', textTransform: 'capitalize' }}>
                  {t === 'requests' ? 'Payment Requests' : 'Activity Timeline'}
                </div>
              ))}
            </div>

            {activeTab === 'requests' && (
              <div style={{ padding: '0 0 16px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#f8faff' }}>
                      {['Ref ID', 'Type', 'Amount Due', 'Amount Paid', 'Status', 'Sent On', 'Due Date', 'Days'].map(h => (
                        <th key={h} style={{ padding: '9px 14px', textAlign: 'left', borderBottom: '1.5px solid #e2e8f0', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                      ))}
                      <th style={{ padding: '9px 14px', borderBottom: '1.5px solid #e2e8f0' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={r.ref} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff' }}>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#0f3460', fontWeight: '700', fontSize: '0.76rem' }}>{r.ref}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7' }}>
                          <span style={{ background: r.type === 'Monthly' ? '#f0f4ff' : '#fff8e6', color: r.type === 'Monthly' ? '#0f3460' : '#856404', fontSize: '0.66rem', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' }}>{r.type === 'Monthly' ? '🔄 Monthly' : r.type}</span>
                        </td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', fontWeight: '700' }}>{r.amount_due}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#0a3622', fontWeight: '700' }}>{r.amount_paid}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7' }}><StatusPill status={r.status} /></td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#666' }}>{r.sent}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: '#666' }}>{r.due}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7', color: r.days?.includes('late') ? '#e94560' : r.days?.includes('early') ? '#0a3622' : '#888', fontWeight: '700' }}>{r.days}</td>
                        <td style={{ padding: '9px 14px', borderBottom: '1px solid #f0f2f7' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>View</button>
                            {r.status !== 'paid' && r.status !== 'expired' && (
                              <button style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>Remind</button>
                            )}
                            {r.status === 'expired' && (
                              <button style={{ padding: '3px 9px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: '600', cursor: 'pointer', background: '#e94560', color: '#fff', border: 'none' }}>New Request</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px 0' }}>
                  <div style={{ fontSize: '0.74rem', color: '#888' }}>Showing 1–6 of 8 requests</div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', cursor: 'pointer' }}>← Prev</button>
                    <button style={{ background: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '0.72rem', fontWeight: '700' }}>1</button>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', cursor: 'pointer' }}>2</button>
                    <button style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0', cursor: 'pointer' }}>Next →</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div style={{ padding: '16px 20px' }}>
                {timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.8rem', marginTop: '2px', flexShrink: 0 }}>{t.dot}</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '2px' }}>{t.time}</div>
                      <div style={{ fontSize: '0.82rem', color: '#333', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: t.text.replace(/REQ-\w+/g, m => `<strong>${m}</strong>`) }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details panel */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '18px' }}>
            <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#e94560', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Customer Details</h4>
            {[
              { k: 'Full Name', v: customer.name },
              { k: 'Mobile', v: customer.mobile },
              { k: 'Email', v: customer.email },
              { k: 'Tag', v: customer.tag },
              { k: 'Customer Since', v: customer.since },
              { k: 'Total Requests', v: customer.requests },
              { k: 'Total Paid', v: customer.total_paid },
              { k: 'Outstanding', v: customer.outstanding },
              { k: 'Avg Days to Pay', v: customer.avg_days },
            ].map(row => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.82rem' }}>
                <span style={{ color: '#888' }}>{row.k}</span>
                <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{row.v}</span>
              </div>
            ))}

            <h4 style={{ fontSize: '0.82rem', fontWeight: '700', color: '#e94560', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '18px 0 10px' }}>Notification Log</h4>
            <div style={{ fontSize: '0.78rem', color: '#555', lineHeight: '2' }}>
              <div>✅ Email sent — 20 Feb, 9:00 AM</div>
              <div>✅ SMS sent — 20 Feb, 9:00 AM</div>
              <div>📧 Reminder sent — 25 Feb, 9:00 AM</div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  )
}