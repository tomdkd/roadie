import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { getDashboard } from '../lib/api'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Calendar, 
  Disc, 
  TrendingUp, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  ChevronRight
} from 'lucide-react'

type Service = { name: string; status: string }
type Gig = { title: string; status: string; date: string; venue: string }

const fallbackServices: Service[] = [
  { name: 'Musicbrainz', status: 'last check: 2m ago' },
  { name: 'Spotify', status: 'last check: 5m ago' },
  { name: 'Deezer', status: 'last check: 12m ago' },
]

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>(fallbackServices)
  const [streams, setStreams] = useState('48.2k')
  const [trend, setTrend] = useState('+12% vs last month')
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await getDashboard()
      if (Array.isArray(data?.syncServices)) setServices(data.syncServices)
      if (data?.metrics?.monthlyStreams) setStreams(data.metrics.monthlyStreams)
      if (data?.metrics?.trend) setTrend(data.metrics.trend)
      if (Array.isArray(data?.gigs)) setGigs(data.gigs)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la synchronisation du tableau de bord')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleManualSync = () => {
    setRefreshing(true)
    toast.promise(
      fetchDashboardData(true),
      {
        loading: 'Interrogation des API de streaming...',
        success: 'Données synchronisées avec succès !',
        error: "Échec de l'interrogation instantanée",
      }
    )
  }

  // Helper pour styliser le badge de statut des évènements
  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'confirmed' || s === 'confirmé') {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ecfdf5', color: '#10b981', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
          <CheckCircle2 size={12} /> Confirmé
        </span>
      )
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fffbeb', color: '#f59e0b', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
        <AlertCircle size={12} /> Optionnel
      </span>
    )
  }

  return (
    <AppShell>
      <Toaster position="top-right" />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '12px' }}>
        
        {/* Header Dynamique */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>Tableau de Bord</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Vue unifiée des streams, concerts programmés et plateformes synchronisées</p>
          </div>
          <button
            onClick={handleManualSync}
            disabled={refreshing || loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#fff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.borderColor = '#94a3b8'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#fff'
              e.currentTarget.style.borderColor = '#cbd5e1'
            }}
          >
            <Clock size={14} className={refreshing ? 'animate-spin' : ''} /> Synchroniser
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', gap: '8px', color: '#64748b' }}>
            <RefreshCw className="animate-spin" size={24} />
            Chargement des statistiques de ton groupe...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
            
            {/* Grille Principale supérieure : Chiffres clés et Statuts serveurs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Carte Streaming Global */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
                  color: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Décoration de fond musical */}
                <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: '#fff' }}>
                  <Disc size={160} />
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={18} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audience Globale</span>
                  </div>
                  <div style={{ fontSize: '42px', fontWeight: 800, marginTop: '16px', letterSpacing: '-0.02em' }}>{streams}</div>
                  <div style={{ color: '#10b981', marginTop: '6px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{trend}</span>
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1, marginTop: '24px', fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Intégration Spotify de Thomas active <ExternalLink size={10} />
                </div>
              </div>

              {/* État des plateformes synchronisées */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Intégrations Distantes
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexGrow: 1 }}>
                  {services.map((service) => (
                    <div
                      key={service.name}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{service.name}</span>
                      <span style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Concerts à venir - Section Inférieure de type Échéancier */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={20} style={{ color: '#4f46e5' }} />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Gigs & Concerts planifiés</h3>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#4f46e5', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  Voir sur la carte <ChevronRight size={14} />
                </span>
              </div>

              {gigs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 12px', color: '#64748b' }}>
                  Aucun concert de planifié pour le moment.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {gigs.map((gig, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        borderRadius: '12px',
                        background: '#f8fafc',
                        border: '1px solid #f1f5f9',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'
                        e.currentTarget.style.borderColor = '#e2e8f0'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#f1f5f9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* Bulle de date colorée */}
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            lineHeight: 1.1
                          }}
                        >
                          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#6366f1' }}>{gig.date.split(' ')[0]}</span>
                          <span style={{ fontSize: '15px' }}>{gig.date.split(' ')[1]?.replace(',', '')}</span>
                        </div>
                        
                        <div>
                          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                            {gig.title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', color: '#64748b', fontSize: '13px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={12} /> {gig.venue}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} /> {gig.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {getStatusBadge(gig.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </AppShell>
  )
}
