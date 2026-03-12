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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa]">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between py-16 lg:py-24 gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-6"
              >
                <Star size={14} className="fill-emerald-700" />
                <span>Premium Quality Guaranteed</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-black text-zinc-900 leading-[1.1] mb-6 font-display"
              >
                Quality Products <br />
                <span className="text-emerald-600">For Your Home</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-500 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                সালামিফাই (Salamify) brings you the finest quality products that blend minimalism with ultimate comfort. Crafted for the modern lifestyle.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2">
                  <span>Shop Now</span>
                  <ArrowRight size={18} />
                </button>
                <button className="px-10 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-all flex items-center justify-center space-x-2">
                  <span>View Categories</span>
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -inset-4 bg-emerald-100 blur-3xl rounded-full opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop" 
                alt="Premium Apparel" 
                className="relative w-full h-[500px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-zinc-100 hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">New Arrivals</p>
                    <p className="text-lg font-black text-zinc-900">Premium Collection</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <header className="mb-12 text-center">
          <h2 className="text-3xl font-black text-zinc-900 mb-4 font-display">Our Products</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border",
                  activeCategory === category 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20" 
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-emerald-600 hover:text-emerald-600"
                )}
              >
                {category}
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
            <p className="text-zinc-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
