import React, { useEffect } from 'react';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  price: string;
  rating?: number;
  image: string;
  mst?: string;
  desc: string;
  onAddToCart?: () => void;
  onFavorite?: () => void;
  type?: 'makeup' | 'outfit';
}

// useEffect(()=>{

//   }
// },[])
// const storedAnalysis1 = sessionStorage.getItem('skinAnalysis');
// if (!storedAnalysis1) {
//   throw new Error('No skin analysis found. Please complete the skin analysis first.');}
// const analysisArray1 = JSON.parse(storedAnalysis1);

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  brand,
  price,
  image,
  desc,
  onAddToCart,
  onFavorite,
  type = 'makeup'
}) => {
  // Clean image URL for outfits
  const displayImage = type === 'outfit' 
    ? image.replace(/^http:\/\/assets\.myntassets\.com\/.*?(v1\/images\/style\/properties|v1\/image\/style\/properties)\//, '')
    : image;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{brand}</div>
        <h3 className="font-medium text-gray-900 mb-2 break-words">
          {name}
          {type === 'makeup' && desc && (
            <span className="block text-sm text-gray-600 mt-1">{desc}</span>
          )}
        </h3>
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold text-gray-900">{price}</span>
          <div className="flex space-x-2">
            <button
              onClick={onFavorite}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onAddToCart}
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;