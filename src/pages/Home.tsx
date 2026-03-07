import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, ShoppingBag } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

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

  // Auto-play featured products
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % Math.min(products.length, 3));
    }, 4000);
    return () => clearInterval(interval);
  }, [products]);

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

  const featuredProduct = products[featuredIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <section className="relative h-[750px] rounded-[48px] overflow-hidden mb-20 bg-zinc-950 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
        <img 
          src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2070&auto=format&fit=crop" 
          alt="Salamify Premium Apparel" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10"></div>

        <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between px-8 md:px-24 py-12 gap-16 z-20">
          {/* Left Side: Brand Message */}
          <div className="max-w-2xl text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-3 px-4 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase rounded-full mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Premium Clothing Brand</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-4 tracking-tighter"
            >
              SALAMIFY<span className="text-emerald-500">.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 flex justify-center lg:justify-start"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-600/40">
                  <ShoppingBag className="text-white" size={40} />
                </div>
                <div className="flex flex-col">
                  <span className="text-5xl font-black tracking-tighter text-white leading-none">
                    SALAMIFY<span className="text-emerald-500">.</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.4em] mt-1">
                    Premium Apparel
                  </span>
                </div>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-zinc-400 text-sm md:text-base mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              সালামিফাই (Salamify) brings you the finest quality T-shirts that blend minimalism with ultimate comfort. Crafted for the modern lifestyle.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-12 py-6 bg-emerald-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-500 transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]"
              >
                Explore Collection
              </motion.button>
            </div>
          </div>

          {/* Right Side: Automatic Featured Product Showcase - More Prominent */}
          <div className="relative w-full max-w-md lg:max-w-xl lg:ml-auto">
            <div className="absolute -inset-24 bg-emerald-500/20 blur-[150px] rounded-full opacity-40"></div>
            
            <div className="relative">
              <div className="absolute -top-12 left-0 text-white/20 text-8xl font-black italic select-none pointer-events-none uppercase">
                Featured
              </div>
              
              <AnimatePresence mode="wait">
                {featuredProduct ? (
                  <motion.div
                    key={featuredProduct.id}
                    initial={{ opacity: 0, scale: 0.9, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    className="relative bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[64px] p-8 md:p-14 shadow-2xl overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                      <motion.div 
                        key={`progress-${featuredIndex}`}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 4, ease: "linear" }}
                        className="h-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,1)]"
                      />
                    </div>
                    
                    <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden mb-12 bg-zinc-800/80 shadow-2xl">
                      <img 
                        src={featuredProduct.image} 
                        alt={featuredProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-8 left-8 flex flex-col gap-3">
                        <span className="px-5 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl w-fit">
                          New Drop
                        </span>
                        <span className="px-5 py-2 bg-black/60 backdrop-blur-xl text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10 w-fit">
                          Premium Cotton
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.5em] mb-4">{featuredProduct.category}</p>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">{featuredProduct.name}</h3>
                        <div className="flex items-center gap-5">
                          <p className="text-zinc-300 text-3xl font-light">৳{featuredProduct.price.toFixed(0)}</p>
                          <div className="h-6 w-[1px] bg-white/20"></div>
                          <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest">In Stock</p>
                        </div>
                      </div>
                      <Link 
                        to={`/product/${featuredProduct.id}`}
                        className="w-20 h-20 bg-white text-black rounded-[32px] flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-700 shadow-2xl group/btn"
                      >
                        <ArrowRight size={32} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-[700px] flex items-center justify-center bg-white/5 rounded-[64px] border border-white/10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center mt-14 gap-5">
              {products.slice(0, 3).map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-700",
                    featuredIndex === idx ? "w-20 bg-emerald-500" : "w-3 bg-white/10 hover:bg-white/30"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
            <p className="text-zinc-400 text-sm">Most loved Salamify pieces this week.</p>
          </div>
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
            <div className="w-2 h-2 rounded-full bg-zinc-200"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.slice(0, 2).map((product, idx) => (
            <motion.div 
              key={`trending-${product.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[300px] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <span className="inline-block w-fit px-2 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded mb-3">
                  {idx === 0 ? 'Best Seller' : 'Limited Edition'}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                <Link 
                  to={`/product/${product.id}`}
                  className="text-white text-sm font-medium flex items-center space-x-2 group/link"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Our Signature T-Shirts</h2>
            <p className="text-zinc-400">Crafted with 100% organic cotton.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeCategory === category 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
