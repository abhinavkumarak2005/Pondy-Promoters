import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer style={{ background: '#07090f' }} className="border-t border-white/5">

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 md:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Pondy Promoters" className="w-9 h-9 rounded-full object-cover"/>
              <div>
                <div className="font-bold text-[15px] text-white" style={{ letterSpacing: '-0.02em' }}>
                  Pondy <span style={{ color: '#4da6ff' }}>Promoters</span>
                </div>
                <div className="text-[8px] uppercase tracking-widest text-white/30 font-semibold">Real Estate</div>
              </div>
            </div>
            <p className="text-sm font-light leading-relaxed mb-5 max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Your trusted partner for premium real estate and land investments in Pondicherry. Transparency, trust, and decades of expertise.
            </p>

            {/* Social */}
            <div className="flex gap-2.5 mb-6">
              <a href="https://www.instagram.com/pondy.promoters?igsh=bmRzOHFiY2dpcDhx" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#e1306c'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(225,48,108,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <Instagram size={16}/>
              </a>
              <a href="#"
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#4da6ff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(77,166,255,0.35)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <Facebook size={16}/>
              </a>
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/919092334499" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25D366' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.14)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.08)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              Join our WhatsApp Group
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-5 text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Contact Us <span style={{ color: '#4da6ff', fontSize: 6 }}>■</span>
            </h4>
            <div className="space-y-4">
              {[
                { Icon: MapPin, val: 'Auroville, Pondicherry', href: null },
                { Icon: Phone, val: '+91 90923 34499', href: 'tel:+919092334499' },
                { Icon: Mail, val: 'info@pondypromoters.in', href: 'mailto:info@pondypromoters.in' },
                { Icon: Instagram, val: '@pondy.promoters', href: 'https://www.instagram.com/pondy.promoters' },
              ].map(({ Icon, val, href }) => (
                <div key={val} className="flex items-start gap-3">
                  <Icon size={15} style={{ color: '#4da6ff', marginTop: 1, flexShrink: 0 }}/>
                  {href
                    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                        className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}>{val}</a>
                    : <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{val}</p>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-5 text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              Quick Links <span style={{ color: '#4da6ff', fontSize: 6 }}>■</span>
            </h4>
            <div className="space-y-3">
              {[['About Us','about'],['Properties','properties'],['Services','services'],['Contact','contact'],['Buy / Sell Property','contact']].map(([label,id]) => (
                <button key={label} onClick={() => scrollTo(id)}
                  className="block text-sm transition-all text-left"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#4da6ff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mega wordmark */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden', paddingTop: 16 }}>
        <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif", fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.9, paddingLeft: 'clamp(12px,4vw,48px)', paddingBottom: 4, userSelect: 'none', display: 'flex', gap: '0.15em' }}>
          <span style={{ color: 'rgba(255,255,255,0.06)', fontSize: 'clamp(32px,8vw,130px)', whiteSpace: 'nowrap' }}>PONDY</span>
          <span style={{ color: 'rgba(77,166,255,0.1)', fontSize: 'clamp(32px,8vw,130px)', whiteSpace: 'nowrap' }}>PROMOTERS</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>© 2026 Pondy Promoters. All rights reserved.</p>
        <div className="flex items-center gap-5">
          {['Privacy Policy','Terms of Service'].map(l => (
            <a key={l} href="#" className="text-xs transition-colors" style={{ color: 'rgba(255,255,255,0.22)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.22)'}>{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}
