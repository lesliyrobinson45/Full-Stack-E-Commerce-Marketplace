import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, HelpCircle } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      {/* Features Banner */}
      <div className="border-b border-slate-800 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-primary-light">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Shipping</h4>
              <p className="text-xs text-slate-400">On all orders over $150</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-primary-light">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Easy Returns</h4>
              <p className="text-xs text-slate-400">30-day money back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-primary-light">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400">Stripe encrypted payments</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-primary-light">
              <HelpCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400">Contact us at any hour</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-primary/20">
                S
              </span>
              <span className="font-extrabold text-xl tracking-tight text-white">
                ShopSphere
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              ShopSphere is a premium full-stack e-commerce marketplace offering top-grade electronics, fashion apparel, home decor, sports gear, and books.
            </p>
          </div>

          {/* Catalog Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shop Categories</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-primary-light transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-primary-light transition-colors">
                  Fashion Apparel
                </Link>
              </li>
              <li>
                <Link to="/products?category=Home & Kitchen" className="hover:text-primary-light transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sports & Outdoors" className="hover:text-primary-light transition-colors">
                  Sports & Outdoors
                </Link>
              </li>
              <li>
                <Link to="/products?category=Books" className="hover:text-primary-light transition-colors">
                  Bestselling Books
                </Link>
              </li>
            </ul>
          </div>

          {/* Account/Company Info */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/profile" className="hover:text-primary-light transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-light transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-primary-light transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary-light transition-colors">
                  F.A.Q. & Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Connected</h3>
            <p className="text-xs text-slate-400">
              Subscribe to get notified about special sales, store discounts, and new collection drops.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-white"
                />
              </div>
              <button
                type="submit"
                className="p-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-md shadow-primary/20 hover:scale-105"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] text-green-400 font-semibold">
                Thank you for subscribing! Check your inbox soon.
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 ShopSphere Marketplace. Built with React + Node.js + MongoDB.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-350 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-350 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };
