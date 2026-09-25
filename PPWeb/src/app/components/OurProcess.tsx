import { motion, useScroll, useSpring } from 'framer-motion';
import { Search, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';

const steps = [
    { id: '01', title: 'Search & Explore', description: 'Browse verified land listings by price, location, and potential. Filter easily with smart tools and discover plots that fit your vision. Start your journey from anywhere.', icon: Search },
    { id: '02', title: 'Book a Site Visit', description: 'Pick your favorite plots and schedule site visits online in seconds. Our team confirms quickly and arranges convenient times for you. See the potential in person.', icon: Calendar },
    { id: '03', title: 'Make your Move', description: 'Get expert help with offers, negotiations, and all the documentation. We guide you step by step, keeping everything clear and compliant. From first offer to final signature.', icon: FileText },
    { id: '04', title: 'Close & Celebrate', description: 'Sign the deal and receive your ownership documents with confidence. We ensure a smooth registration process without last-minute surprises. The land is officially yours!', icon: CheckCircle2 }
];

export function OurProcess() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <section ref={ref} className="bg-slate-50 py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div animate={{ scale:[1,1.2,1], opacity:[0.3,0.5,0.3], x:[0,50,0], y:[0,-30,0] }}
                    transition={{ duration:15, repeat:Infinity, ease:"linear" }}
                    className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"/>
                <motion.div animate={{ scale:[1,1.1,1], opacity:[0.2,0.4,0.2], x:[0,-30,0], y:[0,50,0] }}
                    transition={{ duration:12, repeat:Infinity, ease:"linear", delay:2 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"/>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"/>
                <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none"/>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-16 md:mb-24">
                    <motion.span initial={{ opacity:0,y:10 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
                        className="text-[var(--primary)] font-bold tracking-widest uppercase text-xs mb-4 block">
                        Our Process
                    </motion.span>
                    <motion.h2 initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
                        className="text-3xl sm:text-5xl md:text-6xl text-[var(--foreground)] font-heading font-medium leading-tight mb-4 sm:mb-6">
                        Your journey to <br/><span className="text-blue-600">Land Ownership</span>
                    </motion.h2>
                    <motion.p initial={{ opacity:0,y:20 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
                        className="text-slate-500 font-body text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                        We've simplified the complex process of buying land into four transparent steps.
                    </motion.p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 transform md:-translate-x-1/2 rounded-full"/>
                    <motion.div style={{ scaleY, originY:0 }}
                        className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 transform md:-translate-x-1/2 rounded-full z-0 origin-top"/>

                    <div className="space-y-12 sm:space-y-20 md:space-y-32">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div key={step.id}
                                    initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
                                    viewport={{ once:true, margin:"-80px" }} transition={{ duration:0.6, delay:index*0.1 }}
                                    className={`flex flex-col md:flex-row items-center relative ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                                    <div className={`hidden md:block absolute top-1/2 w-1/2 h-px bg-gradient-to-r from-blue-200/50 to-transparent ${isEven ? 'left-1/2' : 'right-1/2 transform rotate-180'}`}/>

                                    {/* Node */}
                                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full z-10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)] ring-4 sm:ring-8 ring-white">
                                        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-inner">
                                            {step.id}
                                        </div>
                                    </div>

                                    {/* Card */}
                                    <div className={`pl-20 sm:pl-24 md:pl-0 w-full md:w-1/2 z-10 ${isEven ? 'md:pr-24 md:text-right' : 'md:pl-24 md:text-left'}`}>
                                        <motion.div whileHover={{ y:-8, boxShadow:"0 25px 50px -12px rgba(59,130,246,0.15)" }}
                                            className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-[2rem] shadow-lg shadow-slate-200/50 border border-white/50 hover:border-blue-200 transition-all duration-500 relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
                                            <span className={`absolute -bottom-8 sm:-bottom-10 text-[6rem] sm:text-[10rem] font-bold text-slate-100/50 leading-none z-0 pointer-events-none select-none transition-transform duration-700 group-hover:scale-110 group-hover:text-blue-50/80 ${isEven ? '-left-4 sm:-left-6' : '-right-4 sm:-right-6'}`}>
                                                {step.id}
                                            </span>
                                            <div className={`relative z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm border border-blue-100 flex items-center justify-center text-blue-600 mb-4 sm:mb-8 ${isEven ? 'md:ml-auto' : ''} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-blue-300/50`}>
                                                <step.icon size={20} strokeWidth={1.5}/>
                                            </div>
                                            <h3 className="relative z-10 text-base sm:text-xl md:text-2xl font-heading font-bold text-slate-800 mb-2 sm:mb-4 group-hover:text-blue-700 transition-colors">
                                                {step.title}
                                            </h3>
                                            <p className="relative z-10 text-slate-500 font-body leading-relaxed text-xs sm:text-sm md:text-base group-hover:text-slate-600 transition-colors">
                                                {step.description}
                                            </p>
                                        </motion.div>
                                    </div>

                                    <div className="hidden md:block w-1/2"/>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
