import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Users, DollarSign, Package, Plus, Trash2, Edit3, Truck, ShieldCheck, BarChart3, Settings } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import apiCall from '../services/api';
import Loader from '../components/Loader';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    categorySales: [],
    monthlySales: []
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Product Add/Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCat, setProdCat] = useState('Electronics');
  const [prodStock, setProdStock] = useState('');
  const [prodImg, setProdImg] = useState('');

  // Local state for actions response
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fallback mock dashboard stats
  const mockStats = {
    totalUsers: 5,
    totalOrders: 1,
    totalRevenue: 231.99,
    categorySales: [
      { name: 'Electronics', value: 199.99 },
      { name: 'Fashion', value: 32.00 }
    ],
    monthlySales: [
      { month: 'Jan', sales: 150 },
      { month: 'Feb', sales: 300 },
      { month: 'Mar', sales: 420 },
      { month: 'Apr', sales: 380 },
      { month: 'May', sales: 540 }
    ]
  };

  const mockProducts = [
    { _id: 'mock-1', name: 'Noise-Cancelling Headphones', category: 'Electronics', price: 199.99, stock: 10 },
    { _id: 'mock-2', name: 'Smartwatch Pro', category: 'Electronics', price: 129.99, stock: 20 },
    { _id: 'mock-3', name: 'Premium Leather Jacket', category: 'Fashion', price: 249.99, stock: 5 }
  ];

  const mockOrders = [
    { _id: 'ord-mock-1', user: { name: 'John Doe', email: 'john@example.com' }, createdAt: new Date(), totalPrice: 231.99, isPaid: true, isDelivered: false, status: 'shipped' }
  ];

  const mockUsers = [
    { _id: 'user-mock-1', name: 'John Doe', email: 'customer@shopsphere.com', role: 'customer' },
    { _id: 'user-mock-2', name: 'Admin User', email: 'admin@shopsphere.com', role: 'admin' }
  ];

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsData = await apiCall('GET', '/users/stats');
      setStats(statsData);

      // Fetch products
      const prodData = await apiCall('GET', '/products?limit=100');
      setProducts(prodData.products || []);

      // Fetch orders
      const orderData = await apiCall('GET', '/orders');
      setOrders(orderData || []);

      // Fetch users
      const userData = await apiCall('GET', '/users');
      setUsers(userData || []);
    } catch (err) {
      console.warn('API error fetching admin dashboard data. Loading mock dashboards:', err.message);
      setStats(mockStats);
      setProducts(mockProducts);
      setOrders(mockOrders);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) return;
    
    setLoading(true);
    const payload = {
      name: prodName,
      price: Number(prodPrice),
      description: prodDesc || 'Curated premium product',
      category: prodCat,
      stock: Number(prodStock),
      image: prodImg || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    };

    try {
      if (editingProduct) {
        // Edit mode
        await apiCall('PUT', `/products/${editingProduct._id}`, payload);
        setMessage('Product updated successfully!');
      } else {
        // Create mode
        await apiCall('POST', '/products', payload);
        setMessage('Product created successfully!');
      }
      setShowProductModal(false);
      resetProductForm();
      loadAllData();
    } catch (err) {
      setErrorMsg(err.message || 'Action failed');
      setLoading(false);
    }
  };

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdPrice(p.price);
    setProdDesc(p.description || '');
    setProdCat(p.category);
    setProdStock(p.stock);
    setProdImg(p.image || '');
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await apiCall('DELETE', `/products/${id}`);
      setMessage('Product removed successfully!');
      loadAllData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to remove product');
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (id) => {
    setLoading(true);
    try {
      await apiCall('PUT', `/orders/${id}/deliver`);
      setMessage('Order marked as delivered!');
      loadAllData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update order status');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      await apiCall('DELETE', `/users/${id}`);
      setMessage('User deleted successfully!');
      loadAllData();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete user');
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdCat('Electronics');
    setProdStock('');
    setProdImg('');
  };

  // Chart JS Data Configurations
  const barChartData = {
    labels: stats.monthlySales.map(m => m.month),
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: stats.monthlySales.map(m => m.sales),
        backgroundColor: '#2563EB',
        borderRadius: 8
      }
    ]
  };

  const doughnutData = {
    labels: stats.categorySales.map(c => c.name),
    datasets: [
      {
        data: stats.categorySales.map(c => c.value),
        backgroundColor: ['#2563EB', '#7C3AED', '#06B6D4', '#22C55E', '#F59E0B'],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <LayoutDashboard className="text-indigo-600 animate-pulse" size={28} />
            <span>Admin Control Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Overview revenue reports, manage stock inventories, orders, and customer accounts.
          </p>
        </div>

        {/* Global actions info */}
        {message && <span className="bg-green-50 text-green-500 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">{message}</span>}
        {errorMsg && <span className="bg-red-50 text-red-500 text-xs font-semibold px-3 py-1 rounded-full border border-red-200">{errorMsg}</span>}
      </div>

      {/* Analytics Metric Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sales card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-primary border border-blue-200/50 rounded-xl">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Sales</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">${stats.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>

        {/* Orders count card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-secondary border border-purple-200/50 rounded-xl">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Orders</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.totalOrders}</h3>
          </div>
        </div>

        {/* Products count card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50 dark:bg-cyan-950/20 text-accent border border-cyan-200/50 rounded-xl">
            <Package size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Products</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{products.length}</h3>
          </div>
        </div>

        {/* Users count card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-950/20 text-success border border-green-200/50 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Users</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.totalUsers}</h3>
          </div>
        </div>
      </section>

      {/* Tabs list toolbar */}
      <div className="flex border-b border-slate-200 dark:border-slate-850">
        {['analytics', 'products', 'orders', 'users'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setMessage(''); setErrorMsg(''); }}
            className={`px-5 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 -mb-[2px] ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-650 dark:hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader size="medium" />
      ) : (
        <div className="animate-fade-in">
          
          {/* Tab 1: Analytics Report Charts */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Monthly Revenue Bar Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase flex items-center gap-1.5">
                  <BarChart3 size={16} />
                  <span>Monthly Sales (USD)</span>
                </h4>
                <div className="h-72">
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Category Sales Doughnut Chart */}
              <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-850 dark:text-white uppercase">Category Sales distribution</h4>
                <div className="h-64 flex justify-center items-center">
                  {stats.categorySales.length === 0 ? (
                    <p className="text-xs text-slate-400">No category sales recorded yet</p>
                  ) : (
                    <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Products Inventory CRUD Grid */}
          {activeTab === 'products' && (
            <div className="space-y-4 bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-850 dark:text-white uppercase">Product Catalog Grids</h3>
                <button
                  onClick={() => { resetProductForm(); setShowProductModal(true); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all hover:scale-105"
                >
                  <Plus size={14} />
                  <span>Add Product</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Price</th>
                      <th className="py-3 px-2">Stock</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                        <td className="py-3.5 px-2 font-mono text-slate-450">{p._id}</td>
                        <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                        <td className="py-3.5 px-2 text-slate-500">{p.category}</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-900 dark:text-white">${p.price.toFixed(2)}</td>
                        <td className="py-3.5 px-2 font-semibold">{p.stock} units</td>
                        <td className="py-3.5 px-2 text-right space-x-1.5">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1 text-slate-450 hover:text-primary transition-colors border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50"
                            title="Edit Product"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1 text-slate-455 hover:text-red-500 transition-colors border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Orders List Table */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">User Name</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Total price</th>
                    <th className="py-3 px-2">Paid</th>
                    <th className="py-3 px-2">Delivered</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="py-3.5 px-2 font-mono text-slate-450">{o._id}</td>
                      <td className="py-3.5 px-2 font-semibold text-slate-800 dark:text-slate-200">{o.user ? o.user.name : 'Unknown User'}</td>
                      <td className="py-3.5 px-2 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-2 font-semibold text-slate-900 dark:text-white">${o.totalPrice.toFixed(2)}</td>
                      <td className="py-3.5 px-2">
                        {o.isPaid ? (
                          <span className="text-green-500 font-bold">Paid</span>
                        ) : (
                          <span className="text-red-400">Unpaid</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2">
                        {o.isDelivered ? (
                          <span className="text-green-500 font-bold">Yes</span>
                        ) : (
                          <span className="text-blue-500 font-medium">Processing</span>
                        )}
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        {!o.isDelivered && o.isPaid && (
                          <button
                            onClick={() => handleMarkDelivered(o._id)}
                            className="flex items-center gap-1.5 ml-auto px-2.5 py-1.5 bg-slate-850 hover:bg-slate-900 text-white rounded-lg text-[10px] font-semibold transition-all hover:scale-102"
                          >
                            <Truck size={12} />
                            <span>Mark Delivered</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 4: Users Accounts Grid */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">Name</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20">
                      <td className="py-3.5 px-2 font-mono text-slate-450">{u._id}</td>
                      <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-slate-200">{u.name}</td>
                      <td className="py-3.5 px-2 text-slate-500">{u.email}</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-950/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-red-50"
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* Product ADD / EDIT Modal popup Overlay */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowProductModal(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase mb-5">
              {editingProduct ? 'Edit Product Details' : 'Create New Product'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-450">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Headphones X"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-455">Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-primary"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Books">Books</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-450">Price ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="99.99"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-450">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-450">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={prodImg}
                  onChange={(e) => setProdImg(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-450">Description</label>
                <textarea
                  rows="3"
                  placeholder="Provide specifications, features details..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-855 rounded-xl text-slate-800 dark:text-white text-xs focus:ring-1 focus:ring-primary"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold font-semibold"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-750 dark:text-slate-350 rounded-xl font-bold font-semibold hover:bg-slate-250"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
export { AdminDashboard };
