import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addToCart } = useContext(CartContext);

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Heart className="text-red-500 fill-red-500 animate-pulse" size={28} />
          <span>My Wishlist</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Your bookmarked products. Add them to your cart to purchase.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-full text-slate-400 inline-block">
            <Heart size={48} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Your wishlist is empty</h3>
            <p className="text-sm text-slate-450 mt-1 max-w-xs mx-auto">Explore the catalog and tap the heart icon on any product to save it here.</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-105"
          >
            <span>Explore Catalog</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              
              {/* Product Image */}
              <Link to={`/products/${product._id}`} className="block overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  loading="lazy"
                />
              </Link>

              {/* Product Info */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-base font-black text-slate-950 dark:text-white pt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                  {/* Add to Cart */}
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => addToCart(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart size={13} />
                    <span>{product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</span>
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-slate-400 rounded-xl transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
export { Wishlist };
