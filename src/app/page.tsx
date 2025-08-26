'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, Shield, Truck, Heart, Users, Award } from 'lucide-react';
import { ageGroups } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();

  const handleAgeGroupClick = (ageGroup: string) => {
    router.push(`/toys?age=${encodeURIComponent(ageGroup)}`);
  };

  const benefits = [
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: "Curated Selection",
      description: "Every toy is carefully selected by child development experts"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Safety First",
      description: "All toys are sanitized and meet international safety standards"
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      title: "Free Delivery",
      description: "Free shipping and returns across India"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Age Appropriate",
      description: "Toys matched perfectly to your child's developmental stage"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Expert Support",
      description: "Get guidance from our child development specialists"
    },
    {
      icon: <Award className="h-8 w-8 text-orange-500" />,
      title: "Premium Quality",
      description: "Only the highest quality toys from trusted brands"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-screen flex items-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/15 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/12 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        {/* Toy Illustrations - Enhanced */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl opacity-30 animate-float">🧸</div>
          <div className="absolute top-20 right-20 text-5xl opacity-25 animate-float" style={{animationDelay: '1.5s'}}>🚗</div>
          <div className="absolute bottom-20 left-1/4 text-7xl opacity-20 animate-float" style={{animationDelay: '3s'}}>🎨</div>
          <div className="absolute bottom-10 right-10 text-6xl opacity-25 animate-float" style={{animationDelay: '0.5s'}}>🎵</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10 animate-float" style={{animationDelay: '2.5s'}}>🎪</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-scale">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              Discover. Play. Learn.
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-white/90 font-light">
              The ultimate toy subscription service that brings joy, learning, and development 
              right to your doorstep every month.
            </p>
            
            {/* Age Category Buttons - Modern Design */}
            <div className="mb-16 animate-slide-up">
              <h2 className="text-3xl font-semibold mb-8 text-white/95">Choose Your Child's Age Group</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {ageGroups.map((group, index) => (
                  <button
                    key={group.id}
                    onClick={() => handleAgeGroupClick(group.id)}
                    className="glass-strong rounded-2xl p-8 hover:bg-white/25 transition-all duration-500 transform hover:scale-105 group backdrop-blur-xl"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">👶</div>
                    <div className="font-bold text-xl text-white mb-2">{group.label}</div>
                    <div className="text-sm text-white/80 mb-4">{group.description}</div>
                    <ArrowRight className="h-5 w-5 mx-auto opacity-0 group-hover:opacity-100 transition-all duration-300 text-white" />
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons - Modern Design */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up">
              <Link
                href="/toys"
                className="bg-white/95 backdrop-blur-xl text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Explore Toys
                <ArrowRight className="h-6 w-6" />
              </Link>
              <Link
                href="/pricing"
                className="glass-strong border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-3 backdrop-blur-xl transform hover:scale-105"
              >
                View Plans
                <ArrowRight className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-scale">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Why Choose PlayPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're committed to providing the best toy subscription experience for your family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="modern-card p-8 group cursor-pointer animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-purple-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to endless fun and learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Your Plan</h3>
              <p className="text-gray-600">
                Select the perfect subscription plan based on your preferences and budget
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">We Curate</h3>
              <p className="text-gray-600">
                Our experts handpick age-appropriate toys that promote learning and development
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Enjoy & Learn</h3>
              <p className="text-gray-600">
                Receive your monthly box and watch your child discover, play, and learn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start the Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families who trust PlayPro for their children's play and learning journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/toys"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              Browse Toys First
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}