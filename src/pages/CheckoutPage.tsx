import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, CheckCircle2, CreditCard, 
  Truck, MapPin, Phone, Mail, User, ShoppingBag,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

type Step = 'shipping' | 'payment' | 'confirmation';

export const CheckoutPage: React.FC = () => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('shipping');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    area: '',
    address: ''
  });

  const [paymentData, setPaymentData] = useState({
    method: 'cod',
    transactionId: ''
  });

  const [orderId, setOrderId] = useState<number | null>(null);

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="text-zinc-400" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Your bag is empty</h1>
        <Link to="/" className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200">
          Start Shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          total: total,
          payment: paymentData
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrderId(data.id);
        localStorage.setItem('customer_identifier', formData.phone || formData.email);
        clearCart();
        setStep('confirmation');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Success', icon: CheckCircle2 },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: step === 'shipping' ? '0%' : step === 'payment' ? '50%' : '100%' }}
            ></div>
            
            {steps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = 
                (step === 'payment' && s.id === 'shipping') || 
                (step === 'confirmation');
              
              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isActive ? "bg-emerald-600 border-emerald-600 text-white scale-110 shadow-lg shadow-emerald-600/20" :
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                    "bg-white border-zinc-200 text-zinc-400"
                  )}>
                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mt-2 transition-colors",
                    isActive ? "text-emerald-600" : "text-zinc-400"
                  )}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                    <MapPin className="text-emerald-600" />
                    Shipping Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                          <input
                            required
                            type="text"
                            placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                          <input
                            required
                            type="tel"
                            placeholder="017XXXXXXXX"
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                          required
                          type="email"
                          placeholder="email@example.com"
                          className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">City / District</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Dhaka"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Area / Thana</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Uttara"
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          value={formData.area}
                          onChange={e => setFormData({ ...formData, area: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Detailed Address</label>
                      <textarea
                          required
                          rows={3}
                          placeholder="House no, Road no, Landmark..."
                          className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={() => {
                          if (formData.name && formData.phone && formData.city && formData.address) {
                            setStep('payment');
                          } else {
                            alert('Please fill in all required fields');
                          }
                        }}
                        className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200"
                      >
                        Continue to Payment
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                    <CreditCard className="text-emerald-600" />
                    Payment Method
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', icon: Truck, description: 'Pay when you receive' },
                      { id: 'bkash', label: 'bKash', icon: Smartphone, description: '017XXXXXXXX' },
                      { id: 'nagad', label: 'Nagad', icon: Smartphone, description: '017XXXXXXXX' },
                      { id: 'rocket', label: 'Rocket', icon: Smartphone, description: '017XXXXXXXX' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentData({ ...paymentData, method: m.id })}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all group",
                          paymentData.method === m.id 
                            ? "bg-emerald-50 border-emerald-600 text-emerald-700" 
                            : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <m.icon size={24} className={paymentData.method === m.id ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-600"} />
                          {paymentData.method === m.id && <CheckCircle2 size={16} className="text-emerald-600" />}
                        </div>
                        <p className="font-bold">{m.label}</p>
                        <p className="text-xs text-zinc-500 mt-1">{m.description}</p>
                      </button>
                    ))}
                  </div>

                  {paymentData.method !== 'cod' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-200"
                    >
                      <p className="text-sm text-zinc-600 mb-4">
                        Please send the total amount to our {paymentData.method} number and provide the Transaction ID below.
                      </p>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Transaction ID</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. 8N7X6W5V"
                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        value={paymentData.transactionId}
                        onChange={e => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                      />
                    </motion.div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setStep('shipping')}
                      className="flex-1 py-4 bg-zinc-100 text-zinc-600 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={20} />
                      Back
                    </button>
                    <button
                      disabled={loading || (paymentData.method !== 'cod' && !paymentData.transactionId)}
                      onClick={handlePlaceOrder}
                      className="flex-[2] py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-200 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm"
                >
                  <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-zinc-900 mb-4">Order Confirmed!</h2>
                  <p className="text-zinc-500 mb-2">Order ID: <span className="text-zinc-900 font-bold">#{orderId}</span></p>
                  <p className="text-zinc-500 mb-10 max-w-md mx-auto">
                    Thank you for your purchase. We've received your order and will notify you when it ships.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/profile" className="w-full sm:w-auto px-8 py-4 bg-zinc-100 text-zinc-900 rounded-xl font-bold hover:bg-zinc-200 transition-all border border-zinc-200">
                      Track Order
                    </Link>
                    <Link to="/" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200">
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 sticky top-24">
              <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-emerald-600" />
                Order Summary
              </h3>
              
              <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-zinc-200">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity} × ৳{item.price}</p>
                    </div>
                    <p className="text-sm font-bold text-zinc-900">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-zinc-200">
                <div className="flex justify-between text-sm text-zinc-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">৳{total}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600">
                  <span className="font-medium">Shipping</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-zinc-900 pt-3 border-t border-zinc-200">
                  <span>Total</span>
                  <span>৳{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
