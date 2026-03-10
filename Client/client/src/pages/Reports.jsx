import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'

const REPORT_TYPES = [
  { id: 'recon_pg', label: '📒 Recon by Gateway', desc: 'Match PG settlement against platform records', color: '#0f3460', bg: 'linear-gradient(135deg,#0f3460,#1a5ca8)' },
  { id: 'recon_merchant', label: '🧾 Recon by Merchant', desc: 'Merchant-side ledger — all transactions by invoice/ref', color: '#3d5a80', bg: 'linear-gradient(135deg,#3d5a80,#5b82ad)' },
  { id: 'settlement', label: '🏦 Settlement Report', desc: 'T+1 settlement breakdown — what landed in your bank', color: '#0a3622', bg: 'linear-gradient(135deg,#064e3b,#065f46)' },
  { id: 'collections', label: '📊 Collections Summary', desc: 'Daily/monthly collections by status and channel', color: '#7c3aed', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
]

const PERIODS = ['1 Day', '7 Days', '30 Days', 'This Month', 'Custom']

const GATEWAYS = ['All Gateways', 'GCash', 'Maya', 'PayMongo', 'Xendit', 'DragonPay']

const FORMATS = ['CSV', 'Excel', 'JSON']

const recentDownloads = [
  { type: '📒 Recon', sub: 'By PG', subBg: '#eef2ff', subColor: '#0f3460', gw: 'GCash', range: '01–23 Feb 2026', fmt: 'CSV', generated: '23 Feb, 10:14 AM', status: 'Ready', statusBg: '#d1fae5', statusColor: '#065f46' },
  { type: '🧾 Recon', sub: 'By Merchant', subBg: '#e8eef7', subColor: '#3d5a80', gw: 'INV-2026-*', range: '01–23 Feb 2026', fmt: 'Excel', generated: '22 Feb, 9:00 AM', status: 'Ready', statusBg: '#d1fae5', statusColor: '#065f46' },
  { type: '🏦 Settlement', sub: 'T+1', subBg: '#f0fff6', subColor: '#0a3622', gw: 'All', range: '01–22 Feb 2026', fmt: 'Excel', generated: '22 Feb, 9:00 AM', status: 'Ready', statusBg: '#d1fae5', statusColor: '#065f46' },
  { type: '📒 Recon', sub: 'By PG', subBg: '#eef2ff', subColor: '#0f3460', gw: 'Maya', range: 'Jan 2026', fmt: 'CSV', generated: '01 Feb, 6:32 AM', status: 'Processing', statusBg: '#cfe2ff', statusColor: '#084298' },
  { type: '📊 Collections', sub: 'Monthly', subBg: '#f5f3ff', subColor: '#7c3aed', gw: 'All', range: 'Jan 2026', fmt: 'Excel', generated: '01 Feb, 6:00 AM', status: 'Ready', statusBg: '#d1fae5', statusColor: '#065f46' },
]

const summaryStats = [
  { label: 'Total Collected (Feb)', value: '₱28,45,000', color: '#0a3622', bg: '#f0fff6' },
  { label: 'Pending Settlement', value: '₱3,20,500', color: '#856404', bg: '#fff8e6' },
  { label: 'Gateway Fees (Feb)', value: '₱14,225', color: '#842029', bg: '#fdecea' },
  { label: 'Net to Bank (Feb)', value: '₱24,10,275', color: '#0f3460', bg: '#f0f4ff' },
]

export default function Reports() {
  const navigate = useNavigate()
  const [activeReport, setActiveReport] = useState('recon_pg')
  const [activePeriod, setActivePeriod] = useState('1 Day')
  const [activeFormat, setActiveFormat] = useState('CSV')
  const [activeGateway, setActiveGateway] = useState('All Gateways')
  const [showCustom, setShowCustom] = useState(false)
  const [fromDate, setFromDate] = useState('2026-02-01')
  const [toDate, setToDate] = useState('2026-02-26')
  const [activeTab, setActiveTab] = useState('generate')

  const today = new Date()
  const fmt = d => d.toLocaleDateString('en-PH', { day: 'numeric', month: 'short', year: 'numeric' })

  const getPeriodLabel = () => {
    if (activePeriod === '1 Day') return `Today — ${fmt(today)}`
    if (activePeriod === '7 Days') { const d = new Date(today); d.setDate(d.getDate() - 7); return `${fmt(d)} – ${fmt(today)}` }
    if (activePeriod === '30 Days') { const d = new Date(today); d.setDate(d.getDate() - 30); return `${fmt(d)} – ${fmt(today)}` }
    if (activePeriod === 'This Month') return `1 ${today.toLocaleDateString('en-PH', { month: 'short' })} – ${fmt(today)}`
    if (activePeriod === 'Custom') return `${fromDate} → ${toDate}`
    return ''
  }

  const handleDownload = () => {
    toast.success('Report queued! You\'ll receive an email when ready. 📧')
  }

  const currentReport = REPORT_TYPES.find(r => r.id === activeReport)

  return (
    <Layout>
      <div style={{ padding: '0 24px 32px' }}>

        {/* Header */}
        <div style={{ padding: '18px 0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a1a2e' }}>Reports</div>
          <a href="#" style={{ fontSize: '0.8rem', color: '#0f3460', display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', border: '1.5px solid #c7d2f0', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
            🔑 API Keys & Docs →
          </a>
        </div>

        {/* Summary KPIs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {summaryStats.map(s => (
            <div key={s.label} style={{ flex: 1, minWidth: '140px', background: s.bg, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.74rem', color: '#666', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #e2e8f0', marginBottom: '22px' }}>
          {[{ id: 'generate', label: '⬇ Generate Report' }, { id: 'history', label: '🕓 Download History' }, { id: 'settlement', label: '🏦 Settlement Upload' }].map(t => (
            <div key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: '600', color: activeTab === t.id ? '#0f3460' : '#666', cursor: 'pointer', borderBottom: activeTab === t.id ? '2px solid #e94560' : '2px solid transparent', marginBottom: '-1.5px' }}>
              {t.label}
            </div>
          ))}
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>

            {/* Left: report type selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '220px', flexShrink: 0 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '4px' }}>Report Type</div>
              {REPORT_TYPES.map(r => (
                <div key={r.id} onClick={() => setActiveReport(r.id)} style={{ padding: '12px 14px', borderRadius: '10px', border: `1.5px solid ${activeReport === r.id ? r.color : '#e2e8f0'}`, background: activeReport === r.id ? r.color + '10' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: activeReport === r.id ? r.color : '#333' }}>{r.label}</div>
                  <div style={{ fontSize: '0.68rem', color: '#888', marginTop: '3px', lineHeight: '1.4' }}>{r.desc}</div>
                </div>
              ))}
            </div>

            {/* Right: generator panel */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              {/* Header gradient */}
              <div style={{ background: currentReport.bg, padding: '18px 22px', borderRadius: '12px 12px 0 0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '3px' }}>Active Report</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#fff' }}>{currentReport.label}</div>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', marginTop: '3px' }}>{currentReport.desc}</div>
                </div>
              </div>

              <div style={{ background: '#f8faff', border: '1.5px solid #c7d2f0', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '18px 20px' }}>

                {/* Gateway selector (for PG recon) */}
                {(activeReport === 'recon_pg' || activeReport === 'settlement') && (
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '5px' }}>
                      {activeReport === 'settlement' ? 'Settlement Gateway' : 'Select Gateway'}
                    </div>
                    <select value={activeGateway} onChange={e => setActiveGateway(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1.5px solid #c7d2f0', borderRadius: '7px', fontSize: '0.82rem', color: '#0f3460', fontWeight: '600', background: '#fff' }}>
                      {GATEWAYS.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                )}

                {/* Period selector */}
                <div style={{ background: '#fff', border: '1.5px solid #c7d2f0', borderRadius: '11px', overflow: 'hidden', marginBottom: '14px' }}>
                  <div style={{ padding: '9px 12px', background: 'linear-gradient(90deg,#0f3460,#1e5ca8)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#fff' }}>📅 Select Time Period</span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    {/* Period pills */}
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {PERIODS.map(p => (
                        <span key={p} onClick={() => { setActivePeriod(p); setShowCustom(p === 'Custom') }} style={{ padding: '5px 11px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: p === activePeriod ? '700' : '600', background: p === activePeriod ? '#0f3460' : '#fff', color: p === activePeriod ? '#fff' : '#0f3460', cursor: 'pointer', border: `1.5px solid ${p === activePeriod ? '#0f3460' : '#c7d2f0'}` }}>
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* Period display */}
                    <div style={{ background: '#f0f4ff', borderRadius: '8px', padding: '8px 11px', marginBottom: '10px', fontSize: '0.74rem', color: '#0f3460', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>📆 {getPeriodLabel()}</span>
                      <span style={{ fontSize: '0.64rem', color: '#aaa', fontWeight: '400' }}>{activePeriod}</span>
                    </div>

                    {/* Custom date inputs */}
                    {showCustom && (
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.62rem', color: '#888', marginBottom: '2px', fontWeight: '600' }}>From</div>
                          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ width: '100%', padding: '7px 9px', border: '1.5px solid #c7d2f0', borderRadius: '7px', fontSize: '0.76rem', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ color: '#ccc', paddingTop: '14px' }}>→</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.62rem', color: '#888', marginBottom: '2px', fontWeight: '600' }}>To</div>
                          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={{ width: '100%', padding: '7px 9px', border: '1.5px solid #c7d2f0', borderRadius: '7px', fontSize: '0.76rem', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    )}

                    {/* Format */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                      {FORMATS.map(f => (
                        <div key={f} onClick={() => setActiveFormat(f)} style={{ flex: 1, border: `1.5px solid ${f === activeFormat ? '#0f3460' : '#dde1ea'}`, borderRadius: '6px', padding: '7px', textAlign: 'center', fontSize: '0.74rem', fontWeight: f === activeFormat ? '700' : '500', color: f === activeFormat ? '#0f3460' : '#666', background: f === activeFormat ? '#f0f4ff' : '#fff', cursor: 'pointer' }}>
                          {f}
                        </div>
                      ))}
                    </div>

                    <button onClick={handleDownload} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', padding: '10px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer' }}>
                      ⬇ Download {currentReport.label.split(' ').slice(1).join(' ')} Report
                    </button>
                    <div style={{ marginTop: '6px', textAlign: 'center', fontSize: '0.64rem', color: '#aaa' }}>
                      ≤7 days: instant · &gt;7 days: async, emailed when ready
                    </div>
                  </div>
                </div>

                {/* Quick stats preview */}
                <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#0f3460', marginBottom: '10px' }}>Period Preview</div>
                  {[
                    { k: 'Total Transactions', v: '142' },
                    { k: 'Gross Amount', v: '₱8,45,000' },
                    { k: 'Gateway Fees', v: '₱4,225' },
                    { k: 'Net Amount', v: '₱8,40,775' },
                    { k: 'Matched', v: '138 / 142' },
                    { k: 'Unmatched', v: '4' },
                  ].map(row => (
                    <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.8rem' }}>
                      <span style={{ color: '#888' }}>{row.k}</span>
                      <span style={{ fontWeight: '700', color: '#0f3460' }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f3460' }}>Recent Downloads</div>
              <div style={{ fontSize: '0.74rem', color: '#aaa' }}>Reports retained 90 days · Download links expire 24 hrs after generation</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#f8faff' }}>
                    {['Type', 'Sub-type', 'Gateway / Ref', 'Date Range', 'Format', 'Generated', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1.5px solid #e2e8f0', fontSize: '0.72rem', fontWeight: '700', color: '#0f3460', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentDownloads.map((r, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#f8faff'}
                    >
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7', fontWeight: '600' }}>{r.type}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7' }}>
                        <span style={{ background: r.subBg, color: r.subColor, fontSize: '0.66rem', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{r.sub}</span>
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7', color: '#555' }}>{r.gw}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7', color: '#555' }}>{r.range}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7' }}>
                        <span style={{ background: '#f0f2f7', color: '#555', fontSize: '0.7rem', fontWeight: '700', padding: '2px 7px', borderRadius: '5px' }}>{r.fmt}</span>
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7', color: '#888', fontSize: '0.76rem' }}>{r.generated}</td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7' }}>
                        <span style={{ background: r.statusBg, color: r.statusColor, fontSize: '0.7rem', fontWeight: '700', padding: '2px 9px', borderRadius: '20px' }}>{r.status}</span>
                      </td>
                      <td style={{ padding: '10px 14px', borderBottom: '1px solid #f0f2f7' }}>
                        {r.status === 'Ready'
                          ? <button onClick={() => toast.success('Downloading...')} style={{ padding: '4px 11px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '600', cursor: 'pointer', background: '#f0f4ff', color: '#0f3460', border: '1px solid #c7d2f0' }}>⬇ Download</button>
                          : <span style={{ fontSize: '0.74rem', color: '#aaa' }}>Generating…</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settlement Upload Tab */}
        {activeTab === 'settlement' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
            <div>
              {/* Steps */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '24px' }}>
                {[{ n: 1, label: 'Upload File', active: true }, { n: 2, label: 'Review & Validate' }, { n: 3, label: 'Reconcile' }].map((s, i) => (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: s.active ? '#e94560' : '#e2e8f0', color: s.active ? '#fff' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.82rem' }}>{s.n}</div>
                      <span style={{ fontSize: '0.82rem', fontWeight: s.active ? '700' : '400', color: s.active ? '#e94560' : '#888' }}>{s.label}</span>
                    </div>
                    {i < 2 && <div style={{ flex: 1, height: '2px', background: '#e2e8f0', margin: '0 12px', width: '60px' }} />}
                  </div>
                ))}
              </div>

              {/* Download template */}
              <div style={{ background: '#f0f4ff', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f3460' }}>📄 Download Settlement Template</div>
                  <div style={{ fontSize: '0.76rem', color: '#666', marginTop: '2px' }}>Use our pre-formatted template to ensure correct column mapping.</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', background: '#fff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Download .xlsx</button>
                  <button style={{ padding: '7px 14px', borderRadius: '7px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', background: '#fff', color: '#0f3460', border: '1px solid #c7d2f0' }}>Download .csv</button>
                </div>
              </div>

              {/* Upload zone */}
              <div style={{ border: '2px dashed #c7d2f0', borderRadius: '12px', padding: '48px', textAlign: 'center', background: '#f8f9ff', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f3460'; e.currentTarget.style.background = '#f0f4ff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#c7d2f0'; e.currentTarget.style.background = '#f8f9ff' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📂</div>
                <div style={{ fontWeight: '700', color: '#0f3460', fontSize: '0.92rem', marginBottom: '5px' }}>Drop your settlement file here</div>
                <div style={{ fontSize: '0.74rem', color: '#aaa', marginBottom: '16px' }}>.xlsx or .csv · Max 50,000 rows · Max 25 MB</div>
                <button style={{ padding: '9px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}>Browse File</button>
              </div>

              {/* Column reference */}
              <div style={{ marginTop: '20px', background: '#fff', borderRadius: '10px', border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: '700', fontSize: '0.82rem', color: '#0f3460' }}>Required Column Format</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: '#f8faff' }}>
                      {['Column Name', 'Format', 'Required', 'Example'].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: 'left', borderBottom: '1px solid #e2e8f0', fontSize: '0.72rem', fontWeight: '700', color: '#666' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { col: 'txn_id', fmt: 'Text', req: 'Yes', ex: 'TXN9876543210' },
                      { col: 'amount', fmt: 'Number', req: 'Yes', ex: '25000.00' },
                      { col: 'currency', fmt: 'Text (3)', req: 'Yes', ex: 'PHP' },
                      { col: 'settled_at', fmt: 'YYYY-MM-DD', req: 'Yes', ex: '2026-02-22' },
                      { col: 'gateway_ref', fmt: 'Text', req: 'No', ex: 'GC-20240222-001' },
                      { col: 'customer_mobile', fmt: 'E.164', req: 'No', ex: '+63 917 1234 5678' },
                    ].map((r, i) => (
                      <tr key={r.col} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff' }}>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #f0f2f7', fontFamily: 'monospace', color: '#0f3460', fontWeight: '600' }}>{r.col}</td>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #f0f2f7', color: '#555' }}>{r.fmt}</td>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #f0f2f7' }}>
                          <span style={{ background: r.req === 'Yes' ? '#fee2e2' : '#f0f2f7', color: r.req === 'Yes' ? '#991b1b' : '#6b7280', fontSize: '0.66rem', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' }}>{r.req}</span>
                        </td>
                        <td style={{ padding: '8px 14px', borderBottom: '1px solid #f0f2f7', color: '#888', fontFamily: 'monospace', fontSize: '0.76rem' }}>{r.ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#0f3460', marginBottom: '12px' }}>Latest Settlement</div>
                {[
                  { k: 'Settlement Date', v: '22 Feb 2026' },
                  { k: 'Gateway', v: 'GCash' },
                  { k: 'Transactions', v: '87' },
                  { k: 'Gross Amount', v: '₱4,35,000' },
                  { k: 'Fees Deducted', v: '₱2,175' },
                  { k: 'Net Settled', v: '₱4,32,825' },
                  { k: 'Matched', v: '85 / 87' },
                  { k: 'Unmatched', v: '2' },
                ].map(r => (
                  <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5', fontSize: '0.78rem' }}>
                    <span style={{ color: '#888' }}>{r.k}</span>
                    <span style={{ fontWeight: '700', color: r.k === 'Unmatched' ? '#e94560' : r.k === 'Net Settled' ? '#0a3622' : '#0f3460' }}>{r.v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff8e6', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.8rem', color: '#856404', marginBottom: '6px' }}>💡 Reconciliation Tips</div>
                <ul style={{ fontSize: '0.74rem', color: '#6b5200', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
                  <li>Upload within 48 hrs of settlement</li>
                  <li>Use txn_id for exact matching</li>
                  <li>Check unmatched rows for refunds</li>
                  <li>Contact support for &gt;5% mismatch</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}