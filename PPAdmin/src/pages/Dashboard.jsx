import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../lib/ThemeContext'
import {
  getProperties, createProperty, updateProperty, deleteProperty,
  uploadImage, setFeatured,
  getContacts, markContactRead, deleteContact
} from '../lib/supabase'

// Tabs — no emojis, clean SVG icons
const TABS = [
  { id: 'properties', label: 'Properties', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
  { id: 'featured', label: 'Featured', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
  { id: 'clients', label: 'Clients', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg> },
]

// ─── Shared micro-components ────────────────────────────────
function Card({ children, T, style = {} }) {
  return (
    <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: T.isDark ? 'none' : T.shadow, ...style }}>
      {children}
    </div>
  )
}

function Btn({ children, onClick, variant = 'primary', disabled, full, T, style = {} }) {
  const bg = variant === 'primary'
    ? 'linear-gradient(135deg,#1d6bf3,#0f50c8)'
    : variant === 'danger'
      ? T.isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)'
      : variant === 'green'
        ? T.isDark ? 'rgba(52,211,153,0.12)' : 'rgba(22,163,74,0.08)'
        : T.isDark ? 'rgba(255,255,255,0.06)' : T.cardBg2
  const borderColor = variant === 'danger'
    ? T.isDark ? 'rgba(239,68,68,0.28)' : 'rgba(239,68,68,0.3)'
    : variant === 'green'
      ? T.isDark ? 'rgba(52,211,153,0.28)' : 'rgba(22,163,74,0.3)'
      : T.border
  const color = variant === 'danger' ? '#ef4444' : variant === 'green' ? T.isDark ? '#34d399' : '#16a34a' : variant === 'primary' ? '#fff' : T.text

  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} onClick={onClick} disabled={disabled}
      style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, color, fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '9px 15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all 0.18s', opacity: disabled ? 0.5 : 1, width: full ? '100%' : undefined, justifyContent: full ? 'center' : undefined, ...style }}>
      {children}
    </motion.button>
  )
}

// Field defined outside any component to prevent remount on state changes
function Field({ label, T, required, children }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.isDark ? T.textMuted : T.blue, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}{required && <span style={{ color: '#ef4444', fontSize: 11 }}>*</span>}
      </label>
      <div onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ background: T.isDark ? 'rgba(255,255,255,0.04)' : T.cardBg, border: `1px solid ${f ? T.blue : T.border}`, borderRadius: 10, padding: '10px 13px', transition: 'border-color 0.2s', boxShadow: f ? `0 0 0 3px ${T.isDark ? 'rgba(29,107,243,0.15)' : 'rgba(21,88,214,0.1)'}` : T.isDark ? 'none' : T.shadow }}>
        {children}
      </div>
    </div>
  )
}

const Inp = ({ T }) => ({ background: 'none', border: 'none', outline: 'none', width: '100%', fontFamily: "'Inter',sans-serif", fontSize: 13, color: T.text })

function FSelect({ label, value, onChange, options, T, required }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.isDark ? T.textMuted : T.blue, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
        {label}{required && <span style={{ color: '#ef4444', fontSize: 11 }}>*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', background: T.isDark ? 'rgba(12,16,26,0.9)' : T.cardBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 13px', color: T.text, fontFamily: "'Inter',sans-serif", fontSize: 13, outline: 'none', cursor: 'pointer', boxShadow: T.isDark ? 'none' : T.shadow }}>
        {options.map(o => <option key={o} value={o} style={{ background: T.isDark ? '#0a0c12' : T.cardBg }}>{o}</option>)}
      </select>
    </div>
  )
}

const Loader = ({ T }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
    <div style={{ width: 28, height: 28, border: `2px solid ${T.border}`, borderTop: `2px solid ${T.blue}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
  </div>
)

const Empty = ({ title, sub, T }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', color: T.textMuted }}>
    <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.isDark ? 'rgba(29,107,243,0.1)' : 'rgba(21,88,214,0.08)', border: `1px solid ${T.isDark ? 'rgba(29,107,243,0.2)' : 'rgba(21,88,214,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: T.blue }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><polyline points="16 2 12 6 8 2" /></svg>
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, color: T.textSub, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 12, fontWeight: 400 }}>{sub}</div>
  </div>
)

function Badge({ label, color, T }) {
  const c = color || T.blue
  return <span style={{ padding: '3px 9px', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: `${c}20`, border: `1px solid ${c}44`, borderRadius: 100, color: c, whiteSpace: 'nowrap' }}>{label}</span>
}

function ConfirmModal({ open, title, message, onConfirm, onCancel, T }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: '20px 20px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 480, boxShadow: T.shadowLg }}>
            <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.025em', marginBottom: 10, color: T.text }}>{title}</h3>
            <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 24 }}>{message}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="danger" onClick={onConfirm} full T={T}>Confirm Delete</Btn>
              <Btn variant="secondary" onClick={onCancel} full T={T}>Cancel</Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── PROPERTY FORM ──────────────────────────────────────────
const PROP_TYPES = ['Plot', 'Apartment', 'Villa', 'Commercial']
const EMPTY_PROP = { name: '', location: '', price: '', type: 'Plot', sqft: '', beds: '', baths: '', description: '', tags: '', image_url: '', instagram_link: '' }

function PropForm({ initial, onSave, onCancel, T }) {
  const [form, setForm] = useState(initial || EMPTY_PROP)
  const [imgFile, setImgFile] = useState(null)
  const [imgPrev, setImgPrev] = useState(form.image_url || '')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const fileRef = useRef(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp = Inp({ T })

  const handleSave = async () => {
    if (!form.name || !form.location || !form.price) { setErr('Name, location and price are required'); return }
    setSaving(true); setErr('')
    let url = form.image_url
    if (imgFile) {
      const { url: u, error: e } = await uploadImage(imgFile, form.name)
      if (e) { setErr('Image upload failed — check Supabase Storage bucket'); setSaving(false); return }
      url = u
    }
    const tags = typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags || []
    await onSave({ ...form, image_url: url, instagram_link: form.instagram_link || null, tags, beds: form.beds ? Number(form.beds) : null, baths: form.baths ? Number(form.baths) : null })
    setSaving(false)
  }

  return (
    <Card T={T} style={{ padding: 24, marginBottom: 16 }}>
      <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, color: T.text }}>{initial?.id ? 'Edit' : 'Add'} Property</h3>
      <div className='admin-form-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
        <Field label="Name" T={T} required><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Beachfront Plot" style={inp} /></Field>
        <FSelect label="Type" value={form.type} onChange={v => set('type', v)} options={PROP_TYPES} T={T} required />
        <Field label="Location" T={T} required><input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Serenity Beach, Pondicherry" style={inp} /></Field>
        <Field label="Price" T={T} required><input value={form.price} onChange={e => set('price', e.target.value)} placeholder="₹80L – 1.5 Cr" style={inp} /></Field>
        <Field label="Sqft" T={T}><input value={form.sqft} onChange={e => set('sqft', e.target.value)} type="number" placeholder="1200" style={inp} /></Field>
        <Field label="Tags" T={T}><input value={typeof form.tags === 'string' ? form.tags : (form.tags || []).join(',')} onChange={e => set('tags', e.target.value)} placeholder="HOT DEAL,NEW" style={inp} /></Field>
        <Field label="Bedrooms" T={T}><input value={form.beds || ''} onChange={e => set('beds', e.target.value)} type="number" placeholder="3" style={inp} /></Field>
        <Field label="Bathrooms" T={T}><input value={form.baths || ''} onChange={e => set('baths', e.target.value)} type="number" placeholder="2" style={inp} /></Field>
      </div>
      <Field label="Description" T={T}>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Describe the property..." style={{ ...inp, resize: 'none', display: 'block' }} />
        <Field label="Instagram Post Link" T={T}><input value={form.instagram_link || ''} onChange={e => set('instagram_link', e.target.value)} placeholder="https://www.instagram.com/p/..." style={inp} /></Field>
      </Field>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.isDark ? T.textMuted : T.blue, marginBottom: 8 }}>Image</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {imgPrev && <img src={imgPrev} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 8, border: `1px solid ${T.border}` }} />}
          <div>
            <input type="file" ref={fileRef} accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setImgFile(f); setImgPrev(URL.createObjectURL(f)) } }} style={{ display: 'none' }} />
            <Btn variant="secondary" onClick={() => fileRef.current?.click()} T={T} style={{ marginBottom: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Upload Image
            </Btn>
            {imgFile && <div style={{ fontSize: 10, color: '#16a34a', marginTop: 4 }}>✓ {imgFile.name}</div>}
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <Field label="Or paste image URL" T={T}><input value={form.image_url} onChange={e => { set('image_url', e.target.value); setImgPrev(e.target.value) }} placeholder="https://..." style={inp} /></Field>
        </div>
      </div>
      {err && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: '#ef4444' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn onClick={handleSave} disabled={saving} T={T}>{saving ? 'Saving…' : 'Save Property'}</Btn>
        <Btn variant="secondary" onClick={onCancel} T={T}>Cancel</Btn>
      </div>
    </Card>
  )
}

// ─── TABS ────────────────────────────────────────────────────
function PropertiesTab({ T }) {
  const [props, setProps] = useState([]); const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false); const [editing, setEditing] = useState(null); const [deleting, setDeleting] = useState(null)
  const load = async () => { const { data } = await getProperties(); setProps(data); setLoading(false) }
  useEffect(() => { load() }, [])
  if (loading) return <Loader T={T} />
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: T.text }}>Properties</h2><div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>{props.length} total listings</div></div>
        <Btn onClick={() => setAdding(true)} T={T}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add Property
        </Btn>
      </div>
      <AnimatePresence>
        {(adding || editing) && (
          <motion.div key="form" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <PropForm initial={editing} T={T} onSave={async (f) => { editing ? await updateProperty(editing.id, f) : await createProperty(f); setAdding(false); setEditing(null); load() }} onCancel={() => { setAdding(false); setEditing(null) }} />
          </motion.div>
        )}
      </AnimatePresence>
      {props.length === 0 ? <Empty title="No properties yet" sub="Add your first property to get started" T={T} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {props.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card T={T} style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 54, height: 40, borderRadius: 8, background: T.isDark ? 'linear-gradient(135deg,#0d2030,#1a3a4a)' : T.sectionBg, flexShrink: 0, overflow: 'hidden', border: `1px solid ${T.border}` }}>
                    {p.image_url && <img src={p.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: T.text }}>{p.name}</span>
                      <Badge label={p.type} color={p.type === 'Plot' ? T.blue : p.type === 'Villa' ? '#16a34a' : '#7c3aed'} T={T} />
                      {p.is_featured && <Badge label="Featured" color="#d97706" T={T} />}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{p.price} · {p.location}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Btn variant="secondary" onClick={() => setEditing(p)} T={T} style={{ padding: '6px 10px', fontSize: 11 }}>Edit</Btn>
                    <Btn variant="danger" onClick={() => setDeleting(p.id)} T={T} style={{ padding: '6px 10px', fontSize: 11 }}>Delete</Btn>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!deleting} title="Delete Property" message="This will permanently remove the property and cannot be undone." onConfirm={async () => { await deleteProperty(deleting); setDeleting(null); load() }} onCancel={() => setDeleting(null)} T={T} />
    </div>
  )
}

function FeaturedTab({ T }) {
  const [props, setProps] = useState([]); const [sel, setSel] = useState([]); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false)
  useEffect(() => { getProperties().then(({ data }) => { setProps(data); setSel(data.filter(p => p.is_featured).sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99)).map(p => p.id)) }) }, [])
  const toggle = id => { setSaved(false); setSel(s => s.includes(id) ? s.filter(x => x !== id) : s.length < 5 ? [...s, id] : s) }
  const handleSave = async () => { setSaving(true); await setFeatured(sel); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: T.text }}>Featured Properties</h2><div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>Select less than or equal to 5 for the home page</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {saved && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 5 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Saved!</motion.span>}
          <Btn onClick={handleSave} disabled={saving || sel.length !== 5} T={T}>{saving ? 'Saving…' : 'Save Featured'}</Btn>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 20 }}>
        {[0, 1, 2, 3, 4].map(i => {
          const p = props.find(p => p.id === sel[i]); return (
            <Card key={i} T={T} style={{ padding: 14, textAlign: 'center', background: p ? (T.isDark ? 'rgba(29,107,243,0.1)' : 'rgba(21,88,214,0.07)') : (T.isDark ? T.cardBg2 : T.cardBg2), border: `1px dashed ${p ? T.blue : T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: p ? T.text : T.textFaint, marginBottom: 2 }}>{p ? p.name.split(' ').slice(0, 3).join(' ') : `Slot ${i + 1}`}</div>
              <div style={{ fontSize: 9, color: T.textMuted }}>Position {i + 1}</div>
            </Card>
          )
        })}
      </div>
      <div style={{ background: T.isDark ? 'rgba(255,165,0,0.08)' : 'rgba(217,119,6,0.06)', border: `1px solid ${T.isDark ? 'rgba(255,165,0,0.2)' : 'rgba(217,119,6,0.2)'}`, borderRadius: 10, padding: '9px 14px', marginBottom: 18, fontSize: 12, color: '#d97706', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        {sel.length}/5 selected{sel.length < 5 ? ` — pick ${5 - sel.length} more` : ' — ready!'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {props.map(p => {
          const isSel = sel.includes(p.id); const order = sel.indexOf(p.id) + 1; return (
            <motion.div key={p.id} layout onClick={() => toggle(p.id)}
              style={{ background: isSel ? (T.isDark ? 'rgba(29,107,243,0.1)' : 'rgba(21,88,214,0.07)') : T.cardBg, border: `1px solid ${isSel ? T.blue : T.border}`, borderRadius: 12, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: sel.length >= 5 && !isSel ? 'not-allowed' : 'pointer', opacity: sel.length >= 5 && !isSel ? 0.4 : 1, transition: 'all 0.2s', boxShadow: T.isDark ? 'none' : T.shadow }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: isSel ? T.blue : (T.isDark ? 'rgba(255,255,255,0.07)' : T.sectionBg), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 900, color: isSel ? '#fff' : T.textMuted, transition: 'all 0.2s', border: `1px solid ${T.border}` }}>
                {isSel ? order : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
              </div>
              {p.image_url && <img src={p.image_url} alt="" style={{ width: 44, height: 32, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: `1px solid ${T.border}` }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{p.price} · {p.location}</div>
              </div>
              <Badge label={p.type} color={p.type === 'Plot' ? T.blue : '#7c3aed'} T={T} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function ClientsTab({ T }) {
  const [clients, setClients] = useState([]); const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null); const [deleting, setDeleting] = useState(null)
  const load = async () => { const { data } = await getContacts(); setClients(data); setLoading(false) }
  useEffect(() => { load() }, [])
  const handleExpand = async c => {
    setExpanded(expanded?.id === c.id ? null : c)
    if (!c.is_read) { await markContactRead(c.id); load() }
  }
  if (loading) return <Loader T={T} />
  const unread = clients.filter(c => !c.is_read).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: T.text }}>Clients</h2>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>
            {clients.length} total {unread > 0 && <span style={{ color: T.blue }}>· {unread} new</span>}
          </div>
        </div>
      </div>
      {clients.length === 0 ? <Empty title="No clients yet" sub="Contact form submissions appear here" T={T} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {clients.map(c => (
            <div key={c.id}>
              <div style={{ background: !c.is_read ? (T.isDark ? 'rgba(29,107,243,0.07)' : 'rgba(21,88,214,0.05)') : T.cardBg, border: `1px solid ${!c.is_read ? T.blue : T.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: T.isDark ? 'none' : T.shadow }}>
                <div onClick={() => handleExpand(c)} style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: !c.is_read ? T.blue : 'transparent', flexShrink: 0 }} />
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: `linear-gradient(135deg,${T.blue},#0f50c8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {(c.email || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{c.email}</span>
                      {c.interest && <Badge label={c.interest} color="#7c3aed" T={T} />}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {c.phone && <span>📞 {c.phone}</span>}
                      {c.budget && <span>₹ {c.budget}</span>}
                      <span>{new Date(c.submitted_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: expanded?.id === c.id ? 180 : 0 }} style={{ flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                  </motion.div>
                </div>
                <AnimatePresence>
                  {expanded?.id === c.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${T.border}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginTop: 12, marginBottom: 12 }}>
                          {[['Interest', c.interest], ['Budget', c.budget], ['Preferred Date', c.date], ['Phone', c.phone]].filter(([, v]) => v).map(([k, v]) => (
                            <div key={k} style={{ background: T.isDark ? 'rgba(255,255,255,0.04)' : T.sectionBg, borderRadius: 9, padding: '9px 12px', border: `1px solid ${T.border}` }}>
                              <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.isDark ? T.textMuted : T.blue, marginBottom: 4 }}>{k}</div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        {c.message && <div style={{ background: T.isDark ? 'rgba(255,255,255,0.03)' : T.sectionBg, borderRadius: 9, padding: '10px 13px', fontSize: 12.5, color: T.textSub, lineHeight: 1.7, marginBottom: 14, border: `1px solid ${T.border}` }}>"{c.message}"</div>}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {c.phone && <a href={`tel:${c.phone.replace(/\s/g, '')}`} style={{ textDecoration: 'none' }}><Btn variant="green" T={T} style={{ fontSize: 12 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg> Call</Btn></a>}
                          {c.email && <a href={`mailto:${c.email}`} style={{ textDecoration: 'none' }}><Btn T={T} style={{ fontSize: 12 }}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> Reply</Btn></a>}
                          {c.phone && <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}><Btn variant="secondary" T={T} style={{ fontSize: 12, color: '#16a34a', borderColor: 'rgba(22,163,74,0.3)' }}>WhatsApp</Btn></a>}
                          <Btn variant="danger" onClick={() => setDeleting(c.id)} T={T} style={{ fontSize: 12, marginLeft: 'auto' }}>Delete</Btn>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal open={!!deleting} title="Delete Client" message="Permanently remove this enquiry?" onConfirm={async () => { await deleteContact(deleting); setDeleting(null); load() }} onCancel={() => setDeleting(null)} T={T} />
    </div>
  )
}
// ─── THEME TOGGLE ────────────────────────────────────────────
function ThemeToggle({ T, toggle }) {
  return (
    <button onClick={toggle} title={T.isDark ? 'Light mode' : 'Dark mode'}
      style={{ background: T.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: `1px solid ${T.border}`, borderRadius: 9, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: T.textMuted, transition: 'all 0.2s', flexShrink: 0 }}>
      {T.isDark
        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>}
    </button>
  )
}

// ─── DASHBOARD SHELL ─────────────────────────────────────────
export default function Dashboard({ onLogout }) {
  const { theme: T, toggle } = useTheme()
  const [tab, setTab] = useState('properties')
  // Lazy-render only the active tab to prevent crashes on unused tabs
  const renderTab = () => {
    if (tab === 'properties') return <PropertiesTab T={T} />
    if (tab === 'featured') return <FeaturedTab T={T} />
    if (tab === 'clients') return <ClientsTab T={T} />
    return null
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.pageBg, fontFamily: "'Inter',sans-serif", transition: 'background 0.4s,color 0.4s' }}>

      {/* Sticky header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: T.isDark ? 'rgba(7,9,15,0.97)' : T.cardBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: `1px solid ${T.border}`, padding: '0 14px', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, boxShadow: T.isDark ? 'none' : T.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt='Pondy Promoters' style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.02em', color: T.text }}>Pondy <span style={{ color: T.blue }}>Admin</span></span>
        </div>

        {/* Desktop tabs */}
        <div className="admin-desktop-tabs" style={{ display: 'flex', gap: 2, background: T.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: `1px solid ${T.border}`, borderRadius: 100, padding: '3px 4px' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ background: tab === t.id ? (T.isDark ? 'rgba(29,107,243,0.2)' : 'rgba(21,88,214,0.12)') : 'transparent', border: tab === t.id ? `1px solid ${T.isDark ? 'rgba(77,166,255,0.25)' : 'rgba(21,88,214,0.25)'}` : '1px solid transparent', borderRadius: 100, color: tab === t.id ? T.blue : T.textMuted, fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: tab === t.id ? 700 : 500, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '6px 14px', cursor: 'pointer', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
              <span style={{ color: tab === t.id ? T.blue : T.textMuted }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <ThemeToggle T={T} toggle={toggle} />
          <button onClick={onLogout} className="admin-logout-desktop"
            style={{ background: 'none', border: `1px solid ${T.border}`, borderRadius: 9, color: T.textMuted, fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderColor = T.border }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px 14px 110px', maxWidth: 900, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile bottom nav — clean text labels, no emojis */}
      <div className="admin-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: T.isDark ? 'rgba(7,9,15,0.98)' : T.cardBg, backdropFilter: 'blur(24px)', borderTop: `1px solid ${T.border}`, display: 'none', paddingBottom: 'max(env(safe-area-inset-bottom),8px)', boxShadow: T.isDark ? 'none' : T.shadow }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: tab === t.id ? T.blue : T.textMuted, transition: 'color 0.18s', fontFamily: "'Inter',sans-serif", position: 'relative' }}>
            <span style={{ color: tab === t.id ? T.blue : T.textMuted }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontWeight: tab === t.id ? 700 : 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{t.label}</span>
            {tab === t.id && <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 2, background: T.blue, borderRadius: '0 0 2px 2px' }} />}
          </button>
        ))}
        <button onClick={onLogout}
          style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 4px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: 'rgba(239,68,68,0.5)', fontFamily: "'Inter',sans-serif" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Logout</span>
        </button>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        .admin-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}
        @media(max-width:500px){.admin-form-grid{grid-template-columns:1fr!important}}
        @media(min-width:769px){.admin-bottom-nav{display:none!important}.admin-desktop-tabs{display:flex!important}.admin-logout-desktop{display:flex!important}}
        @media(max-width:768px){.admin-desktop-tabs{display:none!important}.admin-logout-desktop{display:none!important}.admin-bottom-nav{display:flex!important}}
      `}</style>
    </div>
  )
}
