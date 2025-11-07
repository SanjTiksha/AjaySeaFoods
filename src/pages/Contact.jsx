
const MAP_SHARE_URL = 'https://maps.app.goo.gl/uq25p5EM74ANHTaFA';
const MAP_EMBED_URL =
  'https://www.google.com/maps?q=18.5725928,73.8344218&hl=en&z=17&output=embed';

const Contact = ({ shopInfo }) => {
  const handleWhatsApp = () => {
    const phoneNumber = shopInfo.whatsapp || shopInfo.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phoneNumber}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${shopInfo.email}`);
  };

  const handleDirections = () => {
    window.open(MAP_SHARE_URL);
  };

  return (
    <div className="min-h-screen bg-cyan-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-cyan-50 max-w-3xl mx-auto">
              Get in touch for the freshest fish and best prices
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're here to help you get the freshest fish. Choose your preferred way to contact us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* WhatsApp */}
            <div className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp Us</h3>
              <p className="text-gray-600 mb-4">Quick messages and orders</p>
              <button
                onClick={handleWhatsApp}
                className="btn-primary w-full"
              >
                WhatsApp Now
              </button>
            </div>


            {/* Email */}
            <div className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Send us your requirements</p>
              <button
                onClick={handleEmail}
                className="btn-primary w-full"
              >
                Send Email
              </button>
            </div>

            {/* Directions */}
            <div className="card p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Get directions to our shop</p>
              <button
                onClick={handleDirections}
                className="btn-primary w-full"
              >
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Details */}
      <section className="py-16 bg-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">🏪</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Shop Name</h3>
                    <p className="text-gray-600">{shopInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">👨‍💼</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Owner</h3>
                    <p className="text-gray-600">{shopInfo.owner}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">📍</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Address</h3>
                    <p className="text-gray-600">{shopInfo.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">📞</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                    <a 
                      href={`tel:${shopInfo.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {shopInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">📧</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Email</h3>
                    <a 
                      href={`mailto:${shopInfo.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {shopInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">⏰</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Working Hours</h3>
                    <p className="text-gray-600">{shopInfo.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="card p-8">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">🗺️ Find Us on the Map</h2>
                  <p className="text-gray-600">Visit Ajay Sea Foods – Fresh Every Morning!</p>
                </div>
                <button
                  onClick={handleDirections}
                  className="btn-primary px-6 py-2"
                >
                  Open in Maps
                </button>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <iframe
                  title="Ajay Sea Foods Location"
                  src={MAP_EMBED_URL}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[450px] border-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-gray-600">Get what you need quickly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/fish"
              className="card p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-4">🐟</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">View Fish Rates</h3>
              <p className="text-gray-600">Check today's fish prices and availability</p>
            </a>

            <a
              href="/about"
              className="card p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-4">ℹ️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">About Us</h3>
              <p className="text-gray-600">Learn more about our fish market</p>
            </a>

            <button
              onClick={handleWhatsApp}
              className="card p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Order Now</h3>
              <p className="text-gray-600">Place your order via WhatsApp</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

