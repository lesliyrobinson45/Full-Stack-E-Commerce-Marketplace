import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    coupon,
    discountPercent,
    prices,
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ success: false, text: '' });
  const navigate = useNavigate();

  const handleApply = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <ShoppingBag className="text-primary" size={28} />
          <span>Shopping Cart</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review your selected items and configure discounts before checking out.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-full text-slate-400 inline-block">
            <ShoppingBag size={48} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h3>
            <p className="text-sm text-slate-450 mt-1 max-w-xs mx-auto">Explore our catalog of premium goods to fill up your shopping cart.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Items Table / Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex flex-col sm:flex-row p-6 gap-4 sm:items-center">
                    
                    {/* Thumbnail */}
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>

                    {/* Description */}
                    <div className="flex-1 space-y-1">
                      <Link to={`/products/${item.product}`}>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-400">Unit Price: ${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center gap-6 justify-between sm:justify-start">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-850">
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity - 1)}
                          className="p-2 text-slate-500 hover:text-primary transition-colors"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-3 font-semibold text-xs text-slate-800 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          className="p-2 text-slate-500 hover:text-primary transition-colors"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Total cost & Trash button */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-900 dark:text-white w-20 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        
                        <button
                          onClick={() => removeFromCart(item.product)}
                          className="p-2 border border-slate-200 dark:border-slate-800 hover:border-red-200 hover:bg-red-50 hover:text-red-500 rounded-xl text-slate-450 dark:hover:bg-red-950/20 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Back to shopping link */}
            <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors">
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Checkout pricing breakdown summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-850 dark:text-white uppercase tracking-wider">
              Order Summary
            </h3>

            {/* Coupon Code Panel */}
            <form onSubmit={handleApply} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-slate-750 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-850 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </form>
            {couponMsg.text && (
              <p className={`text-[10px] font-semibold ${couponMsg.success ? 'text-green-500' : 'text-red-500'}`}>
                {couponMsg.text}
              </p>
            )}

            {/* Price Calculations */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-650 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-850 dark:text-white">${prices.itemsPrice.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-500 font-semibold">
                  <span>Discount ({coupon})</span>
                  <span>-${prices.discountPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span>
                  {prices.shippingPrice === 0 ? (
                    <span className="text-green-500 font-semibold">Free</span>
                  ) : (
                    `$${prices.shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax (8%)</span>
                <span>${prices.taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-750 pt-4 text-base text-slate-900 dark:text-white font-bold">
                <span>Total Charge</span>
                <span>${prices.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Check out CTA buttons */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
export { Cart };
