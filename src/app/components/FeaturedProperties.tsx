import { MapPin, ArrowRight, BedDouble, Bath, Maximize, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProperties } from '../context/PropertyContext';
import { useState, useRef } from 'react';

export function FeaturedProperties({ onViewAll }: { onViewAll?: () => void }) {
  const { properties, searchQuery, searchResults } = useProperties();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayProps = searchQuery && searchResults.length > 0 ? searchResults : properties;

  const next = () => setActiveIndex(p => (p + 1) % displayProps.length);
  const prev = () => setActiveIndex(p => (p - 1 + displayProps.length) % displayProps.length);

  const getCardStyle = (index: number) => {
    const total = displayProps.length;
    let offset = (index - activeIndex + total) % total;
    if (offset > total / 2) offset -= total;
    const abs = Math.abs(offset);
    return {
      isVisible: abs <= 2,
      zIndex: 10 - abs,
      scale: 1 - abs * 0.1,
      opacity: 1 - abs * 0.3,
      x: `${offset * 110}%`,
      rotateY: offset * -15,
    };
  };

  const handleViewAll = () => {
    if (onViewAll) onViewAll();
    else { window.location.hash = '#all-properties'; window.scrollTo({ top: 0, behavior: 'instant' }); }
  };

  // Shared card content — used by both mobile scroll and desktop carousel
  const CardContent = ({ property }: { property: typeof displayProps[0] }) => (
    <div className="w-full h-full bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-[52%] m-3 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"/>
        {property.image
          ? <img src={property.image} alt={property.name} className="w-full h-full object-cover"/>
          : <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background:'linear-gradient(135deg,#0d2030,#1a3a4a)' }}>
              <span className="opacity-60">🏠</span>
            </div>
        }
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/15 backdrop-blur-md border border-white/25 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            {property.tag || 'Featured'}
          </span>
        </div>
        <div className="absolute bottom-4 left-5 z-20">
          <p className="text-white text-2xl font-heading font-bold drop-shadow-md">{property.price}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-2 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="text-xl text-slate-900 font-heading font-bold">{property.name || property.type}</h3>
          <div className="flex items-center gap-1.5 text-slate-500 mt-1">
            <MapPin size={13} className="text-blue-500 flex-shrink-0"/>
            <span className="text-xs font-medium line-clamp-1">{property.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 py-2.5 border-t border-slate-100 mb-3">
          {property.specs.beds > 0 && <SpecPill icon={<BedDouble size={14}/>} val={`${property.specs.beds} Beds`}/>}
          {property.specs.baths > 0 && <SpecPill icon={<Bath size={14}/>} val={`${property.specs.baths} Baths`}/>}
          {property.specs.sqft && <SpecPill icon={<Maximize size={14}/>} val={`${property.specs.sqft} ft²`}/>}
        </div>
        <div className="mt-auto flex flex-col gap-2">
          <motion.a
            href={property.instagram_link || 'https://www.instagram.com/pondy.promoters'}
            target="_blank" rel="noreferrer"
            whileTap={{ scale:0.98 }}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors text-sm">
            View Details <ArrowRight size={16}/>
          </motion.a>
          <motion.a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
            whileTap={{ scale:0.98 }}
            className="w-full bg-blue-50 text-blue-700 border border-blue-200 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Request Visit
          </motion.a>
        </div>
      </div>
    </div>
  );

  return (
    <section id="properties" className="bg-slate-50 py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[700px] sm:min-h-[800px] md:min-h-[900px]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"/>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"/>
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent pointer-events-none"/>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-5 px-2">
          <motion.div initial={{ opacity:0,x:-30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block">Exclusive Listings</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-900 font-heading font-semibold leading-tight">Featured Properties</h2>
            {searchQuery && (
              <p className="mt-2 text-slate-500 text-sm">
                <span className="font-semibold text-slate-700">{displayProps.length}</span> results for "<span className="font-semibold text-blue-600">{searchQuery}</span>"
              </p>
            )}
          </motion.div>
          <motion.div initial={{ opacity:0,x:30 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true }} transition={{ duration:0.8,delay:0.2 }}
            className="flex items-center gap-3">
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={handleViewAll}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 transition-all shadow-md">
              <LayoutGrid size={15}/> View All
            </motion.button>
          </motion.div>
        </div>

        {/* ── MOBILE: native horizontal scroll with snap ── */}
        <div className="md:hidden">
          {displayProps.length > 0 ? (
            <>
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  paddingLeft: 4,
                  paddingRight: 4,
                }}
              >
                <style>{`.snap-scroll::-webkit-scrollbar { display: none; }`}</style>
                {displayProps.map((property) => (
                  <div
                    key={property.id}
                    className="flex-shrink-0"
                    style={{
                      width: 'calc(85vw)',
                      maxWidth: 320,
                      scrollSnapAlign: 'center',
                      height: 500,
                    }}
                  >
                    <CardContent property={property}/>
                  </div>
                ))}
              </div>
              {/* Swipe hint */}
              <p className="text-center text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-2">
                Swipe to explore
              </p>
            </>
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-3xl border border-white/60">
              <MapPin size={24} className="text-slate-300 mx-auto mb-3"/>
              <h3 className="text-base font-bold text-slate-700 mb-1">No properties found</h3>
              <p className="text-slate-500 text-sm">Try a different search term</p>
            </div>
          )}
        </div>

        {/* ── DESKTOP: 3D carousel with buttons ── */}
        <div className="relative hidden md:flex h-[580px] items-center justify-center overflow-visible" style={{ perspective:'1000px' }}>
          {displayProps.length > 0 ? (
            <div className="relative w-full h-full max-w-[460px] lg:max-w-[520px] mx-auto flex items-center justify-center">
              <AnimatePresence>
                {displayProps.map((property, index) => {
                  const s = getCardStyle(index);
                  if (!s.isVisible) return null;
                  return (
                    <motion.div key={property.id} initial={false}
                      animate={{ x:s.x, scale:s.scale, opacity:s.opacity, zIndex:s.zIndex, rotateY:s.rotateY }}
                      transition={{ duration:0.55, ease:[0.32,0.72,0,1] }}
                      className="absolute top-0 bottom-0 w-full" style={{ transformStyle:'preserve-3d' }}>
                      <CardContent property={property}/>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="w-full text-center py-20 bg-white/50 rounded-[2.5rem] border border-white/60 mx-4">
              <MapPin size={28} className="text-slate-300 mx-auto mb-3"/>
              <h3 className="text-lg font-bold text-slate-700 mb-1">No properties found</h3>
              <p className="text-slate-500 text-sm">Try a different search term</p>
            </div>
          )}

          {displayProps.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-slate-700 hover:bg-white hover:text-blue-600 transition-all border border-white/40">
                <ChevronLeft size={22}/>
              </button>
              <button onClick={next} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 p-3.5 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-slate-700 hover:bg-white hover:text-blue-600 transition-all border border-white/40">
                <ChevronRight size={22}/>
              </button>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-50">
                {displayProps.map((_, i) => (
                  <button key={i} onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i===activeIndex ? 'bg-blue-600 w-7' : 'bg-slate-300 w-2 hover:bg-slate-400'}`}/>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom link */}
        <div className="text-center mt-10 md:mt-16">
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={handleViewAll}
            className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 border-b-2 border-blue-200 pb-0.5 hover:border-blue-600 transition-colors">
            Browse all properties <ArrowRight size={15}/>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

function SpecPill({ icon, val }: { icon: React.ReactNode; val: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-0.5 p-2 rounded-2xl bg-slate-50 border border-slate-100">
      <span className="text-slate-400">{icon}</span>
      <span className="text-xs font-bold text-slate-700">{val}</span>
    </div>
  );
}
