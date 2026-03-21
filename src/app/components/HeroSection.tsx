import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Home, ChevronDown, Phone, MessageCircle, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useProperties } from '../context/PropertyContext';

const TYPES = ['All Properties', 'Beachfront Plot', 'Luxury Villa', 'Apartment', 'Commercial Land', 'Bungalow'];

// SVG architectural shapes that give a real estate feel
function ArchBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Deep navy gradient base — premium real estate feel */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 30%, #0f2d54 55%, #0a1e38 80%, #060d1a 100%)'
      }}/>

      {/* Warm amber glow — sunrise / golden hour over Pondicherry */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 60% at 60% 70%, rgba(251,146,60,0.18) 0%, transparent 60%)',
      }}/>

      {/* Cool blue accent — sky reflection on water */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 40% at 20% 30%, rgba(56,189,248,0.12) 0%, transparent 55%)',
      }}/>

      {/* Fine grid — architectural blueprint feel */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}/>

      {/* Floating house/building silhouette shapes */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" style={{ height: '45%', opacity: 0.06 }} viewBox="0 0 1400 300" preserveAspectRatio="xMidYMax slice">
        {/* Cityscape silhouette */}
        <path d="M0,300 L0,200 L60,200 L60,160 L80,160 L80,140 L100,140 L100,160 L120,160 L120,200 L180,200 L180,120 L200,120 L200,80 L210,70 L220,80 L220,120 L280,120 L280,180 L320,180 L320,100 L340,90 L360,100 L360,180 L400,180 L400,140 L420,140 L440,120 L460,140 L460,140 L480,140 L480,180 L540,180 L540,160 L560,160 L560,100 L580,80 L600,100 L600,160 L640,160 L640,200 L700,200 L700,130 L720,110 L740,130 L740,160 L780,160 L780,180 L820,180 L820,110 L850,90 L880,110 L880,180 L920,180 L920,200 L980,200 L980,160 L1000,150 L1020,160 L1020,180 L1060,180 L1060,120 L1080,100 L1100,120 L1100,200 L1160,200 L1160,170 L1200,170 L1200,130 L1220,110 L1240,130 L1240,200 L1300,200 L1300,170 L1340,170 L1340,180 L1400,180 L1400,300 Z" fill="white"/>
      </svg>

      {/* Abstract land plot lines — subtle */}
      <svg className="absolute top-10 right-10 opacity-[0.06]" width="300" height="300" viewBox="0 0 300 300">
        <rect x="20" y="20" width="120" height="80" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="160" y="20" width="100" height="80" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="20" y="120" width="80" height="100" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="120" y="120" width="140" height="60" fill="none" stroke="white" strokeWidth="1"/>
        <rect x="120" y="200" width="140" height="60" fill="none" stroke="white" strokeWidth="1"/>
        <line x1="0" y1="110" x2="300" y2="110" stroke="white" strokeWidth="0.5"/>
        <line x1="150" y1="0" x2="150" y2="300" stroke="white" strokeWidth="0.5"/>
      </svg>

      {/* Horizon glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(90deg, transparent, rgba(251,146,60,0.4), rgba(56,189,248,0.4), transparent)'
      }}/>

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,13,26,0.6) 100%)'
      }}/>
    </div>
  );
}

export function HeroSection() {
  const { searchQuery, setSearchQuery, searchResults, allProperties } = useProperties();
  const [propertyType, setPropertyType] = useState('All Properties');
  const [typeOpen, setTypeOpen] = useState(false);
  const [expertOpen, setExpertOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const words = ['Pondicherry', 'Beachfront', 'Luxury Villas', 'ECR Plots', 'Auroville'];

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = () => {
    setShowDropdown(false);
    document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Live suggestions — show when typing
  const suggestions = searchQuery.length >= 1
    ? searchResults.length > 0
      ? searchResults.slice(0, 6)
      : allProperties.filter(p =>
          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
    : [];

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-16">
      <ArchBackground />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl flex flex-col items-center px-2"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-[2.8rem] sm:text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold mb-3 leading-none tracking-tight text-center"
            style={{ color: '#ffffff' }}
          >
            Pondy <span style={{ color: '#38bdf8' }}>Promoters</span>
          </motion.h1>

          {/* Rotating subtitle */}
          <div className="h-8 flex items-center justify-center mb-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p key={wordIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="text-base md:text-lg font-medium tracking-[0.25em] uppercase"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                {words[wordIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full max-w-3xl mx-auto relative"
            ref={dropdownRef}
          >
            <div className="p-2 rounded-[1.8rem] flex flex-col md:flex-row gap-1.5 shadow-2xl border"
              style={{ background: 'rgba(255,255,255,0.97)', borderColor: 'rgba(255,255,255,0.3)' }}>

              {/* Location input with suggestions */}
              <div className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-[1.4rem] bg-slate-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all relative">
                <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-sm flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</label>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search area, plot type..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-transparent border-none p-0 text-slate-900 font-semibold placeholder:text-slate-300 focus:ring-0 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Property type */}
              <div className="flex-1 flex items-center gap-3 px-5 py-3.5 rounded-[1.4rem] bg-slate-50 hover:bg-white transition-colors cursor-pointer relative"
                onClick={() => setTypeOpen(o => !o)}>
                <div className="p-1.5 bg-white rounded-lg text-blue-500 shadow-sm flex-shrink-0">
                  <Home size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Property Type</label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-slate-900 flex-1 truncate">{propertyType}</span>
                    <motion.span animate={{ rotate: typeOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                    </motion.span>
                  </div>
                </div>
                <AnimatePresence>
                  {typeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white"
                      onClick={e => e.stopPropagation()}
                    >
                      {TYPES.map((t, i) => (
                        <div key={t} onClick={() => { setPropertyType(t); setTypeOpen(false); }}
                          className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center gap-2 ${i < TYPES.length - 1 ? 'border-b border-slate-50' : ''} ${t === propertyType ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${t === propertyType ? 'bg-blue-500' : 'bg-slate-200'}`}/>
                          {t}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSearch}
                className="bg-blue-600 text-white px-7 py-3.5 md:py-0 rounded-[1.4rem] font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all md:w-auto w-full text-sm"
              >
                <Search size={18} strokeWidth={2.5} />
                <span>Search</span>
              </motion.button>
            </div>

            {/* Live search dropdown */}
            <AnimatePresence>
              {showDropdown && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 right-0 mt-3 z-50 rounded-2xl overflow-hidden shadow-2xl border border-white/60"
                  style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="px-4 pt-3 pb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      {searchResults.length > 0 ? 'Best matches' : 'Suggestions'}
                    </span>
                  </div>
                  {suggestions.map((p, i) => (
                    <div key={p.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${i < suggestions.length - 1 ? 'border-b border-slate-50' : ''}`}
                      onClick={() => {
                        setSearchQuery(p.name);
                        setShowDropdown(false);
                        handleSearch();
                      }}
                    >
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        {p.image
                          ? <img src={p.image} alt={p.type} className="w-full h-full object-cover"/>
                          : <div className="w-full h-full bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center">
                              <Home size={14} className="text-blue-400"/>
                            </div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{p.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <MapPin size={10} className="text-blue-400 flex-shrink-0"/> {p.location}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">{p.price}</span>
                      </div>
                    </div>
                  ))}
                  {searchQuery && (
                    <div className="px-4 py-2.5 border-t border-slate-50">
                      <button onClick={handleSearch} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                        <Search size={11}/> See all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Talk to Expert button + popup */}
          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.0, duration:0.6 }}
            className="relative flex justify-center mt-5 sm:mt-6">

            {/* Main button */}
            <motion.button
              onClick={() => setExpertOpen(o => !o)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.22)',
                color: '#ffffff',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              }}
            >
              {/* Subtle shimmer line */}
              <motion.span className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)' }}
                animate={{ x: ['-100%','200%'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
              />
              <span className="relative w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>
              <span className="relative">Talk to an Expert</span>
              <motion.span
                animate={{ rotate: expertOpen ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="relative"
              >
                <Phone size={14} strokeWidth={2.2}/>
              </motion.span>
            </motion.button>

            {/* Popup options */}
            <AnimatePresence>
              {expertOpen && (
                <>
                  {/* Dim overlay — only covers the hero section, not full page */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-40"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
                    onClick={() => setExpertOpen(false)}
                  />

                  {/* Options */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: 12 }}
                    transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute top-full mt-3 z-50 flex flex-row gap-3"
                    style={{ transformOrigin: 'top center' }}
                  >
                    {/* WhatsApp */}
                    <motion.a
                      href="https://wa.me/919092334499"
                      target="_blank" rel="noreferrer"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ delay: 0.04, duration: 0.2, ease: [0.34,1.56,0.64,1] }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setExpertOpen(false)}
                      title="WhatsApp"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(37,211,102,0.92)',
                        color: '#fff',
                        boxShadow: '0 6px 20px rgba(37,211,102,0.45)',
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </motion.a>

                    {/* Call */}
                    <motion.a
                      href="tel:+919342117850"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ delay: 0.10, duration: 0.2, ease: [0.34,1.56,0.64,1] }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setExpertOpen(false)}
                      title="Call"
                      className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer"
                      style={{
                        background: 'rgba(29,107,243,0.92)',
                        color: '#fff',
                        boxShadow: '0 6px 20px rgba(29,107,243,0.45)',
                      }}
                    >
                      <Phone size={22} strokeWidth={2}/>
                    </motion.a>


                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10 flex-wrap justify-center px-4">
            {[['100 Cr+','Properties Managed'],['2000+','Happy Clients'],].map(([num,label])=>(
              <div key={label} className="text-center">
                <div className="text-xl font-extrabold" style={{ color:'#38bdf8' }}>{num}</div>
                <div className="text-[10px] uppercase tracking-widest font-medium mt-0.5" style={{ color:'rgba(255,255,255,0.4)' }}>{label}</div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        style={{ color: 'rgba(255,255,255,0.25)' }}
      >
        <span className="text-[9px] uppercase tracking-widest font-bold">Scroll to Explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"/>
      </motion.div>
    </section>
  );
}
