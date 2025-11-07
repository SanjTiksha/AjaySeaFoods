import React from 'react';

const FishCardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 animate-fade-in-up">
          {/* Image Skeleton */}
          <div className="relative overflow-hidden">
            <div className="w-full h-56 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
            
            {/* Stock Badge Skeleton */}
            <div className="absolute top-4 right-4 w-20 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
          
          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Title and Category */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded-lg w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2 animate-pulse"></div>
            </div>
            
            {/* Price and Rating */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="h-8 bg-gray-300 rounded-lg w-20 animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-gray-300 rounded animate-pulse" 
                         style={{ animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
            </div>
            
            {/* Quantity Controls Skeleton */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                <div className="flex items-center space-x-3 bg-white rounded-xl p-1">
                  <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                  <div className="w-12 h-6 bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-8 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="h-6 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mx-auto mt-1 animate-pulse"></div>
              </div>
            </div>
            
            {/* Action Buttons Skeleton */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FishCardSkeleton;
