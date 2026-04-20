import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Share2, ExternalLink, Image as ImageIcon, Loader2, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5000/api/wishlists/';
const ITEM_API_URL = 'http://localhost:5000/api/items/';

function WishlistDetail() {
    const { id } = useParams();
    const [wishlist, setWishlist] = useState(null);
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', productLink: '', description: '' });
    const [extracting, setExtracting] = useState(false);
    const [formError, setFormError] = useState('');
    
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchData();
        }
    }, [id, user, authLoading, navigate]);

    const fetchData = async () => {
        try {
            const res = await axios.get(API_URL + id);
            setWishlist(res.data.wishlist);
            setItems(res.data.items);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                navigate('/dashboard');
            }
        }
    };

    const handleDeleteWishlist = async () => {
        if (!window.confirm(`Are you sure you want to delete "${wishlist.title}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await axios.delete(API_URL + id);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to delete registry');
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setFormError('');

        // Client-side validation
        if (!newItem.name.trim()) {
            setFormError('Product name is required');
            return;
        }
        if (!newItem.productLink.trim()) {
            setFormError('Product URL is required');
            return;
        }
        if (!isValidUrl(newItem.productLink)) {
            setFormError('Please enter a valid URL (e.g. https://amazon.com/...)');
            return;
        }

        setExtracting(true);

        try {
            const res = await axios.post(`${API_URL}${id}/items`, newItem);
            setItems([...items, res.data]);
            setNewItem({ name: '', productLink: '', description: '' });
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to add item');
        }
        
        setExtracting(false);
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`${ITEM_API_URL}${itemId}`);
            setItems(items.filter(item => item._id !== itemId));
        } catch (err) {
            console.error(err);
        }
    };

    const copyLink = () => {
        const link = `${window.location.origin}/public/wishlists/${id}`;
        navigator.clipboard.writeText(link);
        alert('Public link copied to clipboard!');
    };

    if (!wishlist) return <div className="p-8 text-center text-gray-500">Loading wishlist details...</div>;

    const daysLeft = wishlist.eventDate ? Math.ceil((new Date(wishlist.eventDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div 
            key={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl mx-auto mt-6 relative"
        >
            <div className="bg-glow-pink opacity-50"></div>
            
            <div className="glass-card p-8 md:p-10 rounded-3xl shadow-xl border border-white/40 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-100 to-transparent rounded-full blur-3xl opacity-60"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-black mb-3 text-gray-900 tracking-tight">{wishlist.title}</h2>
                    <p className="text-gray-600 mb-5 font-medium text-lg leading-relaxed max-w-2xl">{wishlist.description || 'No description'}</p>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${wishlist.isPublic ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm' : 'bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm'}`}>
                            {wishlist.isPublic ? "Public Wishlist" : "Private Wishlist"}
                        </span>
                        {daysLeft > 0 && (
                            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                                ⏳ {daysLeft} days left
                            </span>
                        )}
                    </div>
                </div>
                    <div className="flex flex-col md:flex-row gap-3 relative z-10 self-end md:self-center mt-6 md:mt-0">
                        {wishlist.isPublic && (
                            <button 
                                onClick={copyLink} 
                                className="bg-white text-indigo-600 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-50 border border-indigo-100 shadow-sm transition font-bold"
                            >
                                <Link2 size={18} /> Copy Public Link
                            </button>
                        )}
                        <button 
                            onClick={handleDeleteWishlist} 
                            className="bg-red-50 text-red-600 px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-red-100 border border-red-100 shadow-sm transition font-bold"
                        >
                            <Trash2 size={18} /> Delete Registry
                        </button>
                    </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Registry Items <span className="text-gray-400 font-medium ml-2">({items.length})</span></h3>
                    </div>
                    
                    {items.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-gray-500 bg-white/50 backdrop-blur-sm p-12 rounded-3xl border border-gray-200 border-dashed text-center shadow-sm"
                        >
                            You haven't added any items yet. Add something you want!
                        </motion.div>
                    ) : (
                        <div className="space-y-5">
                            <AnimatePresence>
                                {items.map(item => (
                                    <motion.div 
                                        key={item._id} 
                                        variants={itemVariants}
                                        exit={{ opacity: 0, x: -50 }}
                                        whileHover={{ scale: 1.01, y: -2 }}
                                        className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex justify-between items-start transition-all"
                                    >
                                        <div className="flex gap-5 flex-1">
                                            {item.imageUrl && item.imageUrl !== '' ? (
                                                <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-50 rounded-xl flex flex-col items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                                                    <ImageIcon size={32} className="opacity-50" />
                                                    <span className="text-[10px] mt-1 text-center font-bold px-1 text-gray-400 tracking-wider">NO IMG</span>
                                                </div>
                                            )}
                                            <div className="py-1">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h4 className="font-extrabold text-lg text-gray-900">{item.name}</h4>
                                                    {item.status === 'available' ? (
                                                        <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md">Available</span>
                                                    ) : (
                                                        <span className="text-[10px] uppercase font-black tracking-widest bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md">
                                                            Taken by {item.reservedBy}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-sm mb-3 line-clamp-2 pr-4">{item.description}</p>
                                                {item.productLink && (
                                                    <a href={item.productLink} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold text-sm flex items-center gap-1.5 hover:text-indigo-800 transition-colors w-fit">
                                                        Visit Product Link <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteItem(item._id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition bg-gray-50">
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                <div>
                    <div className="glass-card p-7 rounded-3xl border border-white/50 shadow-xl sticky top-28 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-indigo-500"></div>
                        <h3 className="text-xl font-extrabold mb-5 text-gray-900">Add New Gift</h3>
                        {formError && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-5 border border-red-100 font-bold">
                                {formError}
                            </motion.div>
                        )}
                        <form onSubmit={handleAddItem} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-xs uppercase font-black tracking-wider text-gray-500 mb-2 flex justify-between">
                                    Product Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sony WH-1000XM5"
                                    required
                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium outline-none transition"
                                    value={newItem.name}
                                    onChange={(e) => { setNewItem({...newItem, name: e.target.value}); setFormError(''); }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-black tracking-wider text-gray-500 mb-2 flex justify-between">
                                    <span>Product URL <span className="text-red-400">*</span></span>
                                    <span className="text-indigo-400 text-[10px] uppercase tracking-widest font-bold">✨ Auto-Image</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://amazon.com/..."
                                    required
                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium outline-none transition"
                                    value={newItem.productLink}
                                    onChange={(e) => { setNewItem({...newItem, productLink: e.target.value}); setFormError(''); }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-black tracking-wider text-gray-500 mb-2">Description (Optional)</label>
                                <textarea
                                    placeholder="Color: Black, Size: M..."
                                    className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium outline-none transition"
                                    rows="3"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                                ></textarea>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" 
                                disabled={extracting} 
                                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-75 disabled:scale-100 shadow-md"
                            >
                                {extracting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} /> Gathering Image ...
                                    </>
                                ) : (
                                    'Add to Registry'
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default WishlistDetail;
