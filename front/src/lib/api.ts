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

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
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

export function register(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  location?: string
}): Promise<any> {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logout(): Promise<any> {
  return apiRequest('/logout', { method: 'POST' }).catch(() => null)
}

export function getMe(): Promise<any> {
  return apiRequest('/me')
}

export function updateMe(payload: {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  location?: string
}): Promise<any> {
  return apiRequest('/me', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSettings(): Promise<any> {
  return apiRequest('/settings')
}

export function createSettingsUser(payload: {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  address?: string
}): Promise<any> {
  return apiRequest('/settings/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateSettingsUser(
  id: number,
  payload: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
  },
): Promise<any> {
  return apiRequest(`/settings/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteSettingsUser(id: number): Promise<any> {
  return apiRequest(`/settings/users/${id}`, { method: 'DELETE' })
}

export function getNotifications(): Promise<any> {
  return apiRequest('/notifications')
}

export function markNotificationRead(id: number): Promise<any> {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' })
}

export function markAllNotificationsRead(): Promise<any> {
  return apiRequest('/notifications/read-all', { method: 'POST' })
}

export function deleteNotification(id: number): Promise<any> {
  return apiRequest(`/notifications/${id}`, { method: 'DELETE' })
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
