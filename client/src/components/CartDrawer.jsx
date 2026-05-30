import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, Plus, Minus, Tag } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    coupon,
    discountPercent,
    prices,
  } = useContext(CartContext);

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState({ success: false, text: '' });
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
  };

  const handleCheckoutRedirect = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsCartOpen(false)}
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md translate-x-0 transition-transform duration-300">
            <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-primary" size={20} />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Shopping Cart</h2>
                  <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-500"
                  onClick={() => setIsCartOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-full text-slate-400">
                      <ShoppingBag size={48} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">Your cart is empty</h3>
                      <p className="text-sm text-slate-400 mt-1">Looks like you haven't added anything to your cart yet.</p>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {cartItems.map((item) => (
                      <div key={item.product} className="flex py-4 gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-sm font-semibold text-slate-800 dark:text-slate-100">
                              <h4 className="line-clamp-1">{item.name}</h4>
                              <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                          </div>

                          <div className="flex flex-1 items-end justify-between text-sm mt-2">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.product, item.quantity - 1)}
                                className="p-1 hover:text-primary transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="px-3 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                                className="p-1 hover:text-primary transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product)}
                              className="font-medium text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Calculations */}
              {cartItems.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-6 gap-4 flex flex-col">
                  {/* Coupon Form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        placeholder="Promo Code (WELCOME10)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {couponMessage.text && (
                    <p className={`text-[10px] font-semibold ${couponMessage.success ? 'text-green-500' : 'text-red-500'}`}>
                      {couponMessage.text}
                    </p>
                  )}

                  {/* Calculations breakdown */}
                  <div className="flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-250">${prices.itemsPrice.toFixed(2)}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-green-500 font-medium">
                        <span>Discount ({coupon})</span>
                        <span>-${prices.discountPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {prices.shippingPrice === 0 ? (
                          <span className="text-green-500 font-semibold">Free</span>
                        ) : (
                          `$${prices.shippingPrice.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Est. Tax (8%)</span>
                      <span>${prices.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-750 pt-3 text-base text-slate-950 dark:text-white font-bold">
                      <span>Total</span>
                      <span>${prices.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Actions */}
                  <div className="mt-2 flex flex-col gap-2">
                    <button
                      onClick={handleCheckoutRedirect}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                    >
                      <span>Proceed to Checkout</span>
                    </button>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-2 bg-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold text-xs transition-colors text-center"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
export { CartDrawer };
