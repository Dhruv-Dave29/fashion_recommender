import React from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Camera, Star, Sparkles, Crown } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    name: 'Velvet Matte Lipstick',
    brand: 'Arbelle Beauty',
    price: '$24.99',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 2,
    name: 'Liquid Foundation',
    brand: 'Arbelle Beauty',
    price: '$34.99',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 3,
    name: 'Shimmer Eyeshadow Palette',
    brand: 'Arbelle Beauty',
    price: '$45.99',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  },
];

const DemoRecommendations = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-12">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-100 to-pink-100 transform -skew-y-6"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-block">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Crown className="h-8 w-8 text-purple-500" />
                  <span className="text-lg font-semibold text-purple-600">Personalized For You</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Perfect Beauty Match
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Based on your virtual try-on experience, we've curated these products just for you.
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-gray-700">Top Rated</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">AI Selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendations.map((product, index) => (
              <div key={product.id} 
                className="transform hover:-translate-y-2 transition-transform duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProductCard
                  {...product}
                  onAddToCart={() => console.log('Add to cart:', product.id)}
                  onFavorite={() => console.log('Favorite:', product.id)}
                />
              </div>
            ))}
          </div>

          {/* Additional Features Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="h-8 w-8 text-purple-500" />,
                title: "Try Before You Buy",
                description: "Virtual try-on technology lets you see the look before purchasing"
              },
              {
                icon: <Star className="h-8 w-8 text-purple-500" />,
                title: "Guaranteed Match",
                description: "Products selected based on your skin tone and preferences"
              },
              {
                icon: <Sparkles className="h-8 w-8 text-purple-500" />,
                title: "Expert Curation",
                description: "AI-powered recommendations for your perfect look"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DemoRecommendations;