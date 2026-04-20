import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Gift, LogOut, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api/wishlists/';

function Dashboard() {
    const [wishlists, setWishlists] = useState([]);
    const [fetching, setFetching] = useState(true);
    const { user, logout, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchWishlists();
        }
    }, [user, authLoading, navigate]);

    const fetchWishlists = async () => {
        setFetching(true);
        try {
            const res = await axios.get(API_URL);
            setWishlists(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Framer motion variants for staggered grid
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const getGradientByIndex = (index) => {
        const gradients = [
            "from-slate-50 to-slate-200/50",
            "from-indigo-50 to-indigo-100/40",
            "from-rose-50 to-rose-100/40",
            "from-amber-50 to-amber-100/40",
            "from-emerald-50 to-emerald-100/40"
        ];
        return gradients[index % gradients.length];
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full relative min-h-screen pt-4"
        >
            <div className="bg-glow-purple"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-200/60 z-10 relative">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Registries</h2>
                    <p className="text-gray-500 font-medium mt-1">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <Link to="/create-wishlist" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 hover:bg-black hover:scale-105 transition-all transform font-medium">
                        <PlusCircle size={20} /> Create Wishlist
                    </Link>
                    <button onClick={handleLogout} className="glass-card text-gray-700 px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-all font-medium">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </div>

            {authLoading || fetching ? (
                <div className="flex justify-center items-center py-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : wishlists.length === 0 ? (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-20 glass-card rounded-3xl border border-white/60 text-gray-500 max-w-2xl mx-auto mt-10"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-pink-50 mb-6 shadow-inner">
                        <Gift className="text-pink-400" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Your collection is empty</h3>
                    <p className="mt-2 mb-8 text-gray-500 max-w-md mx-auto">Start curating beautiful gifts for your next big occasion. It's time to build your dream wishlist.</p>
                    <Link to="/create-wishlist" className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all font-bold text-lg inline-flex items-center gap-2">
                        <PlusCircle size={22} /> Start Curating
                    </Link>
                </motion.div>
            ) : (
                <motion.div 
                    key={wishlists.length}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
                >
                    {wishlists.map((wl, index) => (
                        <motion.div key={wl._id} variants={itemVariants} whileHover={{ y: -8 }}>
                            <Link to={`/wishlists/${wl._id}`} className="block h-full block group overflow-hidden rounded-3xl bg-gray-900 relative shadow-xl hover:shadow-2xl transition-all duration-300">
                                {/* Simulated Background Image using Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${getGradientByIndex(index)} opacity-40 group-hover:scale-110 transition-transform duration-700 ease-out`}></div>
                                
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                                {/* Glass Overlay Content */}
                                <div className="relative h-full flex flex-col justify-end p-6">
                                    <div className="glass-card p-6 rounded-2xl w-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{wl.title}</h3>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${wl.isPublic ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                                {wl.isPublic ? "Public" : "Private"}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{wl.description || 'No description provided.'}</p>
                                        
                                        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm group-hover:gap-3 transition-all">
                                            Manage Collection &rarr;
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

export default Dashboard;
