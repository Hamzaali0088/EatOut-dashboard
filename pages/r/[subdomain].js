import Head from "next/head";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Youtube, ChevronLeft, ChevronRight, Star, ShoppingBag } from "lucide-react";

function groupByCategory(menu) {
  const byCategory = {};
  for (const item of menu) {
    const key = item.category || "Menu";
    if (!byCategory[key]) byCategory[key] = [];
    byCategory[key].push(item);
  }
  return byCategory;
}

export default function TenantWebsitePage({ restaurant, menu, categories }) {
  const grouped = groupByCategory(menu);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const featuredItems = menu.filter(item => item.isFeatured).slice(0, 8);
  const bestSellers = menu.filter(item => item.isBestSeller).slice(0, 6);
  const heroSlides = restaurant?.heroSlides?.filter(slide => slide.isActive) || [];
  
  const primaryColor = restaurant?.themeColors?.primary || '#EF4444';
  const secondaryColor = restaurant?.themeColors?.secondary || '#FFA500';

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(heroSlides.length, 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(heroSlides.length, 1)) % Math.max(heroSlides.length, 1));
  };

  return (
    <>
      <Head>
        <title>{restaurant?.name || "Restaurant"} • RestaurantOS</title>
        <meta
          name="description"
          content={restaurant?.description || "Order delicious food online"}
        />
        <style>{`
          :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-white">
        {/* Top Bar */}
        <div className="bg-black text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              {restaurant?.contactPhone && (
                <a href={`tel:${restaurant.contactPhone}`} className="flex items-center gap-1 hover:text-gray-300">
                  <Phone className="w-3 h-3" />
                  {restaurant.contactPhone}
                </a>
              )}
              {restaurant?.contactEmail && (
                <a href={`mailto:${restaurant.contactEmail}`} className="flex items-center gap-1 hover:text-gray-300">
                  <Mail className="w-3 h-3" />
                  {restaurant.contactEmail}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              {restaurant?.socialMedia?.facebook && (
                <a href={restaurant.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {restaurant?.socialMedia?.instagram && (
                <a href={restaurant.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {restaurant?.socialMedia?.twitter && (
                <a href={restaurant.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {restaurant?.socialMedia?.youtube && (
                <a href={restaurant.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                {restaurant?.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={restaurant.logoUrl} alt={restaurant.name} className="h-14 w-14 rounded-xl object-cover" />
                ) : (
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white" style={{ backgroundColor: primaryColor }}>
                    {(restaurant?.name || "R")[0]}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{restaurant?.name || "Restaurant"}</h1>
                  <p className="text-xs text-gray-500">{restaurant?.tagline || "Delicious food, delivered fast"}</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
                <a href="#menu" className="hover:text-gray-900">Menu</a>
                <a href="#featured" className="hover:text-gray-900">Featured</a>
                <a href="#bestsellers" className="hover:text-gray-900">Best Sellers</a>
                <a href="#contact" className="hover:text-gray-900">Contact</a>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: primaryColor }}>
                <ShoppingBag className="w-4 h-4" />
                Order Now
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Carousel */}
        {heroSlides.length > 0 && (
          <div className="relative h-[400px] md:h-[500px] overflow-hidden">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {slide.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <div className="max-w-2xl">
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{slide.title}</h2>
                      <p className="text-lg md:text-xl text-gray-200 mb-6">{slide.subtitle}</p>
                      {slide.buttonText && (
                        <button className="px-8 py-3 rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: primaryColor }}>
                          {slide.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Featured Items Section */}
        {featuredItems.length > 0 && (
          <section id="featured" className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Items</h2>
                <p className="text-gray-600">Our chef's special recommendations</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                    <div className="relative h-40 overflow-hidden">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-white/95 text-sm font-bold" style={{ color: primaryColor }}>
                          PKR {item.price}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section id="bestsellers" className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Best Selling Items</h2>
                <p className="text-gray-600">Customer favorites you'll love</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bestSellers.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                    <div className="relative h-48">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Best Seller
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                        <span className="text-lg font-bold" style={{ color: primaryColor }}>PKR {item.price}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                      <button className="w-full py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: primaryColor }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Full Menu */}
        <section id="menu" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h2>
              <p className="text-gray-600">Explore our complete menu</p>
            </div>

            {Object.keys(grouped).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500">Menu coming soon...</p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(grouped).map(([categoryName, items]) => (
                  <div key={categoryName}>
                    <div className="flex items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 pr-4">{categoryName}</h3>
                      <div className="h-0.5 flex-1" style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">
                          <div className="flex gap-4 p-4">
                            {item.imageUrl && (
                              <div className="w-24 h-24 flex-shrink-0">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                <span className="font-bold whitespace-nowrap" style={{ color: primaryColor }}>PKR {item.price}</span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                              <button className="text-sm font-semibold hover:underline" style={{ color: primaryColor }}>
                                Order Now →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* About */}
              <div>
                <h4 className="font-bold text-lg mb-4">{restaurant?.name || "Restaurant"}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {restaurant?.description || "Delicious food, great service."}
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold text-lg mb-4">Contact Us</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  {restaurant?.contactPhone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {restaurant.contactPhone}
                    </p>
                  )}
                  {restaurant?.contactEmail && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {restaurant.contactEmail}
                    </p>
                  )}
                  {restaurant?.address && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {restaurant.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div>
                <h4 className="font-bold text-lg mb-4">Opening Hours</h4>
                <div className="space-y-1 text-sm text-gray-400">
                  {restaurant?.openingHours && Object.entries(restaurant.openingHours).slice(0, 3).map(([day, hours]) => (
                    <p key={day} className="flex justify-between">
                      <span className="capitalize">{day}:</span>
                      <span>{hours}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-bold text-lg mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {restaurant?.socialMedia?.facebook && (
                    <a href={restaurant.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {restaurant?.socialMedia?.instagram && (
                    <a href={restaurant.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {restaurant?.socialMedia?.twitter && (
                    <a href={restaurant.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {restaurant?.socialMedia?.youtube && (
                    <a href={restaurant.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p>© {new Date().getFullYear()} {restaurant?.name || "Restaurant"}. All rights reserved.</p>
              <p>Powered by <span className="font-semibold" style={{ color: primaryColor }}>RestaurantOS</span></p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const subdomain = params.subdomain;

  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const res = await fetch(`${base}/api/menu?subdomain=${encodeURIComponent(subdomain)}`);

    if (!res.ok) {
      if (res.status === 404) {
        return { notFound: true };
      }
      throw new Error(`Failed to load restaurant menu: ${res.status}`);
    }

    const data = await res.json();

    return {
      props: {
        restaurant: data.restaurant || null,
        menu: data.menu || [],
        categories: data.categories || [],
      },
    };
  } catch (error) {
    console.error("Failed to load tenant website", error);
    return {
      notFound: true,
    };
  }
}
