import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, MessageCircle } from 'lucide-react';
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
    const message = `Hello, I want to order: ${product.name}\nPrice: ৳${product.price}\nLink: ${window.location.origin}/product/${product.id}`;
    const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-xl overflow-hidden border border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-300 flex flex-col h-full"
    >
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-zinc-50 relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 hover:text-emerald-600 transition-colors h-10">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-lg font-bold text-zinc-900">৳{product.price.toFixed(0)}</span>
            {/* Optional: Add a strike-through price if you have one */}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ShoppingCart size={14} />
              <span>Add to Cart</span>
            </button>
            
            <button
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all duration-300"
            >
              <MessageCircle size={14} />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
