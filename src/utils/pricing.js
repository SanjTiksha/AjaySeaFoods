// Utility functions for pricing calculations including promotional discounts

export const getPromotionalPrice = (fish, promotions) => {
  if (!promotions || !promotions.isActive) {
    return fish.rate; // Return original rate if no active promotion
  }

  // Check if this fish is in the discounted fish list
  const isDiscounted = promotions.discountedFish && 
    promotions.discountedFish.includes(fish.name);

  if (isDiscounted && promotions.discountPercentage && promotions.discountPercentage > 0) {
    const discountAmount = fish.rate * (promotions.discountPercentage / 100);
    return fish.rate - discountAmount;
  }

  return fish.rate; // Return original rate if not discounted
};

export const getDisplayPrice = (fish, promotions) => {
  const promotionalPrice = getPromotionalPrice(fish, promotions);
  const originalPrice = fish.rate;
  
  return {
    currentPrice: promotionalPrice,
    originalPrice: originalPrice,
    isDiscounted: promotionalPrice < originalPrice,
    discountPercentage: promotions?.discountPercentage || 0
  };
};

export const formatPrice = (price) => {
  return price.toFixed(0);
};
