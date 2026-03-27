import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Edit, Save, X, LogOut, Package, 
  BarChart3, TrendingUp, DollarSign, Users, ShoppingBag,
  LayoutDashboard, PieChart as PieChartIcon, Upload, Home as HomeIcon, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Cell, Pie, Legend
} from 'recharts';
import { Product } from '../types';
import { cn } from '../lib/utils';

interface AnalyticsData {
  summary: {
    revenue: number;
    orders: number;
    products: number;
    avgOrderValue: number;
  };
  salesByCategory: { category: string; value: number }[];
  salesOverTime: { date: string; amount: number }[];
}

export const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        if (Date.now() - decoded.time > 7 * 24 * 60 * 60 * 1000) {
          handleLogout();
        } else {
          setIsLoggedIn(true);
          fetchProducts();
          fetchAnalytics();
          fetchOrders();
        }
      } catch (e) {
        handleLogout();
      }
    }
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/products', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setProducts(data);
    } else {
      setProducts([]);
    }
  };

  const fetchOrders = async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setOrders(data);
    } else {
      setOrders([]);
    }
  };

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setAnalyticsData(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('admin_token', data.token);
      setIsLoggedIn(true);
      fetchProducts();
      fetchAnalytics();
      fetchOrders();
    } else {
      alert('Invalid Credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
  };

  const handleApiError = (err: any) => {
    if (err.message === 'Session expired' || err.message === 'Invalid session' || err.message.includes('Unauthorized')) {
      alert('আপনার সেশন শেষ হয়ে গেছে। দয়া করে আবার লগইন করুন।');
      handleLogout();
    } else if (err.message.includes('violates foreign key constraint')) {
      alert('এই প্রোডাক্টটি কোনো অর্ডারের সাথে যুক্ত আছে, তাই এটি ডিলিট করা যাচ্ছে না। দয়া করে প্রথমে সংশ্লিষ্ট অর্ডারগুলো চেক করুন অথবা প্রোডাক্টটি স্টক ০ করে দিন।\n\n(অথবা Supabase ড্যাশবোর্ডে SQL রান করে এই সীমাবদ্ধতা তুলে দিন)');
    } else {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(`/api/products/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to delete product');
        }
        await fetchProducts();
        alert('প্রোডাক্টটি সফলভাবে ডিলিট করা হয়েছে।');
      } catch (err: any) {
        handleApiError(err);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update product');
      }
      setEditingId(null);
      await fetchProducts();
      alert('প্রোডাক্ট সফলভাবে আপডেট করা হয়েছে।');
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }
      await fetchOrders();
      await fetchAnalytics();
      alert('অর্ডারের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।');
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add product');
      }
      setShowAddForm(false);
      setNewProduct({ name: '', description: '', price: 0, image: '', category: '', stock: 0 });
      await fetchProducts();
      alert('নতুন প্রোডাক্ট সফলভাবে যোগ করা হয়েছে।');
    } catch (err: any) {
      handleApiError(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit) {
          setEditForm({ ...editForm, image: base64String });
        } else {
          setNewProduct({ ...newProduct, image: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[32px] p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <img 
              src="/logo.png" 
              alt="Salamify Logo" 
              className="h-16 mx-auto mt-4 object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="text-zinc-500 text-sm mt-2">Salamify Secure Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="admin@salamify.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">
              Access Dashboard
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-zinc-500 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft size={16} />
              Back to Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-3 bg-zinc-900 border border-white/10 rounded-2xl text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-sm group">
              <HomeIcon size={24} className="group-hover:scale-110 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Salamify Dashboard</h1>
              <img 
                src="/logo.png" 
                alt="Salamify Logo" 
                className="h-10 mt-2 object-contain"
                referrerPolicy="no-referrer"
              />
              <p className="text-zinc-500 mt-1">Manage your products and view analytics</p>
            </div>
          </div>
          
          <div className="flex items-center bg-zinc-900 border border-white/10 p-1 rounded-2xl shadow-sm">
            <button 
              onClick={() => {
                setActiveTab('products');
                fetchProducts();
              }}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === 'products' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-zinc-500 hover:text-white"
              )}
            >
              <ShoppingBag size={18} />
              <span>Products</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('orders');
                fetchOrders();
              }}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === 'orders' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-zinc-500 hover:text-white"
              )}
            >
              <Package size={18} />
              <span>Orders</span>
            </button>
            <button 
              onClick={() => {
                setActiveTab('analytics');
                fetchAnalytics();
              }}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                activeTab === 'analytics' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-zinc-500 hover:text-white"
              )}
            >
              <BarChart3 size={18} />
              <span>Analytics Terminal</span>
            </button>
          </div>

          <div className="flex gap-4">
            {activeTab === 'products' && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-zinc-900 text-zinc-400 border border-white/10 rounded-xl font-bold hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {activeTab === 'products' ? (
          <>
            {showAddForm && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Add New Product</h2>
                  <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Product Name</label>
                      <input 
                        placeholder="e.g. Minimalist Black Tee" 
                        className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        value={newProduct.name}
                        onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Category</label>
                        <input 
                          placeholder="e.g. Premium" 
                          className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Price (৳)</label>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          value={(!newProduct.price && newProduct.price !== 0) || isNaN(newProduct.price) ? '' : newProduct.price}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            setNewProduct({...newProduct, price: isNaN(val) ? 0 : val});
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Stock Units</label>
                      <input 
                        type="number" 
                        placeholder="Available quantity" 
                        className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        value={(!newProduct.stock && newProduct.stock !== 0) || isNaN(newProduct.stock) ? '' : newProduct.stock}
                        onChange={e => {
                          const val = parseInt(e.target.value);
                          setNewProduct({...newProduct, stock: isNaN(val) ? 0 : val});
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Product Image</label>
                      <div className="flex gap-3 mb-3">
                        <input 
                          placeholder="Image URL" 
                          className="flex-1 bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          value={newProduct.image}
                          onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 bg-zinc-800 text-zinc-400 border border-white/5 rounded-xl hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <Upload size={18} />
                          <span className="hidden sm:inline">Upload</span>
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e)}
                        />
                      </div>
                      {newProduct.image && (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                          <img src={newProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            type="button"
                            onClick={() => setNewProduct({...newProduct, image: ''})}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                      <textarea 
                        placeholder="Tell us about this product..." 
                        className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 h-32 text-white focus:outline-none focus:border-emerald-500"
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <button className="md:col-span-2 bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20">
                    Create Product
                  </button>
                </form>
              </motion.div>
            )}

            <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-zinc-800/50 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Product</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Category</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Price</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Stock</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative group">
                              <img src={product.image} className="w-12 h-12 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" />
                              {editingId === product.id && (
                                <button 
                                  onClick={() => editFileInputRef.current?.click()}
                                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                >
                                  <Upload size={14} />
                                </button>
                              )}
                              <input 
                                type="file" 
                                ref={editFileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, true)}
                              />
                            </div>
                            {editingId === product.id ? (
                              <div className="space-y-2">
                                <input 
                                  className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                                  value={editForm.name}
                                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                                />
                                <input 
                                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 outline-none"
                                  value={editForm.image}
                                  placeholder="Image URL"
                                  onChange={e => setEditForm({...editForm, image: e.target.value})}
                                />
                              </div>
                            ) : (
                              <span className="font-medium text-zinc-100">{product.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === product.id ? (
                            <input 
                              className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-emerald-500 outline-none"
                              value={editForm.category}
                              onChange={e => setEditForm({...editForm, category: e.target.value})}
                            />
                          ) : (
                            <span className="text-zinc-500">{product.category}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === product.id ? (
                            <input 
                              type="number"
                              className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-24 focus:border-emerald-500 outline-none"
                              value={(!editForm.price && editForm.price !== 0) || isNaN(editForm.price as number) ? '' : editForm.price}
                              onChange={e => {
                                const val = parseFloat(e.target.value);
                                setEditForm({...editForm, price: isNaN(val) ? 0 : val});
                              }}
                            />
                          ) : (
                            <span className="font-bold text-zinc-100">৳{product.price.toFixed(0)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === product.id ? (
                            <input 
                              type="number"
                              className="bg-zinc-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-24 focus:border-emerald-500 outline-none"
                              value={(!editForm.stock && editForm.stock !== 0) || isNaN(editForm.stock as number) ? '' : editForm.stock}
                              onChange={e => {
                                const val = parseInt(e.target.value);
                                setEditForm({...editForm, stock: isNaN(val) ? 0 : val});
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                (product.stock || 0) > 10 ? "bg-emerald-500" : (product.stock || 0) > 0 ? "bg-amber-500" : "bg-red-500"
                              )}></span>
                              <span className="font-medium text-zinc-400">{product.stock || 0} units</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            {editingId === product.id ? (
                              <>
                                <button onClick={handleUpdate} className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"><Save size={18} /></button>
                                <button onClick={() => setEditingId(null)} className="p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-zinc-700 transition-colors border border-white/5"><X size={18} /></button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => handleEdit(product)} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === 'orders' ? (
          <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-800/50 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Payment</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Items</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Total</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-zinc-500">#{order.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-100">{order.customer_name}</span>
                          <span className="text-xs text-zinc-500">{order.customer_phone}</span>
                          <span className="text-xs text-zinc-400 mt-1">{order.area}, {order.city}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-zinc-300 uppercase">{order.payment_method}</span>
                          {order.transaction_id && (
                            <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/5 px-1 rounded inline-block mt-1">
                              TX: {order.transaction_id}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-zinc-400">{order.items_summary}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-zinc-100">৳{order.total.toFixed(0)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={cn(
                            "text-xs font-bold px-3 py-1 rounded-full border-none outline-none cursor-pointer",
                            order.status === 'pending' ? "bg-amber-500/10 text-amber-500" : 
                            order.status === 'approved' ? "bg-emerald-500/10 text-emerald-500" :
                            order.status === 'processing' ? "bg-blue-500/10 text-blue-500" :
                            order.status === 'shipped' ? "bg-purple-500/10 text-purple-500" :
                            order.status === 'cancelled' ? "bg-red-500/10 text-red-500" :
                            "bg-emerald-500/10 text-emerald-500"
                          )}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs text-emerald-500 hover:underline font-bold"
                          >
                            Details
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, 'approved')}
                                className="text-[10px] bg-emerald-600/20 text-emerald-500 px-2 py-1 rounded hover:bg-emerald-600/30 transition-colors font-bold"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                className="text-[10px] bg-red-600/20 text-red-500 px-2 py-1 rounded hover:bg-red-600/30 transition-colors font-bold"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `৳${analyticsData?.summary.revenue.toFixed(0)}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Total Orders', value: analyticsData?.summary.orders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: 'Total Products', value: analyticsData?.summary.products, icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Avg Order Value', value: `৳${analyticsData?.summary.avgOrderValue.toFixed(0)}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 p-6 rounded-3xl border border-white/10 shadow-sm"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border border-white/5", stat.bg)}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sales Over Time */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900 p-8 rounded-[32px] border border-white/10 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                    <TrendingUp size={20} className="text-emerald-500" />
                    Sales Performance
                  </h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData?.salesOverTime}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Sales By Category */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-900 p-8 rounded-[32px] border border-white/10 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                    <PieChartIcon size={20} className="text-blue-500" />
                    Category Distribution
                  </h3>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="category"
                      >
                        {analyticsData?.salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Order Details</h2>
                      <p className="text-zinc-500 font-mono text-sm mt-1">Order ID: #{selectedOrder.id}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Customer Information</h3>
                        <div className="space-y-2">
                          <p className="text-white font-medium">{selectedOrder.customer_name}</p>
                          <p className="text-zinc-400 text-sm flex items-center gap-2"><Users size={14} /> {selectedOrder.customer_phone}</p>
                          <p className="text-zinc-400 text-sm flex items-center gap-2"><DollarSign size={14} className="opacity-0" /> {selectedOrder.customer_email}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Shipping Address</h3>
                        <div className="text-zinc-400 text-sm space-y-1">
                          <p>{selectedOrder.address}</p>
                          <p>{selectedOrder.area}, {selectedOrder.city}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Payment Details</h3>
                        <div className="bg-zinc-800/50 p-4 rounded-2xl border border-white/5">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-zinc-500 text-xs">Method</span>
                            <span className="text-white font-bold uppercase">{selectedOrder.payment_method}</span>
                          </div>
                          {selectedOrder.transaction_id && (
                            <div className="flex justify-between items-center">
                              <span className="text-zinc-500 text-xs">Transaction ID</span>
                              <span className="text-emerald-500 font-mono text-xs">{selectedOrder.transaction_id}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Order Status</h3>
                        <div className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm",
                          selectedOrder.status === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                          selectedOrder.status === 'approved' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          selectedOrder.status === 'processing' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          selectedOrder.status === 'shipped' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                          selectedOrder.status === 'cancelled' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {selectedOrder.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Ordered Items</h3>
                    <div className="bg-zinc-800/30 p-4 rounded-2xl border border-white/5 text-zinc-300 text-sm leading-relaxed">
                      {selectedOrder.items_summary}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-zinc-500 font-bold uppercase text-xs">Total Amount</span>
                      <span className="text-2xl font-bold text-white">৳{selectedOrder.total.toFixed(0)}</span>
                    </div>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    {selectedOrder.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => {
                            handleUpdateOrderStatus(selectedOrder.id, 'approved');
                            setSelectedOrder({...selectedOrder, status: 'approved'});
                          }}
                          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                        >
                          Approve Order
                        </button>
                        <button 
                          onClick={() => {
                            handleUpdateOrderStatus(selectedOrder.id, 'cancelled');
                            setSelectedOrder({...selectedOrder, status: 'cancelled'});
                          }}
                          className="flex-1 bg-red-600/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold hover:bg-red-600/20 transition-all"
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                    {selectedOrder.status === 'approved' && (
                      <button 
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'processing');
                          setSelectedOrder({...selectedOrder, status: 'processing'});
                        }}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-500 transition-all"
                      >
                        Start Processing
                      </button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <button 
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'shipped');
                          setSelectedOrder({...selectedOrder, status: 'shipped'});
                        }}
                        className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-500 transition-all"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <button 
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, 'delivered');
                          setSelectedOrder({...selectedOrder, status: 'delivered'});
                        }}
                        className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
