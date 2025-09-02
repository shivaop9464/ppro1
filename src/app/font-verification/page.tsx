'use client';

import { useEffect, useState } from 'react';

export default function FontVerification() {
  const [headingFont, setHeadingFont] = useState('Loading...');
  const [bodyFont, setBodyFont] = useState('Loading...');

  useEffect(() => {
    // Check font families after component mounts
    const checkFonts = () => {
      const heading = document.querySelector('h1');
      const body = document.querySelector('p');
      
      if (heading) {
        const headingStyle = window.getComputedStyle(heading);
        setHeadingFont(headingStyle.fontFamily);
      }
      
      if (body) {
        const bodyStyle = window.getComputedStyle(body);
        setBodyFont(bodyStyle.fontFamily);
      }
    };

    // Check immediately and after a small delay to ensure fonts are loaded
    checkFonts();
    const timer = setTimeout(checkFonts, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Font Verification Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Font Status</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Heading Font (Poppins)</h3>
              <p className="text-gray-700">
                Current heading font family: <span className="font-mono bg-gray-100 p-1 rounded">{headingFont}</span>
              </p>
              {headingFont.includes('Poppins') ? (
                <p className="text-green-600 mt-2">✅ Poppins is correctly applied to headings</p>
              ) : (
                <p className="text-yellow-600 mt-2">⚠️ Poppins may not be loaded yet or there's an issue</p>
              )}
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">Body Font (Poppins)</h3>
              <p className="text-gray-700">
                Current body font family: <span className="font-mono bg-gray-100 p-1 rounded">{bodyFont}</span>
              </p>
              {bodyFont.includes('Poppins') ? (
                <p className="text-green-600 mt-2">✅ Poppins is correctly applied to body text</p>
              ) : (
                <p className="text-yellow-600 mt-2">⚠️ Poppins may not be loaded yet or there's an issue</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Font Showcase</h2>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl mb-2">Heading 1 (H1) - Clean and Modern</h1>
              <p className="text-gray-600">This is body text using Poppins - clean, modern, and highly readable.</p>
            </div>
            
            <div>
              <h2 className="text-2xl mb-2">Heading 2 (H2) - Professional and Friendly</h2>
              <p className="text-gray-600">The quick brown fox jumps over the lazy dog. This text should be in Poppins.</p>
            </div>
            
            <div>
              <h3 className="text-xl mb-2">Heading 3 (H3) - Versatile and Clear</h3>
              <p className="text-gray-600">All headings and body text should use Poppins with its clean and modern characteristics.</p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">Button Text</h3>
              <div className="flex space-x-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold">
                  Primary Button (Poppins)
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Secondary Button (Poppins)
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accessibility Check</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-900">Dark text on light background - Good contrast for accessibility</p>
            </div>
            <div className="p-4 bg-white border-2 border-gray-900 rounded-lg">
              <p className="text-gray-900">High contrast text - Meets accessibility standards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}