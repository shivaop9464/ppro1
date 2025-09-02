'use client';

import { useState, useEffect } from 'react';

export default function TestFixPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
  }, []);

  // Don't render anything until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Test Fix Page</h1>
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
        <h1 className="text-4xl font-bold mb-8 text-center">Test Fix Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Font and CSS Tests</h2>
            <div className="p-4 rounded-lg bg-green-100 text-green-800">
              <p className="font-medium">✅ Page loaded successfully without hydration errors</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Font Tests</h3>
              <div className="space-y-3">
                <p className="text-base font-sans">This uses font-sans class (should be Poppins)</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}