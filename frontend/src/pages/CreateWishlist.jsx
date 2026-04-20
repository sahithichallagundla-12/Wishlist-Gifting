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
            {/* Background Glows Removed */}

            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>

            <div className="glass-panel p-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C00645]"></div>
                
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#E7CDCE] shadow-inner mb-4">
                        <Sparkles className="text-[#C00645]" size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gradient">Create New Registry</h2>
                    <p className="text-gray-600 font-medium mt-2">Design a beautiful collection for your special moment</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs uppercase font-black tracking-widest text-gray-400 ml-1">
                                <Type size={14} /> Occasion Title
                            </label>
                            <input
                                type="text"
                                className="glass-input w-full px-5 py-4 rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-500"
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
                                className="glass-input w-full px-5 py-4 rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-500"
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
                            className="glass-input w-full px-5 py-4 rounded-2xl text-sm font-bold text-gray-800 placeholder-gray-500 min-h-[120px]"
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share a short note with your loved ones about this amazing milestone..."
                        ></textarea>
                    </div>

                    <div className="bg-[#E7CDCE]/30 backdrop-blur-sm p-6 rounded-3xl border border-[#EAA8AC]/50 flex items-start gap-4 transition-all hover:bg-[#E7CDCE]/50">
                        <div className="relative flex items-center justify-center pt-1">
                            <input
                                type="checkbox"
                                id="isPublic"
                                className="peer h-6 w-6 text-[#C00645] focus:ring-[#D05D65] border-gray-300 rounded-lg cursor-pointer transition-all border-2"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                        </div>
                        <label htmlFor="isPublic" className="flex-1 cursor-pointer select-none">
                            <div className="flex items-center gap-2 mb-1">
                                {isPublic ? <Globe size={16} className="text-[#C00645]" /> : <Lock size={16} className="text-gray-400" />}
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
                            className="flex-1 btn-primary py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            <Plus size={20} strokeWidth={3} /> Create Registry
                        </motion.button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/dashboard')} 
                            className="px-8 py-4 glass-button text-gray-700 rounded-2xl font-bold text-sm"
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
