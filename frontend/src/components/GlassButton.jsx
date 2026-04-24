import React from 'react';

function GlassButton({ children, onClick, className = '' }) {
    return (
        <button
            onClick={onClick}
            className={`glass-button text-gray-700 px-5 py-2.5 rounded-xl hover:text-gray-900 font-medium transition ${className}`}
        >
            {children}
        </button>
    );
}

export default GlassButton;
