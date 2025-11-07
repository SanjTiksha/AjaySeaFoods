import { useState, useEffect } from 'react';

const PromoBanner = ({ promotion }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log('PromoBanner - promotion data:', promotion);
    if (promotion && promotion.expiresOn) {
      const expiryDate = new Date(promotion.expiresOn);
      const now = new Date();
      console.log('PromoBanner - expiry date:', expiryDate, 'current date:', now);
      
      if (now > expiryDate) {
        console.log('PromoBanner - promotion expired, hiding banner');
        setIsVisible(false);
      }
    }
  }, [promotion]);

  console.log('PromoBanner - render check:', {
    promotion: promotion,
    isActive: promotion?.isActive,
    isVisible: isVisible,
    shouldShow: promotion && promotion.isActive && isVisible
  });

  if (!promotion || !promotion.isActive || !isVisible) {
    console.log('PromoBanner - not rendering:', {
      noPromotion: !promotion,
      notActive: !promotion?.isActive,
      notVisible: !isVisible
    });
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <span className="text-2xl flex-shrink-0">🎉</span>
          <div className="flex-1">
            <p className="font-semibold text-lg leading-tight text-left">
              {promotion.text}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full ml-4 flex-shrink-0"
          aria-label="Close promotion"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;

