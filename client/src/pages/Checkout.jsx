import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, MapPin, ShoppingBag, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import apiCall from '../services/api';
import Loader from '../components/Loader';

const Checkout = () => {
  const { cartItems, prices, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Address fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Auto-fill from user saved addresses
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setStreet(defaultAddr.street);
      setCity(defaultAddr.city);
      setState(defaultAddr.state);
      setZipCode(defaultAddr.zipCode);
      setCountry(defaultAddr.country);
    }
  }, [user]);

  // Redirect if cart is empty and not checked out
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [cartItems, success, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode) {
      setErrorMsg('Please fill in all shipping fields');
      return;
    }
    if (!cardNumber || !cardExpiry || !cardCvc) {
      setErrorMsg('Please fill in your payment card details');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Call Payment endpoint to get client secret / mock session info
      const paymentIntent = await apiCall('POST', '/payment/create-payment-intent', {
        amount: prices.totalPrice
      });

      // 2. Simulate transaction processing (2 seconds loader)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentResult = {
        id: paymentIntent.clientSecret || 'mock_tx_id_' + Math.random().toString(36).substring(2),
        status: 'succeeded',
        email: user.email
      };

      // 3. Create the order in the database
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: { street, city, state, zipCode, country },
        paymentMethod: 'Stripe',
        itemsPrice: prices.itemsPrice,
        taxPrice: prices.taxPrice,
        shippingPrice: prices.shippingPrice,
        totalPrice: prices.totalPrice,
        paymentResult
      };

      const orderData = await apiCall('POST', '/orders', orderPayload);
      
      setCreatedOrder(orderData);
      setSuccess(true);
      clearCart();
    } catch (err) {
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success && createdOrder) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6 animate-fade-in">
        <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-500 rounded-full inline-block animate-bounce border border-green-200/50">
          <CheckCircle2 size={64} className="fill-current text-white dark:text-slate-900" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Order Confirmed!</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Thank you for your purchase. Your payment was successfully processed via Stripe. Your order is now in the processing phase.
        </p>

        {/* Order Details box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto shadow-sm text-xs text-slate-650 dark:text-slate-350">
          <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-3 font-semibold">
            <span>Order Reference:</span>
            <span className="text-slate-900 dark:text-white font-bold">{createdOrder._id}</span>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-slate-400 uppercase tracking-wider">Shipping to:</span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{street}</p>
            <p>{city}, {state} {zipCode}</p>
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-850 text-sm text-slate-900 dark:text-white font-bold">
            <span>Total Charge:</span>
            <span>${createdOrder.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-6">
          <Link
            to="/orders"
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary/10 hover:scale-105"
          >
            Track Order
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <CreditCard className="text-primary" size={28} />
          <span>Checkout Portal</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Provide your shipping credentials and enter mock card details to finalize the Stripe checkout.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl text-red-500 flex items-start gap-2 text-xs font-semibold">
          <AlertCircle size={16} className="mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main split grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Shipping address & payment inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>Shipping Information</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Delivery Lane"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">City</label>
                  <input
                    type="text"
                    required
                    placeholder="San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">State / Region</label>
                  <input
                    type="text"
                    required
                    placeholder="CA"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Zip / Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="94107"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Secure Credit Card Stripe elements panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} className="text-primary" />
                <span>Stripe Encrypted Payment</span>
              </h3>
              <span className="flex gap-1 items-center text-[10px] text-green-500 font-semibold bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded border border-green-200/50">
                <Sparkles size={11} fill="currentColor" />
                <span>Sandbox Active</span>
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">Credit Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4242 4242 4242 4242 (Stripe Demo Card)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-850 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">Expiration Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM / YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-850 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">CVC Code</label>
                  <input
                    type="password"
                    required
                    maxLength="3"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-sm focus:ring-1 focus:ring-primary text-slate-850 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Summary & CTA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag size={15} />
            <span>Order Breakdown</span>
          </h3>

          {/* Cart items summary */}
          <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 text-xs pr-1">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5">
                <div className="flex-1 pr-3">
                  <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.name}</p>
                  <p className="text-slate-400 mt-0.5">{item.quantity} x ${item.price.toFixed(2)}</p>
                </div>
                <span className="font-semibold text-slate-850 dark:text-white">
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-semibold text-slate-850 dark:text-white">${prices.itemsPrice.toFixed(2)}</span>
            </div>
            {prices.discountPrice > 0 && (
              <div className="flex justify-between text-green-500 font-semibold">
                <span>Discount applied</span>
                <span>-${prices.discountPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping cost</span>
              <span>{prices.shippingPrice === 0 ? 'Free' : `$${prices.shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span>${prices.taxPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-sm text-slate-900 dark:text-white font-black">
              <span>Total Charge</span>
              <span>${prices.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-5 space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader size="small" color="white" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Pay & Place Order</span>
                </>
              )}
            </button>

            <Link
              to="/cart"
              className="w-full block text-center py-2 text-slate-450 hover:text-slate-800 dark:hover:text-white font-semibold text-xs transition-colors"
            >
              Back to Edit Cart
            </Link>
          </div>

        </div>

      </form>
    </div>
  );
};

export default Checkout;
export { Checkout };
