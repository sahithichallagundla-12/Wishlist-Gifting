import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormInput, ErrorMessage, PrimaryButton } from '../components';

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
            {/* Background Glows Removed */}

            <div className="w-full max-w-md mx-auto relative z-10 px-4">
                <div className="glass-panel p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#C00645]"></div>
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4">
                            <UserPlus className="text-[#C00645]" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gradient">Join the Registry</h2>
                        <p className="text-gray-600 font-medium mt-2">Create an account to start curating</p>
                    </div>
                    
                    <ErrorMessage message={error} />
                    
                    <form onSubmit={onSubmit} className="space-y-5">
                        <FormInput
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <FormInput
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <FormInput
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <PrimaryButton type="submit">Create Account</PrimaryButton>
                    </form>
                    
                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account? <Link to="/login" className="text-[#C00645] hover:text-[#A00539] transition">Sign in here</Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Register;
