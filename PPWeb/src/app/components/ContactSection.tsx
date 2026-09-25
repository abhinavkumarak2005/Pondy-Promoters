import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail, Phone, User, Home, Calendar, MessageCircle } from 'lucide-react';

export function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} id="contact" className="py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Main Container with Deep Blue Gradient */}
                <div className="relative bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E293B] rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">

                    {/* Impressive Corner Lighting & Depth Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Vibrant Top-Left Glow - The main light source */}
                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/40 rounded-full blur-[100px] mix-blend-screen contrast-125" />

                        {/* Secondary Accent Glow to create dimension */}
                        <div className="absolute top-20 -left-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-[80px] mix-blend-screen" />

                        {/* Subtle grid pattern for texture */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />

                        {/* Bottom Right ambient glow (behind form) */}
                        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
                    </div>

                    {/* Left Content Side */}
                    <div className="w-full lg:w-5/12 p-6 sm:p-10 md:p-16 flex flex-col justify-center relative z-10 text-white">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-heading font-bold mb-3 sm:mb-5 leading-tight">
                                Let's Talk <br /><span className="text-blue-400">Real Estate</span>
                            </h2>
                            <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 leading-relaxed font-body">
                                We are committed to providing you with exceptional service and expert guidance throughout your property journey in Pondicherry.
                            </p>

                            <div className="space-y-3 sm:space-y-5">
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
                                        <Phone className="text-white" size={20} />
                                    </div>
                                    <span className="text-sm sm:text-base md:text-lg font-medium">+91 90923 34499</span>
                                </div>
                                <div className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
                                        <Mail className="text-white" size={20} />
                                    </div>
                                    <span className="text-sm sm:text-base md:text-lg font-medium">info@pondypromoters.in</span>
                                </div>
                                <a
                                    href="https://chat.whatsapp.com/FEY04aGh5rX45L1Tx8Qy2Q"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 group cursor-pointer"
                                >
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500 transition-colors duration-300 flex-shrink-0">
                                        <MessageCircle className="text-white" size={20} />
                                    </div>
                                    <span className="text-sm sm:text-base md:text-lg font-medium">Join our WhatsApp Group</span>
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Form Side */}
                    <div className="w-full lg:w-7/12 bg-white p-5 sm:p-8 md:p-12 lg:rounded-l-[2rem] lg:my-4 lg:mr-4 lg:rounded-[2rem] shadow-none flex items-center">
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">My full name is</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <Input
                                        placeholder="Vijay"
                                        className="pl-10 sm:pl-12 h-11 sm:h-14 bg-slate-50 border-slate-200 rounded-xl text-sm sm:text-base focus-visible:ring-blue-500 font-body placeholder:text-slate-400/80"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">I'm interested in</label>
                                    <div className="relative">
                                        <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <Input
                                            placeholder="Buying a Villa"
                                            className="pl-10 sm:pl-12 h-11 sm:h-14 bg-slate-50 border-slate-200 rounded-xl text-sm sm:text-base focus-visible:ring-blue-500 font-body placeholder:text-slate-400/80"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Date of appointment</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <Input
                                            type="date"
                                            className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl text-lg focus-visible:ring-blue-500 font-body text-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">My email address is</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <Input
                                            type="email"
                                            placeholder="vijay@example.com"
                                            className="pl-10 sm:pl-12 h-11 sm:h-14 bg-slate-50 border-slate-200 rounded-xl text-sm sm:text-base focus-visible:ring-blue-500 font-body placeholder:text-slate-400/80"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">My phone number is</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <Input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="pl-10 sm:pl-12 h-11 sm:h-14 bg-slate-50 border-slate-200 rounded-xl text-sm sm:text-base focus-visible:ring-blue-500 font-body placeholder:text-slate-400/80"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4">
                                Submit Request
                            </Button>
                        </motion.form>
                    </div>

                </div>
            </div>
        </section>
    );
}
