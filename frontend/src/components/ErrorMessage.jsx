import React from 'react';

function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100 flex items-center justify-center">
            {message}
        </div>
    );
}

export default ErrorMessage;
