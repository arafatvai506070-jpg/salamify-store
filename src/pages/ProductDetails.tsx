import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';
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

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hello, I want to order: ${product.name}\nPrice: ৳${product.price}\nLink: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/8801700000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold text-zinc-900">৳{product.price.toFixed(0)}</p>
              {product.stock > 0 ? (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">In Stock</span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Out of Stock</span>
              )}
            </div>
            
            <div className="prose prose-zinc mb-8">
              <p className="text-zinc-600 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className="flex-1 px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg shadow-zinc-200"
              >
                <ShoppingBag size={20} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg shadow-emerald-600/20"
              >
                <MessageCircle size={20} />
                <span>Order on WhatsApp</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-zinc-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100"><Truck size={18} /></div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100"><RotateCcw size={18} /></div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Easy Returns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-zinc-50 rounded-lg text-zinc-600 border border-zinc-100"><ShieldCheck size={18} /></div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
