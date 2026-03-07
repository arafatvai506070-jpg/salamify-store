import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
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
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200">
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
          
          <footer className="border-t border-white/5 py-12 mt-20 bg-zinc-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
                      <ShoppingBag className="text-white" size={16} />
                    </div>
                    <h2 className="text-xl font-black tracking-tighter text-white">SALAMIFY<span className="text-emerald-500">.</span></h2>
                  </div>
                  <p className="text-zinc-400 max-w-xs">Premium, minimalist, and comfortable T-shirts designed for your everyday comfort and style.</p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-200">Shop</h3>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-200">Support</h3>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-zinc-200">Admin</h3>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/admin-portal" className="hover:text-white transition-colors">Admin Portal</Link></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500">
                <p>© 2026 Salamify. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}
