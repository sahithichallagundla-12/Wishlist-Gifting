import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormInput, ErrorMessage, PrimaryButton } from '../components';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
            setMessage('A password reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-screen w-full relative overflow-hidden"
        >
            {/* Background Glows Removed */}

            <div className="w-full max-w-md mx-auto relative z-10 px-4">
                <button 
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                </button>

                <div className="glass-panel p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C00645]"></div>
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4">
                            <Mail className="text-[#C00645]" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gradient">Forgot Password?</h2>
                        <p className="text-gray-600 font-medium mt-2">Enter your email and we'll send a reset link</p>
                    </div>

                    {message && (
                        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 text-sm font-bold border border-emerald-100 text-center">
                            {message}
                        </div>
                    )}

                    <ErrorMessage message={error} />

                    {!message && (
                        <form onSubmit={onSubmit} className="space-y-6">
                            <FormInput
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <PrimaryButton type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Sending Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </PrimaryButton>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Remember your password? <Link to="/login" className="text-[#C00645] hover:text-[#A00539] transition">Sign in here</Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ForgotPassword;
