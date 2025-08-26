'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { Toy, useCartStore } from '@/store/cart';
import { formatPriceSimple } from '@/lib/utils';

interface ToyCardProps {
  toy: Toy;
}

export default function ToyCard({ toy }: ToyCardProps) {
  const { addToCart } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(toy);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      // Simulate loading state for better UX
      setTimeout(() => {
        setIsAdding(false);
      }, 500);
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
          <div className="text-lg font-bold text-gray-900">
            {formatPriceSimple(toy.price)}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}