import React from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import Button from './Button';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  price: string;
  rating: number;
  image: string;
  onAddToCart?: () => void;
  onFavorite?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  price,
  rating,
  image,
  onAddToCart,
  onFavorite,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onFavorite}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-purple-600 font-medium">
            {brand}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {name}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {price}
          </span>
          <Button
            variant="primary"
            icon={ShoppingCart}
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard