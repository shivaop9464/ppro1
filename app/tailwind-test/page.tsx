export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">Tailwind CSS Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Basic Styles</h2>
          <p className="text-gray-700 mb-4">
            If you can see this text with proper styling (indigo headers, gray text, white background with shadow),
            then Tailwind CSS is working correctly.
          </p>
          <div className="flex space-x-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Primary Button
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Secondary Button
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800">Box 1</h3>
            <p className="text-blue-600">This should have a blue background</p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-green-800">Box 2</h3>
            <p className="text-green-600">This should have a green background</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800">Box 3</h3>
            <p className="text-purple-600">This should have a purple background</p>
          </div>
        </div>
      </div>
    </div>
  );
}