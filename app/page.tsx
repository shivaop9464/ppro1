'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    setIsLoaded(true);
  }, []);
  
  const handleAgeGroupClick = (ageGroupId: string) => {
    router.push(`/toys?ageGroup=${ageGroupId}`);
  };

  const ageGroups = [
    { id: '0-2', label: '0-2 Years', description: 'Infants & Toddlers', icon: '🧸' },
    { id: '2-4', label: '2-4 Years', description: 'Preschoolers', icon: '🚂' },
    { id: '4-8', label: '4-8 Years', description: 'Early Elementary', icon: '🧩' },
    { id: '8+', label: '8+ Years', description: 'School Age', icon: '🎮' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-hero text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
            style={{animationDelay: '0.2s'}}
          >
            Discover. Play. Learn.
          </h1>
          <p 
            className={`text-lg sm:text-xl mb-8 md:mb-12 max-w-3xl mx-auto ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
            style={{animationDelay: '0.4s'}}
          >
            The ultimate toy subscription service that brings joy, learning, and
            development right to your doorstep every month.
          </p>
          
          <div 
            className={`mt-10 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
            style={{animationDelay: '0.6s'}}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Choose Your Child's Age Group</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
              {ageGroups.map((group, index) => (
                <button
                  key={group.id}
                  onClick={() => handleAgeGroupClick(group.id)}
                  className={`glass-effect-dark p-5 sm:p-6 rounded-xl text-center hover:bg-white/30 transition-all duration-300 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
                  style={{animationDelay: `${0.8 + index * 0.1}s`}}
                >
                  <div className="text-4xl mb-3 animate-float" style={{animationDelay: `${index * 0.5}s`}}>{group.icon}</div>
                  <div className="font-bold text-lg">{group.label}</div>
                  <div className="text-sm">{group.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* How It Works Section */}
          <div 
            className={`mt-20 ${isLoaded ? 'animate-slide-up' : 'opacity-0'}`}
            style={{animationDelay: '1.2s'}}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-10">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="glass-effect-dark p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Choose a Plan</h3>
                <p className="text-sm">Select a subscription plan that works best for your child's needs and your budget.</p>
              </div>
              
              {/* Step 2 */}
              <div className="glass-effect-dark p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
                     style={{animationDelay: '0.5s'}}>
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Select Toys</h3>
                <p className="text-sm">Browse our catalog and select toys that match your child's interests and developmental stage.</p>
              </div>
              
              {/* Step 3 */}
              <div className="glass-effect-dark p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"
                     style={{animationDelay: '1s'}}>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Receive & Enjoy</h3>
                <p className="text-sm">Get toys delivered to your doorstep and watch your child learn through play. Exchange toys monthly!</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center mt-16 space-y-4 sm:space-y-0 sm:space-x-10">
            <Link 
              href="/toys" 
              className={`btn-primary flex items-center justify-center w-full sm:w-auto group sm:mr-4 ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{animationDelay: '1.5s'}}
            >
              Explore Toys <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/plans" 
              className={`btn-secondary flex items-center justify-center w-full sm:w-auto group ${isLoaded ? 'animate-fade-scale' : 'opacity-0'}`}
              style={{animationDelay: '1.7s'}}
            >
              View Plans <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}