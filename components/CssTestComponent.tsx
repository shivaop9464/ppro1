'use client';

import React from 'react';

export default function CssTestComponent() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">CSS Test Component</h2>
      <div className="space-y-4">
        <div className="p-3 bg-red-100 text-red-800 rounded">
          This should have a red background
        </div>
        <div className="p-3 bg-green-100 text-green-800 rounded-lg">
          This should have a green background
        </div>
        <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
          This should have a blue background
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
          This should have a purple to pink gradient
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          This should be an indigo button
        </button>
      </div>
    </div>
  );
}