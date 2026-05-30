import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useContext(CartContext);
  
  const isWishlisted = wishlist.some((item) => item._id === product._id);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-500 transition-colors shadow-sm"
        aria-label="Add to Wishlist"
      >
        <Heart
          size={18}
          className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'transition-transform group-hover:scale-110'}`}
        />
      </button>

      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Card Info */}
      <div className="p-5">
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase mb-1">
          {product.category}
        </div>
        
        <Link to={`/products/${product._id}`}>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mt-2 mb-3">
          <div className="flex items-center text-amber-500">
            <Star size={14} className="fill-current" />
            <span className="text-xs font-semibold ml-1 text-slate-700 dark:text-slate-300">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            ({product.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-850">
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {isOutOfStock ? (
            <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded-full">
              Out of stock
            </span>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-all hover:shadow hover:scale-105"
            >
              <ShoppingCart size={13} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
