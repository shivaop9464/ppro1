'use client';

import React from 'react';

export default function CssTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          CSS Test Page
        </h1>
        
        <div className="space-y-6">
          {/* Test Tailwind classes */}
          <div className="bg-blue-500 text-white p-4 rounded-lg">
            <p className="font-bold">Tailwind CSS Test</p>
            <p>This should have a blue background with white text</p>
          </div>
          
          {/* Test custom classes from globals.css */}
          <div className="btn-primary">
            <p className="font-bold text-white">Custom Button Class</p>
            <p>This should have a gradient background</p>
          </div>
          
          {/* Test flexbox */}
          <div className="flex space-x-4">
            <div className="bg-red-500 text-white p-4 rounded-lg flex-1">
              Flex Item 1
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg flex-1">
              Flex Item 2
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg flex-1">
              Flex Item 3
            </div>
          </div>
          
          {/* Test grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-500 text-white p-4 rounded-lg">
              Grid Item 1
            </div>
            <div className="bg-pink-500 text-white p-4 rounded-lg">
              Grid Item 2
            </div>
            <div className="bg-indigo-500 text-white p-4 rounded-lg">
              Grid Item 3
            </div>
          </div>
          
          {/* Test responsive design */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 rounded-lg">
            <p className="hidden md:block">This text is only visible on medium screens and larger</p>
            <p className="md:hidden">This text is only visible on small screens</p>
          </div>
        </div>
      </div>
    </div>
  );
}
