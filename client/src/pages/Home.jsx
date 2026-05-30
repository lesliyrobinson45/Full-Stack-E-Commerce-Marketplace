import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, ShieldCheck, Tag, StarHalf } from 'lucide-react';
import apiCall from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock products in case connection fails
  const mockProducts = [
    {
      _id: 'mock-1',
      name: 'ShopSphere Noise-Cancelling Headphones',
      category: 'Electronics',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      rating: 4.8,
      numReviews: 12,
      stock: 10
    },
    {
      _id: 'mock-2',
      name: 'ShopSphere Smartwatch Pro',
      category: 'Electronics',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      rating: 4.5,
      numReviews: 8,
      stock: 20
    },
    {
      _id: 'mock-3',
      name: 'Premium Leather Jacket',
      category: 'Fashion',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
      rating: 4.9,
      numReviews: 15,
      stock: 5
    },
    {
      _id: 'mock-4',
      name: 'Modernist Ceramic Vase Set',
      category: 'Home & Kitchen',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
      rating: 4.6,
      numReviews: 9,
      stock: 8
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await apiCall('GET', '/products?limit=4');
        if (data && data.products && data.products.length > 0) {
          setFeaturedProducts(data.products.slice(0, 4));
        } else {
          setFeaturedProducts(mockProducts);
        }
      } catch (err) {
        console.warn('Backend fetch failed, showing mock products:', err.message);
        setFeaturedProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Electronics', count: '12+ Items', icon: '💻', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60' },
    { name: 'Fashion', count: '40+ Items', icon: '👕', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=60' },
    { name: 'Home & Kitchen', count: '18+ Items', icon: '🏡', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=60' },
    { name: 'Sports & Outdoors', count: '15+ Items', icon: '⚽', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=60' },
    { name: 'Books', count: '25+ Items', icon: '📚', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60' }
  ];

  const testimonials = [
    { name: 'Sarah M.', text: 'The Noise-Cancelling Headphones are absolute magic! Fast shipping and excellent premium packaging.', rating: 5 },
    { name: 'David K.', text: 'Outstanding Customer Service. The checkout was secure and extremely simple. Will buy again!', rating: 5 },
    { name: 'Elena R.', text: 'Very modern design. I love the dark mode switch. Shopping experience is smooth and fast.', rating: 4 }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[500px] flex items-center shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&auto=format&fit=crop&q=80"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl px-8 sm:px-12 lg:px-16 py-12 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-semibold uppercase tracking-wider">
            <Tag size={13} />
            <span>Launch Offer: 10% off withWELCOME10</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-primary-light via-accent-light to-secondary-light bg-clip-text text-transparent">
              Digital Shopping
            </span>
          </h1>

          <p className="text-slate-350 text-base sm:text-lg leading-relaxed">
            Discover handpicked collections across tech, apparel, and literature. Experience smooth checkout, rapid shipping, and premium SaaS aesthetics.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/products"
              className="flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all"
            >
              <ShoppingBag size={18} />
              <span>Shop All Products</span>
            </Link>
            
            <Link
              to="/categories"
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700 backdrop-blur text-white border border-slate-700 rounded-xl font-bold text-sm hover:scale-105 transition-all"
            >
              <span>Explore Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Shop by Category</h2>
            <p className="text-sm text-slate-400 mt-1">Explore our wide catalog of curated premium goods</p>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 group">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="group relative h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-end p-5 transition-all hover:shadow-md"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
              
              <div className="relative z-20 space-y-1">
                <span className="text-2xl" role="img" aria-label={cat.name}>
                  {cat.icon}
                </span>
                <h3 className="text-white text-base font-bold tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                  {cat.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured / Best Sellers Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Featured Products</h2>
          <p className="text-sm text-slate-400 mt-1">Our top-rated products handpicked for quality and value</p>
        </div>

        {loading ? (
          <Loader size="medium" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Dynamic Promotion Block */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-900 p-8 text-white flex flex-col justify-between min-h-[220px] shadow-lg">
          <div className="max-w-xs space-y-3">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">Summer Special</span>
            <h3 className="text-2xl font-extrabold tracking-tight">Activewear Sale</h3>
            <p className="text-xs text-indigo-200 leading-relaxed">Save 20% on all Sports & Outdoors equipment using coupon code <strong className="text-white font-bold">SHOPSPHERE20</strong> during checkout.</p>
          </div>
          <Link to="/products?category=Sports & Outdoors" className="text-xs font-bold text-white hover:text-indigo-200 flex items-center gap-1.5 mt-4 group">
            <span>Explore Outdoors</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-600 to-cyan-900 p-8 text-white flex flex-col justify-between min-h-[220px] shadow-lg">
          <div className="max-w-xs space-y-3">
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">Tech Focus</span>
            <h3 className="text-2xl font-extrabold tracking-tight">Smart Accessories</h3>
            <p className="text-xs text-cyan-200 leading-relaxed">Upgrade your workstation with wireless, noise-cancelling tech with direct 1-year product warranty.</p>
          </div>
          <Link to="/products?category=Electronics" className="text-xs font-bold text-white hover:text-cyan-200 flex items-center gap-1.5 mt-4 group">
            <span>Shop Tech</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Testimonials Customer Reviews */}
      <section className="bg-slate-100 dark:bg-slate-900 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">What Our Customers Say</h2>
          <p className="text-sm text-slate-400">Read verified reviews from users globally enjoying ShopSphere</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => (
            <div key={index} className="bg-white dark:bg-slate-850 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < test.rating ? 'fill-current' : 'text-slate-350 dark:text-slate-700'}`}
                  />
                ))}
              </div>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-2 pt-2">
                <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center">
                  {test.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{test.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety Banner */}
      <section className="flex flex-col sm:flex-row gap-6 items-center justify-between bg-gradient-to-r from-slate-950 to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl">
        <div className="flex gap-4 items-center text-left">
          <div className="p-3 bg-primary/20 text-primary-light border border-primary/30 rounded-2xl hidden sm:block">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold">100% Secure Payments</h3>
            <p className="text-xs text-slate-400 mt-1">We utilize Stripe to encrypt credentials. Your transactions are secure.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">Payment methods:</span>
          <div className="flex gap-2">
            <span className="bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-200 border border-slate-700">Visa</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-200 border border-slate-700">Mastercard</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-200 border border-slate-700">Apple Pay</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
export { Home };
