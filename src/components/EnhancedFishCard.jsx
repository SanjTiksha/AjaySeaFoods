import { useState } from 'react';
import { Heart, Share2, Star, Eye, ShoppingCart } from 'lucide-react';
import { getDisplayPrice, formatPrice } from '../utils/pricing';
import { getFishImageUrl, handleImageError } from '../utils/imageUtils';
import QRModal from './QRModal';
import QuickViewModal from './QuickViewModal';
import QuantityInput from './QuantityInput';
import { QUANTITY_LIMITS, normalizeQuantity } from '../utils/quantityUtils';

const EnhancedFishCard = ({
  fish,
  shopInfo,
  onToggleFavorite,
  isFavorite = false,
  addToCart,
  onBuyNow,
  cart,
  fishData,
}) => {
  const [showQR, setShowQR] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(QUANTITY_LIMITS.MIN);
  const [isQuantityValid, setIsQuantityValid] = useState(true);

  const handleBuyNowClick = () => {
    if (!isQuantityValid) {
      return;
    }

    const normalizedQuantity = normalizeQuantity(quantity);

    if (onBuyNow) {
      onBuyNow(fish, normalizedQuantity);
    } else {
      // Fallback to QR modal if onBuyNow not provided
      setShowQR(true);
    }
  };

  const handleAddToCart = () => {
    if (!isQuantityValid) {
      return;
    }

    const normalizedQuantity = normalizeQuantity(quantity);

    addToCart(fish, normalizedQuantity);
    setQuantity(QUANTITY_LIMITS.MIN);
  };

  const cartItem = cart.find(item => item.id === fish.id);
  const isInCart = !!cartItem;
  
  // Get promotional pricing
  const priceInfo = getDisplayPrice(fish, fishData?.promotions);
  
  // Debug logging for Surmai and Pomfret only
  if (fish.name === 'Surmai (King Fish)' || fish.name === 'Pomfret (White)') {
    console.log('🐟 Promotion Debug for', fish.name, ':', {
      originalRate: fish.rate,
      promotions: fishData?.promotions,
      priceInfo: priceInfo,
      isDiscounted: priceInfo.isDiscounted,
      discountPercentage: fishData?.promotions?.discountPercentage
    });
  }

  const handleToggleFavorite = () => {
    onToggleFavorite(fish.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fish.name} - ${shopInfo.name}`,
          text: `Check out this fresh ${fish.name} at ₹${fish.rate}/${fish.unit}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
        <div className="relative">
          {/* Image with loading state */}
          <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            <img
              src={getFishImageUrl(fish.image)}
              alt={fish.name}
              className={`w-full h-full object-cover rounded-t-3xl transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                handleImageError(e);
                setImageLoaded(true);
              }}
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
                <button
                  onClick={() => setShowQuickView(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Quick View
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!fish.inStock || !isQuantityValid}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Share Button - moved to top-left */}
            <button
              onClick={handleShare}
              className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-300 transform hover:scale-110"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>

            {/* Favorite Button - moved to top-right */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-600'}`} />
            </button>

            {/* Stock Badge - bottom-right, larger premium size to cover watermark */}
            <div className={`absolute bottom-3 right-3 text-base font-bold px-4 py-2 rounded-xl shadow-md border transition-all duration-300 ${
              fish.inStock 
                ? 'bg-white/70 backdrop-blur-sm text-green-800 border-green-300' 
                : 'bg-white/70 backdrop-blur-sm text-red-800 border-red-300'
            }`}>
              {fish.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {/* Fish Info */}
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {fish.name}
            </h3>
            <p className="text-sm text-gray-500">{fish.category} Fish</p>
            
            {/* Rating */}
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2 font-medium">(4.8)</span>
            </div>
          </div>

          {/* Price and Cart Info */}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">₹{formatPrice(priceInfo.currentPrice)}</span>
            {priceInfo.isDiscounted && (
              <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-lg font-semibold">
                {priceInfo.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Quantity Controls */}
          <div className="space-y-3">
            <QuantityInput
              value={quantity}
              onChange={setQuantity}
              onValidityChange={setIsQuantityValid}
              rate={priceInfo.currentPrice}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={handleAddToCart}
              disabled={!fish.inStock || !isQuantityValid}
              className={`w-1/2 py-2 rounded-xl font-semibold transition-all duration-300 mr-2 ${
                fish.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNowClick}
              disabled={!fish.inStock || !isQuantityValid}
              className={`w-1/2 py-2 rounded-xl font-semibold transition-all duration-300 ${
                fish.inStock
                  ? 'bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {fish.inStock ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>

          {/* Description */}
          {fish.description && (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{fish.description}</p>
          )}

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <span className="text-green-500">🌊</span>
              <span className="font-medium">Fresh Daily</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-blue-500">🚚</span>
              <span className="font-medium">Free Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {showQR && (
        <QRModal
          fish={fish}
          shopInfo={shopInfo}
          onClose={() => setShowQR(false)}
        />
      )}

      {showQuickView && (
        <QuickViewModal
          fish={fish}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          addToCart={addToCart}
          onBuyNow={onBuyNow}
          cart={cart}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      )}
    </>
  );
};

export default EnhancedFishCard;
