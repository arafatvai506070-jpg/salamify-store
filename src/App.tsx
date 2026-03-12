import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { Admin } from './pages/Admin';
import { Profile } from './pages/Profile';
import { CheckoutPage } from './pages/CheckoutPage';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-[#f8f9fa] font-sans text-zinc-900 selection:bg-emerald-500/30 selection:text-emerald-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-portal" element={<Admin />} />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-zinc-200 pt-16 pb-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 border-b border-zinc-100 pb-16">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Fast Delivery</h4>
                    <p className="text-sm text-zinc-500">Quick shipping to your doorstep</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Quality Guaranteed</h4>
                    <p className="text-sm text-zinc-500">100% authentic premium products</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <RotateCcw size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">Easy Return</h4>
                    <p className="text-sm text-zinc-500">7 days hassle-free return policy</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
                      <ShoppingBag className="text-white" size={16} />
                    </div>
                    <h2 className="text-xl font-black tracking-tighter text-zinc-900 font-display">GHORER BAZAR<span className="text-emerald-500">.</span></h2>
                  </div>
                  <p className="text-zinc-500 max-w-xs">Your trusted partner for premium quality products. We bring the best to your home.</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-900">Shop</h3>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/" className="hover:text-emerald-600 transition-colors">All Products</Link></li>
                    <li><Link to="/" className="hover:text-emerald-600 transition-colors">New Arrivals</Link></li>
                    <li><Link to="/" className="hover:text-emerald-600 transition-colors">Best Sellers</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-900">Support</h3>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Shipping Policy</a></li>
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Returns & Exchanges</a></li>
                    <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-900">Admin</h3>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/admin-portal" className="hover:text-emerald-600 transition-colors">Admin Portal</Link></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
                <p>© 2026 Ghorer Bazar. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}
