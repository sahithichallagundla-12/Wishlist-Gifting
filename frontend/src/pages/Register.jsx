import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center min-h-screen w-full relative overflow-hidden"
        >
            {/* Background Glows (Explicitly needed here as well) */}
            <div className="bg-glow-pink"></div>
            <div className="bg-glow-purple"></div>
            <div className="bg-glow-gold"></div>

            <div className="w-full max-w-md mx-auto relative z-10 px-4">
                <div className="glass-card rounded-3xl p-10 backdrop-blur-2xl border border-white/40 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-4 shadow-sm">
                            <UserPlus className="text-indigo-600" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Join the Registry</h2>
                        <p className="text-gray-500 font-medium mt-2">Create an account to start curating</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 flex items-center justify-center">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={onSubmit} className="space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-5 py-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-gray-800 placeholder-gray-400 transition"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-5 py-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-gray-800 placeholder-gray-400 transition"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-5 py-4 bg-white/60 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none text-gray-800 placeholder-gray-400 transition"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-xl transition duration-300 transform hover:scale-[1.02] hover:shadow-xl mt-2">
                            Create Account
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 transition">Sign in here</Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Register;
