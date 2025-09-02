export default function FontVerificationSimple() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Simple Font Verification</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Font Test</h2>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl mb-2">This should be Poppins (H1)</h1>
              <p className="text-gray-600">This paragraph should also be in Poppins font.</p>
            </div>
            
            <div>
              <h2 className="text-2xl mb-2">This should be Poppins (H2)</h2>
              <p className="text-gray-600">The quick brown fox jumps over the lazy dog.</p>
            </div>
            
            <div>
              <h3 className="text-xl mb-2">This should be Poppins (H3)</h3>
              <p className="text-gray-600">All text should now be using the Poppins font family.</p>
            </div>
            
            <div className="p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-bold text-indigo-800 mb-2">Button Test</h3>
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
      </div>
    </div>
  );
}