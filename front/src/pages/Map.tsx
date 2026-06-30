import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getVenues } from '../lib/api'

type Venue = {
  id: string
  name: string
  location: string
  coordinates: { x: number; y: number }
  contact: { name: string; role: string; email: string; phone: string }
}

const fallbackVenues: Venue[] = [
  {
    id: 'le-splendid',
    name: 'Le Splendid',
    location: 'Lille, FR',
    coordinates: { x: 150, y: 120 },
    contact: { name: 'Jean-Marc', role: 'Booking', email: 'jm@venue.com', phone: '+33 6 12 34 56 78' },
  },
]

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [venues, setVenues] = useState<Venue[]>(fallbackVenues)

  useEffect(() => {
    let mounted = true

    getVenues()
      .then((data) => {
        if (mounted && Array.isArray(data?.items) && data.items.length > 0) {
          setVenues(data.items)
        }
      })
      .catch(() => {
        if (mounted) setVenues(fallbackVenues)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return venues
    const lower = query.toLowerCase()
    return venues.filter((venue) => venue.name.toLowerCase().includes(lower) || venue.location.toLowerCase().includes(lower))
  }, [query, venues])

  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>Map</h1>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher une salle"
        style={{ width: '100%', maxWidth: 420, border: '1px solid #cbd5e1', borderRadius: 10, padding: '10px 12px' }}
      />

      <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
        {filtered.map((venue) => (
          <div key={venue.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
            <div style={{ fontWeight: 700 }}>{venue.name}</div>
            <div style={{ color: '#475569', marginTop: 4 }}>{venue.location}</div>
            <div style={{ color: '#64748b', marginTop: 6, fontSize: 14 }}>
              Contact: {venue.contact.name} ({venue.contact.role})
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
