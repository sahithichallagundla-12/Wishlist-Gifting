import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Gift, Heart, Sparkles } from 'lucide-react';
import Login from './Login';

function Landing() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-transparent">
            {/* Background Glows Removed for Minimal UI */}

            {/* Part 1: Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 pb-32 z-10">
                
                {/* Floating Elements (Subtle Icons) */}
                <motion.div 
                    animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute top-32 left-[10%] lg:left-[15%] hidden md:flex items-center justify-center opacity-20"
                >
                    <Gift size={64} strokeWidth={1} className="text-gray-600" />
                </motion.div>

                <motion.div 
                    animate={{ y: [0, -30, 0], rotate: [0, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.5 }}
                    className="absolute top-40 right-[10%] lg:right-[15%] hidden lg:flex items-center justify-center opacity-15"
                >
                    <Heart size={80} strokeWidth={1} className="text-[#C00645]" />
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 25, 0], rotate: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1.2 }}
                    className="absolute bottom-40 right-[15%] lg:right-[20%] hidden md:flex items-center justify-center opacity-20"
                >
                    <Sparkles size={56} strokeWidth={1} className="text-gray-500" />
                </motion.div>

                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-gray-700 font-bold mb-6 text-sm border-white/50!">
                            <Sparkles size={16} /> Welcome to the New Standard
                        </span>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
                    >
                        Create and Share <br/>
                        <span className="text-gradient">
                            Meaningful Gifts
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed"
                    >
                        Curate your personal wishlist, reserve beautiful gifts for your loved ones, and experience the joy of seamless gifting in a modern, elegant space.
                    </motion.p>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    className="absolute bottom-10 flex flex-col items-center text-gray-400 font-medium tracking-widest text-xs uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <span className="mb-2">Scroll To Enter</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ChevronDown size={24} className="text-gray-400" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Part 2: Login Section Layered Below */}
            <section className="relative min-h-screen flex items-center justify-center p-6 z-20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="w-full"
                >
                    <Login embedded={true} />
                </motion.div>
            </section>
        </div>
    );
}

export default Landing;
