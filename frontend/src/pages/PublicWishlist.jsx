import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Gift, ExternalLink, Image as ImageIcon, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api/wishlists/';
const ITEM_API_URL = 'http://localhost:5000/api/items/';

function PublicWishlist() {
    const { id } = useParams();
    const [wishlist, setWishlist] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [reservingItemId, setReservingItemId] = useState(null);
    const [reservedBy, setReservedBy] = useState('');

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get(API_URL + id);
                setWishlist(res.data.wishlist);
                setItems(res.data.items);
            } catch (err) {
                setError('Wishlist not found or is private.');
            }
            setLoading(false);
        };
        fetchWishlist();
    }, [id]);

    const handleReserve = async (itemId) => {
        if (!reservedBy.trim()) {
            alert('Please enter your name');
            return;
        }
        try {
            const res = await axios.put(`${ITEM_API_URL}${itemId}/reserve`, { reservedBy });
            setItems(items.map(i => i._id === itemId ? res.data : i));
            setReservingItemId(null);
            setReservedBy('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reserve item');
        }
    };

    if (loading) return <div className="text-center p-12 text-gray-500">Loading wishlist...</div>;
    if (error) return <div className="text-center p-12 text-red-600 bg-red-50 rounded-lg mx-auto max-w-2xl mt-8 font-semibold">{error}</div>;

    const daysLeft = wishlist.eventDate ? Math.ceil((new Date(wishlist.eventDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto mt-6 relative pb-20"
        >
            {/* Background Glows Removed */}

            <div className="glass-card p-10 md:p-14 rounded-3xl shadow-2xl border border-white/40 mb-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#C00645]"></div>
                
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6">
                        <Gift className="text-[#C00645]" size={40} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 tracking-tight">
                        {wishlist.userId?.name ? `${wishlist.userId.name}'s Wishlist` : wishlist.title}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        {wishlist.description || "Welcome to my curated gift collection. Your presence is the greatest gift, but if you're so inclined, here are some things I'd love."}
                    </p>
                    
                    {daysLeft > 0 && (
                        <div className="mt-8 inline-flex items-center gap-2 bg-[#E7CDCE] text-[#C00645] px-6 py-2.5 rounded-full font-bold text-sm border border-[#EAA8AC] shadow-sm">
                            <span className="animate-pulse">⏳</span> {daysLeft} Days to go!
                        </div>
                    )}
                </motion.div>
            </div>

            <div className="flex items-center gap-3 mb-8 px-4">
                <Heart className="text-[#C00645]" size={24} fill="currentColor" />
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Gift Ideas</h3>
            </div>

            {items.length === 0 ? (
                <div className="text-center p-20 glass-card rounded-3xl border border-dashed border-gray-300 text-gray-500 shadow-sm mt-4">
                    <p className="text-lg font-medium">No items have been added yet. Check back soon!</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4"
                >
                    <AnimatePresence mode="popLayout">
                        {items.map(item => (
                            <motion.div 
                                key={item._id} 
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="glass-card p-6 rounded-3xl shadow-lg border border-white/60 flex flex-col h-full group transition-all duration-300"
                            >
                                <div className="flex gap-5 mb-6">
                                    {item.imageUrl ? (
                                        <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                    ) : (
                                        <div className="w-28 h-28 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-200 text-gray-300 shrink-0">
                                            <ImageIcon size={40} className="mb-1 opacity-40" />
                                            <span className="text-[10px] font-black tracking-widest text-gray-400">NO IMAGE</span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex flex-col mb-2">
                                            <h4 className="text-xl font-bold text-gray-900 mb-1 truncate" title={item.name}>{item.name}</h4>
                                            <div>
                                                {item.status === 'available' ? (
                                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2.5 py-1 rounded-md font-black tracking-widest uppercase">Available</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-400 text-[10px] px-2.5 py-1 rounded-md font-black tracking-widest uppercase">Reserved</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-3 font-medium leading-relaxed">{item.description}</p>
                                        {item.productLink && (
                                            <a href={item.productLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[#C00645] hover:text-[#A00539] font-bold text-xs group/link">
                                                View Product <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4">
                                    {item.status === 'available' ? (
                                        <div className="relative">
                                            <AnimatePresence mode="wait">
                                                {reservingItemId === item._id ? (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="flex gap-2"
                                                    >
                                                        <input 
                                                            type="text" 
                                                            placeholder="Your Name" 
                                                            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#E7CDCE] focus:border-[#C00645] text-sm font-medium outline-none transition shadow-inner"
                                                            value={reservedBy}
                                                            onChange={(e) => setReservedBy(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button 
                                                            onClick={() => handleReserve(item._id)}
                                                            className="bg-gray-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black transition text-sm shadow-md"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button 
                                                            onClick={() => setReservingItemId(null)}
                                                            className="bg-gray-100 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-200 transition text-sm font-bold"
                                                        >
                                                            ✕
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.button 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => setReservingItemId(item._id)}
                                                        className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                                                    >
                                                        Reserve Gift <ArrowRight size={18} />
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 font-bold bg-gray-50/50 rounded-2xl border border-gray-100 text-sm uppercase tracking-widest">
                                            Reserved by {item.reservedBy || 'Guest'}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </motion.div>
    );
}

export default PublicWishlist;
