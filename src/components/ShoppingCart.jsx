import { useState, useEffect, useMemo } from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { getFishImageUrl, handleImageError } from '../utils/imageUtils';
import QuantityInput from './QuantityInput';
import { calculateLineTotal, normalizeQuantity } from '../utils/quantityUtils';

const ShoppingCart = ({ isOpen, onClose, cart, onUpdateCart, onRemoveItem, onClearCart, onCheckout, fishData }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [invalidItems, setInvalidItems] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the modal is rendered before animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setInvalidItems({});
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const unitPrice = item.price || item.rate;
      return total + calculateLineTotal(unitPrice, item.quantity);
    }, 0);
  }, [cart]);

  const discount = useMemo(() => {
    const discountSettings = fishData?.discountSettings || {
      isEnabled: true,
      percentage: 5,
      minimumAmount: 1000,
    };

    if (discountSettings.isEnabled && subtotal >= discountSettings.minimumAmount) {
      return parseFloat((subtotal * (discountSettings.percentage / 100)).toFixed(2));
    }

    return 0;
  }, [subtotal, fishData?.discountSettings]);

  const totalPrice = useMemo(() => parseFloat((subtotal - discount).toFixed(2)), [subtotal, discount]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + normalizeQuantity(item.quantity), 0);
  }, [cart]);

  const hasInvalidQuantities = useMemo(
    () => Object.values(invalidItems).some((value) => value === true),
    [invalidItems],
  );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className={`bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-[33.6rem] max-h-[90vh] flex flex-col transform transition-all duration-300 ${
          isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {totalItems.toFixed(1)} kg
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {/* Clear Cart Button - Only show if cart has items */}
            {cart.length > 0 && onClearCart && (
              <button
                onClick={onClearCart}
                className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                title="Clear Cart"
              >
                <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-700" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Add some fresh fish to get started!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <img
                  src={getFishImageUrl(item.image)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={handleImageError}
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.weight ? 
                      `₹${item.price || item.rate}/${item.unit || 'kg'} × ${item.weight}kg` : 
                      `₹${item.price || item.rate}/${item.unit || 'kg'}`
                    }
                  </p>
                </div>
                <div className="w-[120px] sm:w-[140px]">
                  <QuantityInput
                    value={item.quantity}
                    onChange={(updatedQuantity) => onUpdateCart(item.id, updatedQuantity)}
                    onValidityChange={(isValid) =>
                      setInvalidItems((prev) => ({ ...prev, [item.id]: !isValid }))
                    }
                    rate={item.price || item.rate}
                    variant="compact"
                  />
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">
                    ₹{calculateLineTotal(item.price || item.rate, item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({fishData?.discountSettings?.percentage || 5}% {fishData?.discountSettings?.description || "off ₹1000+"}):</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
              
              <hr className="border-gray-200" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-blue-600">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-3">
              {/* Clear Cart Button - Bottom */}
              {onClearCart && (
                <button
                  onClick={onClearCart}
                  className="w-full py-2.5 px-4 border-2 border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 hover:border-red-400 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
              )}
              
              {hasInvalidQuantities && (
                <p className="text-xs text-red-500 text-center">
                  Update failed — please re-check quantity or try again.
                </p>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={() => {
                    if (onCheckout && !hasInvalidQuantities) {
                      onCheckout(cart, totalPrice);
                    }
                  }}
                  disabled={hasInvalidQuantities}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
