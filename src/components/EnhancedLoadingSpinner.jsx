import React from 'react';

const EnhancedLoadingSpinner = ({ message = "Loading Fresh Fish Data...", size = "large" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16", 
    large: "h-32 w-32",
    xl: "h-40 w-40"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-50 via-white to-seafoam-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-ocean-200 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-seafoam-200 rounded-full animate-float animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-coral-200 rounded-full animate-float animation-delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-deep-blue-200 rounded-full animate-float animation-delay-400"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Main Spinner */}
        <div className="relative mb-8">
          <div className={`${sizeClasses[size]} border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin mx-auto`}></div>
          
          {/* Outer Ring */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-seafoam-200 border-t-seafoam-600 rounded-full animate-spin mx-auto`} 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          
          {/* Inner Pulse */}
          <div className={`absolute inset-4 ${sizeClasses[size === 'xl' ? 'large' : size === 'large' ? 'medium' : 'small']} bg-gradient-to-r from-ocean-500 to-seafoam-500 rounded-full animate-pulse opacity-20`}></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gradient-ocean animate-fade-in-up">
            {message}
          </h2>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-ocean-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-seafoam-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-3 h-3 bg-coral-500 rounded-full animate-bounce animation-delay-300"></div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-ocean-500 to-seafoam-500 h-full rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Fish Icon Animation */}
        <div className="mt-8 text-6xl animate-float">
          🐟
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoadingSpinner;
