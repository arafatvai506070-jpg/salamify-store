import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    city: '',
    area: '',
    address: '' 
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your bag is empty</h1>
        <p className="text-zinc-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-10">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="space-y-6">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-4 p-4 bg-zinc-900/50 rounded-2xl border border-white/5"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-zinc-100">{item.name}</h3>
                    <p className="text-sm text-zinc-500 mb-2">৳{item.price.toFixed(0)}</p>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center text-zinc-200">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-zinc-900/50 rounded-3xl p-8 sticky top-24 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>৳{total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between font-bold text-white text-lg">
                <span>Total</span>
                <span>৳{total.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
