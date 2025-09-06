'use client';

import { useState, useEffect } from 'react';

export default function FontDebugPage() {
  const [fontInfo, setFontInfo] = useState({
    bodyFont: 'Not loaded',
    headingFont: 'Not loaded',
    isPoppinsLoaded: false,
    cssVariables: 'Not loaded'
  });

  useEffect(() => {
    // Check font information after component mounts
    const checkFonts = () => {
      try {
        // Get body font
        const bodyStyle = window.getComputedStyle(document.body);
        const bodyFont = bodyStyle.fontFamily;
        
        // Get heading font
        const heading = document.querySelector('h1') || document.querySelector('h2') || document.createElement('h1');
        if (!heading.parentNode) {
          heading.textContent = 'Test';
          document.body.appendChild(heading);
        }
        const headingStyle = window.getComputedStyle(heading);
        const headingFont = headingStyle.fontFamily;
        
        // Check if Poppins is loaded
        const isPoppinsLoaded = bodyFont.includes('Poppins') || headingFont.includes('Poppins');
        
        // Get CSS variables
        const rootStyles = getComputedStyle(document.documentElement);
        const fontPrimaryVar = rootStyles.getPropertyValue('--font-primary');
        
        setFontInfo({
          bodyFont,
          headingFont,
          isPoppinsLoaded,
          cssVariables: fontPrimaryVar
        });
        
        // Clean up temporary element
        if (heading.parentNode === document.body) {
          document.body.removeChild(heading);
        }
      } catch (error) {
        console.error('Error checking fonts:', error);
      }
    };

    // Check immediately and after a delay to ensure fonts are loaded
    checkFonts();
    const timer = setTimeout(checkFonts, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Font Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Font Information</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Body Font</h3>
              <p className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
                {fontInfo.bodyFont}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">Heading Font</h3>
              <p className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
                {fontInfo.headingFont}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-800 mb-2">CSS Variables</h3>
              <p className="text-gray-700 font-mono bg-gray-100 p-2 rounded">
                {fontInfo.cssVariables || 'Not set'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg" 
                 className={fontInfo.isPoppinsLoaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              <h3 className="font-bold mb-2">Poppins Status</h3>
              <p className="font-medium">
                {fontInfo.isPoppinsLoaded 
                  ? '✅ Poppins is loaded and active' 
                  : '❌ Poppins is not loaded or not active'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Font Showcase</h2>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl mb-2">Heading 1 (H1)</h1>
              <p className="text-gray-600">This text should be in Poppins if the font is loaded correctly.</p>
            </div>
            
            <div>
              <h2 className="text-2xl mb-2">Heading 2 (H2)</h2>
              <p className="text-gray-600">The quick brown fox jumps over the lazy dog.</p>
            </div>
            
            <div>
              <h3 className="text-xl mb-2">Heading 3 (H3)</h3>
              <p className="text-gray-600">All headings and body text should use Poppins.</p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">Button Text</h3>
              <div className="flex space-x-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting Steps</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-2">If Poppins is not loading:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Check browser console for font loading errors</li>
                <li>Verify internet connection (Google Fonts needs to be accessible)</li>
                <li>Try clearing browser cache and reloading</li>
                <li>Check if any ad blockers are blocking Google Fonts</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}