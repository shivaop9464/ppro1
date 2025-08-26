'use client';

import { Heart, Users, Award, Target, Lightbulb, Shield } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '50,000+', label: 'Happy Families' },
    { number: '500+', label: 'Curated Toys' },
    { number: '15+', label: 'Cities Served' },
    { number: '4.9/5', label: 'Customer Rating' }
  ];

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Child-Centric',
      description: 'Every decision we make is centered around what\'s best for children\'s development and happiness.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Safety First',
      description: 'We maintain the highest safety standards and rigorously test every toy before it reaches your home.'
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: 'Innovation',
      description: 'We constantly evolve our selection and service to bring you the latest in educational play.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Community',
      description: 'We believe in building a community of parents who value quality play and child development.'
    }
  ];

  const team = [
    // Team section removed
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero min-h-[70vh] flex items-center relative overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/15 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center animate-fade-scale">
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              About PlayPro
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-white/90 font-light">
              We're on a mission to make quality play accessible to every child, 
              fostering development through carefully curated toys.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  PlayPro was born from a simple observation: parents want the best for their children, 
                  but finding quality, age-appropriate toys can be overwhelming and expensive.
                </p>
                <p>
                  Founded in 2020 by child development experts and concerned parents, we set out to 
                  create a service that would make quality play accessible to every family.
                </p>
                <p>
                  Today, we're proud to serve thousands of families across India, bringing carefully 
                  curated, educational toys right to their doorstep.
                </p>
              </div>
            </div>
            <div className="animate-fade-scale">
              <div className="modern-card p-8 text-center">
                <div className="text-6xl mb-6">🏆</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Award Winning Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Recognized as "Best Toy Subscription Service" by Parents Magazine and 
                  "Innovation in Child Development" by Early Learning Association.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-scale">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              These core values guide everything we do at PlayPro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="modern-card p-8 group animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                    {value.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-scale">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Be part of a community that's revolutionizing how children play and learn
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/pricing"
                className="bg-white/95 backdrop-blur-xl text-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Start Your Journey
              </a>
              <a
                href="/contact"
                className="glass-strong border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center gap-3 backdrop-blur-xl transform hover:scale-105"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}