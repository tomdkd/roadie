import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { Mail, Lock, Phone, MapPin, RefreshCw, ChevronLeft } from 'lucide-react'
import { register } from '../lib/api'
import './Login.css'

export default function Register() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        phone,
        location,
      })

      toast.success('Compte créé avec succès ! Tu peux te connecter.')
      // Rediriger vers la connexion après 1,5 secondes
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Toaster position="top-right" />
      
      <form className="login-card" style={{ maxWidth: '440px', padding: '32px' }} onSubmit={handleRegister}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
            <ChevronLeft size={16} /> Retour
          </Link>
        </div>

        <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Créer un compte</h1>
        <p style={{ margin: '0 0 24px 0', color: '#64748b', fontSize: '14px' }}>Rejoins Roadie pour gérer tes fichiers et de futures tournées.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
            Prénom
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                required 
                placeholder="Thomas"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
            Nom
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                required 
                placeholder="Dominik"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </label>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '12px' }}>
          Adresse Email
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Mail size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="votre@email.com"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '12px' }}>
          Mot de passe (Min. 4 cars)
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Lock size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              minLength={4}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '12px' }}>
          Téléphone
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Phone size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+33 6 12 34 56 78"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#475569', marginTop: '12px' }}>
          Localisation / Ville
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
            <input 
              type="text" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="Lille, FR"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
            />
          </div>
        </label>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', marginTop: '24px', padding: '12px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> Inscription...
            </>
          ) : (
            'Créer mon compte'
          )}
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>
            Connexion
          </Link>
        </div>
      </form>
    </div>
  )
}
