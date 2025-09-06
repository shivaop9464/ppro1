'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Search, ShoppingBag } from 'lucide-react';
import ToyCard from '@/components/ToyCard';
import { Toy, useCartStore } from '@/store/cart';
import { ageGroups, categories } from '@/lib/utils';
import { supabaseService } from '@/lib/supabase-service';

// Helper function to transform database toy to frontend toy format
const transformDatabaseToy = (dbToy: any): Toy => ({
  id: dbToy.id,
  name: dbToy.name,
  description: dbToy.description,
  age_group: dbToy.age_group,
  category: dbToy.category,
  image_url: dbToy.image_url || '',
  brand: dbToy.brand || 'PlayPro',
  price: dbToy.price, // Use price as-is (no conversion)
  stock: dbToy.stock,
  tags: dbToy.tags
});

export default function ToysPage() {
  const searchParams = useSearchParams();
  const [toys, setToys] = useState<Toy[]>([]);
  const [filteredToys, setFilteredToys] = useState<Toy[]>([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedPlan, items, selectPlan } = useCartStore();
  const router = useRouter();
  // Add state to handle hydration
  const [isClient, setIsClient] = useState(false);
  
  // Check if user came through plans page
  const cameFromPlans = !!(
    searchParams.get('plan') && 
    searchParams.get('toysPerMonth')
  );

  // Set isClient to true after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

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
          setError('Failed to load toys. Please try again later.');
          return;
        }
        
        if (result.toys) {
          const transformedToys = result.toys.map(transformDatabaseToy);
          setToys(transformedToys);
        }
      } catch (err) {
        console.error('Error fetching toys:', err);
        setError('Failed to load toys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchToys();
  }, []);

  // Initialize plan from URL params
  useEffect(() => {
    const planParam = searchParams.get('plan');
    const toysPerMonthParam = searchParams.get('toysPerMonth');
    
    if (planParam && toysPerMonthParam) {
      // Fetch the actual plan data from the API
      const fetchAndSetPlan = async () => {
        try {
          const response = await fetch('/api/plans');
          const data = await response.json();
          
          // Find the selected plan in the plans data
          const planData = data.plans.find((p: any) => p.id === planParam);
          
          if (planData) {
            // Add deposit amount based on plan price
            let planWithDeposit = { ...planData };
            
            if (planWithDeposit.price === 699) {
              planWithDeposit.deposit_amount = 1000;
            } else if (planWithDeposit.price === 1299) {
              planWithDeposit.deposit_amount = 3000;
            } else if (planWithDeposit.price === 2199) {
              planWithDeposit.deposit_amount = 6000;
            }
            
            // Set the plan in the cart store
            selectPlan(planWithDeposit);
          } else {
            // Fallback to creating a plan object based on URL parameters
            const planFromUrl = {
              id: planParam,
              name: planParam.charAt(0).toUpperCase() + planParam.slice(1),
              toysPerMonth: parseInt(toysPerMonthParam),
              price: 0, // Will be updated when user goes to cart
              features: [],
              popular: false,
              deposit_amount: 0
            };
            
            // Set the plan in the cart store
            selectPlan(planFromUrl);
          }
        } catch (error) {
          console.error('Error fetching plan data:', error);
          // Fallback to creating a plan object based on URL parameters
          const planFromUrl = {
            id: planParam,
            name: planParam.charAt(0).toUpperCase() + planParam.slice(1),
            toysPerMonth: parseInt(toysPerMonthParam),
            price: 0,
            features: [],
            popular: false,
            deposit_amount: 0
          };
          
          // Set the plan in the cart store
          selectPlan(planFromUrl);
        }
      };
      
      fetchAndSetPlan();
    }
  }, [searchParams, selectPlan]);

  // Initialize age group from URL params
  useEffect(() => {
    const ageParam = searchParams.get('age');
    if (ageParam) {
      setSelectedAgeGroup(ageParam);
    }
  }, [searchParams]);

  // Filter toys based on selected criteria
  useEffect(() => {
    let filtered = toys;

    // Filter by age group
    if (selectedAgeGroup !== 'all') {
      filtered = filtered.filter(toy => toy.age_group === selectedAgeGroup);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(toy => toy.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(toy =>
        toy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        toy.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        toy.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // NOTE: Removed the limiting logic that was causing only some toys to display
    // All toys should be displayed, with selection limits enforced in the UI

    setFilteredToys(filtered);
  }, [toys, selectedAgeGroup, selectedCategory, searchQuery]);

  const handleAgeGroupChange = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSelectedAgeGroup('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Toy Catalog
            </h1>
            {/* Only render the conditional content after hydration */}
            {isClient ? (
              selectedPlan ? (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Select up to {selectedPlan.toysPerMonth} toy{selectedPlan.toysPerMonth !== 1 ? 's' : ''} per month with your {selectedPlan.name} plan
                </p>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <p className="text-xl text-gray-600 mb-2">
                    All toys are free with your subscription
                  </p>
                  {/* Add prominent "Free with subscription" tagline */}
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mt-2">
                    Free with subscription
                  </div>
                </div>
              )
            ) : (
              // Render a placeholder during server-side rendering
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Loading...
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
              </div>

              <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block`}>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Toys
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search toys..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Age Groups */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Age Group
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAgeGroupChange('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedAgeGroup === 'all'
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All Ages
                    </button>
                    {ageGroups.map((group) => (
                      <button
                        key={group.id}
                        onClick={() => handleAgeGroupChange(group.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedAgeGroup === group.id
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{group.label}</div>
                        <div className="text-xs text-gray-500">{group.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-primary-100 text-primary-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {filteredToys.length} {filteredToys.length === 1 ? 'toy' : 'toys'} found
                </h3>
                {(selectedAgeGroup !== 'all' || selectedCategory !== 'all' || searchQuery) && (
                  <p className="text-sm text-gray-600 mt-1">
                    Filtered by: {' '}
                    {selectedAgeGroup !== 'all' && (
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs mr-2">
                        {ageGroups.find(g => g.id === selectedAgeGroup)?.label}
                      </span>
                    )}
                    {selectedCategory !== 'all' && (
                      <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-xs mr-2">
                        {selectedCategory}
                      </span>
                    )}
                    {searchQuery && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        "{searchQuery}"
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Toys Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading toys...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Toys</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredToys.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredToys.map((toy) => (
                    <ToyCard 
                      key={toy.id} 
                      toy={toy} 
                      isPlanSelection={cameFromPlans} 
                    />
                  ))}
                </div>
                
                {/* Proceed to Cart Button - only show when toys are selected and plan is selected */}
                {selectedPlan && items.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => router.push('/cart')}
                      className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg flex items-center gap-2"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Proceed to Cart ({items.length} {items.length === 1 ? 'toy' : 'toys'} selected)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No toys found</h3>
                <p className="text-gray-600 mb-4">
                  {toys.length === 0 
                    ? 'No toys available in the database yet.'
                    : 'Try adjusting your filters or search terms'
                  }
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}