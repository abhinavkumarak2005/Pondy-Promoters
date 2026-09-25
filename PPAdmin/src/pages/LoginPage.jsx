import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../lib/ThemeContext'

const ADMIN_USER = 'viknesh'
const ADMIN_PASS = 'sri@0711'

// Defined outside component — avoids remount / cursor-jump bug
function FocusField({ label, T, children }) {
  const [f, setF] = useState(false)
  return (
    <div onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ background: T.isDark ? 'rgba(255,255,255,0.05)' : T.cardBg, border: `1px solid ${f ? T.blue : T.border}`, borderRadius: 13, padding: '13px 16px', marginBottom: 12, transition: 'border-color 0.2s', boxShadow: f ? `0 0 0 3px ${T.isDark?'rgba(29,107,243,0.15)':'rgba(21,88,214,0.1)'}` : 'none' }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.isDark ? 'rgba(255,255,255,0.35)' : T.blue, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  )
}

export default function LoginPage({ onLogin }) {
  const { theme: T, toggle } = useTheme()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const inp = { background: 'none', border: 'none', outline: 'none', width: '100%', fontFamily: "'Inter',sans-serif", fontSize: 15, color: T.text, padding: 0 }

  const handleLogin = async () => {
    if (!user || !pass) { setError('Please fill both fields'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    if (user === ADMIN_USER && pass === ADMIN_PASS) { onLogin() }
    else { setError('Invalid username or password'); setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.pageBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'max(20px,env(safe-area-inset-top)) 16px 20px', position: 'relative', overflow: 'hidden', fontFamily: "'Inter',sans-serif", transition: 'background 0.4s' }}>
      {/* BG decoration */}
      <div style={{ position: 'absolute', inset: 0, background: T.isDark ? 'radial-gradient(ellipse 60% 50% at 50% 40%,rgba(29,107,243,0.09) 0%,transparent 70%)' : 'radial-gradient(ellipse 60% 50% at 50% 40%,rgba(21,88,214,0.06) 0%,transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', inset: 0, opacity: T.isDark ? 0.025 : 0.04, backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`, backgroundSize: '52px 52px', pointerEvents: 'none' }}/>

      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.16,1,0.3,1] }}
        style={{ width: '100%', maxWidth: 420, background: T.isDark ? 'rgba(255,255,255,0.035)' : T.cardBg, backdropFilter: 'blur(28px)', border: `1px solid ${T.border}`, borderRadius: 22, padding: 'clamp(28px,6vw,44px)', boxShadow: T.shadowLg }}>

        {/* Logo + theme toggle row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt='Pondy Promoters' style={{ width:40,height:40,borderRadius:'50%',objectFit:'cover',flexShrink:0 }}/>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>Pondy <span style={{ color: T.blue }}>Admin</span></div>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.textFaint, marginTop: 2 }}>Portal</div>
            </div>
          </div>
          {/* Mini theme toggle */}
          <button onClick={toggle} title={T.isDark ? 'Light mode' : 'Dark mode'}
            style={{ background: T.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: `1px solid ${T.border}`, borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.textMuted, transition: 'all 0.2s' }}>
            {T.isDark
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            }
          </button>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.035em', marginBottom: 6, color: T.text }}>Sign In</h1>
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 28, fontWeight: 400 }}>Authorised access only</p>

        <FocusField label="Username" T={T}>
          <input value={user} onChange={e => { setUser(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="admin" style={inp} autoCapitalize="off" autoComplete="username"/>
        </FocusField>

        <FocusField label="Password" T={T}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input value={pass} onChange={e => { setPass(e.target.value); setError('') }} onKeyDown={e => e.key === 'Enter' && handleLogin()} type={showPass ? 'text' : 'password'} placeholder="••••••••" style={inp} autoComplete="current-password"/>
            <button onClick={() => setShowPass(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, display: 'flex', padding: 4, flexShrink: 0 }}>
              {showPass
                ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10 10 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9 9 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/></svg>
                : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          </div>
        </FocusField>

        {error && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.28)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: 12.5, color: '#f87171' }}>{error}</span>
          </motion.div>
        )}

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={handleLogin} disabled={loading}
          style={{ width: '100%', background: 'linear-gradient(135deg,#1d6bf3,#0f50c8)', border: 'none', color: '#fff', borderRadius: 12, fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(29,107,243,0.35)', transition: 'all 0.2s', marginTop: 4 }}>
          {loading
            ? <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
            : <>Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
        </motion.button>

        <p style={{ textAlign: 'center', fontSize: 11, color: T.textFaint, marginTop: 20, lineHeight: 1.65 }}>
          Authorised administrators only. Misuse is prohibited.
        </p>
      </motion.div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
