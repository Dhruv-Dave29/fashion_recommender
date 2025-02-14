import React, { useState, Suspense, lazy } from 'react';
// import ProductCard from './ProductCard';
import { Product } from '../types/Product';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

interface ProductRecommendationsProps {
  skinTone: string;
  products: Product[];
  productsPerPage?: number;
  type: 'makeup' | 'outfit';
}

// Rename to LazyProductCard
const LazyProductCard = lazy(() => import('./ProductCard'));

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  skinTone,
  products,
  productsPerPage = 8,
  type
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Ensure products is an array
  const safeProducts = Array.isArray(products) ? products : [];
  
  // Calculate pagination values
  const totalPages = Math.ceil(safeProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = safeProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Generate page numbers array
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Add loading state check
  if (!safeProducts || safeProducts.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Recommended {type === 'makeup' ? 'Makeup' : 'Outfits'} for {skinTone}
        </h2>
        <div className="text-center py-8 text-gray-500">
          No {type === 'makeup' ? 'makeup products' : 'outfits'} found for your skin tone. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">
        Recommended {type === 'makeup' ? 'Makeup' : 'Outfits'} for {skinTone}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <Suspense key={product.id || product.name} fallback={<ProductCardSkeleton />}>
            <LazyProductCard
              key={product.id || product.name}
              id={product.id || 0}
              name={product.name}
              brand={product.brand}
              desc={product.brand==="H%26M" ? '' : product.desc}
              price={product.price}
              rating={product.rating}
              image={product.image || product.image_url}
              mst={product.mst}
              onAddToCart={() => {
                console.log('Add to cart:', product.name);
              }}
              onFavorite={() => {
                console.log('Add to favorites:', product.name);
              }}
            />
          </Suspense>
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
            <ChevronLeftIcon className="h-5 w-5" />
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
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations; 