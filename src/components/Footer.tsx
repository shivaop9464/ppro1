import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              🧸 PlayPro
            </div>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Discover, play, and learn with our curated toy subscription service. 
              Quality toys delivered to your doorstep every month.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
                <span className="sr-only">Instagram</span>
                📸
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-300">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/toys" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Toy Catalog
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-gray-300 hover:text-white text-sm transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-sm rounded-lg px-2 py-1 inline-block">
                  Safety Standards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 PlayPro. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Made with ❤️ for children everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}