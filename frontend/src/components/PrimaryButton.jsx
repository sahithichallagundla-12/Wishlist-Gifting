import React from 'react';
import { motion } from 'framer-motion';

function PrimaryButton({ children, onClick, disabled = false, type = 'button', className = '' }) {
    return (
        <motion.button
            whileHover={{ scale: !disabled ? 1.02 : 1 }}
            whileTap={{ scale: !disabled ? 0.98 : 1 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn-primary py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-75 disabled:scale-100 w-full ${className}`}
        >
            {children}
        </motion.button>
    );
}

export default PrimaryButton;
