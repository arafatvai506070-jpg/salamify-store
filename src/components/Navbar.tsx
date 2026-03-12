import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, UserCircle, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-zinc-900 leading-none font-display">
                  Salamify<span className="text-emerald-500">.</span>
                </span>
                <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.3em] mt-0.5">
                  Premium Quality
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/" className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition-colors">Shop</Link>
            <Link to="/" className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition-colors">Categories</Link>
            <Link to="/admin-portal" className="text-sm font-semibold text-zinc-600 hover:text-emerald-600 transition-colors">Admin</Link>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-zinc-500 hover:text-emerald-600 transition-colors hidden sm:block">
              <Search size={22} />
            </button>
            <Link to="/profile" className="p-2 text-zinc-500 hover:text-emerald-600 transition-colors">
              <UserCircle size={22} />
            </Link>
            <Link to="/cart" className="p-2 text-zinc-500 hover:text-emerald-600 transition-colors relative">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="p-2 text-zinc-500 md:hidden">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
