import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getVenues } from '../lib/api'
import toast, { Toaster } from 'react-hot-toast'
import { MapPin, Search, Mail, Phone, User, Compass, HelpCircle, RefreshCw } from 'lucide-react'

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
  {
    id: 'la-cartonnerie',
    name: 'La Cartonnerie',
    location: 'Reims, FR',
    coordinates: { x: 280, y: 190 },
    contact: { name: 'Sophie', role: 'Booking', email: 'sophie@venue.com', phone: '+33 6 87 65 43 21' },
  },
  {
    id: 'le-point-ephemere',
    name: 'Le Point Éphémère',
    location: 'Paris, FR',
    coordinates: { x: 220, y: 240 },
    contact: { name: 'Aurelie', role: 'Booking', email: 'aurelie@venue.com', phone: '+33 6 34 56 78 90' },
  }
]

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [venues, setVenues] = useState<Venue[]>(fallbackVenues)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(fallbackVenues[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    getVenues()
      .then((data) => {
        if (mounted && Array.isArray(data?.items) && data.items.length > 0) {
          setVenues(data.items)
          // Sélectionner par défaut le premier élément trouvé
          setSelectedVenue(data.items[0])
        }
      })
      .catch((err) => {
        console.error(err)
        if (mounted) {
          setVenues(fallbackVenues)
          setSelectedVenue(fallbackVenues[0])
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return venues
    const lower = query.toLowerCase()
    return venues.filter((venue) => 
      venue.name.toLowerCase().includes(lower) || 
      venue.location.toLowerCase().includes(lower)
    )
  }, [query, venues])

  const handleMarkerClick = (venue: Venue) => {
    setSelectedVenue(venue)
    toast.success(`Salle sélectionnée : ${venue.name}`, { id: 'marker' })
  }

  return (
    <AppShell>
      <Toaster position="top-right" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
        
        {/* En-tête */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ margin: 0, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px', fontWeight: 600 }}>
            Carte des partenaires
          </p>
          <h1 style={{ margin: '8px 0 0', color: '#0f172a', fontSize: '32px', fontWeight: 700 }}>Touring Bookings</h1>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', gap: '8px', color: '#64748b' }}>
            <RefreshCw className="animate-spin" size={24} />
            Chargement de la projection géoréférencée...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* Colonne Gauche : Liste & Recherche */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Barre de Recherche */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: '#fff', 
                  border: '1px solid #cbd5e1', 
                  borderRadius: '10px', 
                  padding: '10px 14px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <Search size={16} style={{ color: '#94a3b8' }} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher une salle..."
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#334155' }}
                />
              </div>

              {/* Résultats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '450px', overflowY: 'auto' }}>
                {filtered.map((venue) => {
                  const isSelected = selectedVenue?.id === venue.id
                  return (
                    <div
                      key={venue.id}
                      onClick={() => setSelectedVenue(venue)}
                      style={{
                        background: '#fff',
                        border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease-in-out',
                        boxShadow: isSelected ? '0 4px 6px -1px rgba(59,130,246,0.1)' : 'none',
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#94a3b8'
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.borderColor = '#e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={16} style={{ color: isSelected ? '#3b82f6' : '#64748b' }} />
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{venue.name}</span>
                      </div>
                      <div style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', marginLeft: '26px' }}>{venue.location}</div>
                    </div>
                  )
                })}
                {filtered.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    Aucune salle de concert ne correspond.
                  </div>
                )}
              </div>
            </div>

            {/* Colonne Droite : Projection de la Carte interactive SVG et Contacts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Carte SVG Interactive */}
              <div 
                style={{ 
                  background: '#0f172a', 
                  borderRadius: '16px', 
                  padding: '24px', 
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  minHeight: '340px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.15)'
                }}
              >
                {/* Flous d'arrière-plan futuristes */}
                <div style={{ position: 'absolute', top: '10%', left: '10%', width: '150px', height: '150px', borderRadius: '50%', background: '#3b82f6', filter: 'blur(100px)', opacity: 0.15 }}></div>
                <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '150px', height: '150px', borderRadius: '50%', background: '#a78bfa', filter: 'blur(100px)', opacity: 0.1 }}></div>

                {/* Grillage cartographique */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    backgroundImage: 'radial-gradient(#ffffff0a 1px, transparent 1px)', 
                    backgroundSize: '24px 24px',
                    opacity: 0.8
                  }}
                ></div>

                {/* Boussole boussolant l'orientation */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}>
                  <Compass size={14} /> PROJECTION FRANCE
                </div>

                {/* Schéma de navigation SVG */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 500 350"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5, userSelect: 'none' }}
                >
                  {/* Tracé abstrait de réseaux ferroviaires / de tournées entre les points */}
                  {venues.length > 1 && (
                    <g opacity="0.15">
                      <line x1={venues[0].coordinates.x} y1={venues[0].coordinates.y} x2={venues[1].coordinates.x} y2={venues[1].coordinates.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={venues[1].coordinates.x} y1={venues[1].coordinates.y} x2={venues[2].coordinates.x} y2={venues[2].coordinates.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1={venues[2].coordinates.x} y1={venues[2].coordinates.y} x2={venues[0].coordinates.x} y2={venues[0].coordinates.y} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                    </g>
                  )}

                  {/* Marqueurs sur la carte */}
                  {venues.map((v) => {
                    const isSelected = selectedVenue?.id === v.id
                    return (
                      <g 
                        key={v.id} 
                        transform={`translate(${v.coordinates.x}, ${v.coordinates.y})`}
                        onClick={() => handleMarkerClick(v)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Halo d'impulsion */}
                        {isSelected && (
                          <circle r="14" fill="#3b82f6" opacity="0.3">
                            <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {/* Point central */}
                        <circle r="6" fill={isSelected ? '#3b82f6' : '#94a3b8'} stroke="#fff" strokeWidth="1.5" />
                        {/* Libellé survolé textuel */}
                        <text
                          y="-12"
                          textAnchor="middle"
                          fill={isSelected ? '#3b82f6' : '#64748b'}
                          style={{ fontSize: '10px', fontWeight: isSelected ? 700 : 500, fontFamily: 'sans-serif' }}
                        >
                          {v.name}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>

              {/* Fiche d'informations administratives et de Booking pour la salle sélectionnée */}
              {selectedVenue ? (
                <div 
                  style={{ 
                    background: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0', 
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{selectedVenue.name}</h4>
                      <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> {selectedVenue.location}
                      </p>
                    </div>
                    <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                      En BDD locale
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '6px', color: '#475569' }}>
                        <User size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Interlocuteur Booking</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>{selectedVenue.contact.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Responsable programmation</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '6px', color: '#475569' }}>
                        <Mail size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Adresse Courriel</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px', wordBreak: 'break-all' }}>{selectedVenue.contact.email}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ background: '#f8fafc', padding: '6px', borderRadius: '6px', color: '#475569' }}>
                        <Phone size={14} />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Numéro Téléphone</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>{selectedVenue.contact.phone}</div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', padding: '24px', textAlign: 'center', borderRadius: '16px', color: '#64748b' }}>
                  <HelpCircle size={24} style={{ margin: '0 auto 8px auto', opacity: 0.7 }} />
                  Sélectionne un marqueur sur la carte ou dans la liste pour dévoiler les détails de booking.
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </AppShell>
  )
}
