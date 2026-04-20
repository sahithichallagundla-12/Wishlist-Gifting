import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateWishlist from './pages/CreateWishlist'
import WishlistDetail from './pages/WishlistDetail'
import PublicWishlist from './pages/PublicWishlist'

// Sub-component to handle routing access and animated layouts cleanly
function AnimatedRoutes() {
  const location = useLocation();
  const isImmersivePage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Hide header on full-screen immersive pages */}
      {!isImmersivePage && (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="max-w-7xl mx-auto py-4 px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">GiftRegistry</h1>
          </div>
        </header>
      )}
      
      {/* Main container scaling - full width if immersive, otherwise boxed */}
      <main className={`flex-grow ${!isImmersivePage ? 'max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8' : 'w-full'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-wishlist" element={<CreateWishlist />} />
            <Route path="/wishlists/:id" element={<WishlistDetail />} />
            <Route path="/public/wishlists/:id" element={<PublicWishlist />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
// Eliminated old App block, safely appended via AnimatedRoutes
