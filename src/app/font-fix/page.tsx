'use client';

import { useState, useEffect } from 'react';

export default function FontFixPage() {
  const [status, setStatus] = useState('initial');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
    
    // Force a reflow to ensure CSS is applied
    if (typeof document !== 'undefined') {
      document.body.offsetHeight;
      setStatus('loaded');
    }
  }, []);

  // Don't render anything until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Font & CSS Fix Test</h1>
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Font & CSS Fix Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Status: {status}</h2>
            <div className={`p-4 rounded-lg ${status === 'loaded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <p className="font-medium">
                {status === 'loaded' ? '✅ Page loaded successfully' : '⏳ Loading...'}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Font Tests</h3>
              <div className="space-y-3">
                <p className="text-base font-sans">This uses font-sans class</p>
                <p className="text-base font-poppins">This uses font-poppins class</p>
                <p className="text-base" style={{ fontFamily: 'var(--font-poppins)' }}>This uses inline style with CSS variable</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">CSS Tests</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-500 text-white rounded">Tailwind CSS working</div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded">Gradient working</div>
                <div className="p-3 shadow-lg rounded">Shadow working</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Combined Tests</h3>
              <div className="space-y-3">
                <button className="px-4 py-2 bg-primary-600 text-white rounded font-sans hover:bg-primary-700 transition">
                  Button with font-sans
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded font-poppins hover:bg-primary-700 transition">
                  Button with font-poppins
                </button>
                <div className="p-4 bg-secondary-100 rounded font-sans">
                  Card with font-sans
                </div>
                <div className="p-4 bg-secondary-100 rounded font-poppins">
                  Card with font-poppins
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}