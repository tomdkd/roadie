import React, { useState, useEffect } from 'react'
import { AppShell } from '../components/AppShell'
import toast, { Toaster } from 'react-hot-toast'
import { User, Mail, Phone, MapPin, Shield, Edit2, Check, X, RefreshCw } from 'lucide-react'

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  role: string
}

export default function Me() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Champs du formulaire gérés individuellement
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  // Charger le profil depuis le backend
  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/me')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        // Remplir le formulaire
        setFirstName(data.firstName || '')
        setLastName(data.lastName || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
        setLocation(data.location || '')
      } else {
        toast.error('Failed to load profile details')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error while fetching profile')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  // Sauvegarder les modifications
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch('/api/me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          location,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
        setIsEditing(false)
        toast.success('Your profile was successfully updated!')
      } else {
        const errData = await response.json().catch(() => ({}))
        toast.error(errData.message || 'Failed to update profile')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error during save operation')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setEmail(profile.email || '')
      setPhone(profile.phone || '')
      setLocation(profile.location || '')
    }
    setIsEditing(false)
  }

  return (
    <AppShell>
      <Toaster position="top-right" />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>Mon Profil</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>Gère tes informations personnelles et de contact</p>
          </div>
          {!loading && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
            >
              <Edit2 size={16} /> Éditer le profil
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', gap: '8px', color: '#64748b' }}>
            <RefreshCw className="animate-spin" size={24} />
            Chargement de tes détails de profil...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            {/* Carte d'identité principale */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '24px',
                  }}
                >
                  {firstName[0] || 'T'}
                  {lastName[0] || 'D'}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                    <Shield size={14} />
                    {profile?.role}
                  </div>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Prénom</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Nom</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Adresse Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Numéro de téléphone</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Localisation / Ville</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={16} /> Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#fff',
                        cursor: 'pointer',
                        opacity: saving ? 0.7 : 1,
                      }}
                    >
                      {saving ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" /> Enregistrement...
                        </>
                      ) : (
                        <>
                          <Check size={16} /> Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', color: '#64748b' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Nom Complet</div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#334155', marginTop: '2px' }}>
                        {profile?.firstName} {profile?.lastName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', color: '#64748b' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Email</div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#334155', marginTop: '2px' }}>
                        {profile?.email}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', color: '#64748b' }}>
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Téléphone</div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#334155', marginTop: '2px' }}>
                        {profile?.phone || 'Non renseigné'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', color: '#64748b' }}>
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Localisation</div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#334155', marginTop: '2px' }}>
                        {profile?.location || 'Non renseigné'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section Sécurité & Sessions fictive */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: '#334155' }}>
                Droits d'administration du groupe
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
                En tant que <strong>Band Administrator</strong> pour le projet <em>Stuck In Yesterday</em>, tu disposes des droits d'écriture sur les fiches techniques, l'ajout de nouveaux membres au sein d'un groupe, ainsi que la configuration des clés secrètes d'intégration de services externes (Spotify & MusicBrainz).
              </p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
