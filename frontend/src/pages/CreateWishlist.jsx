import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Type, AlignLeft, Globe, Lock, ArrowLeft, Plus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/wishlists/';

function CreateWishlist() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(API_URL, { title, description, eventDate, isPublic });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto mt-8 pb-20 relative"
        >
            {/* Background Glows */}
            <div className="bg-glow-pink opacity-30"></div>
            <div className="bg-glow-purple opacity-20" style={{ bottom: '-10%', right: '-10%' }}></div>

            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>

            <div className="glass-card p-10 rounded-[2.5rem] shadow-2xl border border-white/60 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-50 to-indigo-50 shadow-inner mb-4">
                        <Sparkles className="text-indigo-600" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create New Registry</h2>
                    <p className="text-gray-500 font-medium mt-2">Design a beautiful collection for your special moment</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs uppercase font-black tracking-widest text-gray-400 ml-1">
                                <Type size={14} /> Occasion Title
                            </label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold outline-none transition shadow-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Dream Wedding Registry"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs uppercase font-black tracking-widest text-gray-400 ml-1">
                                <Calendar size={14} /> Event Date
                            </label>
                            <input
                                type="date"
                                className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold outline-none transition shadow-sm text-gray-700"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs uppercase font-black tracking-widest text-gray-400 ml-1">
                            <AlignLeft size={14} /> Description
                        </label>
                        <textarea
                            className="w-full px-5 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-sm font-bold outline-none transition shadow-sm min-h-[120px]"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share a short note with your loved ones about this amazing milestone..."
                        ></textarea>
                    </div>

                    <div className="bg-indigo-50/50 backdrop-blur-sm p-6 rounded-3xl border border-indigo-100/50 flex items-start gap-4 transition-all hover:bg-indigo-50">
                        <div className="relative flex items-center justify-center pt-1">
                            <input
                                type="checkbox"
                                id="isPublic"
                                className="peer h-6 w-6 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-lg cursor-pointer transition-all border-2"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                        </div>
                        <label htmlFor="isPublic" className="flex-1 cursor-pointer select-none">
                            <div className="flex items-center gap-2 mb-1">
                                {isPublic ? <Globe size={16} className="text-indigo-600" /> : <Lock size={16} className="text-gray-400" />}
                                <span className="font-black text-gray-900 text-sm uppercase tracking-wider">Make Public</span>
                            </div>
                            <span className="text-gray-500 text-xs font-medium leading-relaxed block">
                                {isPublic 
                                    ? "Anyone with the unique link can view your registry and reserve curated gifts."
                                    : "Only you can see this registry. You can make it public later when you're ready to share."}
                            </span>
                        </label>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit" 
                            className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} strokeWidth={3} /> Create Registry
                        </motion.button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')} 
                            className="px-8 py-4 bg-white text-gray-500 border border-gray-200 rounded-2xl font-bold text-sm transition-all hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default CreateWishlist;
