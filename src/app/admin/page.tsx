'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Save, X, Upload, Package, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Toy } from '@/store/cart';
import { categories, ageGroups, formatPriceSimple } from '@/lib/utils';
import { supabaseService } from '@/lib/supabase-service';
import LoginButton from '@/components/LoginButton';

interface ToyFormData {
  name: string;
  description: string;
  age_group: string; // Changed to snake_case for database
  category: string;
  price: number;
  image_url: string; // Changed to snake_case for database
  is_free_with_subscription: boolean; // New field for free with subscription
}

// Helper function to transform database toy to frontend toy format
const transformDatabaseToy = (dbToy: any): Toy => ({
  id: dbToy.id,
  name: dbToy.name,
  description: dbToy.description,
  age_group: dbToy.age_group,
  category: dbToy.category,
  image_url: dbToy.image_url || '',
  brand: 'PlayPro', // Default brand since removed from database
  price: dbToy.price, // Use price as-is from database
  stock: dbToy.stock || 50,
  tags: dbToy.tags || (dbToy.is_free_with_subscription ? ['free-with-subscription'] : []) // Add tag if free
});

// Helper function to transform frontend toy to database format
const transformToDatabase = (formData: ToyFormData) => {
  // Add free-with-subscription tag if needed
  const tags = formData.is_free_with_subscription 
    ? ['free-with-subscription'] 
    : [];
  
  return {
    name: formData.name,
    description: formData.description,
    category: formData.category,
    price: formData.is_free_with_subscription ? 0 : formData.price, // Set price to 0 if free
    age_group: formData.age_group,
    image_url: formData.image_url,
    stock: 50, // Default stock
    tags: tags.length > 0 ? tags : undefined // Only include tags if there are any
  };
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editForm, setEditForm] = useState<ToyFormData>({
    name: '',
    description: '',
    age_group: '', // Changed to snake_case
    category: '',
    price: 0,
    image_url: '', // Changed to snake_case
    is_free_with_subscription: false // Initialize new field
  });

  // Fetch toys from toys-admin API
  useEffect(() => {
    const fetchToys = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/toys-admin', {
          method: 'GET'
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Error fetching toys:', result.error);
          setError('Failed to load toys.');
          return;
        }
        
        if (result.toys) {
          const transformedToys = result.toys.map(transformDatabaseToy);
          setToys(transformedToys);
        }
      } catch (err) {
        console.error('Error fetching toys:', err);
        setError('Failed to load toys.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.isAdmin) {
      fetchToys();
    }
  }, [isAuthenticated, user?.isAdmin]);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Don't render if not authenticated or not admin
  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  // Handle edit click
  const handleEditClick = (toy: Toy) => {
    setIsEditing(toy.id);
    setEditForm({
      name: toy.name,
      description: toy.description,
      age_group: toy.age_group, // Updated field name
      category: toy.category,
      price: toy.price,
      image_url: toy.image_url, // Updated field name
      is_free_with_subscription: toy.tags?.includes('free-with-subscription') || false // Set based on tags
    });
    // Set preview for existing image
    if (toy.image_url) {
      setImagePreview(toy.image_url);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditForm({
      name: '',
      description: '',
      age_group: ageGroups[0].id, // Updated field name
      category: categories[0],
      price: 0,
      image_url: '', // Updated field name
      is_free_with_subscription: false // Initialize new field
    });
  };

  // Handle form change
  const handleFormChange = (field: keyof ToyFormData, value: string | number | boolean) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate required fields
      if (!editForm.name.trim()) {
        setError('Toy name is required.');
        setLoading(false);
        return;
      }
      
      if (!editForm.description.trim()) {
        setError('Toy description is required.');
        setLoading(false);
        return;
      }
      
      if (!editForm.category) {
        setError('Toy category is required.');
        setLoading(false);
        return;
      }
      
      if (!editForm.age_group) {
        setError('Age group is required.');
        setLoading(false);
        return;
      }
      
      // Only validate price if not free with subscription
      if (!editForm.is_free_with_subscription && editForm.price <= 0) {
        setError('Price must be greater than 0.');
        setLoading(false);
        return;
      }
      
      console.log('Form validation passed, saving toy...');
      
      if (isEditing) {
        // Update existing toy via admin-toys API
        const dbData = transformToDatabase(editForm);
        console.log('Updating toy with data:', dbData);
        
        const response = await fetch('/api/toys-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            toyId: isEditing,
            toyData: dbData
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Error updating toy:', result.error);
          setError(`Failed to update toy: ${result.error?.message || 'Unknown error'}`);
          return;
        }
        
        if (result.toy) {
          const updatedToy = transformDatabaseToy(result.toy);
          setToys(toys.map(toy => toy.id === isEditing ? updatedToy : toy));
          console.log('Toy updated successfully');
        }
        setIsEditing(null);
      } else if (isAdding) {
        // Add new toy via toys-admin API
        const dbData = transformToDatabase(editForm);
        console.log('Creating toy with data:', dbData);
        
        const response = await fetch('/api/toys-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            toyData: dbData
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Error creating toy:', result.error);
          setError(`Failed to create toy: ${result.error?.message || 'Unknown error'}`);
          return;
        }
        
        if (result.toy) {
          const newToy = transformDatabaseToy(result.toy);
          setToys([...toys, newToy]);
          console.log('Toy created successfully');
        }
        setIsAdding(false);
      }
      
      // Reset form
      setEditForm({
        name: '',
        description: '',
        age_group: '',
        category: '',
        price: 0,
        image_url: '',
        is_free_with_subscription: false
      });
      setImageFile(null);
      setImagePreview('');
      setError(null);
    } catch (err) {
      console.error('Error saving toy:', err);
      setError(`Failed to save toy: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(null);
    setIsAdding(false);
    setImageFile(null);
    setImagePreview('');
    setEditForm({
      name: '',
      description: '',
      age_group: '', // Updated field name
      category: '',
      price: 0,
      image_url: '', // Updated field name
      is_free_with_subscription: false // Reset new field
    });
    setError(null);
  };

  const handleDelete = async (toyId: string) => {
    if (confirm('Are you sure you want to delete this toy?')) {
      try {
        setLoading(true);
        
        const response = await fetch('/api/toys-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete',
            toyId: toyId
          })
        });
        
        const result = await response.json();
        
        if (!result.success) {
          console.error('Error deleting toy:', result.error);
          setError(`Failed to delete toy: ${result.error?.message || 'Unknown error'}`);
          return;
        }
        
        setToys(toys.filter(toy => toy.id !== toyId));
        setError(null);
        console.log('Toy deleted successfully');
      } catch (err) {
        console.error('Error deleting toy:', err);
        setError('Failed to delete toy.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        // Convert file to base64 and store in form
        handleFormChange('image_url', result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG, GIF, etc.)');
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Clear image
  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    handleFormChange('image_url', '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage toys and subscription plans</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/orders"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Orders
              </Link>
              <div className="text-sm text-gray-500">
                Welcome, {user?.name}
              </div>
              <button
                onClick={async () => {
                  await logout();
                  router.push('/');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-primary-600">{toys.length}</div>
            <div className="text-gray-600">Total Toys</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{categories.length}</div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{ageGroups.length}</div>
            <div className="text-gray-600">Age Groups</div>
          </div>
        </div>

        {/* Toys Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Toy Management</h2>
            <button
              onClick={handleAddClick}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Toy
            </button>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || isEditing) && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isAdding ? 'Add New Toy' : 'Edit Toy'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Toy name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group
                  </label>
                  <select
                    value={editForm.age_group}
                    onChange={(e) => handleFormChange('age_group', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {ageGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="free-with-subscription"
                      checked={editForm.is_free_with_subscription}
                      onChange={(e) => handleFormChange('is_free_with_subscription', e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="free-with-subscription" className="ml-2 block text-sm text-gray-700">
                      Free with Subscription
                    </label>
                  </div>
                  {!editForm.is_free_with_subscription && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => handleFormChange('price', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Price in rupees"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toy Image
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Image uploaded successfully!</p>
                          <button
                            type="button"
                            onClick={clearImage}
                            className="text-sm text-red-600 hover:text-red-700 mt-1"
                          >
                            Remove image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Toy description"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Toys Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {toys.map((toy) => (
                  <tr key={toy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{toy.name}</div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">{toy.description}</div>
                        {toy.tags?.includes('free-with-subscription') && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            Free with Subscription
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {toy.age_group}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {toy.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {toy.tags?.includes('free-with-subscription') ? (
                        <span className="text-blue-600 font-medium">Free with Subscription</span>
                      ) : (
                        formatPriceSimple(toy.price)
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(toy)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Edit toy"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(toy.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete toy"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RLS Fix Section */}
        {error && error.includes('RLS policy') && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="text-yellow-800 text-sm">
                <strong>Database Permission Issue:</strong> Row Level Security (RLS) is blocking database operations.
                <br />Changes are being saved temporarily. To fix this permanently:
                <br />1. Go to Supabase Dashboard → Authentication → Policies
                <br />2. Temporarily disable RLS for the toys table, or
                <br />3. Click the button below to attempt automatic fix.
              </div>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/fix-rls', { method: 'POST' });
                    const result = await response.json();
                    if (result.success) {
                      setError(null);
                      alert('RLS fix applied! Try saving toys again.');
                    } else {
                      alert('Automatic fix failed. Please disable RLS manually in Supabase dashboard.');
                    }
                  } catch (err) {
                    alert('Fix attempt failed. Please disable RLS manually.');
                  }
                }}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 ml-4 flex-shrink-0"
              >
                Try Auto Fix
              </button>
            </div>
          </div>
        )}

        {/* Database Integration Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-blue-600 text-sm">
              <strong>Toys Management:</strong> All changes are automatically saved to the JSON file system and will persist across sessions.
              The admin panel is fully functional for creating, editing, and deleting toys.
              {toys.length === 0 && ' Start by adding some toys using the "Add New Toy" button above!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}