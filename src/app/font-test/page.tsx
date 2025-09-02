'use client';

import { useState, useEffect } from 'react';

export default function FontTestPage() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
    
    // Check if font is loaded
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      // Create a test element
      const testElement = document.createElement('span');
      testElement.style.fontFamily = 'Poppins, sans-serif';
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.style.fontSize = '72px';
      testElement.innerHTML = 'Test';
      document.body.appendChild(testElement);

      // Get the width with Poppins
      const widthWithPoppins = testElement.offsetWidth;
      
      // Change to default font
      testElement.style.fontFamily = 'sans-serif';
      const widthWithSans = testElement.offsetWidth;
      
      // Clean up
      document.body.removeChild(testElement);
      
      // If widths are different, Poppins is likely loaded
      if (widthWithPoppins !== widthWithSans) {
        setFontLoaded(true);
      }
    }
  }, []);

  // Don't render anything until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Font Test Page</h1>
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
        <h1 className="text-4xl font-bold mb-8 text-center">Font Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Font Loading Status</h2>
            <div className={`p-4 rounded-lg ${fontLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <p className="font-medium">
                {fontLoaded ? '✅ Poppins Font Loaded' : '⏳ Checking font loading...'}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Font Comparison Tests</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">System Font (fallback):</p>
                  <p className="text-xl p-3 bg-gray-100 rounded font-system">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Poppins Font (via CSS variable):</p>
                  <p className="text-xl p-3 bg-gray-100 rounded font-poppins">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Poppins Font (via Tailwind class):</p>
                  <p className="text-xl p-3 bg-gray-100 rounded font-sans">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}