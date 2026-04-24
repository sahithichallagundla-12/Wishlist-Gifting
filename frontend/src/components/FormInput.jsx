import React from 'react';

function FormInput({ label, type = 'text', placeholder, value, onChange, required = false, error }) {
    return (
        <div>
            {label && (
                <label className="block text-xs uppercase font-black tracking-wider text-gray-500 mb-2">
                    {label} {required && <span className="text-[#C00645]">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C00645]/20 focus:border-[#C00645] text-sm font-medium outline-none transition"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

export default FormInput;
