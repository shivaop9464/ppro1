'use client';

import { useEffect, useState } from 'react';

export default function PoppinsTest() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Check if Poppins font is loaded
    const checkFont = () => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const fontFamily = computedStyle.fontFamily;
      
      if (fontFamily.includes('Poppins')) {
        setFontLoaded(true);
      }
    };

    // Check immediately and after a delay
    checkFont();
    const timer = setTimeout(checkFont, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Poppins Font Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Font Status</h2>
          <div className={`p-4 rounded-lg mb-4 ${fontLoaded ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <p className={fontLoaded ? 'text-green-800' : 'text-yellow-800'}>
              {fontLoaded 
                ? '✅ Poppins font is loaded and active' 
                : '⚠️ Poppins font may not be loaded yet. Waiting for font to load...'}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Heading Text (H1-H6)</h3>
              <div className="space-y-2">
                <h1 className="text-3xl">Heading 1 - Poppins</h1>
                <h2 className="text-2xl">Heading 2 - Poppins</h2>
                <h3 className="text-xl">Heading 3 - Poppins</h3>
                <h4 className="text-lg">Heading 4 - Poppins</h4>
                <h5 className="text-base">Heading 5 - Poppins</h5>
                <h6 className="text-sm">Heading 6 - Poppins</h6>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Body Text</h3>
              <p className="text-gray-700">
                This is body text using Poppins. The quick brown fox jumps over the lazy dog. 
                Poppins provides a clean, modern, and highly readable typeface for all body content.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Font Weights</h3>
              <div className="space-y-2">
                <p className="font-light">Light weight text (300)</p>
                <p className="font-normal">Normal weight text (400)</p>
                <p className="font-medium">Medium weight text (500)</p>
                <p className="font-semibold">Semibold weight text (600)</p>
                <p className="font-bold">Bold weight text (700)</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Buttons</h3>
              <div className="flex space-x-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Primary Button
                </button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Font Family Information</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              Current font family: <span className="font-mono">font-family: var(--font-poppins), Poppins, system-ui, sans-serif;</span>
            </p>
            <p className="text-gray-700 mt-2">
              If you see this text in the Poppins font, the font configuration is working correctly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}