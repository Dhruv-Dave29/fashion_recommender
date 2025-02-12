import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
// import ProductCard from '../components/ProductCard';
import { Camera, Star, Sparkles, Crown } from 'lucide-react';
import ProductRecommendations from '../components/ProductRecommendations';
import { Product } from '../types/Product';

interface SkinAnalysisResult {
  label: string;
  confidences: null;
}

interface ApiProduct {
  product?: string;
  name?: string;
  brand: string;
  imgSrc?: string;
  image?: string;
  mst: string;
}

const DemoRecommendations = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [skinHex] = useState<string>('');  // Removed unused setter
  const [monkHex] = useState<string>('');  // Removed unused setter

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedAnalysis = sessionStorage.getItem('skinAnalysis');
        if (!storedAnalysis) {
          throw new Error('No skin analysis found. Please complete the skin analysis first.');
        }

        const analysisArray = JSON.parse(storedAnalysis);
        console.log('Skin Analysis Data:', analysisArray);

        const monkData = analysisArray[0] as SkinAnalysisResult;
        const derivedHex = analysisArray[1] as string;
        const monkHexColor = analysisArray[2] as string;
        
        setSkinAnalysis(monkData);

        const monkNumber = monkData.label.split(' ')[1];
        const response = await fetch(`http://127.0.0.1:8000/data/?mst=Monk ${monkNumber}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product recommendations');
        }

        const result = await response.json();
        console.log('API Response:', result);

        const transformedProducts = result.data.map((item: ApiProduct, index: number) => ({
          id: index + 1,
          name: item.name || item.product || '',
          brand: item.brand,
          price: '$49.99',
          rating: 4.5,
          image: item.image || '',
          image_url: item.imgSrc || item.image || '',
          mst: item.mst
        }));

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  if (error) {
    return (
      <Layout>
        <div className="text-center">
          <div className="bg-red-50 p-4 rounded-lg inline-block">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate('/demo/try-on')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go to Skin Analysis
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16 pb-12">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-purple-100 to-pink-100 transform -skew-y-6"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {skinAnalysis && (
                <div className="inline-block mb-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Crown className="h-8 w-8 text-purple-500" />
                    <span className="text-lg font-semibold text-purple-600">
                      {skinAnalysis.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg" 
                        style={{ backgroundColor: skinHex }}
                        title="Your Skin Tone"
                      />
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg" 
                        style={{ backgroundColor: monkHex }}
                        title="Matched Monk Scale Color"
                      />
                    </div>
                  </div>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Perfect Beauty Match
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                We've curated these products specifically for your skin tone
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent" />
            </div>
          ) : (
            <>
              <ProductRecommendations 
                skinTone={skinAnalysis?.label || ''}
                products={products}
              />

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
                  <div 
                    key={`feature-${index}`}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DemoRecommendations;