import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import Layout from '../components/Layout'

// Colours for the donut chart
const CHANNEL_COLORS = ['#0f3460', '#e94560', '#059669', '#d97706', '#7c3aed']

// KPI Card component
function KPICard({ title, value, subtitle, color }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid #dde3f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      flex: 1
    }}>
      <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '28px', fontWeight: '800', color: color || '#0f3460', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
        {subtitle}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const merchant = JSON.parse(localStorage.getItem('merchant') || '{}')

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchStats(token)
  }, [])

  const fetchStats = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(res.data)
    } catch (err) {
      // If token is invalid, go back to login
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  // Show loading spinner while fetching
  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading dashboard...</div>
        </div>
      </Layout>
    )
  }

  // Use real data if available, otherwise show zeros
  const kpis = stats || {
    total_collected: 0,
    outstanding: 0,
    collection_rate: 0,
    avg_days_to_pay: 0,
    active_customers: 0,
    collections_by_day: [],
    collections_by_channel: [],
    request_status_counts: { paid: 0, pending: 0, partial: 0, expired: 0 }
  }

  return (
    <Layout>

      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f3460', marginBottom: '4px' }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Welcome back, {merchant.company_name}! Here's what's happening.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <KPICard
          title="TOTAL COLLECTED"
          value={`₱${Number(kpis.total_collected || 0).toLocaleString()}`}
          subtitle="Last 30 days"
          color="#059669"
        />
        <KPICard
          title="OUTSTANDING"
          value={`₱${Number(kpis.outstanding || 0).toLocaleString()}`}
          subtitle="Pending + Partial requests"
          color="#d97706"
        />
        <KPICard
          title="COLLECTION RATE"
          value={`${kpis.collection_rate || 0}%`}
          subtitle="Paid vs total requested"
          color="#0f3460"
        />
        <KPICard
          title="AVG DAYS TO PAY"
          value={`${kpis.avg_days_to_pay || 0} days`}
          subtitle="Across fully paid requests"
          color="#7c3aed"
        />
        <KPICard
          title="ACTIVE CUSTOMERS"
          value={kpis.active_customers || 0}
          subtitle="With requests this month"
          color="#e94560"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>

        {/* Bar Chart — Daily Collections */}
        <div style={{
          flex: 2,
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #dde3f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
            Collections — Last 30 Days
          </h3>
          {kpis.collections_by_day?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={kpis.collections_by_day}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => `₱${val.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#0f3460" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: '220px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#9ca3af', fontSize: '14px'
            }}>
              No collections yet — send your first payment request!
            </div>
          )}
        </div>

        {/* Donut Chart — By Channel */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #dde3f0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f3460', marginBottom: '20px' }}>
            By Payment Channel
          </h3>
          {kpis.collections_by_channel?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={kpis.collections_by_channel}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  dataKey="amount"
                  nameKey="channel"
                >
                  {kpis.collections_by_channel.map((_, i) => (
                    <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(val) => `₱${val.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: '220px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: '#9ca3af', fontSize: '14px', textAlign: 'center'
            }}>
              No payment data yet
            </div>
          )}
        </div>

      </div>

      {/* Request Status Row */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #dde3f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f3460', marginBottom: '16px' }}>
          Request Status Overview
        </h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {[
            { label: 'Paid', value: kpis.request_status_counts?.paid || 0, color: '#059669', bg: '#f0fdf4' },
            { label: 'Pending', value: kpis.request_status_counts?.pending || 0, color: '#d97706', bg: '#fffbeb' },
            { label: 'Partial', value: kpis.request_status_counts?.partial || 0, color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Expired', value: kpis.request_status_counts?.expired || 0, color: '#e94560', bg: '#fff0f3' },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1, minWidth: '100px',
              backgroundColor: s.bg,
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </Layout>
  )
}