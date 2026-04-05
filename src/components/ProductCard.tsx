import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, MessageCircle, Zap, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `আসসালামু আলাইকুম, আমি আপনার ওয়েবসাইট থেকে এই প্রোডাক্টটি কিনতে চাই।\n\nপ্রোডাক্ট: ${product.name}\nমূল্য: ৳${product.price}\nলিঙ্ক: ${window.location.origin}/product/${product.id}`;
    const whatsappUrl = `https://wa.me/8801886836315?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-[32px] overflow-hidden border border-zinc-100 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] flex flex-col h-full relative"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        {product.stock === 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
            স্টক আউট
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-zinc-100 flex items-center gap-1">
            <Zap size={10} className="fill-emerald-500 text-emerald-500" />
            {product.category}
          </div>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-xl font-black text-zinc-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-black text-emerald-600">৳{product.price.toFixed(0)}</span>
          <span className="text-xs text-zinc-400 line-through font-bold">৳{(product.price * 1.2).toFixed(0)}</span>
        </div>

        <div className="mt-auto space-y-3">
          <Link 
            to={`/product/${product.id}#order-form`}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 group/btn"
          >
            <span>অর্ডার করুন</span>
            <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="py-3 bg-zinc-100 text-zinc-900 rounded-xl font-bold text-xs hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} />
              কার্ট
            </button>
            <button
              onClick={handleWhatsAppOrder}
              className="py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 border border-emerald-100"
            >
              <MessageCircle size={14} />
              হোয়াটসঅ্যাপ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
