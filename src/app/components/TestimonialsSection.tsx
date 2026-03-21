import { Star, Quote } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Rajesh & Priya Kumar', location: 'Beachfront Plot Owner · Serenity Beach',
    review: 'Pondy Promoters helped us find our dream beachfront property. Their transparency and professionalism made the entire process smooth and stress-free. Highly recommend!',
    rating: 5, initial: 'R',
    bg: 'linear-gradient(135deg,#0d2030,#1a3a4a)',
  },
  {
    name: 'Arun Subramanian', location: 'NRI Investor · Apartment Owner, ECR',
    review: 'As an NRI investor, I was worried about the legal aspects. The team handled everything perfectly and kept me informed at every step. Exceptional service.',
    rating: 5, initial: 'A',
    bg: 'linear-gradient(135deg,#1a0d20,#2a1a38)',
  },
  {
    name: 'Suresh & Kavitha Nair', location: 'Villa Owner · Auroville Road',
    review: 'Their local market knowledge is exceptional. They found us a prime location property at the right price. We couldn\'t have done it without their guidance.',
    rating: 5, initial: 'S',
    bg: 'linear-gradient(135deg,#0d1a0a,#1a2810)',
  },
  {
    name: 'Meena Krishnamurthy', location: 'Land Owner · Chunnambar',
    review: 'From documentation to registration, everything was handled flawlessly. Zero hassle. The team was always responsive and went above and beyond our expectations.',
    rating: 5, initial: 'M',
    bg: 'linear-gradient(135deg,#1a1008,#2a200e)',
  },
  {
    name: 'Venkat Ramachandran', location: 'Plot Buyer · White Town',
    review: 'I purchased a heritage plot in White Town and the process was seamless. Their legal team is top-notch and the site visits were beautifully organised.',
    rating: 5, initial: 'V',
    bg: 'linear-gradient(135deg,#0a1018,#182438)',
  },
  {
    name: 'Deepa & Rajan Pillai', location: 'Apartment Owners · ECR Road',
    review: 'We were first-time buyers and nervous about everything. Pondy Promoters held our hand through every step. Now we have our dream sea-view apartment!',
    rating: 5, initial: 'D',
    bg: 'linear-gradient(135deg,#180a0a,#2e1212)',
  },
];

// Duplicate for seamless infinite loop
const ALL = [...TESTIMONIALS, ...TESTIMONIALS];

function TestiCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="flex-shrink-0 w-[240px] sm:w-[300px] md:w-[340px] mr-3 sm:mr-4 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden select-none">
      {/* Color top strip */}
      <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#3b82f6,#38bdf8)' }}/>
      <div className="p-5 sm:p-7">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400"/>)}
        </div>
        {/* Quote icon */}
        <Quote size={32} className="text-slate-100 mb-3 -scale-x-100"/>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-4">"{t.review}"</p>
        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: t.bg }}>
            {t.initial}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-none">{t.name}</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">{t.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const SPEED = 0.6; // px per frame

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Calculate half width (for seamless loop)
    const getHalfWidth = () => track.scrollWidth / 2;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += SPEED;
        const half = getHalfWidth();
        if (posRef.current >= half) posRef.current = 0;
        if (track) track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <section className="py-14 sm:py-20 md:py-24 overflow-hidden bg-white relative">
      {/* BG */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/60 rounded-full blur-3xl -z-10"/>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-14">
        <motion.div initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }}>
          <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block">Testimonials</span>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="text-2xl sm:text-3xl md:text-5xl text-slate-900 font-heading font-semibold leading-tight">
              Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Trust</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-xs text-right hidden md:block">
              Real clients, real results — from across Pondicherry and beyond.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Auto-scroll strip */}
      <div
        className="cursor-pointer"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        <div ref={trackRef} className="flex will-change-transform" style={{ width:'max-content', paddingLeft: '24px' }}>
          {ALL.map((t, i) => <TestiCard key={i} t={t}/>)}
        </div>
      </div>

      {/* Pause hint */}
      <p className="text-center text-[10px] font-medium text-slate-300 uppercase tracking-widest mt-6">
        Hover to pause
      </p>
    </section>
  );
}
