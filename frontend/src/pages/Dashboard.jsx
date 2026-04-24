import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Gift, LogOut, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner, GlassButton } from '../components';

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
            "from-[#F9F6F0] to-[#EFE8E0]/90",
            "from-[#EFE8E0] to-[#E3D5CA]/80",
            "from-[#E3D5CA] to-[#D5BDAF]/80",
            "from-[#D5BDAF] to-[#BCA394]/70",
            "from-[#BCA394] to-[#9B7664]/60"
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
            {/* Background Glows Removed */}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-200/60 z-10 relative">
                <div>
                    <h2 className="text-3xl font-extrabold text-gradient tracking-tight">Your Registries</h2>
                    <p className="text-gray-600 font-medium mt-1">Welcome back, {user?.name}</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <Link to="/create-wishlist" className="btn-primary px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-2 font-medium">
                        <PlusCircle size={20} /> Create Wishlist
                    </Link>
                    <GlassButton onClick={handleLogout}>
                        <LogOut size={20} /> Logout
                    </GlassButton>
                </div>
            </div>

            {authLoading || fetching ? (
                <LoadingSpinner />
            ) : wishlists.length === 0 ? (
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-20 glass-panel rounded-3xl text-gray-500 max-w-2xl mx-auto mt-10 shadow-lg"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#F5EBE0] mb-6 shadow-inner">
                        <Gift className="text-[#9B7664]" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Your collection is empty</h3>
                    <p className="mt-2 mb-8 text-gray-500 max-w-md mx-auto">Start curating beautiful gifts for your next big occasion. It's time to build your dream wishlist.</p>
                    <Link to="/create-wishlist" className="btn-primary px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2">
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
                            <Link to={`/wishlists/${wl._id}`} className="block h-full group overflow-hidden rounded-3xl glass-panel relative transition-all duration-300 hover:shadow-lg border border-[#EAA8AC]/30">
                                {/* Soft Pink Tinted Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#EAA8AC]/5 to-[#C00645]/5 group-hover:from-[#EAA8AC]/10 group-hover:to-[#C00645]/10 transition-colors"></div>

                                <div className="relative h-full flex flex-col p-8">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#C00645] transition-colors">{wl.title}</h3>
                                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full ${wl.isPublic ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                            {wl.isPublic ? "Public" : "Private"}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">{wl.description || 'No description provided.'}</p>
                                    
                                    <div className="flex items-center gap-2 text-[#C00645] font-bold text-sm group-hover:gap-3 transition-all mt-auto pt-2">
                                        Manage Collection &rarr;
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
