import { Award, Users } from 'lucide-react';
import { motion, useInView, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useRef, useEffect } from 'react';

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    duration: 2
  });

  const formattedValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{formattedValue}</motion.span>;
}

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 100, label: 'Properties Managed', suffix: 'Cr+' },
    { value: 2000, label: 'Active Clients', suffix: '+' },
    { value: 100, label: 'Client Retention Rate', suffix: '%' },
  ];

  return (
    <section ref={ref} id="about" className="bg-[var(--background)] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-[var(--primary)] font-bold tracking-widest uppercase text-xs mb-2 block">
              Who We Are
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-5xl text-[var(--foreground)] mb-4 sm:mb-6 md:mb-8 font-heading font-medium leading-tight"
            >
              Building Trust,<br />Creating <span className="text-[var(--primary)] italic">Legacies</span>.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[var(--muted-foreground)] font-body text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6"
            >
              We are Pondicherry's most trusted real estate firm, specializing in premium properties, land investments, and comprehensive property services. With over a decade of experience, we've helped thousands of clients find their dream properties and make sound real estate investments.
            </motion.p>


          </motion.div>

          {/* Right: Trust Metrics (Replaces Image) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center relative"
          >
            <div className="w-full bg-white p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
              {/* Decorative Background for Card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50/50 rounded-tr-[80px] -z-0" />

              <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10 relative z-10">
                {metrics.map((metric, index) => (
                  <div key={index} className="text-center md:text-left flex flex-col items-center md:items-start p-4 hover:bg-slate-50 rounded-xl transition-colors duration-300">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-3xl sm:text-4xl md:text-5xl text-blue-600 font-heading font-bold">
                        <AnimatedCounter value={metric.value} />
                      </span>
                      <span className="text-3xl text-blue-400 font-light">{metric.suffix}</span>
                    </div>
                    <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Border Element moved to background */}
            <div className="absolute -top-6 -right-6 w-full h-full border-2 border-blue-100 rounded-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}