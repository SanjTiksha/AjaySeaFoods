
// shopInfo will be passed as props from App component

const About = ({ shopInfo }) => {
  return (
    <div className="min-h-screen bg-cyan-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About {shopInfo.name}</h1>
            <p className="text-xl md:text-2xl text-cyan-50 max-w-3xl mx-auto">
              Your trusted partner for fresh, quality fish for over 15 years
            </p>
          </div>
        </div>
      </section>

      {/* Shop Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                {shopInfo.name} has been serving the community with the freshest fish for over 15 years. 
                We believe in bringing you the best quality seafood directly from the source, ensuring 
                every fish that reaches your table is fresh, healthy, and delicious.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our commitment to quality and customer satisfaction has made us the preferred choice 
                for both retail customers and restaurants in the area. We source our fish directly 
                from local fishermen, ensuring the freshest catch every morning.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="/fish"
                  className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <span>View Fish Rates</span>
                  <span className="ml-2 text-base group-hover:translate-x-1 transition-transform duration-300">→</span>
                </a>
                
                <a
                  href={`https://wa.me/${shopInfo.whatsapp || shopInfo.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="text-base">💬</span>
                  <span>WhatsApp Now</span>
                </a>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl p-4 sm:p-8">
              <img
                src="/images/OurStory.jpg"
                alt="Our Story - Ajay Sea Foods"
                className="w-full h-auto max-h-[480px] object-cover rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Owner Introduction */}
      <section className="py-16 bg-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Owner</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {shopInfo.ownerPhoto ? (
                    <img
                      src={shopInfo.ownerPhoto}
                      alt={shopInfo.owner}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                      alt={shopInfo.owner}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  )}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{shopInfo.owner}</h3>
                  <p className="text-lg text-red-500 font-medium mb-4">Owner & Founder</p>
                  <blockquote className="text-lg text-gray-600 italic mb-6">
                    "Quality fish is not just our business, it's our passion. We ensure every customer 
                    gets the freshest catch at the best prices. Your satisfaction is our success."
                  </blockquote>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">15+</div>
                      <div className="text-sm text-gray-600">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1000+</div>
                      <div className="text-sm text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">24/7</div>
                      <div className="text-sm text-gray-600">Fresh Supply</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Shop</h2>
            <p className="text-gray-600">Come and experience the freshest fish in town</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24 lg:pb-16">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📍</span>
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">{shopInfo.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📞</span>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <a href={`tel:${shopInfo.phone}`} className="text-blue-600 hover:underline">
                        {shopInfo.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">📧</span>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <a href={`mailto:${shopInfo.email}`} className="text-blue-600 hover:underline">
                        {shopInfo.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-4">⏰</span>
                    <div>
                      <p className="font-medium text-gray-900">Working Hours</p>
                      <p className="text-gray-600">{shopInfo.workingHours}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card p-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">🗺️ Find Us on the Map</h3>
                  <p className="text-gray-600">Visit Ajay Sea Foods – Fresh Every Morning!</p>
                </div>
                <button
                  onClick={() => window.open('https://maps.app.goo.gl/uq25p5EM74ANHTaFA', '_blank', 'noopener,noreferrer')}
                  className="btn-primary px-6 py-2"
                >
                  Open in Maps
                </button>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <iframe
                  title="Ajay Sea Foods Location"
                  src="https://www.google.com/maps?q=18.5725928,73.8344218&hl=en&z=17&output=embed"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[350px] md:h-[400px] border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

