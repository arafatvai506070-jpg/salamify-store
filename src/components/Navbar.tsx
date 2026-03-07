import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, Settings, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white leading-none">
                  SALAMIFY<span className="text-emerald-500">.</span>
                </span>
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.3em] mt-0.5">
                  Premium Apparel
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Shop</Link>
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Categories</Link>
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
            <Link to="/admin-portal" className="text-sm font-medium text-zinc-600 hover:text-emerald-500 transition-colors">Admin</Link>
          </div>

          <div className="flex items-center space-x-5">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <Link to="/profile" className="p-2 text-zinc-400 hover:text-white transition-colors">
              <UserCircle size={20} />
            </Link>
            <Link to="/cart" className="p-2 text-zinc-400 hover:text-white transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
