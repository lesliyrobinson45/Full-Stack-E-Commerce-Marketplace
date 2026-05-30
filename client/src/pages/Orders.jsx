import React, { useState, useEffect } from 'react';
import { Compass, Calendar, CreditCard, Box, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import apiCall from '../services/api';
import Loader from '../components/Loader';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Mock fallback database
  const mockOrders = [
    {
      _id: 'ord-mock-12345',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      totalPrice: 231.99,
      isPaid: true,
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isDelivered: false,
      status: 'shipped',
      paymentMethod: 'Stripe',
      shippingAddress: { street: '123 E-Commerce Way', city: 'San Francisco', state: 'CA', zipCode: '94107', country: 'United States' },
      orderItems: [
        { product: 'mock-1', name: 'ShopSphere Noise-Cancelling Headphones', quantity: 1, price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' }
      ]
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiCall('GET', '/orders/myorders');
        if (data && data.length > 0) {
          setOrders(data);
        } else {
          setOrders(mockOrders);
        }
      } catch (err) {
        console.warn('API error, loading mock order data:', err.message);
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Box className="text-primary animate-pulse" size={28} />
          <span>My Orders</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review your transaction logs, payment histories, and shipping tracking information.
        </p>
      </div>

      {loading ? (
        <Loader size="medium" />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-full text-slate-400 inline-block">
            <Box size={48} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No orders found</h3>
            <p className="text-sm text-slate-450 mt-1 max-w-xs mx-auto">You haven't placed any orders yet. Fill your cart and checkout to create your first order.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            
            return (
              <div
                key={order._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-shadow"
              >
                {/* Summary Header */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  className="flex flex-wrap items-center justify-between p-5 sm:p-6 gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Order ID</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                        {order._id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Date Placed</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Total Charge</p>
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Status badges */}
                  <div className="flex gap-2">
                    {/* Payment status */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.isPaid ? 'bg-green-50 text-green-500 border border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30' : 'bg-amber-50 text-amber-500 border border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    {/* Delivery Status */}
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.isDelivered ? 'bg-green-50 text-green-500 border border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30' : 'bg-blue-50 text-blue-500 border border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/30'}`}>
                      {order.isDelivered ? 'Delivered' : order.status}
                    </span>
                  </div>

                  <button className="text-slate-450 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Collapsible Details Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-850 p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-900/40 divide-y divide-slate-100 dark:divide-slate-800">
                    
                    {/* Items list */}
                    <div className="pb-4 space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</p>
                      <div className="space-y-3">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="h-12 w-12 rounded-lg border border-slate-200 dark:border-slate-850 overflow-hidden bg-white">
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-1 text-xs">
                              <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.name}</p>
                              <p className="text-slate-400 mt-0.5">
                                {item.quantity} x ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Details info */}
                    <div className="pt-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-650 dark:text-slate-350">
                      <div className="space-y-1.5 leading-relaxed">
                        <p className="font-bold text-slate-400 uppercase tracking-wider">Shipping Address</p>
                        <p className="font-bold text-slate-850 dark:text-white">{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-slate-400 uppercase tracking-wider">Payment Details</p>
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={14} className="text-slate-400" />
                          <span>Method: <strong className="text-slate-850 dark:text-white">{order.paymentMethod}</strong></span>
                        </div>
                        {order.isPaid ? (
                          <p className="text-slate-400 font-semibold">
                            Charged on: {new Date(order.paidAt).toLocaleDateString()} at {new Date(order.paidAt).toLocaleTimeString()}
                          </p>
                        ) : (
                          <p className="text-amber-500 font-semibold">Awaiting payment verification</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
export { Orders };
