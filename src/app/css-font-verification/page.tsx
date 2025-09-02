'use client';

import { useState, useEffect } from 'react';

export default function CSSFontVerificationPage() {
  const [mounted, setMounted] = useState(false);
  const [fontStatus, setFontStatus] = useState('checking');
  const [cssStatus, setCssStatus] = useState('checking');
  
  useEffect(() => {
    // Set mounted to true after component mounts
    setMounted(true);
    
    // Check font loading
    const checkFont = () => {
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
          setFontStatus('loaded');
        } else {
          setFontStatus('not loaded');
        }
      }
    };

    // Check CSS loading
    const checkCSS = () => {
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        // Check if Tailwind classes are working
        const testElement = document.createElement('div');
        testElement.className = 'bg-blue-500 text-white p-4 rounded-lg';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.innerHTML = 'Test';
        document.body.appendChild(testElement);

        // Get computed styles
        const computedStyles = window.getComputedStyle(testElement);
        const backgroundColor = computedStyles.backgroundColor;
        
        // Clean up
        document.body.removeChild(testElement);
        
        // If background color is blue, CSS is working
        if (backgroundColor === 'rgb(59, 130, 246)') {
          setCssStatus('loaded');
        } else {
          setCssStatus('not loaded');
        }
      }
    };

    // Check both
    checkFont();
    checkCSS();

    // Set interval to keep checking
    const interval = setInterval(() => {
      checkFont();
      checkCSS();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render anything until component is mounted to prevent hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">CSS & Font Verification</h1>
          <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
            <p className="text-center text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">CSS & Font Verification</h1>
        
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Status Panel */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Loading Status</h2>
              
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${fontStatus === 'loaded' ? 'bg-green-100 text-green-800' : fontStatus === 'not loaded' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <p className="font-medium">
                    {fontStatus === 'loaded' ? '✅ Font Loaded' : fontStatus === 'not loaded' ? '❌ Font Not Loaded' : '⏳ Font Loading...'}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${cssStatus === 'loaded' ? 'bg-green-100 text-green-800' : cssStatus === 'not loaded' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <p className="font-medium">
                    {cssStatus === 'loaded' ? '✅ CSS Loaded' : cssStatus === 'not loaded' ? '❌ CSS Not Loaded' : '⏳ CSS Loading...'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Troubleshooting Tips</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                  <li>Check browser console for errors</li>
                  <li>Verify network requests for CSS/font files</li>
                  <li>Try hard refresh (Ctrl+F5)</li>
                  <li>Clear browser cache</li>
                </ul>
              </div>
            </div>
            
            {/* Test Elements */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Visual Tests</h2>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Default system font:</p>
                  <p style={{ fontFamily: 'system-ui, sans-serif' }} className="text-xl p-3 bg-gray-100 rounded">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Poppins via CSS variable:</p>
                  <p style={{ fontFamily: 'var(--font-poppins, system-ui, sans-serif)' }} className="text-xl p-3 bg-gray-100 rounded">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Poppins via Tailwind class:</p>
                  <p className="font-poppins text-xl p-3 bg-gray-100 rounded">
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tailwind CSS test (should be blue with rounded corners):</p>
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    If this box is blue with rounded corners, CSS is working
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Responsive test:</p>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
                    <p className="md:hidden">Small screen style</p>
                    <p className="hidden md:block">Large screen style</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CSS Variables Display - Only show after mounting */}
          {mounted && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">CSS Variables</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="font-mono text-sm break-all">
                  --font-poppins: {typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--font-poppins') || 'Not set' : 'Loading...'}
                </p>
                <p className="font-mono text-sm break-all mt-2">
                  --background: {typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--background') || 'Not set' : 'Loading...'}
                </p>
                <p className="font-mono text-sm break-all mt-2">
                  --foreground: {typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--foreground') || 'Not set' : 'Loading...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}