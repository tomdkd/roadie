import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../lib/api'
import './Login.css'

type LoginProps = {
  onLoginSuccess: (token: string) => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await login(username, password)
      onLoginSuccess(response.token)
      toast.success('Connexion réussie')
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Échec de connexion'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Roadie</h1>
        <p>Connecte-toi pour accéder au MVP.</p>
        <label>
          Utilisateur
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
        
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          Pas encore de compte ?{' '}
          <span 
            onClick={() => navigate('/register')} 
            style={{ color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}
          >
            S'inscrire
          </span>
        </div>

        <small>Compte de démonstration: admin / admin</small>
      </form>
    </div>
  )
}
