import { useState, useEffect } from 'react';
import { Activity, Zap, Database, Clock } from 'lucide-react';
import usePerformance from '../hooks/usePerformance';

const PerformanceMonitor = () => {
  const { performanceMetrics, isOptimized, runOptimizations } = usePerformance();
  const [showMonitor, setShowMonitor] = useState(false);

  const getPerformanceScore = () => {
    let score = 100;
    
    if (performanceMetrics.loadTime > 3000) score -= 20;
    if (performanceMetrics.memoryUsage > 50) score -= 15;
    if (performanceMetrics.cacheHitRate < 0.8) score -= 10;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const performanceScore = getPerformanceScore();

  return (
    <>
      {/* Performance Toggle Button */}
      <button
        onClick={() => setShowMonitor(!showMonitor)}
        className="fixed top-4 right-4 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        title="Performance Monitor"
      >
        <Activity className="h-5 w-5" />
      </button>

      {/* Performance Monitor Panel */}
      {showMonitor && (
        <div className="fixed top-20 right-4 w-80 bg-white rounded-lg shadow-2xl border z-40">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Performance Monitor</h3>
              <button
                onClick={() => setShowMonitor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Performance Score */}
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreBg(performanceScore)}`}>
                <span className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}
                </span>
                <span className="ml-2 text-sm text-gray-600">/ 100</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">Performance Score</div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Load Time</span>
                </div>
                <span className={`text-sm font-bold ${
                  performanceMetrics.loadTime < 2000 ? 'text-green-600' :
                  performanceMetrics.loadTime < 3000 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {performanceMetrics.loadTime}ms
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span className={`text-sm font-bold ${
                  performanceMetrics.memoryUsage < 30 ? 'text-green-600' :
                  performanceMetrics.memoryUsage < 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {performanceMetrics.memoryUsage}MB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                </div>
                <span className={`text-sm font-bold ${
                  performanceMetrics.cacheHitRate > 0.8 ? 'text-green-600' :
                  performanceMetrics.cacheHitRate > 0.6 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(performanceMetrics.cacheHitRate * 100)}%
                </span>
              </div>
            </div>

            {/* Optimization Status */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Optimizations</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isOptimized ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isOptimized ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              
              {!isOptimized && (
                <button
                  onClick={runOptimizations}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Enable Optimizations
                </button>
              )}
            </div>

            {/* Performance Tips */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Performance Tips</h4>
              <div className="space-y-2 text-xs text-gray-600">
                {performanceScore < 90 && (
                  <div className="p-2 bg-yellow-50 rounded">
                    💡 Enable image lazy loading for better performance
                  </div>
                )}
                {performanceMetrics.memoryUsage > 50 && (
                  <div className="p-2 bg-red-50 rounded">
                    ⚠️ High memory usage detected. Consider reducing image sizes
                  </div>
                )}
                {performanceMetrics.loadTime > 3000 && (
                  <div className="p-2 bg-orange-50 rounded">
                    🐌 Slow load time. Enable caching and compression
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;
