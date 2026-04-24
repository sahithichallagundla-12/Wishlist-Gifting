import React from 'react';

function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C00645]"></div>
        </div>
    );
}

export default LoadingSpinner;
