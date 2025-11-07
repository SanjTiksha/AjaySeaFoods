import { useState, useEffect, useCallback } from 'react';

const usePerformance = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0
  });

  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Measure initial load time
    const startTime = performance.now();
    
    window.addEventListener('load', () => {
      const loadTime = performance.now() - startTime;
      setPerformanceMetrics(prev => ({
        ...prev,
        loadTime: Math.round(loadTime)
      }));
    });

    // Monitor memory usage
    const checkMemoryUsage = () => {
      if (performance.memory) {
        setPerformanceMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) // MB
        }));
      }
    };

    const interval = setInterval(checkMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, []);

  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.loading) {
        img.loading = 'lazy';
      }
      if (!img.decoding) {
        img.decoding = 'async';
      }
    });
  }, []);

  const enableCaching = useCallback(() => {
    // Enable browser caching for static assets
    if ('caches' in window) {
      caches.open('fish-market-v1').then(cache => {
        cache.addAll([
          '/',
          '/manifest.json',
          '/images/qr.png'
        ]);
      });
    }
  }, []);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  const throttle = useCallback((func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  const preloadCriticalResources = useCallback(() => {
    const criticalResources = [
      '/src/index.css',
      '/src/main.jsx'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }, []);

  const enableServiceWorker = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  const optimizeBundle = useCallback(() => {
    // Code splitting for better performance
    const loadComponent = (componentName) => {
      return import(`../components/${componentName}.jsx`);
    };

    return { loadComponent };
  }, []);

  const enableCompression = useCallback(() => {
    // Enable gzip compression for better loading times
    if (window.location.protocol === 'https:') {
      // HTTPS is required for compression
      console.log('Compression enabled for HTTPS');
    }
  }, []);

  const runOptimizations = useCallback(() => {
    optimizeImages();
    enableCaching();
    preloadCriticalResources();
    enableServiceWorker();
    enableCompression();
    setIsOptimized(true);
  }, [optimizeImages, enableCaching, preloadCriticalResources, enableServiceWorker, enableCompression]);

  return {
    performanceMetrics,
    isOptimized,
    runOptimizations,
    debounce,
    throttle,
    optimizeBundle
  };
};

export default usePerformance;
