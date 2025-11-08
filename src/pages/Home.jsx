import { Link, useLocation } from 'react-router-dom';
import Reviews from '../components/Reviews';
import HeroSliderSimple from '../components/HeroSliderSimple';
import SmartBanner from '../components/SmartBanner';
import { getFishImageUrl, handleImageError } from '../utils/imageUtils';

const Home = ({ fishData, refreshFishData }) => {
  const featuredFishes = fishData.fishes.slice(0, 4);
  const location = useLocation();
  
  // Check if user is admin (only through URL parameter for security)
  const isAdmin = new URLSearchParams(location.search).get('admin') === 'true';

  return (
    <div className="min-h-screen">
      {/* Evening Selection Banner - Separate Section */}
      <section className="relative z-20 pt-6 pb-4 px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="max-w-7xl mx-auto">
          <SmartBanner fishData={fishData} />
        </div>
      </section>

      {/* Hero Slider Section - Fresh Fish Every Morning */}
      <section className="relative z-10 mt-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <HeroSliderSimple />
          </div>
        </div>
      </section>

      {/* Additional Hero Content for Better Visual Impact */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Premium Quality</span> Fish
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl mx-auto">
              Direct from the ocean to your table. We bring you the freshest catch every morning with guaranteed quality and competitive prices.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Fresh Daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Best Prices</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section (Why Choose Us) */}
      <section className="relative z-20 py-12 sm:py-16 bg-gradient-to-b from-blue-50 via-cyan-50 to-white overflow-hidden">
        {/* Safe background layer (always behind text) */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-gradient-to-r from-blue-100/20 to-cyan-100/20 animate-pulse opacity-10"></div>
        </div>

        {/* Content container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Title & Description */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight drop-shadow-md">
              Why Choose Us?
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-base sm:text-lg text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
              Discover why customers trust Ajay Sea Foods for unmatched freshness, quality, and service — every single day.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Fresh Daily */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                  <span className="text-3xl animate-float">🌊</span>
                </div>
                <div className="absolute inset-0 rounded-2xl border-4 border-blue-300/30 group-hover:border-blue-400/60 transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                Fresh Daily
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Caught fresh every morning, delivered to your doorstep with maximum freshness and quality guaranteed.
              </p>
            </div>

            {/* Best Prices */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                  <span className="text-3xl animate-float">💰</span>
                </div>
                <div className="absolute inset-0 rounded-2xl border-4 border-green-300/30 group-hover:border-green-400/60 transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300">
                Best Prices
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Wholesale rates for retail customers — no middlemen, no markup. Better prices straight from the source.
              </p>
            </div>

            {/* Quick Delivery */}
            <div className="text-center group">
              <div className="relative mb-4">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white p-6 rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl">
                  <span className="text-3xl animate-float">🚚</span>
                </div>
                <div className="absolute inset-0 rounded-2xl border-4 border-red-300/30 group-hover:border-red-400/60 transition-all duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
                Quick Delivery
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Fast and reliable delivery with temperature-controlled packaging — same-day delivery available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Fish Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-cyan-50 via-white to-blue-50 relative overflow-hidden mt-8">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-cyan-200 rounded-full animate-float animation-delay-200"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-200 rounded-full animate-float animation-delay-300"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4 animate-fade-in-up">Today's Featured Fish</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-4 rounded-full animate-fade-in-up animation-delay-200"></div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
              Fresh catch available now at premium quality with guaranteed freshness and competitive pricing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredFishes.map((fish, index) => (
              <div key={fish.id} className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fade-in-up`} style={{animationDelay: `${(index + 1) * 200}ms`}}>
                <div className="relative overflow-hidden">
                  <img
                    src={getFishImageUrl(fish.image)}
                    alt={fish.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                    <div className="flex transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <Link
                        to={`/fish?highlight=${encodeURIComponent(fish.name || '')}`}
                        className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-xl font-bold hover:bg-white/30 transition-all duration-300"
                      >
                        Quick View
                      </Link>
                    </div>
                  </div>
                  
                  {/* Enhanced Stock Badge */}
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm transition-all duration-300 ${
                    fish.inStock 
                      ? 'bg-green-500/90 text-white shadow-lg' 
                      : 'bg-red-500/90 text-white shadow-lg'
                  }`}>
                    {fish.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ocean-600 transition-colors duration-300">{fish.name}</h3>
                    <p className="text-sm text-gray-600 capitalize font-medium bg-ocean-50 text-ocean-700 px-3 py-1 rounded-full inline-block">
                      {fish.category} Fish
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold text-gradient-ocean">₹{fish.rate}</span>
                        <span className="text-gray-600 font-medium">/kg</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-sm">⭐</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">(4.8)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                to="/fish"
                className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <span>View All Fish</span>
                <span className="ml-2 text-base group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
              
              <a
                href={`https://wa.me/${fishData.shopInfo.whatsapp || fishData.shopInfo.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="text-base">💬</span>
                <span>WhatsApp Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers about their experience with Ajay Sea Foods.
            </p>
            
          </div>
          <Reviews 
            isAdmin={isAdmin} 
            reviews={fishData.reviews || []} 
            onUpdateReviews={refreshFishData ? async (updatedReviews) => {
              try {
                // Update reviews directly in Firestore
                const { updateReviews } = await import('../services/firestoreService');
                await updateReviews(updatedReviews);
                
                // Refresh fish data from Firestore
                await refreshFishData();
              } catch (error) {
                console.error('Error updating reviews:', error);
              }
            } : undefined} 
          />
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden mt-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg md:text-xl mb-6 text-blue-100 max-w-3xl mx-auto">
            Contact us now for the freshest fish at the best prices with guaranteed quality and fast delivery.
          </p>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm font-medium">No Middlemen</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm font-medium">Fresh Daily</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm font-medium">Best Prices Guaranteed</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${fishData.shopInfo.whatsapp || fishData.shopInfo.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold text-base shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="text-lg">💬</span>
              <span>WhatsApp Now</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;


