import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import apiCall from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables for filters
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState(['Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Outdoors', 'Books']);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter local fields
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'Newest');

  // Hardcoded mock fallback catalog
  const mockProducts = [
    { _id: 'mock-1', name: 'ShopSphere Noise-Cancelling Headphones', category: 'Electronics', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', rating: 4.8, numReviews: 12, stock: 10, createdAt: new Date() },
    { _id: 'mock-2', name: 'ShopSphere Smartwatch Pro', category: 'Electronics', price: 129.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', rating: 4.5, numReviews: 8, stock: 20, createdAt: new Date() },
    { _id: 'mock-3', name: 'Premium Leather Jacket', category: 'Fashion', price: 249.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80', rating: 4.9, numReviews: 15, stock: 5, createdAt: new Date() },
    { _id: 'mock-4', name: 'Minimalist Canvas Sneakers', category: 'Fashion', price: 59.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80', rating: 4.2, numReviews: 24, stock: 120, createdAt: new Date() },
    { _id: 'mock-5', name: 'Modernist Ceramic Vase Set', category: 'Home & Kitchen', price: 45.00, image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80', rating: 4.6, numReviews: 9, stock: 40, createdAt: new Date() },
    { _id: 'mock-6', name: 'Sleek Drip Coffee Maker', category: 'Home & Kitchen', price: 89.99, image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=800&auto=format&fit=crop&q=80', rating: 4.4, numReviews: 11, stock: 30, createdAt: new Date() },
    { _id: 'mock-7', name: 'Ergonomic Mountain Bike Helmet', category: 'Sports & Outdoors', price: 79.99, image: 'https://images.unsplash.com/photo-1582249842910-17945d7c8cc0?w=800&auto=format&fit=crop&q=80', rating: 4.7, numReviews: 5, stock: 15, createdAt: new Date() },
    { _id: 'mock-8', name: 'Ultra-Grip Yoga Mat', category: 'Sports & Outdoors', price: 34.99, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80', rating: 4.3, numReviews: 32, stock: 200, createdAt: new Date() },
    { _id: 'mock-9', name: 'The Art of E-Commerce Strategy', category: 'Books', price: 24.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80', rating: 5.0, numReviews: 7, stock: 100, createdAt: new Date() }
  ];

  // Sync state with URL search params when they change
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '');
    setSortBy(searchParams.get('sortBy') || 'Newest');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch products from server matching filter variables
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        let endpoint = `/products?page=${page}&sortBy=${sortBy}`;
        if (keyword) endpoint += `&keyword=${keyword}`;
        if (selectedCategory && selectedCategory !== 'All') endpoint += `&category=${selectedCategory}`;
        if (minPrice) endpoint += `&minPrice=${minPrice}`;
        if (maxPrice) endpoint += `&maxPrice=${maxPrice}`;
        if (rating) endpoint += `&rating=${rating}`;

        const data = await apiCall('GET', endpoint);
        if (data && data.products) {
          setProducts(data.products);
          setPages(data.pages || 1);
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        } else {
          // Fallback to local filtering
          applyLocalMockFilters();
        }
      } catch (err) {
        console.warn('API fetch failed, filtering mock data:', err.message);
        applyLocalMockFilters();
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [page, keyword, selectedCategory, minPrice, maxPrice, rating, sortBy]);

  // Fallback filtering helper if server is off
  const applyLocalMockFilters = () => {
    let filtered = [...mockProducts];

    if (keyword) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
    }
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }
    if (rating) {
      filtered = filtered.filter(p => p.rating >= Number(rating));
    }

    // Sorting mock data
    if (sortBy === 'Price Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Most Popular') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // Newest
      filtered.sort((a, b) => b._id.localeCompare(a._id));
    }

    // Pagination mock data (limit 8)
    const limit = 8;
    const startIdx = (page - 1) * limit;
    setProducts(filtered.slice(startIdx, startIdx + limit));
    setPages(Math.ceil(filtered.length / limit) || 1);
  };

  // Submit filters to URL parameters
  const updateFilters = (updatedFields) => {
    const params = {};
    const newKeyword = updatedFields.hasOwnProperty('keyword') ? updatedFields.keyword : keyword;
    const newCategory = updatedFields.hasOwnProperty('category') ? updatedFields.category : selectedCategory;
    const newMin = updatedFields.hasOwnProperty('minPrice') ? updatedFields.minPrice : minPrice;
    const newMax = updatedFields.hasOwnProperty('maxPrice') ? updatedFields.maxPrice : maxPrice;
    const newRating = updatedFields.hasOwnProperty('rating') ? updatedFields.rating : rating;
    const newSort = updatedFields.hasOwnProperty('sortBy') ? updatedFields.sortBy : sortBy;
    const newPage = updatedFields.hasOwnProperty('page') ? updatedFields.page : 1; // Default reset page to 1 on filter

    if (newKeyword) params.keyword = newKeyword;
    if (newCategory && newCategory !== 'All') params.category = newCategory;
    if (newMin) params.minPrice = newMin;
    if (newMax) params.maxPrice = newMax;
    if (newRating) params.rating = newRating;
    if (newSort) params.sortBy = newSort;
    if (newPage > 1) params.page = newPage;

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSortBy('Newest');
    setSearchParams({});
    setShowFiltersMobile(false);
  };

  const filterSidebar = (
    <div className="space-y-6">
      {/* Category selector */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Categories</h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => updateFilters({ category: 'All' })}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${selectedCategory === 'All' ? 'bg-primary/10 text-primary' : 'text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters({ category: cat })}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${selectedCategory === cat ? 'bg-primary/10 text-primary' : 'text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div className="border-t border-slate-150 dark:border-slate-800 pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Price Range ($)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-white focus:ring-1 focus:ring-primary"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs text-slate-700 dark:text-white focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Rating filter */}
      <div className="border-t border-slate-150 dark:border-slate-800 pt-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Minimum Rating</h3>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => updateFilters({ rating: stars })}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${Number(rating) === stars ? 'bg-primary/10 text-primary' : 'text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              <span className="flex text-amber-500">★</span>
              <span>{stars} Stars & up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear filters Button */}
      <button
        onClick={handleClearFilters}
        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shop Catalog</h1>
          <p className="text-sm text-slate-400 mt-1">Browse all available premium goods at ShopSphere</p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name..."
            value={keyword}
            onChange={(e) => updateFilters({ keyword: e.target.value, page: 1 })}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary text-slate-850 dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar (Left side filters) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 pr-6">
          {filterSidebar}
        </aside>

        {/* Mobile controls drawer & header toolbar */}
        <div className="flex-1 space-y-6">
          
          {/* Toolbar for mobile button & Sorting option */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <button
              onClick={() => setShowFiltersMobile(true)}
              className="lg:hidden flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors text-sm font-semibold"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>

            <span className="hidden lg:inline text-xs text-slate-400 font-semibold">
              Showing {products.length} products
            </span>

            {/* Sorting menu */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-transparent text-sm font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Newest">Sort by: Newest</option>
                <option value="Price Low to High">Sort by: Price Low to High</option>
                <option value="Price High to Low">Sort by: Price High to Low</option>
                <option value="Most Popular">Sort by: Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Loader size="medium" />
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-250 dark:border-slate-800 shadow-sm">
              <Filter className="mx-auto text-slate-400 mb-3" size={36} />
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-250">No products found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Try resetting your filter parameters or search keyword to find matching items.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination control footer */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft size={16} />
              </button>
              
              {[...Array(pages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => updateFilters({ page: idx + 1 })}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all border ${page === idx + 1 ? 'bg-primary border-primary text-white shadow shadow-primary/20 scale-105' : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={page >= pages}
                onClick={() => updateFilters({ page: page + 1 })}
                className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer modal */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowFiltersMobile(false)}></div>
          <div className="relative w-full max-w-xs bg-white dark:bg-slate-900 shadow-2xl p-6 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            {filterSidebar}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
export { Products };
