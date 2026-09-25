import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Home, ChevronDown, ArrowLeft, BedDouble, Bath, Maximize, X } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

const TYPES = ['All Types', 'Plot', 'Luxury Villa', 'Apartment', 'Commercial', 'Bungalow', 'Beach House'];

const GRAD: Record<string, string> = {
  'Plot': 'linear-gradient(135deg,#071828,#0f2a42)',
  'Luxury Villa': 'linear-gradient(135deg,#071208,#102010)',
  'Apartment': 'linear-gradient(135deg,#130a1e,#241230)',
  'Bungalow': 'linear-gradient(135deg,#181208,#2a200a)',
  'Commercial': 'linear-gradient(135deg,#0a1018,#18242a)',
};

const ACC: Record<string, string> = {
  'Plot': '#38bdf8', 'Luxury Villa': '#34d399', 'Apartment': '#a78bfa',
  'Bungalow': '#fb923c', 'Commercial': '#f59e0b',
};

const EMOJI: Record<string, string> = {
  'Plot': '🏞', 'Luxury Villa': '🏡', 'Apartment': '🏢', 'Bungalow': '🏘', 'Commercial': '🏗',
};

export function AllPropertiesPage({ onBack }: { onBack: () => void }) {
  const { allProperties } = useProperties();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All Types');
  const [typeOpen, setTypeOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const typeRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setTypeOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live suggestion logic (same relevance scoring)
  const suggestions = search.length >= 1
    ? allProperties.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  const filtered = allProperties.filter(p => {
    const matchType = type === 'All Types' || p.type === type;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  }).sort((a, b) => {
    if (!search) return 0;
    const scoreA = (a.name.toLowerCase().startsWith(search.toLowerCase()) ? 3 : 0) +
                   (a.location.toLowerCase().includes(search.toLowerCase()) ? 2 : 0) +
                   (a.type.toLowerCase().includes(search.toLowerCase()) ? 1 : 0);
    const scoreB = (b.name.toLowerCase().startsWith(search.toLowerCase()) ? 3 : 0) +
                   (b.location.toLowerCase().includes(search.toLowerCase()) ? 2 : 0) +
                   (b.type.toLowerCase().includes(search.toLowerCase()) ? 1 : 0);
    return scoreB - scoreA;
  });

  return (
    <div className="min-h-screen" style={{ background: '#f2f1eb' }}>
      {/* Header bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.95 }} onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors flex-shrink-0">
            <ArrowLeft size={18}/> Back
          </motion.button>
          <div className="h-5 w-px bg-slate-200 flex-shrink-0"/>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Pondy Promoters" className="w-7 h-7 rounded-full flex-shrink-0 object-cover"/>
            <span className="font-bold text-slate-900 text-sm">All Properties</span>
          </div>
        </div>
      </div>

      {/* Hero search */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}>
            <div className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Browse All</div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-extrabold text-slate-900 mb-2 leading-tight">
              Every Property,<br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">One Place.</span>
            </h1>
            <p className="text-slate-500 mb-8 text-sm md:text-base">{allProperties.length} properties available in Pondicherry</p>

            {/* Search + filter bar */}
            <div className="flex flex-col gap-2">
              {/* Search input with suggestions */}
              <div className="relative flex-1">
                <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search size={17} className="text-blue-500 flex-shrink-0"/>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by location, type, or name..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-900 placeholder:text-slate-300"
                  />
                  {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600"><X size={15}/></button>}
                </div>

                {/* Suggestions dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
                      transition={{ duration:0.15 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 pt-2.5 pb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Suggestions</span>
                      </div>
                      {suggestions.map((p, i) => (
                        <div key={p.id}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors ${i < suggestions.length - 1 ? 'border-b border-slate-50' : ''}`}
                          onMouseDown={() => { setSearch(p.name); setShowSuggestions(false); }}>
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" style={{ background: GRAD[p.type] || GRAD.Plot }}>
                            {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover"/> :
                              <div className="w-full h-full flex items-center justify-center text-lg">{EMOJI[p.type] || '🏠'}</div>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-slate-900 truncate">{p.name}</div>
                            <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                              <MapPin size={9} className="text-blue-400"/> {p.location}
                            </div>
                          </div>
                          <span className="text-xs font-bold text-blue-600 flex-shrink-0">{p.price}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Type filter */}
              <div ref={typeRef} className="relative md:w-52">
                <div onClick={() => setTypeOpen(o => !o)}
                  className="flex items-center gap-2 px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer hover:bg-white hover:border-blue-300 transition-all">
                  <Home size={16} className="text-blue-500 flex-shrink-0"/>
                  <span className="flex-1 text-sm font-medium text-slate-700 truncate">{type}</span>
                  <motion.span animate={{ rotate: typeOpen ? 180 : 0 }} transition={{ duration:0.2 }}>
                    <ChevronDown size={14} className="text-slate-400"/>
                  </motion.span>
                </div>
                <AnimatePresence>
                  {typeOpen && (
                    <motion.div initial={{ opacity:0,y:-6 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden">
                      {TYPES.map((t, i) => (
                        <div key={t} onClick={() => { setType(t); setTypeOpen(false); }}
                          className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${i < TYPES.length-1 ? 'border-b border-slate-50' : ''} ${t === type ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${t === type ? 'bg-blue-500' : 'bg-slate-200'}`}/>
                          {t}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-6 pb-20">
        {/* Count + active filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-sm font-semibold text-slate-700">{filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'}</span>
          {search && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              "{search}"
              <button onClick={() => setSearch('')} className="hover:text-blue-800"><X size={11}/></button>
            </span>
          )}
          {type !== 'All Types' && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              {type} <button onClick={() => setType('All Types')} className="hover:text-slate-900"><X size={11}/></button>
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No properties found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filter</p>
            <button onClick={() => { setSearch(''); setType('All Types'); }} className="mt-4 text-blue-600 font-bold text-sm underline">Clear filters</button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={search + type}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => {
                const acc = ACC[p.type] || '#38bdf8';
                return (
                  <motion.div key={p.id}
                    initial={{ opacity:0, y:20 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ duration:0.45, delay: Math.min(i * 0.06, 0.3) }}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <div className="h-40 sm:h-48 relative overflow-hidden" style={{ background: GRAD[p.type] || GRAD.Plot }}>
                      {p.image
                        ? <img src={p.image} alt={p.name} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">{EMOJI[p.type] || '🏠'}</div>
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
                      {p.is_featured && (
                        <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 backdrop-blur-sm">
                          ★ Featured
                        </div>
                      )}
                      <div className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white">
                        {p.tag}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 text-base mb-1 leading-snug">{p.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                        <MapPin size={11} className="text-blue-400 flex-shrink-0"/> {p.location}
                      </p>

                      {/* Specs */}
                      <div className="flex items-center gap-2 mb-4">
                        {p.specs.beds > 0 && <Spec icon={<BedDouble size={12}/>} val={`${p.specs.beds} Beds`}/>}
                        {p.specs.baths > 0 && <Spec icon={<Bath size={12}/>} val={`${p.specs.baths} Baths`}/>}
                        {p.specs.sqft && <Spec icon={<Maximize size={12}/>} val={`${p.specs.sqft} ft²`}/>}
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-50">
                        <span className="font-extrabold text-base" style={{ color: acc }}>{p.price}</span>
                        <a href="#contact"
                          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-blue-600 transition-colors">
                          Enquire
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function Spec({ icon, val }: { icon: React.ReactNode; val: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
      <span className="text-slate-400">{icon}</span> {val}
    </div>
  );
}
