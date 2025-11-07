import { useState } from 'react';

const FloatingActionButton = ({ children, position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-40`}>
      <div className={`transition-all duration-300 ${isOpen ? 'space-y-3' : 'space-y-0'}`}>
        {/* Action Buttons */}
        <div className={`flex flex-col space-y-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {children}
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 bg-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
          aria-label="Toggle actions"
        >
          <span className="text-2xl">{isOpen ? '✕' : '+'}</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
