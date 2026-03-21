import { Shield, Award, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Shield,
      title: '100% Legal Certainty',
      description: 'We conduct 40+ point legal checks on every property. Zero ambiguity, total peace of mind.',
    },
    {
      icon: TrendingUp,
      title: 'High-Yield ROI',
      description: 'Our data-driven approach identifies properties poised for maximum appreciation and rental returns.',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'A personal relationship manager is assigned to you, ensuring a smooth journey from visit to registration.',
    },
    {
      icon: Award,
      title: 'Market Leadership',
      description: 'Leverage our 15+ years of dominance in Pondicherry real estate to get exclusive access and best deals.',
    },
  ];

  return (
    <section ref={ref} className="bg-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Image/Visual Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000&auto=format&fit=crop"
                alt="Luxury Modern Villa"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-lg font-medium italic">"The process was incredibly smooth. Pondy Promoters handled everything."</p>
                <div className="flex items-center gap-2 mt-4 text-white/90">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-sm font-bold tracking-wide uppercase">Verified Review</span>
                </div>
              </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-[var(--primary)]/10 rounded-3xl -z-10" />
          </motion.div>

          {/* Right: Content & Grid */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-xs mb-3 block">Other Agencies vs Us</span>
              <h2 className="text-4xl sm:text-5xl text-[var(--foreground)] font-heading font-medium leading-tight mb-6">
                Why we are the <br /><span className="text-[var(--primary)]">Gold Standard.</span>
              </h2>
              <p className="text-[var(--muted-foreground)] font-body text-lg leading-relaxed">
                We don't just sell properties; we curate legacies. Our commitment to transparency and excellence sets us apart in a crowded market.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    className="flex flex-col gap-3 group"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">{feature.title}</h4>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}