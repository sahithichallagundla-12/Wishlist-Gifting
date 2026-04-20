import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Gift, Heart, Sparkles } from 'lucide-react';
import Login from './Login';

function Landing() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#FAFAFA]">
            {/* Background Glows */}
            <div className="bg-glow-pink"></div>
            <div className="bg-glow-purple"></div>
            <div className="bg-glow-gold"></div>

            {/* Part 1: Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 pb-32 z-10">
                
                {/* Floating Elements */}
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute top-32 left-[15%] hidden md:flex glass-card p-4 rounded-2xl items-center gap-3 text-sm font-semibold text-gray-700"
                >
                    <Gift className="text-pink-500" /> Premium Experiences
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 20, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-40 right-[15%] hidden md:flex glass-card p-4 rounded-2xl items-center gap-3 text-sm font-semibold text-gray-700"
                >
                    <Heart className="text-red-500" /> Meaningful Connections
                </motion.div>

                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700 font-semibold mb-6 border border-pink-200 shadow-sm text-sm">
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
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
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
