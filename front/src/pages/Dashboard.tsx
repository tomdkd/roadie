import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getDashboard } from '../lib/api'

type Service = { name: string; status: string }

const fallbackServices: Service[] = [
  { name: 'Musicbrainz', status: 'last check: 2m ago' },
  { name: 'Spotify', status: 'last check: 5m ago' },
  { name: 'Deezer', status: 'last check: 12m ago' },
]

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>(fallbackServices)
  const [streams, setStreams] = useState('48.2k')
  const [trend, setTrend] = useState('+12% vs last month')

  useEffect(() => {
    let mounted = true

    getDashboard()
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data?.syncServices)) setServices(data.syncServices)
        if (data?.metrics?.monthlyStreams) setStreams(data.metrics.monthlyStreams)
        if (data?.metrics?.trend) setTrend(data.metrics.trend)
      })
      .catch(() => {
        if (mounted) setServices(fallbackServices)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {services.map((service) => (
          <div key={service.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <div style={{ fontWeight: 700 }}>{service.name}</div>
            <div style={{ color: '#64748b', marginTop: 6 }}>{service.status}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
          <div style={{ color: '#64748b' }}>Monthly Streams</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8 }}>{streams}</div>
          <div style={{ color: '#16a34a', marginTop: 8 }}>{trend}</div>
        </div>
      </div>
    </AppShell>
  )
}
