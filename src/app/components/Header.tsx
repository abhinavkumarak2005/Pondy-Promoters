import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 50));

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Properties', href: '#properties' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 ${scrolled ? 'py-3' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className={`relative flex items-center justify-between rounded-full transition-all duration-500 ${
              scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 py-3 px-6'
                : 'bg-transparent py-2 px-0'
            }`}
          >
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group z-20">
              <img src="/logo.png" alt="Pondy Promoters" className="w-10 h-10 rounded-full flex-shrink-0 object-cover"/>
              <div className="flex flex-col">
                {/* "Pondy" is always white on dark hero, slate on scrolled white bar */}
                <span className={`font-heading font-bold text-[17px] leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                  Pondy <span className={scrolled ? 'text-blue-600' : 'text-sky-400'}>Promoters</span>
                </span>
                <span className={`text-[0.6rem] font-bold tracking-wider uppercase mt-0.5 ${scrolled ? 'text-slate-400' : 'text-white/40'}`}>
                  Real Estate
                </span>
              </div>
            </a>

            {/* Desktop nav pill */}
            <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-white/30 absolute left-1/2 -translate-x-1/2 shadow-sm">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href}
                  className="relative px-5 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors group">
                  <span className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-sm transition-opacity duration-200"/>
                  <span className="relative">{link.name}</span>
                </a>
              ))}
            </nav>

            {/* CTA */}
            <a href="#contact"
              className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg transition-all">
              Buy / Sell Property
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            {/* Hamburger — clean icon, no background box */}
            <button onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 transition-all"
              style={{ color: scrolled ? '#0f172a' : '#ffffff' }}>
              <Menu size={26} strokeWidth={2}/>
            </button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 bg-white" style={{ overflowY:'auto' }}>
            <div className="px-6 pt-6 pb-12">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.png" alt="Pondy Promoters" className="w-9 h-9 rounded-full object-cover"/>
                  <span className="font-bold text-slate-900 text-lg">Pondy <span className="text-blue-600">Promoters</span></span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900">
                  <X size={22}/>
                </button>
              </div>
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)}
                  className="block text-2xl font-heading font-medium text-slate-900 border-b border-slate-100 py-4 flex justify-between items-center">
                  {link.name}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              ))}
              <div className="mt-8 p-6 bg-slate-50 rounded-3xl">
                <p className="text-slate-500 mb-4 font-medium">Ready to buy or sell?</p>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg text-base">
                  Buy / Sell Property
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
