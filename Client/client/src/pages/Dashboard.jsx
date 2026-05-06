import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../config'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts'
import Layout from '../components/Layout'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}')
  const firstName = merchant.company_name?.split(' ')[0] || 'there'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
axios.get(`${API}/api/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` }
   }).then(res => setStats(res.data)).catch(err => {
      console.log('Dashboard stats error:', err.response?.status)
      // Don't logout on stats failure - just show default values
    })
  }, [])

  const kpis = stats || {
    total_collected: 0, outstanding: 0, collection_rate: 0,
    avg_days_to_pay: 0, active_customers: 0,
    collections_by_day: [],
    request_status_counts: { paid: 0, pending: 0, partial: 0, expired: 0 }
  }

  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const kpiCards = [
    { label: 'Total Collected', value: `₱${Number(kpis.total_collected).toLocaleString()}`, sub: '↑ 12.4% vs last month', subColor: '#22c55e', borderColor: '#0f3460' },
    { label: 'Outstanding', value: `₱${Number(kpis.outstanding).toLocaleString()}`, sub: `${kpis.request_status_counts?.pending || 0} requests pending`, subColor: '#f59e0b', borderColor: '#e94560' },
    { label: 'Collection Rate', value: `${kpis.collection_rate || 0}%`, sub: '↑ 3.1% vs last month', subColor: '#22c55e', borderColor: '#22c55e' },
    { label: 'Avg Days to Pay', value: `${kpis.avg_days_to_pay || 0} days`, sub: '↓ 0.8d faster', subColor: '#22c55e', borderColor: '#f59e0b' },
    { label: 'Active Customers', value: Number(kpis.active_customers || 0).toLocaleString(), sub: '+38 this month', subColor: '#22c55e', borderColor: '#8b5cf6' },
  ]

  const channelData = [
    { channel: 'GCash', pct: 42, color: '#00b14f' },
    { channel: 'Maya', pct: 28, color: '#0087da' },
    { channel: 'Visa / Mastercard', pct: 16, color: '#0f3460' },
    { channel: 'InstaPay', pct: 9, color: '#8b5cf6' },
    { channel: 'OTC / 7-Eleven', pct: 5, color: '#f59e0b' },
  ]

  const statusRows = [
    { label: 'Paid', count: kpis.request_status_counts?.paid || 742, color: '#22c55e', pct: 72 },
    { label: 'Pending', count: kpis.request_status_counts?.pending || 94, color: '#f59e0b', pct: 9 },
    { label: 'Partial', count: kpis.request_status_counts?.partial || 63, color: '#3b82f6', pct: 6 },
    { label: 'Overdue', count: 38, color: '#e94560', pct: 4 },
    { label: 'Expired', count: 89, color: '#d1d5db', pct: 9 },
  ]

  return (
    <Layout>
      <div style={{ padding: '0 0 24px' }}>

        {/* Sub-header */}
        <div style={{
          padding: '11px 22px',
          borderBottom: '1px solid #e8eaf0',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff'
        }}>
          <div>
            <div style={{ fontSize: '0.67rem', color: '#aaa', marginBottom: '1px' }}>{today}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1a1a2e' }}>
              Good morning, {firstName} 👋
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              background: '#f0f4ff', border: '1px solid #c7d2f0',
              borderRadius: '7px', padding: '5px 12px',
              fontSize: '0.74rem', fontWeight: '600', color: '#0f3460', cursor: 'pointer'
            }}>
              Last 30 days ▾
            </div>
            <button
              onClick={() => navigate('/requests/new')}
              style={{
                background: '#e94560', color: '#fff', border: 'none',
                borderRadius: '7px', padding: '6px 14px',
                fontSize: '0.76rem', fontWeight: '600', cursor: 'pointer'
              }}
            >
              + New Request
            </button>
          </div>
        </div>

        <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
            {kpiCards.map((kpi) => (
              <div key={kpi.label} style={{
                background: '#fff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 12px',
                borderTop: `3px solid ${kpi.borderColor}`
              }}>
                <div style={{ fontSize: '0.6rem', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '7px' }}>
                  {kpi.label}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f3460', letterSpacing: '-1px', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.67rem', fontWeight: '600', color: kpi.subColor, marginTop: '5px' }}>
                  {kpi.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '10px' }}>

            {/* Bar chart */}
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f3460' }}>Collections — Last 30 Days</div>
                <div style={{ fontSize: '0.63rem', color: '#aaa' }}>₱ daily</div>
              </div>
              {kpis.collections_by_day?.length > 0 ? (
                <ResponsiveContainer width="100%" height={80}>
                  <BarChart data={kpis.collections_by_day}>
                    <Bar dataKey="amount" fill="#0f3460" radius={[2, 2, 0, 0]} />
                    <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
                  {[30,45,38,55,42,68,72,58,45,80,65,72,48,55,62,70,58,45,72,65,80,55,68,74,60,82,70,65,78,90].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i % 4 === 0 || i > 25 ? '#0f3460' : '#c7d2f0', borderRadius: '2px 2px 0 0', height: `${h}%`, minHeight: '3px' }} />
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: '14px', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f0f2f7' }}>
                {[{ l: 'Peak day', v: '₱284,500' }, { l: 'Daily avg', v: '₱108,000' }, { l: 'Net settled', v: '₱3.18M', c: '#22c55e' }].map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: '0.6rem', color: '#aaa' }}>{s.l}</div>
                    <div style={{ fontSize: '0.76rem', fontWeight: '700', color: s.c || '#0f3460' }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel bars */}
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f3460', marginBottom: '12px' }}>Collections by Channel</div>
              {channelData.map((ch) => (
                <div key={ch.channel} style={{ marginBottom: '9px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: '600', color: '#333' }}>{ch.channel}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f3460' }}>{ch.pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f0f2f7', borderRadius: '20px', overflow: 'hidden' }}>
                    <div style={{ width: `${ch.pct}%`, height: '100%', background: ch.color, borderRadius: '20px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Status + Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px', flex: 1 }}>
                <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0f3460', marginBottom: '10px' }}>Request Status</div>
                {statusRows.map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: '0.74rem', color: '#555' }}>{s.label}</div>
                    <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0f3460', minWidth: '34px', textAlign: 'right' }}>{s.count}</div>
                    <div style={{ width: '50px', height: '4px', background: '#f0f2f7', borderRadius: '20px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: '20px' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', marginBottom: '8px' }}>Quick Actions</div>
                {[
                  { label: '+ New Payment Request', primary: true, onClick: () => navigate('/requests/new') },
                  { label: '📋 Bulk Upload', primary: false, onClick: () => {} },
                  { label: '📊 Recon Report', primary: false, onClick: () => navigate('/reports') },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.onClick} style={{
                    width: '100%', padding: '6px', marginBottom: '4px',
                    background: btn.primary ? '#e94560' : '#f0f4ff',
                    color: btn.primary ? '#fff' : '#0f3460',
                    border: btn.primary ? 'none' : '1px solid #c7d2f0',
                    borderRadius: '7px', fontSize: '0.7rem', fontWeight: '600',
                    cursor: 'pointer', display: 'flex', justifyContent: 'center'
                  }}>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions + Overdue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '10px' }}>

            {/* Transactions table */}
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f3460' }}>Recent Transactions</div>
                <span onClick={() => navigate('/requests')} style={{ fontSize: '0.7rem', color: '#e94560', fontWeight: '600', cursor: 'pointer' }}>View all →</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.65fr 0.65fr 0.6fr', fontSize: '0.59rem', fontWeight: '700', color: '#bbb', letterSpacing: '0.4px', padding: '4px 8px 6px', borderBottom: '1px solid #f0f2f7', textTransform: 'uppercase' }}>
                <span>Customer</span><span>Amount</span><span>Channel</span><span>Status</span><span>Time</span>
              </div>
              {[
                { name: 'Maria Santos', amount: '₱25,000', channel: 'GCash', status: 'Paid', statusBg: '#d1fae5', statusColor: '#065f46', time: '2 min ago' },
                { name: 'Jose Reyes', amount: '₱50,000', channel: 'Maya', status: 'Pending', statusBg: '#fef3c7', statusColor: '#92400e', time: '8 min ago' },
                { name: 'Ana Cruz', amount: '₱18,500', channel: 'Visa', status: 'Partial', statusBg: '#dbeafe', statusColor: '#1e40af', time: '14 min ago' },
                { name: 'Carlo Villanueva', amount: '₱12,000', channel: 'OTC', status: 'Paid', statusBg: '#d1fae5', statusColor: '#065f46', time: '31 min ago' },
                { name: 'Liza Mendoza', amount: '₱35,000', channel: 'GCash', status: 'Overdue', statusBg: '#fee2e2', statusColor: '#991b1b', time: '1 hr ago' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 0.65fr 0.65fr 0.6fr', fontSize: '0.73rem', padding: '6px 8px', borderBottom: '1px solid #f9fafb', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{row.name}</span>
                  <span style={{ fontWeight: '700', color: '#0f3460' }}>{row.amount}</span>
                  <span style={{ color: '#888' }}>{row.channel}</span>
                  <span><span style={{ background: row.statusBg, color: row.statusColor, fontSize: '0.6rem', fontWeight: '700', padding: '2px 6px', borderRadius: '20px' }}>{row.status}</span></span>
                  <span style={{ color: '#bbb', fontSize: '0.67rem' }}>{row.time}</span>
                </div>
              ))}
            </div>

            {/* Overdue */}
            <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0f3460' }}>⚠️ Overdue</div>
                <span style={{ background: '#fee2e2', color: '#991b1b', fontSize: '0.6rem', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' }}>38</span>
              </div>
              {[
                { initials: 'LM', name: 'Liza Mendoza', due: 'Due Jan 30 · 26d late', amount: '₱35,000' },
                { initials: 'RG', name: 'Roberto Garcia', due: 'Due Feb 1 · 24d late', amount: '₱12,500' },
                { initials: 'SC', name: 'Sofia Chan', due: 'Due Feb 5 · 20d late', amount: '₱67,000' },
                { initials: 'AP', name: 'Alex Perez', due: 'Due Feb 10 · 15d late', amount: '₱9,200' },
              ].map((c) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 10px', background: '#fff9f9', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '30px', height: '30px', background: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: '700', color: '#991b1b', flexShrink: 0 }}>{c.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
<div onClick={() => navigate('/customers')} style={{ fontSize: '0.76rem', fontWeight: '700', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}>{c.name}</div>                    <div style={{ fontSize: '0.62rem', color: '#aaa' }}>{c.due}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#e94560' }}>{c.amount}</div>
                    <div style={{ fontSize: '0.58rem', background: '#e94560', color: '#fff', padding: '1px 6px', borderRadius: '20px', cursor: 'pointer', marginTop: '2px' }}>Remind</div>
                  </div>
                </div>
              ))}
<span onClick={() => navigate('/customers')} style={{ display: 'block', textAlign: 'center', fontSize: '0.7rem', color: '#e94560', fontWeight: '600', paddingTop: '4px', cursor: 'pointer' }}>View all 38 →</span>            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}