import { useState, useEffect, useRef } from 'react';
import { useProperties } from '../context/PropertyContext';
import { Plus, Trash2, Star, LogOut, Upload, Edit2, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  supabase,
  fetchAllProperties, fetchFeaturedProperties,
  type DBProperty
} from '../../lib/supabase';

const TYPES = ['Plot', 'Luxury Villa', 'Apartment', 'Commercial', 'Bungalow', 'Beach House'];

const EMPTY_FORM = {
  name: '', location: '', price: '', type: 'Plot', sqft: '', beds: '', baths: '',
  description: '', tags: '', image_url: '', instagram_link: '',
};

// ── SUPABASE HELPERS (with localStorage fallback) ─────────
async function adminGetProperties(): Promise<DBProperty[]> {
  if (supabase) {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    return data || [];
  }
  try { return JSON.parse(localStorage.getItem('pp_admin_props') || '[]'); } catch { return []; }
}

async function adminSaveProperty(form: typeof EMPTY_FORM, editing: DBProperty | null): Promise<void> {
  const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
  const row = {
    name: form.name,
    location: form.location,
    price: form.price,
    type: form.type,
    sqft: form.sqft || null,
    beds: form.beds ? Number(form.beds) : null,
    baths: form.baths ? Number(form.baths) : null,
    description: form.description || null,
    tags,
    image_url: form.image_url || null,
    instagram_link: form.instagram_link || null,
  };
  if (supabase) {
    if (editing) {
      await supabase.from('properties').update(row).eq('id', editing.id);
    } else {
      await supabase.from('properties').insert([row]);
    }
  } else {
    const stored: DBProperty[] = JSON.parse(localStorage.getItem('pp_admin_props') || '[]');
    if (editing) {
      const idx = stored.findIndex(p => p.id === editing.id);
      if (idx >= 0) stored[idx] = { ...stored[idx], ...row };
    } else {
      const maxId = stored.reduce((m, p) => Math.max(m, p.id), 0);
      stored.push({ id: maxId + 1, is_featured: false, featured_order: null, created_at: new Date().toISOString(), ...row } as DBProperty);
    }
    localStorage.setItem('pp_admin_props', JSON.stringify(stored));
  }
}

async function adminDeleteProperty(id: number): Promise<void> {
  if (supabase) { await supabase.from('properties').delete().eq('id', id); return; }
  const stored: DBProperty[] = JSON.parse(localStorage.getItem('pp_admin_props') || '[]');
  localStorage.setItem('pp_admin_props', JSON.stringify(stored.filter(p => p.id !== id)));
}

async function adminUploadImage(file: File, name: string): Promise<string | null> {
  if (!supabase) return URL.createObjectURL(file);
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${name.replace(/\s+/g, '-').toLowerCase()}.${ext}`;
  const { error } = await supabase.storage.from('property-images').upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from('property-images').getPublicUrl(path);
  return data.publicUrl;
}

async function adminSetFeatured(ids: number[]): Promise<void> {
  if (!supabase) return;
  await supabase.from('properties').update({ is_featured: false, featured_order: null }).neq('id', 0);
  for (let i = 0; i < ids.length; i++) {
    await supabase.from('properties').update({ is_featured: true, featured_order: i + 1 }).eq('id', ids[i]);
  }
}

// ── COMPONENTS ────────────────────────────────────────────
function Btn({ children, onClick, variant = 'primary', disabled = false, full = false, small = false }: any) {
  const base = `inline-flex items-center justify-center gap-1.5 font-bold transition-all rounded-xl cursor-pointer border ${full ? 'w-full' : ''} ${small ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5'}`;
  const styles: Record<string, string> = {
    primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 shadow-sm',
    danger: 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100',
  };
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClick} disabled={disabled}
      className={`${base} ${styles[variant] || styles.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {children}
    </motion.button>
  );
}

function Field({ label, children, required }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all";

export function AdminPanel() {
  const [props, setProps] = useState<DBProperty[]>([]);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);
  const [tab, setTab] = useState<'properties' | 'featured'>('properties');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DBProperty | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);
  const [saveFeaturedState, setSaveFeaturedState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [all, featured] = await Promise.all([adminGetProperties(), fetchFeaturedProperties()]);
    setProps(all);
    setFeaturedIds(featured.sort((a, b) => (a.featured_order || 99) - (b.featured_order || 99)).map(p => p.id));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setImgFile(null); setImgPreview(''); setFormOpen(true); };
  const openEdit = (p: DBProperty) => {
    setEditing(p);
    setForm({ name:p.name||'', location:p.location, price:p.price, type:p.type, sqft:p.sqft||'', beds:String(p.beds||''), baths:String(p.baths||''), description:p.description||'', tags:(p.tags||[]).join(','), image_url:p.image_url||'', instagram_link:(p as any).instagram_link||'' });
    setImgPreview(p.image_url||'');
    setImgFile(null);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.location || !form.price) return;
    setSaving(true);
    let imageUrl = form.image_url;
    if (imgFile) {
      const url = await adminUploadImage(imgFile, form.name);
      if (url) imageUrl = url;
    }
    await adminSaveProperty({ ...form, image_url: imageUrl }, editing);
    setSaving(false); setFormOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    setDeleting(null);
    await adminDeleteProperty(id);
    load();
  };

  const toggleFeatured = (id: number) => {
    setSaveFeaturedState('idle');
    setFeaturedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 5 ? [...prev, id] : prev);
  };

  const handleSaveFeatured = async () => {
    setSaveFeaturedState('saving');
    await adminSetFeatured(featuredIds);
    setSaveFeaturedState('saved');
    setTimeout(() => setSaveFeaturedState('idle'), 2500);
  };

  const TABS = [
    { id: 'properties', label: 'Properties' },
    { id: 'featured', label: 'Featured (5)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {/* Header */}
      <div className="bg-white sticky top-0 z-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Pondy Promoters" className="w-8 h-8 rounded-full flex-shrink-0 object-cover"/>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-none">Pondy Admin</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{props.length} properties</div>
          </div>
        </div>
        <a href="#" onClick={e => { e.preventDefault(); window.location.hash = ''; }}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <LogOut size={13}/> Exit Admin
        </a>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* PROPERTIES TAB */}
        {tab === 'properties' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">All Properties</h2>
              <Btn onClick={openAdd}><Plus size={14}/> Add Property</Btn>
            </div>

            {/* ADD / EDIT FORM */}
            <AnimatePresence>
              {formOpen && (
                <motion.div initial={{ opacity:0,y:-12 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">{editing ? 'Edit' : 'Add'} Property</h3>
                    <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={18}/></button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Field label="Property Name" required>
                      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Beachfront Plot" className={inputCls}/>
                    </Field>
                    <Field label="Type" required>
                      <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className={inputCls}>
                        {TYPES.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </Field>
                    <Field label="Location" required>
                      <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Serenity Beach, Pondicherry" className={inputCls}/>
                    </Field>
                    <Field label="Price" required>
                      <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="₹80L – 1.5 Cr" className={inputCls}/>
                    </Field>
                    <Field label="Sqft">
                      <input value={form.sqft} onChange={e=>setForm({...form,sqft:e.target.value})} placeholder="1200" className={inputCls}/>
                    </Field>
                    <Field label="Tags (comma-separated)">
                      <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} placeholder="NEW LAUNCH, HOT DEAL" className={inputCls}/>
                    </Field>
                    <Field label="Bedrooms">
                      <input type="number" value={form.beds} onChange={e=>setForm({...form,beds:e.target.value})} placeholder="3" className={inputCls}/>
                    </Field>
                    <Field label="Bathrooms">
                      <input type="number" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})} placeholder="2" className={inputCls}/>
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} placeholder="Describe the property..." className={`${inputCls} resize-none`}/>
                  </Field>

                  {/* Image */}
                  <Field label="Instagram Post Link">
                    <input value={form.instagram_link} onChange={e=>setForm({...form,instagram_link:e.target.value})} placeholder="https://www.instagram.com/p/..." className={inputCls}/>
                  </Field>

                  <div className="mt-3 mb-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Image</label>
                    <div className="flex items-center gap-3">
                      {imgPreview && <img src={imgPreview} alt="" className="w-20 h-14 object-cover rounded-xl border border-slate-100"/>}
                      <div className="flex-1">
                        <input type="file" ref={fileRef} accept="image/*" className="hidden"
                          onChange={e => { const f=e.target.files?.[0]; if(f){setImgFile(f);setImgPreview(URL.createObjectURL(f))} }}/>
                        <Btn variant="secondary" small onClick={()=>fileRef.current?.click()}>
                          <Upload size={12}/> Upload Image
                        </Btn>
                        {imgFile && <p className="text-[10px] text-green-600 mt-1">✓ {imgFile.name}</p>}
                      </div>
                    </div>
                    <div className="mt-2">
                      <input value={form.image_url} onChange={e=>{setForm({...form,image_url:e.target.value});setImgPreview(e.target.value)}} placeholder="Or paste image URL..." className={inputCls}/>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Btn onClick={handleSave} disabled={saving || !form.name || !form.location || !form.price} full>
                      {saving ? 'Saving...' : <><Check size={14}/> Save Property</>}
                    </Btn>
                    <Btn variant="secondary" onClick={()=>setFormOpen(false)}>Cancel</Btn>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Property list */}
            <div className="space-y-3">
              {props.map(p => (
                <motion.div key={p.id} layout initial={{opacity:0}} animate={{opacity:1}}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm">{p.name}</h3>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">{p.type}</span>
                      {p.is_featured && <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Featured</span>}
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{p.location}</p>
                    <p className="text-sm font-bold text-blue-600">{p.price}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <Btn variant="ghost" small onClick={()=>openEdit(p)}><Edit2 size={12}/></Btn>
                    <Btn variant="danger" small onClick={()=>setDeleting(p.id)}><Trash2 size={12}/></Btn>
                  </div>
                </motion.div>
              ))}
              {props.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-3xl mb-2">🏠</div>
                  <p className="text-sm font-medium">No properties yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FEATURED TAB */}
        {tab === 'featured' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Featured Properties</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select up to 5 properties to show on the homepage</p>
              </div>
              <div className="flex items-center gap-2">
                {saveFeaturedState === 'saved' && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check size={12}/>Saved!</span>}
                <Btn onClick={handleSaveFeatured} disabled={saveFeaturedState==='saving'}>
                  {saveFeaturedState==='saving' ? 'Saving...' : 'Save Featured'}
                </Btn>
              </div>
            </div>

            {/* Slots preview */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1,2,3,4,5].map(i => {
                const p = props.find(p => p.id === featuredIds[i-1]);
                return (
                  <div key={i} className={`rounded-xl p-2 text-center border text-[10px] font-bold ${p ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-dashed border-slate-200 text-slate-300'}`}>
                    <div className="mb-1">#{i}</div>
                    <div className="truncate text-[9px]">{p ? p.name?.split(' ')[0] : 'Empty'}</div>
                  </div>
                );
              })}
            </div>

            <div className={`text-xs font-semibold px-3 py-2 rounded-xl mb-4 flex items-center gap-2 ${featuredIds.length >= 5 ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
              <Star size={12}/> {featuredIds.length}/5 selected{featuredIds.length < 5 ? ` — pick ${5-featuredIds.length} more` : ' — ready!'}
            </div>

            <div className="space-y-2.5">
              {props.map(p => {
                const isSel = featuredIds.includes(p.id);
                const order = featuredIds.indexOf(p.id) + 1;
                return (
                  <motion.div key={p.id} layout
                    onClick={() => toggleFeatured(p.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${isSel ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-100 hover:bg-slate-50'} ${!isSel && featuredIds.length >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${isSel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {isSel ? order : '+'}
                    </div>
                    {p.image_url && <img src={p.image_url} alt="" className="w-10 h-8 object-cover rounded-lg flex-shrink-0"/>}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{p.name}</div>
                      <div className="text-xs text-slate-500 truncate">{p.price} · {p.location}</div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${isSel ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{p.type}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <AnimatePresence>
        {deleting !== null && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center p-4" onClick={()=>setDeleting(null)}>
            <motion.div initial={{y:40}} animate={{y:0}} exit={{y:40}}
              className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={e=>e.stopPropagation()}>
              <div className="w-8 h-1 bg-slate-200 rounded mx-auto mb-4"/>
              <h3 className="text-base font-bold text-slate-900 mb-2">Delete Property</h3>
              <p className="text-sm text-slate-500 mb-5">This will permanently remove the property.</p>
              <div className="flex gap-2">
                <Btn variant="danger" full onClick={()=>handleDelete(deleting!)}>Delete</Btn>
                <Btn variant="secondary" full onClick={()=>setDeleting(null)}>Cancel</Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
