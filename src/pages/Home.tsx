import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (!Array.isArray(data)) {
          setLoading(false);
          return;
        }
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = ['All', ...new Set(data.map((p: Product) => p.category))] as string[];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcfcfc]">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/30 -skew-x-12 translate-x-1/4 z-0" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between py-20 lg:py-32 gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-emerald-100"
              >
                <Star size={14} className="fill-emerald-700" />
                <span>১০০% প্রিমিয়াম কোয়ালিটি গ্যারান্টি</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-6xl md:text-8xl font-black text-zinc-900 leading-[0.95] mb-8 font-display tracking-tight"
              >
                সেরা মানের পণ্য <br />
                <span className="text-emerald-600">আপনার ঘরের জন্য</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-zinc-500 text-xl mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                সালামিফাই (Salamify) আপনার জন্য নিয়ে এসেছে সেরা মানের পণ্য যা আধুনিক জীবনযাত্রার সাথে মানানসই এবং আরামদায়ক।
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
              >
                <button 
                  onClick={scrollToProducts}
                  className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center space-x-3 hover:-translate-y-1"
                >
                  <span>এখনই কিনুন</span>
                  <ArrowRight size={22} />
                </button>
                <button 
                  onClick={scrollToProducts}
                  className="px-12 py-5 bg-white text-zinc-900 border-2 border-zinc-100 rounded-2xl font-black text-lg hover:bg-zinc-50 transition-all flex items-center justify-center space-x-3 hover:-translate-y-1 shadow-lg shadow-zinc-100"
                >
                  <span>ক্যাটাগরি দেখুন</span>
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-10 bg-emerald-200 blur-[100px] rounded-full opacity-20 animate-pulse"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)]">
                <img 
                  src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop" 
                  alt="Premium Apparel" 
                  className="w-full h-[600px] object-cover hover:scale-110 transition-transform duration-[2s]"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-zinc-50 hidden md:block"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/30">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-600 font-black uppercase tracking-[0.2em] mb-1">নতুন কালেকশন</p>
                    <p className="text-2xl font-black text-zinc-900">প্রিমিয়াম কোয়ালিটি</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div id="products-grid" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Category Filter */}
        <header className="mb-16 text-center">
          <div className="inline-block px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">শপ</div>
          <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-8 font-display">আমাদের কালেকশন</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-8 py-4 rounded-2xl text-sm font-black transition-all duration-300 border-2",
                  activeCategory === category 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xl shadow-emerald-600/20 -translate-y-1" 
                    : "bg-white text-zinc-500 border-zinc-100 hover:border-emerald-600 hover:text-emerald-600 hover:shadow-lg"
                )}
              >
                {category === 'All' ? 'সব প্রোডাক্ট' : category}
              </button>
            ))}
          </div>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};
