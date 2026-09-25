import { createContext, useContext, useState, useEffect } from 'react'

export const LIGHT = {
  isDark: false,
  // Backgrounds — warm stone palette, strong contrast between layers
  pageBg:    '#edeae2',      // warm stone — noticeably different from cards
  sectionBg: '#e5e2d9',      // slightly darker stone for alternating sections
  cardBg:    '#faf9f6',      // near-white cards — pop against the stone bg
  cardBg2:   '#f2f0ea',
  navBg:     'rgba(237,234,226,0.96)',
  heroBg:    '#edeae2',
  // Text — strong, intentional hierarchy
  text:      '#0d0c09',      // near-black with warm tint
  textSub:   '#1a1916',      // very dark gray — almost as dark as headings
  textMuted: '#4a4740',      // medium warm gray — still very readable
  textFaint: '#8a867e',      // muted for labels, captions
  // Borders — visible but not harsh
  border:    'rgba(0,0,0,0.13)',
  borderSub: 'rgba(0,0,0,0.07)',
  // Accents
  blue:      '#1558d6',      // slightly richer blue for light bg
  blue2:     '#3b82f6',
  blueText:  '#0f4fc0',      // darker for text on light
  // Shadows — crisp, strong
  shadow:    '0 2px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.08)',
  shadowLg:  '0 8px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
  // Stat numbers
  statNum:   '#0d0c09',
}

export const DARK = {
  isDark: true,
  pageBg:    '#07090f',
  sectionBg: '#080a12',
  cardBg:    'rgba(12,16,26,0.9)',
  cardBg2:   'rgba(255,255,255,0.03)',
  navBg:     'rgba(8,10,18,0.96)',
  heroBg:    '#07090f',
  text:      '#f0eff8',
  textSub:   'rgba(240,239,248,0.75)',
  textMuted: 'rgba(240,239,248,0.45)',
  textFaint: 'rgba(240,239,248,0.24)',
  border:    'rgba(255,255,255,0.08)',
  borderSub: 'rgba(255,255,255,0.04)',
  blue:      '#1d6bf3',
  blue2:     '#4da6ff',
  blueText:  '#4da6ff',
  shadow:    '0 4px 24px rgba(0,0,0,0.5)',
  shadowLg:  '0 12px 48px rgba(0,0,0,0.7)',
  statNum:   '#ffffff',
}

const ThemeCtx = createContext({ theme: LIGHT, toggle: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    // Default: light. Only go dark if user has explicitly toggled to dark.
    try { return localStorage.getItem('pp_admin_theme') === 'dark' } catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem('pp_admin_theme', dark ? 'dark' : 'light') } catch {}
    document.body.style.background = dark ? DARK.pageBg : LIGHT.pageBg
    document.body.style.color = dark ? DARK.text : LIGHT.text
  }, [dark])

  return (
    <ThemeCtx.Provider value={{ theme: dark ? DARK : LIGHT, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
