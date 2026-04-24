import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { FormInput, ErrorMessage, PrimaryButton } from '../components';

function Login({ embedded = false }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const containerClasses = embedded 
        ? "w-full max-w-md mx-auto" 
        : "flex items-center justify-center min-h-[70vh] w-full max-w-md mx-auto";

    return (
        <div className={containerClasses}>
            <div className="glass-panel p-10 relative overflow-hidden group">
                {/* Decorative inner glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#C00645]"></div>
                
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-panel mb-4">
                        <LogIn className="text-[#C00645]" size={32} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gradient">Welcome Back</h2>
                    <p className="text-gray-600 font-medium mt-2">Sign in to access your luxury registry</p>
                </div>
                
                <ErrorMessage message={error} />
                
                <form onSubmit={onSubmit} className="space-y-5">
                    <FormInput
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <div>
                        <FormInput
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" className="text-xs font-semibold text-[#D05D65] hover:text-[#C00645] transition">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                    <PrimaryButton type="submit">Sign In Securely</PrimaryButton>
                </form>
                
                <div className="mt-8 text-center text-sm font-medium text-gray-500">
                    Don't have an account? <Link to="/register" className="text-[#C00645] hover:text-[#A00539] transition">Register here</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
