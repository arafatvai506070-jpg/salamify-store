import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-zinc-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{product.category}</p>
          <p className="text-sm font-semibold text-white">৳{product.price.toFixed(0)}</p>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-medium text-zinc-200 group-hover:text-emerald-400 transition-colors mb-4">{product.name}</h3>
        </Link>
        
        <Link
          to={`/product/${product.id}`}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium hover:bg-emerald-600 hover:text-white transition-all duration-300 border border-white/5"
        >
          <span>View Details</span>
          <Plus size={16} className="rotate-45" />
        </Link>
      </div>
    </motion.div>
  );
};
