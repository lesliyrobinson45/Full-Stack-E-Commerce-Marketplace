import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Sun, Moon, LogOut, LayoutDashboard, Compass } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, setIsCartOpen, wishlist } = useContext(CartContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Load dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-primary/20">
                S
              </span>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-350 bg-clip-text text-transparent">
                ShopSphere
              </span>
            </Link>
            
            {/* Primary Nav Links */}
            <div className="hidden md:flex ml-10 space-x-6">
              <Link to="/products" className="text-sm font-medium text-slate-600 dark:text-slate-350 hover:text-primary dark:hover:text-primary transition-colors py-2">
                All Products
              </Link>
              <Link to="/categories" className="text-sm font-medium text-slate-600 dark:text-slate-350 hover:text-primary dark:hover:text-primary transition-colors py-2">
                Categories
              </Link>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Open Cart"
            >
              <ShoppingCart size={20} />
              {totalCartItems > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900">
                  {totalCartItems}
                </span>
              )}
            </button>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-850 mx-1"></span>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-350">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-float-down">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                    >
                      <Compass size={16} />
                      <span>My Orders</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 font-semibold transition-colors border-t border-slate-100 dark:border-slate-800"
                      >
                        <LayoutDashboard size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left transition-colors border-t border-slate-100 dark:border-slate-850"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-all shadow-sm shadow-primary/10 hover:shadow hover:scale-[1.02]"
              >
                <User size={15} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };
