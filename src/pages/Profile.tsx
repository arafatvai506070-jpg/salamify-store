import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Search, Package, Clock, CheckCircle2, Truck, Box, 
  ArrowRight, LogOut, User, X, LayoutDashboard, Settings, 
  CreditCard, MapPin, Phone, Mail, Calendar, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface OrderHistoryItem {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  city: string;
  area: string;
  address: string;
  payment_method: string;
  transaction_id: string | null;
  total: number;
  status: 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items_summary: string;
}

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  area: string;
  profile_image: string | null;
  bio: string | null;
}

export const Profile: React.FC = () => {
  const [identifier, setIdentifier] = useState(localStorage.getItem('customer_identifier') || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('customer_identifier'));
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');

  const fetchOrders = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const orderRes = await fetch(`/api/customer/orders?identifier=${encodeURIComponent(id)}`);
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(Array.isArray(orderData) ? orderData : []);
        setIsLoggedIn(true);
        localStorage.setItem('customer_identifier', id);
        
        const profileRes = await fetch(`/api/customer/profile?identifier=${encodeURIComponent(id)}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && identifier) {
      fetchOrders(identifier);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (res.ok) {
        const id = data.customer.email || data.customer.phone;
        localStorage.setItem('customer_identifier', id);
        setIdentifier(id);
        setIsLoggedIn(true);
        fetchOrders(id);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthMode('login');
        setIdentifier(email || phone);
        setError('Signup successful! Please login.');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => prev ? { ...prev, profile_image: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_identifier');
    setIsLoggedIn(false);
    setOrders([]);
    setIdentifier('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={18} />;
      case 'approved': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'processing': return <Box className="text-blue-500" size={18} />;
      case 'shipped': return <Truck className="text-purple-500" size={18} />;
      case 'delivered': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'cancelled': return <X className="text-red-500" size={18} />;
      default: return <Clock className="text-zinc-500" size={18} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'অপেক্ষমান';
      case 'approved': return 'অনুমোদিত';
      case 'processing': return 'প্রসেসিং';
      case 'shipped': return 'শিপড';
      case 'delivered': return 'ডেলিভারি সম্পন্ন';
      case 'cancelled': return 'বাতিল';
      default: return status;
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-zinc-200 rounded-3xl p-10 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-600"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <User size={32} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
              {authMode === 'login' ? 'স্বাগতম!' : 'অ্যাকাউন্ট তৈরি করুন'}
            </h1>
            <p className="text-zinc-500 text-sm">
              {authMode === 'login' ? 'আপনার প্রোফাইলে লগইন করুন' : 'Ghorer Bazar-এ আপনার যাত্রা শুরু করুন'}
            </p>
          </div>

          <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                {authMode === 'login' ? 'Email or Phone' : 'Email Address'}
              </label>
              <input 
                type={authMode === 'login' ? 'text' : 'email'} required
                value={authMode === 'login' ? identifier : email}
                onChange={(e) => authMode === 'login' ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder={authMode === 'login' ? "e.g. 017XXXXXXXX or email@example.com" : "email@example.com"}
              />
            </div>
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                <input 
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="017XXXXXXXX"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3.5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className={cn("text-xs text-center font-medium", error.includes('successful') ? "text-emerald-600" : "text-red-500")}>
                {error}
              </p>
            )}

            <button 
              disabled={loading}
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-zinc-200"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                <>
                  {authMode === 'login' ? 'লগইন করুন' : 'সাইন আপ করুন'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              {authMode === 'login' ? 'অ্যাকাউন্ট নেই?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'}
              <button 
                onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}
                className="ml-2 text-emerald-600 font-bold hover:underline"
              >
                {authMode === 'login' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'লগইন করুন'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 bg-zinc-50 text-zinc-400 rounded-3xl flex items-center justify-center mb-4 border border-zinc-200 shadow-inner overflow-hidden">
                    {profile?.profile_image ? (
                      <img src={profile.profile_image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} />
                    )}
                  </div>
                  <label className="absolute bottom-2 right-0 w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition-colors shadow-lg border-2 border-white">
                    <Settings size={14} className="text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-zinc-900 truncate w-full">{profile?.name || 'Customer'}</h2>
                <p className="text-zinc-500 text-xs font-mono mt-1">{identifier}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'orders', label: 'My Orders', icon: Package },
                  { id: 'settings', label: 'Account Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                      activeSection === item.id 
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </div>

            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100">
              <h3 className="text-lg font-bold mb-2">Need Help?</h3>
              <p className="text-emerald-50 text-sm mb-6 leading-relaxed">Our support team is available 24/7 to assist you with your orders.</p>
              <a href="tel:01700000000" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors">
                Contact Support
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Welcome Back!</h1>
                  <div className="text-zinc-500 text-sm font-medium">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Spent', value: `৳${stats.totalSpent}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Completed', value: stats.deliveredOrders, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                        <stat.icon size={20} />
                      </div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-zinc-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-zinc-900">Recent Orders</h3>
                    <button onClick={() => setActiveSection('orders')} className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1">
                      View All <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50">
                        <tr>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Order ID</th>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Date</th>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                          <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-zinc-50 transition-colors cursor-pointer" onClick={() => setActiveSection('orders')}>
                            <td className="px-8 py-4 font-mono text-xs text-zinc-500">#{order.id}</td>
                            <td className="px-8 py-4 text-sm text-zinc-600">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-8 py-4">
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter",
                                order.status === 'pending' ? "bg-amber-100 text-amber-700" : 
                                order.status === 'approved' ? "bg-emerald-100 text-emerald-700" :
                                order.status === 'processing' ? "bg-blue-100 text-blue-700" :
                                order.status === 'shipped' ? "bg-purple-100 text-purple-700" :
                                order.status === 'cancelled' ? "bg-red-100 text-red-700" :
                                "bg-emerald-100 text-emerald-700"
                              )}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-4 font-bold text-zinc-900">৳{order.total}</td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={4} className="px-8 py-12 text-center text-zinc-500">No recent orders found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-8">Order History</h1>
                {loading ? (
                  <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>
                ) : orders.length === 0 ? (
                  <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
                    <ShoppingBag size={48} className="mx-auto text-zinc-200 mb-4" />
                    <h2 className="text-xl font-bold text-zinc-900 mb-2">No orders found</h2>
                    <p className="text-zinc-500 mb-8">You haven't placed any orders yet.</p>
                    <Link to="/" className="inline-block bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:border-zinc-300 transition-all">
                        <div className="p-8">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 border border-zinc-100">
                                <Package size={28} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Order ID</p>
                                <h3 className="text-xl font-bold text-zinc-900">#{order.id}</h3>
                              </div>
                            </div>
                            <div className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm",
                              order.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" : 
                              order.status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              order.status === 'processing' ? "bg-blue-50 text-blue-700 border-blue-100" :
                              order.status === 'shipped' ? "bg-purple-50 text-purple-700 border-purple-100" :
                              order.status === 'cancelled' ? "bg-red-50 text-red-700 border-red-100" :
                              "bg-emerald-50 text-emerald-700 border-emerald-100"
                            )}>
                              {getStatusIcon(order.status)}
                              {getStatusText(order.status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-zinc-100">
                            <div className="md:col-span-2 space-y-6">
                              <div>
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Order Summary</h4>
                                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-zinc-600 text-sm leading-relaxed">{order.items_summary}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Shipping To</h4>
                                  <p className="text-zinc-900 text-sm font-bold">{order.customer_name}</p>
                                  <p className="text-zinc-500 text-xs mt-1">{order.address}, {order.area}, {order.city}</p>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Contact</h4>
                                  <p className="text-zinc-500 text-xs flex items-center gap-2 mb-1"><Phone size={12} /> {order.customer_phone}</p>
                                  <p className="text-zinc-500 text-xs flex items-center gap-2"><Mail size={12} /> {order.customer_email}</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex flex-col justify-between">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Payment</span>
                                  <span className="text-zinc-900 font-bold text-sm uppercase">{order.payment_method}</span>
                                </div>
                                {order.transaction_id && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">TX ID</span>
                                    <span className="text-emerald-600 font-mono text-[10px] font-bold">{order.transaction_id}</span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Date</span>
                                  <span className="text-zinc-600 text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="pt-4 border-t border-zinc-200 mt-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total</span>
                                  <span className="text-2xl font-bold text-zinc-900">৳{order.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Account Settings</h1>
                  <button onClick={handleUpdateProfile} disabled={saving} className="bg-zinc-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-lg shadow-zinc-200">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2"><User size={20} className="text-emerald-600" />Personal Information</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                            <input type="text" value={profile?.name || ''} onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="Your Name" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Bio / Details</label>
                            <textarea value={profile?.bio || ''} onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-24 resize-none" placeholder="Tell us about yourself..." />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                            <input type="email" value={profile?.email || ''} readOnly className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Phone Number</label>
                            <input type="text" value={profile?.phone || ''} readOnly className="w-full bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-400 cursor-not-allowed" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2"><MapPin size={20} className="text-emerald-600" />Shipping Address</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Street Address</label>
                            <input type="text" value={profile?.address || ''} onChange={(e) => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="House #, Road #" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">City</label>
                              <input type="text" value={profile?.city || ''} onChange={(e) => setProfile(prev => prev ? { ...prev, city: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="City" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Area</label>
                              <input type="text" value={profile?.area || ''} onChange={(e) => setProfile(prev => prev ? { ...prev, area: e.target.value } : null)} className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" placeholder="Area" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <p className="text-emerald-600 text-xs font-bold mb-2 uppercase tracking-widest">Pro Tip</p>
                        <p className="text-zinc-600 text-xs leading-relaxed">Keeping your profile updated helps us process your orders faster and ensures accurate delivery.</p>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
