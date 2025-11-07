import { useState, useEffect } from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue-600' }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    'blue-600': 'border-blue-600',
    'red-500': 'border-red-500',
    'white': 'border-white'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-4 ${colorClasses[color]} rounded-full animate-spin`}></div>
      <p className="text-sm text-gray-600">Loading{dots}</p>
    </div>
  );
};

export default LoadingSpinner;
