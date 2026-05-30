import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Heart, ArrowLeft, Plus, Minus, ShoppingCart, MessageSquare, Award } from 'lucide-react';
import apiCall from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, wishlist, toggleWishlist } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Fallback mock database items
  const mockProducts = [
    { _id: 'mock-1', name: 'ShopSphere Noise-Cancelling Headphones', category: 'Electronics', price: 199.99, description: 'Immersive sound experience with up to 40 hours of battery life and adaptive hybrid active noise-cancelling technology. Perfect for working from home, daily commuting, or long travels. High-fidelity audio driver delivering deep bass and crystal clear trebles.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 1, stock: 10, reviews: [{ _id: 'r1', name: 'Alice Smith', rating: 5, comment: 'Incredible sound! Best headphones I have ever purchased.', createdAt: new Date() }] },
    { _id: 'mock-2', name: 'ShopSphere Smartwatch Pro', category: 'Electronics', price: 129.99, description: 'Track health metrics, receive messages, and navigate with ease. Up to 7 days battery charge with IP68 waterproof rating.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', rating: 4.5, numReviews: 1, stock: 20, reviews: [{ _id: 'r2', name: 'Bob Jones', rating: 4, comment: 'Nice display, battery is good.', createdAt: new Date() }] },
    { _id: 'mock-3', name: 'Premium Leather Jacket', category: 'Fashion', price: 249.99, description: 'Handcrafted from 100% genuine top-grain leather. A timeless classic fit with durable metallic zippers.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 1, stock: 5, reviews: [] },
    { _id: 'mock-4', name: 'Modernist Ceramic Vase Set', category: 'Home & Kitchen', price: 45.00, description: 'A collection of three matte-finished ceramic vases in sleek pastel color palettes. Perfect for minimalist shelves.', image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80', rating: 4.6, numReviews: 1, stock: 8, reviews: [] }
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const data = await apiCall('GET', `/products/${id}`);
        setProduct(data);
        
        // Fetch similar products
        const catData = await apiCall('GET', `/products?category=${data.category}`);
        if (catData && catData.products) {
          setSimilarProducts(catData.products.filter(p => p._id !== data._id).slice(0, 4));
        }
      } catch (err) {
        console.warn('API error, falling back to mock product details:', err.message);
        const match = mockProducts.find(p => p._id === id) || mockProducts[0];
        setProduct(match);
        // Similar products mock fallback
        setSimilarProducts(mockProducts.filter(p => p._id !== match._id));
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    setQuantity(1);
    setReviewSuccess('');
    setReviewError('');
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) {
      setReviewError('Please write a review comment');
      return;
    }
    try {
      await apiCall('POST', `/products/${id}/reviews`, { rating, comment });
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setReviewError('');
      
      // Reload product details
      const updatedProduct = await apiCall('GET', `/products/${id}`);
      setProduct(updatedProduct);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <Loader size="large" />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">Back to Catalog</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-12 pb-12">
      {/* Back Button */}
      <div>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main product showcase section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side: Product Image */}
        <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 aspect-square flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Zoom effect on hover could go here, clean image showcase */}
        </div>

        {/* Right Side: Product Details info */}
        <div className="flex flex-col justify-between py-2 space-y-6">
          <div className="space-y-4">
            <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Ratings & reviews count banner */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500">
                <Star size={16} className="fill-current" />
                <span className="text-sm font-bold ml-1 text-slate-700 dark:text-slate-350">
                  {product.rating ? product.rating.toFixed(1) : '0.0'}
                </span>
              </div>
              <span className="text-slate-400">|</span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <MessageSquare size={13} />
                <span>{product.reviews ? product.reviews.length : 0} verified customer reviews</span>
              </span>
            </div>

            {/* Price section */}
            <div className="text-3xl font-black text-slate-900 dark:text-white pt-2">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Specs & Warranties */}
            <div className="grid grid-cols-2 gap-4 border-y border-slate-200 dark:border-slate-800 py-4 mt-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <Award className="text-primary" size={16} />
                <span>1-Year ShopSphere Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <ShieldCheck className="text-primary" size={16} />
                <span>Secure Payment Encrypted</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {/* Stock Alert */}
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="text-slate-400">Status:</span>
              {isOutOfStock ? (
                <span className="text-red-500">Out of Stock</span>
              ) : (
                <span className="text-green-500">In Stock ({product.stock} units left)</span>
              )}
            </div>

            {/* Add to Cart Controls */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm h-12">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 font-bold text-sm text-slate-850 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 text-slate-500 hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01]"
                >
                  <ShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-all h-12 w-12 flex items-center justify-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50/50' : 'text-slate-500'}`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Customer Reviews List & Form */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-slate-200 dark:border-slate-800 pt-12">
        {/* Left column: review stats */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Reviews</h2>
          <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-6">
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </div>
            <div>
              <div className="flex text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-slate-350 dark:text-slate-700'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">Based on {product.reviews ? product.reviews.length : 0} verified buyer reviews</p>
            </div>
          </div>

          {/* Add Review Form */}
          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase">Write a Review</h3>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Rating Stars</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-slate-750 dark:text-white"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Comment</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Share your experience with this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-slate-750 dark:text-white"
                ></textarea>
              </div>

              {reviewSuccess && <p className="text-xs text-green-500 font-semibold">{reviewSuccess}</p>}
              {reviewError && <p className="text-xs text-red-500 font-semibold">{reviewError}</p>}

              <button
                type="submit"
                className="w-full py-2 bg-slate-850 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-755 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-slate-900/10 hover:shadow"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">You must be logged in to leave a review comment.</p>
              <Link to="/login" className="inline-block px-4 py-2 bg-primary text-white font-semibold text-xs rounded-xl hover:bg-primary-dark">
                Log In
              </Link>
            </div>
          )}
        </div>

        {/* Right column: reviews lists */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Customer Feedback</h2>
          {(!product.reviews || product.reviews.length === 0) ? (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-slate-450 text-xs font-medium">
              No reviews yet for this product. Be the first to leave a feedback!
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{rev.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={11}
                          className={`${i < rev.rating ? 'fill-current' : 'text-slate-350 dark:text-slate-750'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Similar / Related Products Section */}
      {similarProducts.length > 0 && (
        <section className="space-y-6 border-t border-slate-200 dark:border-slate-800 pt-12">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Similar Products</h2>
            <p className="text-xs text-slate-400 mt-1">Explore other products in the {product.category} catalog</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
export { ProductDetails };
