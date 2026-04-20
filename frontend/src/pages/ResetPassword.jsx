import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.put(`http://localhost:5000/api/users/resetpassword/${token}`, { password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
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
                <div className="glass-panel p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C00645]"></div>
                    
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4">
                            <Lock className="text-[#C00645]" size={32} />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gradient">Set New Password</h2>
                        <p className="text-gray-600 font-medium mt-2">Enter your new secure password below</p>
                    </div>

                    {success ? (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-inner">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successfully</h3>
                            <p className="text-gray-500 font-medium">Redirecting you to login page...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold border border-red-100 text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="space-y-5">
                                <div>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="glass-input w-full px-5 py-4 rounded-xl text-gray-800 placeholder-gray-500 font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        className="glass-input w-full px-5 py-4 rounded-xl text-gray-800 placeholder-gray-500 font-medium"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full btn-primary font-bold py-4 rounded-xl mt-2 flex justify-center items-center gap-2 disabled:opacity-75"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} /> Updating Password...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default ResetPassword;
