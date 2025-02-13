import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { Camera, Star, Sparkles, Crown, Shirt, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductRecommendations from '../components/ProductRecommendations';
import { Product } from '../types/Product';

interface SkinAnalysisResult {
  label: string;
  confidences: null;
}

interface ApiProduct {
  product?: string;
  name?: string;
  brand?: string;
  Brand?: string;
  Product_Name?: string;
  "Product Name"?: string;
  Price?: string;
  Image_URL?: string;
  "Image URL"?: string;
  imgSrc?: string;
  image?: string;
  image_url?: string;
  product_name?: string;
  price?: string;
  rating?: number;
  mst: string;
}

interface Product {
  'Product Name': string;
  'Price': string;
  'Product Type': string;
  'Image URL': string;
}

const DemoRecommendations = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [skinHex] = useState<string>('');  // Removed unused setter
  const [monkHex] = useState<string>('');  // Removed unused setter
  const [activeTab, setActiveTab] = useState<'makeup' | 'outfit'>('makeup');
  const [outfits, setOutfits] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedAnalysis = sessionStorage.getItem('skinAnalysis');
        if (!storedAnalysis) {
          throw new Error('No skin analysis found. Please complete the skin analysis first.');
        }

        const analysisArray = JSON.parse(storedAnalysis);
        setSkinAnalysis(analysisArray[0]);

        let response;
        let transformedProducts;

        if (activeTab === 'makeup') {
          // Fetch makeup products from /data/ endpoint
          response = await fetch(`http://localhost:8000/data/?mst=${analysisArray[0].label}&page=1&limit=15`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch makeup recommendations');
          }

          const data = await response.json();
          transformedProducts = data.data.map((item: ApiProduct) => ({
            id: Math.random(),
            name: item.product_name || item.Product_Name || item.name || '',
            brand: item.brand || item.Brand || 'Unknown',
            price: item.price || item.Price || '$29.99',
            rating: item.rating || 4.5,
            image: item.imgSrc || item.image_url || item.Image_URL || item.image || '',
            image_url: item.imgSrc || item.image_url || item.Image_URL || item.image || '',
            mst: item.mst || ''
          }));

          // Debug log for makeup products
          console.log('Makeup product data:', data.data[0]);
          console.log('Transformed makeup product:', transformedProducts[0]);
        } else {
          // Fetch random outfit products from /api/random-outfits endpoint
          response = await fetch('http://localhost:8000/api/random-outfits?limit=24');
          
          if (!response.ok) {
            throw new Error('Failed to fetch outfit recommendations');
          }

          const data = await response.json();
          console.log('Received data:', data); // Debug log
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          setOutfits(data.data);
          setError(null);
        }

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, activeTab]);

  // Pagination calculations
  const totalPages = Math.ceil(outfits.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = outfits.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers array
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

        {/* Tab Buttons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab('makeup')}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'makeup'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <Sparkles className="h-5 w-5" />
              <span>Makeup</span>
            </button>
            <button
              onClick={() => setActiveTab('outfit')}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'outfit'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-purple-50'
              }`}
            >
              <Shirt className="h-5 w-5" />
              <span>Outfits</span>
            </button>
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
              {activeTab === 'makeup' ? (
                <ProductRecommendations 
                  skinTone={skinAnalysis?.label || ''}
                  products={products}
                  type={activeTab}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentItems.map((product, index) => (
                      <ProductCard
                        key={index}
                        id={index}
                        name={product['Product Name']}
                        brand="H&M"
                        price={product['Price']}
                        image={product['Image URL']}
                        rating={4.5}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      <div className="flex space-x-1">
                        {pageNumbers.map((number) => (
                          <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`px-4 py-2 rounded-md ${
                              currentPage === number
                                ? 'bg-purple-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </>
              )}

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