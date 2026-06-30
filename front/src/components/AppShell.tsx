import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Bell, FolderOpen, LayoutDashboard, Map, Settings, User } from 'lucide-react'
import { getNotifications } from '../lib/api'

const sidebarItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Files', icon: FolderOpen, path: '/files' },
  { label: 'Map', icon: Map, path: '/map' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

const fallbackNotifications = [
  {
    title: 'New Mix Available',
    description: 'Pierre uploaded Youth_Collapse_Track_01_v2.wav to the cloud repository',
    time: '10m ago',
    unread: true,
  },
  {
    title: 'Gig Update',
    description: 'The technical rider for the upcoming Paris concert has been updated',
    time: '2h ago',
    unread: true,
  },
  {
    title: 'System Sync',
    description: 'MusicBrainz artist metadata successfully refreshed',
    time: 'Yesterday',
    unread: false,
  },
]

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(fallbackNotifications)

  useEffect(() => {
    let mounted = true

    getNotifications()
      .then((response) => {
        if (mounted && Array.isArray(response?.items)) {
          setNotifications(response.items)
        }
      })
      .catch(() => {
        if (mounted) {
          setNotifications(fallbackNotifications)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  const hasUnread = notifications.some((item) => item.unread)

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <aside style={{ width: 88, background: '#0f172a', color: '#fff', padding: '20px 12px' }}>
        <div style={{ textAlign: 'center', fontWeight: 800, marginBottom: 20 }}>R</div>
        <nav style={{ display: 'grid', gap: 8 }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  width: 56,
                  height: 56,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 12,
                  margin: '0 auto',
                  color: isActive ? '#0f172a' : '#e2e8f0',
                  background: isActive ? '#fff' : 'transparent',
                })}
              >
                <Icon size={20} />
              </NavLink>
            )
          })}
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <header
          style={{
            position: 'relative',
            height: 64,
            background: '#fff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '0 24px',
            gap: 16,
          }}
        >
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsNotifOpen((value) => !value)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <Bell size={20} color="#334155" />
            </button>
            {hasUnread && (
              <span
                style={{
                  position: 'absolute',
                  top: -1,
                  right: -1,
                  width: 10,
                  height: 10,
                  background: '#ef4444',
                  borderRadius: '50%',
                }}
              />
            )}
          </div>
          <Link to="/me" style={{ color: '#334155' }}>
            <User size={20} />
          </Link>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 60,
                right: 24,
                width: 360,
                maxHeight: 400,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                zIndex: 250,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: 16, borderBottom: '1px solid #e2e8f0', fontWeight: 700 }}>Notifications</div>
              <div style={{ overflowY: 'auto', display: 'grid', gap: 8, padding: 12 }}>
                {notifications.map((notification) => (
                  <div
                    key={notification.title}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      background: notification.unread ? '#f0f9ff' : '#fff',
                      border: notification.unread ? '1px solid #dbeafe' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{notification.title}</div>
                    <div style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>{notification.description}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>{notification.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>

        <section style={{ padding: 24 }}>{children}</section>
      </main>
    </div>
  )
}
