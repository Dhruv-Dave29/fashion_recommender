import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  ArrowRight, 
  Sparkle, 
  Camera, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: "Virtual Try-On",
    description: "Experience makeup products in real-time with our advanced AR technology"
  },
  {
    icon: ShoppingBag,
    title: "Smart Recommendations",
    description: "Get personalized product suggestions based on your skin tone and preferences"
  },
  {
    icon: Users,
    title: "Multi-Platform Support",
    description: "Seamless experience across web and mobile devices"
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard",
    description: "Track user engagement and conversion metrics in real-time"
  }
];

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600",
    alt: "Makeup Application"
  },
  {
    url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
    alt: "Beauty Products"
  },
  {
    url: "https://images.unsplash.com/photo-1596704017704-0b27b1c0af01?auto=format&fit=crop&q=80&w=600",
    alt: "Virtual Try-On"
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100 via-pink-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-purple-200 to-transparent opacity-30 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8 relative">
              <div className="absolute -left-20 -top-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <h1 className="text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 leading-tight">
                Beauty AR & AI Solutions
              </h1>
              <p className="text-xl text-gray-600 max-w-xl relative">
                Drive sales across channels with beauty AR and AI solutions designed for cosmetic brands
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/demo"
                  className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try Live Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-purple-600 bg-white/80 backdrop-blur hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg border border-purple-100">
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-[2rem] blur-2xl opacity-30 transform rotate-6"></div>
              <div className="relative bg-white/50 backdrop-blur-sm p-4 rounded-[2rem] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80"
                  alt="Beauty AR Demo"
                  className="rounded-2xl shadow-lg w-full object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Sparkle className="h-6 w-6 text-purple-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI-Powered Beauty Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Transform Your Beauty Experience
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover the power of AI-driven beauty technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="group bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-50"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="p-3 bg-purple-50 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Get started with virtual try-on in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Take or Upload Photo
              </h3>
              <p className="text-gray-600">
                Use your camera or upload a photo to start the virtual try-on experience
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Choose Products
              </h3>
              <p className="text-gray-600">
                Select from a wide range of makeup products and colors to try on
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get Recommendations
              </h3>
              <p className="text-gray-600">
                Receive personalized product recommendations based on your preferences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              See It in Action
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Experience the magic of virtual makeup try-on
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkle className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold">Arbelle</span>
              </div>
              <p className="text-gray-400">
                Transforming the beauty industry with AI-powered AR technology
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#press" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#documentation" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#twitter" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#linkedin" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#facebook" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#instagram" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 HueMatch Beauty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;