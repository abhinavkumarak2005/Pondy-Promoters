import { useState, Component } from 'react'
import { ThemeProvider } from './lib/ThemeContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

// Error boundary — shows a friendly message instead of blank screen
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) { console.error('Admin error:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, fontFamily: "'Inter',sans-serif", background: '#edeae2', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0d0c09', marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ fontSize: 13, color: '#6b6860', marginBottom: 24, maxWidth: 320 }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
            style={{ background: '#1d6bf3', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Reload Page
          </button>
          <p style={{ fontSize: 11, color: '#9a9690', marginTop: 16 }}>
            Make sure your .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

function AdminApp() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem('pp_admin') === '1' } catch { return false }
  })

  const handleLogin = () => {
    try { sessionStorage.setItem('pp_admin', '1') } catch {}
    setAuthed(true)
  }

  const handleLogout = () => {
    try { sessionStorage.removeItem('pp_admin') } catch {}
    setAuthed(false)
  }

  if (!authed) return <LoginPage onLogin={handleLogin}/>
  return <Dashboard onLogout={handleLogout}/>
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ErrorBoundary>
          <AdminApp/>
        </ErrorBoundary>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
