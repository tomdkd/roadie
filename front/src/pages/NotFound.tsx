import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0f172a',
        color: '#fff',
        padding: 24,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div
          style={{
            width: 88,
            height: 88,
            margin: '0 auto 24px',
            borderRadius: 24,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <Compass size={40} color="#38bdf8" />
        </div>
        <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1 }}>404</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>Page introuvable</div>
        <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
          Cette page semble avoir quitté la tournée. Vérifiez l'adresse ou revenez à la base.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 24,
            padding: '12px 20px',
            borderRadius: 12,
            background: '#fff',
            color: '#0f172a',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <Home size={18} /> Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
