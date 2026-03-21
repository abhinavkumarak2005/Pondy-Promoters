import { motion, useSpring, useTransform, useInView, useMotionValue } from 'framer-motion';
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

export function TrustMetrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const metrics = [
    { value: 100, label: 'Crores Value Managed', suffix: 'Cr+' },
    { value: 2000, label: 'Happy Families', suffix: '+' },
    { value: 100, label: 'Legal Verification', suffix: '%' },
  ];

  return (
    <section ref={ref} className="bg-[var(--card)] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[var(--border)]">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-[var(--border)]">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center px-4 py-8 md:py-0"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-5xl md:text-6xl text-[var(--primary)] font-heading font-bold flex items-baseline">
                  <AnimatedCounter value={metric.value} />
                  <span className="text-3xl text-[var(--primary)] font-light ml-1">{metric.suffix}</span>
                </span>
              </div>
              <p className="text-[var(--muted-foreground)] text-sm uppercase tracking-widest font-body font-medium">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}