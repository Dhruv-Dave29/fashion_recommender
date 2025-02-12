import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/Product';

interface ProductRecommendationsProps {
  skinTone: string;
  products: Product[];
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  skinTone,
  products
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Recommended Products for {skinTone}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={`product-${product.id || index}`}>
            <ProductCard
              id={product.id || index}
              name={product.name}
              brand={product.brand}
              price={product.price}
              rating={product.rating}
              image={product.image_url || ''}
              mst={product.mst}
              onAddToCart={() => console.log('Added to cart:', product.id, product.name)}
              onFavorite={() => console.log('Added to favorites:', product.id, product.name)}
            />
          </div>
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center text-gray-500">
          No products found for this skin tone.
        </div>
      )}
    </div>
  );
};

export default ProductRecommendations; 