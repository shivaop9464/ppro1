'use client';

import { useState, useEffect } from 'react';

export default function CssTestPage() {
  const [isCssWorking, setIsCssWorking] = useState(false);
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    // Check if Tailwind CSS is working by testing a simple class
    const testElement = document.createElement('div');
    testElement.className = 'flex hidden';
    document.body.appendChild(testElement);
    
    const computedStyle = window.getComputedStyle(testElement);
    const isFlex = computedStyle.display === 'flex';
    
    if (isFlex) {
      setIsCssWorking(true);
    }
    
    document.body.removeChild(testElement);
    
    // Check if Poppins font is loaded
    const bodyFont = window.getComputedStyle(document.body).fontFamily;
    if (bodyFont.includes('Poppins')) {
      setIsFontLoaded(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          CSS and Font Test
        </h1>
        
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <span className="font-medium">CSS Loading Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isCssWorking 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isCssWorking ? 'Working' : 'Not Working'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
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
          
          <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Visual Test Elements</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Button Test:</h3>
                <button className="btn-primary">
                  Primary Button
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Card Test:</h3>
                <div className="toy-card p-4 max-w-sm">
                  <h4 className="font-bold text-lg mb-2">Sample Card</h4>
                  <p className="text-gray-600">This is a sample card to test CSS styles.</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Gradient Text Test:</h3>
                <p className="gradient-text text-2xl font-bold">Gradient Text</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Animation Test:</h3>
                <div className="flex items-center gap-4">
                  <div className="animate-pulse w-12 h-12 bg-blue-500 rounded-lg"></div>
                  <div className="animate-bounce w-12 h-12 bg-purple-500 rounded-lg"></div>
                </div>
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