import { AppShell } from '../components/AppShell'

export default function Me() {
  return (
    <AppShell>
      <h1 style={{ marginTop: 0 }}>My Account</h1>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, maxWidth: 520 }}>
        <p style={{ marginTop: 0 }}>Thomas Dominik</p>
        <p style={{ color: '#64748b' }}>thomas@roadie-app.com</p>
        <p style={{ color: '#64748b' }}>Band Administrator</p>
      </div>
    </AppShell>
  )
}
