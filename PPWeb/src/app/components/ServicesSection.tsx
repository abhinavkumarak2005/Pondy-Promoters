import { Home, FileSearch, Calculator, MapPin } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: Home,
      title: 'Property Buying Assistance',
      description: 'Expert guidance in finding and purchasing the perfect property that matches your requirements.',
    },
    {
      icon: FileSearch,
      title: 'Property Research & Analysis',
      description: 'In-depth market research and legal analysis to help you make informed investment decisions.',
    },
    {
      icon: Calculator,
      title: 'Financial Planning',
      description: 'Tailored financial advice and ROI calculations to optimize your real estate portfolio.',
    },
    {
      icon: MapPin,
      title: 'Location Insights',
      description: 'Detailed analysis of emerging hotspots and neighborhood trends in Pondicherry.',
    },
  ];

  return (
    <section ref={ref} id="services" className="bg-[var(--background)] py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-6 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            className="text-[var(--primary)] font-bold tracking-widest uppercase text-xs mb-3 block"
          >
            Our Expertise
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl text-[var(--foreground)] mb-4 sm:mb-6 font-heading font-medium"
          >
            Comprehensive Services
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1 w-24 bg-[var(--primary)] mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[var(--muted-foreground)] font-body max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Tailored real estate solutions designed for your success, backed by years of local market dominance.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative bg-white p-3.5 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-500 overflow-hidden flex flex-col min-h-[120px] md:min-h-0"
              >
                {/* Hover Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Decorative Circle in Background */}
                <div className="hidden md:block absolute -right-12 -top-12 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col flex-grow">
                  {/* Icon Container */}
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 md:mb-8 text-blue-600 shadow-sm transition-all duration-500 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white">
                    <Icon size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5 md:w-6 md:h-6"/>
                  </div>

                  {/* Title */}
                  <h3 className="text-[11px] sm:text-sm md:text-xl text-slate-900 mb-1 md:mb-4 font-heading font-bold group-hover:text-blue-700 transition-colors leading-snug">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 font-body leading-relaxed text-[10px] sm:text-xs md:text-sm mb-2 md:mb-4 flex-grow">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}