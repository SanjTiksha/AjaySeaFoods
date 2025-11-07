import { useState, useMemo, useEffect } from 'react';
import EnhancedFishCard from '../components/EnhancedFishCard';
import SocialShare from '../components/SocialShare';
import HeroSliderSimple from '../components/HeroSliderSimple';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FishCatalog = ({ fishData, addToCart, onBuyNow, toggleFavorite, favorites, cart, voiceSearchQuery }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  const categories = ['All', 'Seawater', 'Freshwater'];

  useEffect(() => {
    if (typeof voiceSearchQuery === 'string') {
      const trimmedQuery = voiceSearchQuery.trim();
      if (trimmedQuery && trimmedQuery !== searchTerm) {
        setSearchTerm(trimmedQuery);
        setSelectedCategory('All');
        setShowInStockOnly(false);
      }
    }
  }, [voiceSearchQuery, searchTerm]);

  const filteredFishes = useMemo(() => {
    let filtered = fishData.fishes.filter(fish => {
      const matchesSearch = fish.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || fish.category === selectedCategory;
      const matchesStock = !showInStockOnly || fish.inStock;
      const matchesPriceRange = fish.rate >= priceRange.min && fish.rate <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesStock && matchesPriceRange;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rate':
          comparison = a.rate - b.rate;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [fishData.fishes, searchTerm, selectedCategory, showInStockOnly, sortBy, sortOrder, priceRange]);

  const handlePrintRates = () => {
    window.print();
  };

  const handleDownloadRates = async () => {
    try {
      // Create a temporary element for PDF generation
      const tempElement = document.createElement('div');
      tempElement.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #005f73; font-size: 28px; margin-bottom: 10px;">${fishData.shopInfo.name}</h1>
            <p style="color: #666; font-size: 16px;">Today's Fresh Fish Rates</p>
            <p style="color: #666; font-size: 14px;">Updated: ${new Date(fishData.shopInfo.updatedOn).toLocaleDateString('en-IN')}</p>
            <hr style="border: 2px solid #005f73; margin: 20px 0;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #005f73; font-size: 20px; margin-bottom: 15px;">Contact Information</h2>
            <p style="margin: 5px 0;"><strong>Owner:</strong> ${fishData.shopInfo.owner}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${fishData.shopInfo.phone}</p>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${fishData.shopInfo.address}</p>
            <p style="margin: 5px 0;"><strong>Hours:</strong> ${fishData.shopInfo.workingHours}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #005f73; font-size: 20px; margin-bottom: 15px;">Fish Rates</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Fish Name</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Category</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Rate (₹)</th>
                  <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Stock</th>
                </tr>
              </thead>
              <tbody>
                ${filteredFishes.map(fish => `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 10px;">${fish.name}</td>
                    <td style="border: 1px solid #ddd; padding: 10px;">${fish.category}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: right; font-weight: bold;">₹${fish.rate}</td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                      ${fish.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
            <p>Thank you for choosing ${fishData.shopInfo.name}!</p>
            <p>For orders, call: ${fishData.shopInfo.phone}</p>
          </div>
        </div>
      `;
      
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.top = '0';
      document.body.appendChild(tempElement);
      
      const canvas = await html2canvas(tempElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      document.body.removeChild(tempElement);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `Fish_Rates_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-cyan-50 to-white">
      {/* Hero Banner Slider Section */}
      <section className="relative z-10 mt-2 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <HeroSliderSimple />
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="relative py-8 text-center mb-8">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handlePrintRates}
              className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="mr-2">📄</span>
              <span>Print Rates</span>
              <span className="ml-2 text-base group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
            
            <button
              onClick={handleDownloadRates}
              className="group flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="text-base">⬇️</span>
              <span>Download PDF</span>
            </button>
            
            <div className="group flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <SocialShare 
                title="Today's Fresh Fish Rates"
                description="Check out the latest fish prices at Ajay Sea Foods"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 mt-8 relative z-20">
          
          {/* Sidebar Filters - Desktop Only */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🔍 Search & Filter</h3>
              
              <div className="space-y-6">
            {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Fish</label>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search fish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-12 px-4 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="All">All Categories</option>
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category} Fish</option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="rate">Sort by Price</option>
                    <option value="category">Sort by Category</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>

                {/* Price Range Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">💰 Price Range (₹)</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                      <span>₹{priceRange.min}</span>
                      <span>₹{priceRange.max}</span>
                    </div>
                    
                    {/* Dual Range Slider Container */}
                    <div className="relative h-8 flex items-center">
                      {/* Background Track */}
                      <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                      
                      {/* Active Range Track */}
                      <div 
                        className="absolute h-2 bg-blue-500 rounded-lg"
                        style={{
                          left: `${(priceRange.min / 10000) * 100}%`,
                          width: `${((priceRange.max - priceRange.min) / 10000) * 100}%`
                        }}
                      ></div>
                      
                      {/* Min Range Input */}
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange.min}
                        onChange={(e) => {
                          const newMin = parseInt(e.target.value);
                          if (newMin < priceRange.max) {
                            setPriceRange({...priceRange, min: newMin});
                          }
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                        style={{ zIndex: priceRange.min > priceRange.max - 200 ? 5 : 10 }}
                      />
                      
                      {/* Max Range Input */}
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange.max}
                        onChange={(e) => {
                          const newMax = parseInt(e.target.value);
                          if (newMax > priceRange.min) {
                            setPriceRange({...priceRange, max: newMax});
                          }
                        }}
                        className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                        style={{ zIndex: priceRange.max < priceRange.min + 200 ? 5 : 10 }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <span>Min: ₹{priceRange.min}</span>
                      <span>•</span>
                      <span>Max: ₹{priceRange.max}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      className="accent-blue-500 w-5 h-5"
                    />
                    <span className="text-sm text-gray-700 font-medium">Show in-stock only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setShowInStockOnly(false);
                    setSortBy('name');
                    setSortOrder('asc');
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 h-12 rounded-xl text-gray-700 transition-all duration-300 font-medium"
                >
                  🗑️ Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filters - Top Layout */}
          <div className="lg:hidden mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4">
              {/* Search */}
              <div className="relative flex-1 min-w-48">
                <input
                  type="text"
                  placeholder="🔍 Search fish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 px-4 pl-12 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 px-4 border border-gray-200 rounded-xl w-44 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
            >
              <option value="All">All Categories</option>
              {categories.filter(cat => cat !== 'All').map(category => (
                <option key={category} value={category}>{category} Fish</option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 border border-gray-200 rounded-xl w-44 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
            >
              <option value="name">Sort by Name</option>
              <option value="rate">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-12 px-4 border border-gray-200 rounded-xl w-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>

              {/* Price Range Slider - Mobile */}
              <div className="flex-1 min-w-48">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                  
                  {/* Dual Range Slider Container */}
                  <div className="relative h-8 flex items-center">
                    {/* Background Track */}
                    <div className="absolute w-full h-2 bg-gray-200 rounded-lg"></div>
                    
                    {/* Active Range Track */}
                    <div 
                      className="absolute h-2 bg-blue-500 rounded-lg"
                      style={{
                        left: `${(priceRange.min / 10000) * 100}%`,
                        width: `${((priceRange.max - priceRange.min) / 10000) * 100}%`
                      }}
                    ></div>
                    
                    {/* Min Range Input */}
              <input
                      type="range"
                      min="0"
                      max="10000"
                value={priceRange.min}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin < priceRange.max) {
                          setPriceRange({...priceRange, min: newMin});
                        }
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                      style={{ zIndex: priceRange.min > priceRange.max - 200 ? 5 : 10 }}
                    />
                    
                    {/* Max Range Input */}
              <input
                      type="range"
                      min="0"
                      max="10000"
                value={priceRange.max}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax > priceRange.min) {
                          setPriceRange({...priceRange, max: newMax});
                        }
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-10"
                      style={{ zIndex: priceRange.max < priceRange.min + 200 ? 5 : 10 }}
                    />
                  </div>
                </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(e) => setShowInStockOnly(e.target.checked)}
                className="accent-blue-500 w-5 h-5"
              />
              <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Show in-stock only</span>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setShowInStockOnly(false);
                setSortBy('name');
                setSortOrder('asc');
                setPriceRange({ min: 0, max: 10000 });
              }}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 h-12 rounded-xl text-gray-700 transition-all duration-300 font-medium"
            >
              🗑️ Clear All Filters
            </button>
          </div>
        </div>

          {/* Fish Grid - Main Content */}
          <div className="flex-1">
            {/* Premium Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                🐟 Fresh Catch of the Day
              </h2>
              <p className="text-gray-500 text-lg mb-6">Handpicked seafood delivered daily from local fishermen.</p>
            </div>

          {filteredFishes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6 animate-float">🐟</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No fish found</h3>
              <p className="text-gray-600 mb-8 text-lg">Try adjusting your search or filters to find what you're looking for</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setShowInStockOnly(false);
                }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="mr-2">🔄</span>
                Clear Filters
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {filteredFishes.length} Fish Available
                  </h2>
                  <p className="text-gray-500">Fresh catch ready for order</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-md border border-white/20">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">📅 Last updated:</span> {new Date(fishData.shopInfo.updatedOn).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 px-4">
                {filteredFishes.map((fish) => (
                  <EnhancedFishCard
                    key={fish.id}
                    fish={fish}
                    shopInfo={fishData.shopInfo}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.includes(fish.id)}
                    fishData={fishData}
                    addToCart={addToCart}
                    onBuyNow={onBuyNow}
                    cart={cart}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white !important;
          }
          
          .fish-card {
            break-inside: avoid;
            margin-bottom: 1rem;
          }
        }
        
        /* Custom Range Slider Styles */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]:hover::-webkit-slider-thumb {
          background: #2563eb;
          transform: scale(1.1);
        }
        
        input[type="range"]:hover::-moz-range-thumb {
          background: #2563eb;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default FishCatalog;

