import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Login from './pages/Login'
import Register from './pages/Register'
import MapPage from './pages/Map'
import Me from './pages/Me'
import Settings from './pages/Settings'
import { getStoredToken, setStoredToken } from './lib/api'

function App() {
  const [token, setToken] = useState(getStoredToken())
  const isAuthenticated = useMemo(() => Boolean(token), [token])

  const handleLoginSuccess = (nextToken: string) => {
    setStoredToken(nextToken)
    setToken(nextToken)
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/files"
          element={isAuthenticated ? <Files /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/map"
          element={isAuthenticated ? <MapPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/me"
          element={isAuthenticated ? <Me /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
