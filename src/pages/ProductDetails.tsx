import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw, MessageCircle, Zap, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        
        // Scroll to form if hash is present in URL
        if (window.location.hash === '#order-form') {
          setTimeout(() => {
            const form = document.getElementById('order-form');
            if (form) {
              form.scrollIntoView({ behavior: 'smooth' });
            }
          }, 500);
        }
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `আসসালামু আলাইকুম, আমি আপনার ওয়েবসাইট থেকে এই প্রোডাক্টটি কিনতে চাই।\n\nপ্রোডাক্ট: ${product.name}\nমূল্য: ৳${product.price}\nলিঙ্ক: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/8801886836315?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: 'N/A',
            area: 'N/A',
            email: 'N/A'
          },
          items: [{ ...product, quantity: 1 }],
          total: product.price,
          payment: { method: 'cod', transactionId: '' }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.id);
        setOrderConfirmed(true);
      } else {
        alert('অর্ডার করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      console.error(err);
      alert('সার্ভারে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!product) return;
    const message = `আসসালামু আলাইকুম, আমি আপনার ওয়েবসাইট থেকে এই প্রোডাক্টটি অর্ডার করেছি।\n\nঅর্ডার আইডি: #${orderId}\nপ্রোডাক্ট: ${product.name}\nমূল্য: ৳${product.price}\n\nকাস্টমার তথ্য:\nনাম: ${customerInfo.name}\nমোবাইল: ${customerInfo.phone}\nঠিকানা: ${customerInfo.address}`;
    const whatsappUrl = `https://wa.me/8801886836315?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollToForm = () => {
    const form = document.getElementById('order-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;
  if (!product) return <div className="text-center py-20 text-xl font-bold">প্রোডাক্ট পাওয়া যায়নি</div>;

  return (
    <div className="bg-zinc-50/50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-bold text-zinc-500 hover:text-emerald-600 mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          পিছনে যান
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 bg-white p-6 md:p-10 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-200/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-6 aspect-square rounded-3xl overflow-hidden bg-zinc-50 border border-zinc-100"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full w-fit mb-6">
              <Zap size={14} className="fill-emerald-700" />
              <span className="text-xs font-black uppercase tracking-widest">{product.category}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 mb-6 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <p className="text-5xl font-black text-emerald-600">৳{product.price.toFixed(0)}</p>
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">স্টকে আছে</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                  <span className="text-sm font-bold">স্টক আউট</span>
                </div>
              )}
            </div>
            
            <div className="prose prose-zinc mb-10">
              <p className="text-zinc-600 text-xl leading-relaxed font-medium">
                {product.description || "এই প্রোডাক্টটির জন্য কোনো বর্ণনা পাওয়া যায়নি।"}
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  disabled={product.stock === 0}
                  className="flex-[2] px-8 py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl hover:bg-emerald-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl shadow-emerald-600/30 hover:-translate-y-1"
                >
                  <ShoppingBag size={24} />
                  <span>এখনই অর্ডার করুন</span>
                </button>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 px-8 py-6 bg-zinc-900 text-white rounded-2xl font-bold text-lg hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl shadow-zinc-200 hover:-translate-y-1"
                >
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full px-8 py-5 bg-white text-emerald-600 border-2 border-emerald-600 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg shadow-emerald-600/5"
              >
                <MessageCircle size={24} />
                <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-zinc-100">
              <div className="flex flex-col items-center text-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm mb-3"><Truck size={24} /></div>
                <span className="text-xs font-black text-zinc-900 uppercase tracking-wider">ফাস্ট ডেলিভারি</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm mb-3"><RotateCcw size={24} /></div>
                <span className="text-xs font-black text-zinc-900 uppercase tracking-wider">সহজ রিটার্ন</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm mb-3"><ShieldCheck size={24} /></div>
                <span className="text-xs font-black text-zinc-900 uppercase tracking-wider">১০০% নিরাপদ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bengali Order Form */}
        <div id="order-form" className="max-w-4xl mx-auto bg-white rounded-[40px] border-4 border-emerald-500/10 p-8 md:p-16 shadow-[0_32px_64px_-12px_rgba(16,185,129,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full -ml-32 -mb-32 opacity-50" />
          
          <div className="relative z-10">
            {!orderConfirmed ? (
              <>
                <div className="text-center mb-12">
                  <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">অর্ডার ফর্ম</div>
                  <h2 className="text-3xl md:text-5xl font-black text-zinc-900 mb-6">অর্ডার করতে নিচের ফর্মটি পূরণ করুন</h2>
                  <p className="text-zinc-500 text-lg font-medium">আপনার সঠিক তথ্য দিয়ে আমাদের সহায়তা করুন</p>
                </div>

                <form className="space-y-8" onSubmit={handleFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-zinc-900 uppercase tracking-wider ml-1">আপনার নাম</label>
                      <input 
                        name="name"
                        required
                        type="text" 
                        placeholder="আপনার নাম লিখুন" 
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className="w-full px-8 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-lg font-medium"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black text-zinc-900 uppercase tracking-wider ml-1">মোবাইল নম্বর</label>
                      <input 
                        name="phone"
                        required
                        type="tel" 
                        placeholder="আপনার মোবাইল নম্বর লিখুন" 
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full px-8 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-lg font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-zinc-900 uppercase tracking-wider ml-1">সম্পূর্ণ ঠিকানা</label>
                    <textarea 
                      name="address"
                      required
                      rows={4}
                      placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন (গ্রাম/শহর, থানা, জেলা)" 
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full px-8 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-lg font-medium resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black text-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center space-x-4 group disabled:bg-zinc-300 disabled:cursor-not-allowed"
                    >
                      <span>{submitting ? 'অর্ডার প্রসেসিং হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</span>
                      {!submitting && <ArrowLeft className="rotate-180 group-hover:translate-x-2 transition-transform" size={28} />}
                    </button>
                    <p className="text-center text-zinc-400 text-sm mt-6 font-medium">অর্ডার কনফার্ম করলে আপনার তথ্য আমাদের কাছে জমা হবে</p>
                  </div>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-lg shadow-emerald-600/10">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-black text-zinc-900 mb-4">অর্ডার সফল হয়েছে!</h2>
                <p className="text-zinc-500 text-xl font-medium mb-2">অর্ডার আইডি: <span className="text-emerald-600 font-black">#{orderId}</span></p>
                <p className="text-zinc-500 mb-12 max-w-md mx-auto text-lg">
                  আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। দ্রুত কনফার্মেশনের জন্য নিচের বাটনে ক্লিক করে হোয়াটসঅ্যাপে মেসেজ দিন।
                </p>
                
                <button 
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black text-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center space-x-4 group"
                >
                  <MessageCircle size={28} />
                  <span>হোয়াটসঅ্যাপে মেসেজ দিন</span>
                </button>
                
                <button 
                  onClick={() => setOrderConfirmed(false)}
                  className="mt-6 text-zinc-400 font-bold hover:text-zinc-600 transition-colors"
                >
                  নতুন অর্ডার করুন
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
