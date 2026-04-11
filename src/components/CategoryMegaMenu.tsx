import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  Menu, 
  X, 
  Shirt, 
  Smartphone, 
  Home as HomeIcon, 
  Heart, 
  Watch, 
  Zap,
  ShoppingBag,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  subCategories: {
    name: string;
    items: string[];
  }[];
}

const categories: Category[] = [
  {
    id: 'mens-fashion',
    name: "Men's Fashion",
    icon: Shirt,
    subCategories: [
      {
        name: "Clothing",
        items: ["Drop Shoulder", "Panjabi", "T-Shirts", "Shirts", "Pants", "Hoodies"]
      },
      {
        name: "Accessories",
        items: ["Watches", "Belts", "Wallets", "Sunglasses"]
      },
      {
        name: "Footwear",
        items: ["Sneakers", "Formal Shoes", "Sandals"]
      }
    ]
  },
  {
    id: 'womens-fashion',
    name: "Women's Fashion",
    icon: ShoppingBag,
    subCategories: [
      {
        name: "Clothing",
        items: ["Saree", "Salwar Kameez", "Kurtas", "Tops", "Leggings"]
      },
      {
        name: "Beauty",
        items: ["Skincare", "Makeup", "Haircare", "Fragrance"]
      }
    ]
  },
  {
    id: 'electronics',
    name: "Electronics",
    icon: Smartphone,
    subCategories: [
      {
        name: "Mobile",
        items: ["Smartphones", "Tablets", "Cases", "Power Banks"]
      },
      {
        name: "Computing",
        items: ["Laptops", "Monitors", "Keyboards", "Mice"]
      }
    ]
  },
  {
    id: 'home-lifestyle',
    name: "Home & Lifestyle",
    icon: HomeIcon,
    subCategories: [
      {
        name: "Kitchen",
        items: ["Cookware", "Appliances", "Storage"]
      },
      {
        name: "Decor",
        items: ["Wall Art", "Lighting", "Cushions"]
      }
    ]
  },
  {
    id: 'health-beauty',
    name: "Health & Beauty",
    icon: Heart,
    subCategories: [
      {
        name: "Personal Care",
        items: ["Bath & Body", "Oral Care", "Grooming"]
      }
    ]
  },
  {
    id: 'watches-accessories',
    name: "Watches & Accessories",
    icon: Watch,
    subCategories: [
      {
        name: "Watches",
        items: ["Analog", "Digital", "Smartwatches"]
      }
    ]
  }
];

export const CategoryMegaMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);

  return (
    <div className="relative w-full lg:w-72 z-40">
      {/* Desktop Menu */}
      <div className="hidden lg:block bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-visible">
        <div className="p-4 border-b border-zinc-50 bg-zinc-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-zinc-900 font-black uppercase tracking-widest text-xs">
            <Menu size={16} className="text-emerald-600" />
            <span>Categories</span>
          </div>
        </div>
        
        <div className="py-2 relative" onMouseLeave={() => setActiveCategory(null)}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              className={cn(
                "group flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200",
                activeCategory === cat.id ? "bg-emerald-50 text-emerald-700" : "text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <div className="flex items-center gap-3">
                <cat.icon size={18} className={cn(
                  "transition-colors",
                  activeCategory === cat.id ? "text-emerald-600" : "text-zinc-400 group-hover:text-emerald-500"
                )} />
                <span className="text-sm font-bold">{cat.name}</span>
              </div>
              <ChevronRight size={14} className={cn(
                "transition-transform",
                activeCategory === cat.id ? "translate-x-1" : "opacity-0 group-hover:opacity-100"
              )} />
            </div>
          ))}

          {/* Mega Menu Pop-up */}
          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-full ml-2 w-[600px] bg-white border border-zinc-100 rounded-2xl shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 z-50 min-h-full"
              >
                <div className="grid grid-cols-3 gap-8">
                  {categories.find(c => c.id === activeCategory)?.subCategories.map((sub, idx) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-2">
                        {sub.name}
                      </h4>
                      <ul className="space-y-2">
                        {sub.items.map((item, i) => (
                          <li key={i}>
                            <a href="#" className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors font-medium block">
                              {item}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between px-6 py-4 bg-white border border-zinc-100 rounded-2xl shadow-sm text-zinc-900 font-bold"
        >
          <div className="flex items-center gap-3">
            <Menu size={20} className="text-emerald-600" />
            <span>Browse Categories</span>
          </div>
          {isMobileMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 bg-white border border-zinc-100 rounded-2xl shadow-lg overflow-hidden"
            >
              {categories.map((cat) => (
                <div key={cat.id} className="border-b border-zinc-50 last:border-0">
                  <button
                    onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon size={18} className="text-emerald-600" />
                      <span className="text-sm font-bold">{cat.name}</span>
                    </div>
                    <ChevronDown size={16} className={cn(
                      "transition-transform duration-300",
                      expandedMobileCat === cat.id ? "rotate-180" : ""
                    )} />
                  </button>
                  
                  <AnimatePresence>
                    {expandedMobileCat === cat.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-zinc-50/50 px-6 pb-4"
                      >
                        {cat.subCategories.map((sub, idx) => (
                          <div key={idx} className="mt-4 first:mt-2">
                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                              {sub.name}
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {sub.items.map((item, i) => (
                                <a key={i} href="#" className="text-sm text-zinc-600 hover:text-emerald-600 py-1 font-medium">
                                  {item}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
