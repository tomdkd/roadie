const API_BASE_URL = '/api'
const TOKEN_STORAGE_KEY = 'roadie_token'

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`
}

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || ''
}

export function setStoredToken(token: string): void {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }

  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

async function apiRequest(path: string, options: RequestInit = {}): Promise<any> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }

  return payload
}

export function login(username: string, password: string): Promise<any> {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function getNotifications(): Promise<any> {
  return apiRequest('/notifications')
}

export function getDashboard(): Promise<any> {
  return apiRequest('/dashboard')
}

export function getFiles(): Promise<any> {
  return apiRequest('/files')
}

export function getVenues(): Promise<any> {
  return apiRequest('/venues')
}
