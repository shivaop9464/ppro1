'use client';

import { useState, useEffect } from 'react';

export default function TestCssPage() {
  const [isCssLoaded, setIsCssLoaded] = useState(false);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    // Check if CSS is loaded by looking for Tailwind classes
    const testElement = document.createElement('div');
    testElement.className = 'flex hidden';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const isFlex = computedStyle.display === 'flex';
    const isHidden = computedStyle.display === 'none';
    
    if (isFlex && isHidden) {
      setIsCssLoaded(true);
    }
    
    document.body.removeChild(testElement);
    
    // Check if font is loaded
    const poppinsFont = new FontFace('Poppins', 'url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecmNE.woff2)');
    poppinsFont.load().then(() => {
      setIsFontLoaded(true);
    }).catch(() => {
      // Check if font is already loaded
      const bodyFont = window.getComputedStyle(document.body).fontFamily;
      if (bodyFont.includes('Poppins')) {
        setIsFontLoaded(true);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          CSS and Font Loading Test
        </h1>
        
        <div className="space-y-6">
          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">CSS Loading Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCssLoaded 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isCssLoaded ? 'Loaded' : 'Not Loaded'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium">Font Loading Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isFontLoaded 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isFontLoaded ? 'Loaded' : 'Not Loaded'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Visual Test</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-500 rounded-lg"></div>
                <div className="flex-1">
                  <p className="font-bold text-lg">Primary Color Test</p>
                  <p className="text-gray-600">This should show the primary color</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 modern-card"></div>
                <div className="flex-1">
                  <p className="font-bold text-lg">Modern Card Test</p>
                  <p className="text-gray-600">This should show a modern card style</p>
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                <p className="font-bold text-white text-lg">Gradient Test</p>
                <p className="text-white/90">This should show a gradient background</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-3"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}