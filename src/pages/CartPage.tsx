import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-zinc-400" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Your bag is empty</h1>
        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our products and find something you love!</p>
        <Link to="/" className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-10">Shopping Bag</h1>

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
                    className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-zinc-200 shadow-sm"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-zinc-50 flex-shrink-0 border border-zinc-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-zinc-900">{item.name}</h3>
                      <p className="text-sm font-medium text-emerald-600 mb-2">৳{item.price.toFixed(0)}</p>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center text-zinc-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-500 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-zinc-50 rounded-3xl p-8 sticky top-24 border border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">৳{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span className="font-medium">Shipping</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="pt-4 border-t border-zinc-200 flex justify-between font-bold text-zinc-900 text-xl">
                  <span>Total</span>
                  <span>৳{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-zinc-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
              
              <p className="text-center text-xs text-zinc-500 mt-4 font-medium">
                Secure checkout powered by Ghorer Bazar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
