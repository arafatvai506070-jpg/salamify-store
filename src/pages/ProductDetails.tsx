import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-zinc-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-white/5"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>
          <p className="text-2xl font-medium text-zinc-300 mb-6">৳{product.price.toFixed(0)}</p>
          
          <div className="prose prose-invert mb-8">
            <p className="text-zinc-400 leading-relaxed">
              {product.description} This Salamify signature piece is crafted from 100% premium organic cotton, ensuring maximum breathability and a soft feel against your skin. Our T-shirts are pre-shrunk and designed to maintain their shape and color wash after wash.
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="w-full md:w-auto px-12 py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-500 transition-all duration-300 flex items-center justify-center space-x-3 mb-10 shadow-lg shadow-emerald-600/20"
          >
            <ShoppingBag size={20} />
            <span>Add to Shopping Bag</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-white/5"><Truck size={18} /></div>
              <span className="text-xs font-medium text-zinc-500">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-white/5"><RotateCcw size={18} /></div>
              <span className="text-xs font-medium text-zinc-500">30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-white/5"><ShieldCheck size={18} /></div>
              <span className="text-xs font-medium text-zinc-500">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
