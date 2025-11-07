import { useState, useEffect } from 'react';
import { X, Gift, Clock, Star } from 'lucide-react';

const PromoPopup = ({ promotion, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenToday, setHasSeenToday] = useState(false);

  useEffect(() => {
    // Check if user has seen promotion today
    const today = new Date().toDateString();
    const lastSeen = localStorage.getItem('promo-last-seen');
    
    if (lastSeen !== today && promotion && promotion.isActive) {
      // Check if promotion hasn't expired
      const expiryDate = new Date(promotion.expiresOn);
      const now = new Date();
      
      if (now <= expiryDate) {
        setTimeout(() => {
          setIsVisible(true);
        }, 2000); // Show after 2 seconds
      }
    }
  }, [promotion]);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as seen today
    const today = new Date().toDateString();
    localStorage.setItem('promo-last-seen', today);
    onClose && onClose();
  };

  const handleClaimOffer = () => {
    // You can add analytics or redirect logic here
    console.log('User claimed promotion:', promotion.text);
    handleClose();
  };

  if (!isVisible || !promotion || !promotion.isActive) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="relative p-6 pb-4">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Promotion Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Special Offer!
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                {promotion.text}
              </p>
              
              {/* Features */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Limited Time Offer</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Premium Quality Fish</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleClaimOffer}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  🎉 Claim This Offer
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>

              {/* Expiry Info */}
              <p className="text-xs text-gray-400 mt-4">
                Expires: {new Date(promotion.expiresOn).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoPopup;
