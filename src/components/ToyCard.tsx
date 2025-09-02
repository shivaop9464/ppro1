'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Heart, X } from 'lucide-react';
import { Toy, useCartStore } from '@/store/cart';
import { formatPriceSimple } from '@/lib/utils';

interface ToyCardProps {
  toy: Toy;
  isPlanSelection?: boolean; // New prop to indicate if we're in plan selection mode
}

export default function ToyCard({ toy, isPlanSelection = false }: ToyCardProps) {
  const { items, selectedPlan, addToCart, removeFromCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Check if toy is already selected
  const isToySelected = items.some(item => item.toy.id === toy.id);
  
  // Check if user can select more toys based on their plan
  const canSelectMoreToys = selectedPlan 
    ? items.length < selectedPlan.toysPerMonth 
    : true;
    
  // Check if toy is free with subscription
  const isFreeWithSubscription = toy.tags?.includes('free-with-subscription') || false;

  const getCategoryIcon = () => {
    const iconMap = {
      'Educational': '🧩',
      'Creative': '🎨',
      'STEM': '🔬',
      'Role Play': '🏠',
      'Musical': '🎵',
      'Vehicles': '🚗',
      'Games': '🎲',
      'Construction': '🧱',
      'Comfort': '🧸'
    };
    return iconMap[toy.category as keyof typeof iconMap] || '🧸';
  };

  const handleSelectToy = async () => {
    if (isToySelected) return;
    
    // Check again if user can select more toys based on their plan
    const currentStore = useCartStore.getState();
    const canStillSelectMore = currentStore.selectedPlan 
      ? currentStore.items.length < currentStore.selectedPlan.toysPerMonth 
      : true;
      
    if (!canStillSelectMore) {
      alert(`You can only select ${currentStore.selectedPlan?.toysPerMonth} toy(s) with your plan.`);
      return;
    }
    
    setIsAdding(true);
    try {
      await currentStore.addToCart(toy);
      // Add a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Failed to select toy:', error);
      alert('Failed to select toy. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleUnselectToy = async () => {
    if (!isToySelected) return;
    
    setIsRemoving(true);
    try {
      // Get current store state
      const currentStore = useCartStore.getState();
      // Find the item to remove and get its ID
      const itemToRemove = currentStore.items.find(item => item.toy.id === toy.id);
      if (itemToRemove) {
        await currentStore.removeFromCart(itemToRemove.toy.id);
        // Add a small delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Failed to unselect toy:', error);
      alert('Failed to unselect toy. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="toy-card bg-white rounded-xl overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {toy.image_url && !imageError ? (
          <Image
            src={toy.image_url}
            alt={toy.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">
              {getCategoryIcon()}
            </div>
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
          />
        </button>

        {/* Age Group Badge */}
        <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          {toy.age_group}
        </div>
        
        {/* Selected Indicator - only show in plan selection mode */}
        {isPlanSelection && isToySelected && (
          <div className="absolute top-3 left-3 bg-green-500 text-white p-1 rounded-full">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-sm text-primary-600 font-medium mb-1">
          {toy.category}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {toy.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {toy.description}
        </p>

        {/* Brand */}
        <div className="text-xs text-gray-500 mb-3">
          by {toy.brand}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          {isFreeWithSubscription ? (
            // Always show "Free with Subscription" for toys marked as free
            <>
              <div className="text-lg font-bold text-green-600">
                Free with Subscription
              </div>
            </>
          ) : isPlanSelection ? (
            // Show price and select/unselect buttons when in plan selection mode and not free
            <>
              <div className="text-lg font-bold text-gray-900">
                {formatPriceSimple(toy.price)}
              </div>
              {isToySelected ? (
                <button
                  onClick={handleUnselectToy}
                  disabled={isRemoving}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isRemoving
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {isRemoving ? 'Removing...' : (
                    <>
                      <X className="h-4 w-4" />
                      Unselect
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSelectToy}
                  disabled={isAdding || (!canSelectMoreToys && items.length > 0)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isAdding
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : (!canSelectMoreToys && items.length > 0)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {isAdding ? 'Selecting...' : 'Select Toy'}
                </button>
              )}
            </>
          ) : (
            // Show "Free with Subscription" when not in plan selection mode and not explicitly free
            <>
              <div className="text-lg font-bold text-green-600">
                Free with Subscription
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}