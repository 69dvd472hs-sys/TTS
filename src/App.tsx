import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Search, User, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from './lib/utils';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

// --- Cart Context ---
interface CartItem {
  id: string;
  variantId: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Components ---

const Logo = ({ className, invert = false }: { className?: string; invert?: boolean }) => (
  <Link to="/" className={cn("flex items-center gap-5 group", className)}>
    <div className={cn(
      "w-12 h-12 flex items-center justify-center relative",
      invert ? "invert brightness-200" : ""
    )}>
      <img 
        src="/input_file_0.png" 
        alt="Touch The Stars" 
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-700"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement?.querySelector('.fallback-svg')?.classList.remove('hidden');
        }}
      />
      <div className="fallback-svg hidden">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-current">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor" />
        </svg>
      </div>
    </div>
    <span className={cn(
      "text-lg font-black tracking-[0.5em] uppercase hidden sm:block whitespace-nowrap transition-colors duration-500",
      invert ? "text-white" : "text-black"
    )}>
      Touch The Stars
    </span>
  </Link>
);

const Navbar = () => {
  const { setIsCartOpen, cart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isDarkTheme = !isScrolled && location.pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700 h-24 flex items-center justify-between px-12 md:px-20",
      isScrolled ? "bg-brand-navy shadow-[0_1px_20px_rgba(0,0,0,0.4)]" : "bg-transparent"
    )}>
      <div className="flex items-center gap-20">
        <Logo invert={isDarkTheme || isScrolled} />
        <div className={cn(
          "hidden xl:flex gap-14 text-[9px] font-black uppercase tracking-[0.5em] transition-colors duration-500",
          (isDarkTheme || isScrolled) ? "text-white/60" : "text-black/40"
        )}>
          <Link to="/" className="hover:text-white transition-colors relative group">
            Drop 01
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
          </Link>
          <Link to="/" className="hover:text-white transition-colors relative group">
            Archive
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
          </Link>
          <Link to="/" className="hover:text-white transition-colors relative group">
            Laboratory
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
          </Link>
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-10 transition-colors duration-500",
        (isDarkTheme || isScrolled) ? "text-white" : "text-black"
      )}>
        <button className="hover:scale-110 transition-transform"><Search size={20} strokeWidth={2.5} /></button>
        <button className="hidden sm:block hover:scale-110 transition-transform group relative">
          <User size={20} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative group p-1"
        >
          <ShoppingBag size={22} strokeWidth={2.5} className="group-hover:translate-y-[-2px] transition-transform" />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 text-[8px] w-4 h-4 bg-white text-brand-navy rounded-full flex items-center justify-center font-black"
              >
                {cartCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </nav>
  );
};

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-serif">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-gray-400">Your bag is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-sm font-bold underline uppercase tracking-widest"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-black">-</button>
                        <span className="text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-black">+</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-gray-500 uppercase tracking-widest font-medium">Subtotal</span>
                  <span className="text-xl font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-full flex items-center justify-center gap-2 group overflow-hidden relative">
                  <span className="relative z-10 font-bold uppercase tracking-widest text-sm">Checkout</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full mt-4 text-xs text-center text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-white">
          <Navbar />
          <CartDrawer />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:handle" element={<ProductDetails />} />
            </Routes>
          </main>
          
          <footer className="bg-black text-white py-32 px-8 mt-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
              <div className="space-y-10">
                <Logo invert className="scale-110 origin-left" />
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.25em] leading-relaxed max-w-xs font-black">
                  Orbital aesthetics. <br/>Urban culture. <br/>Uncompromising quality.
                </p>
                <div className="pt-4 border-t border-gray-900">
                  <span className="text-[10px] text-gray-700 font-black uppercase tracking-widest">Connect with our Lab</span>
                  <div className="flex gap-4 mt-2">
                    <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Server Status: Online</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-gray-400">Collections</h3>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-200">
                  <li><Link to="/" className="hover:text-white transition-colors">Drop 01: Celestial</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">The Orbital Series</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Archive</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-gray-400">Company</h3>
                <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-200">
                  <li><Link to="/" className="hover:text-white transition-colors">Our Ethos</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Sustainability</Link></li>
                  <li><Link to="/" className="hover:text-white transition-colors">Journal</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 text-gray-400">Frequency</h3>
                <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest font-medium leading-relaxed">
                  Subscribe to receive early access to upcoming drops.
                </p>
                <div className="flex border-b border-gray-800 pb-3">
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR EMAIL" 
                    className="bg-transparent border-none text-[10px] w-full focus:outline-none placeholder:text-gray-700 font-bold tracking-widest" 
                  />
                  <button className="hover:translate-x-1 transition-transform"><ArrowRight size={16} /></button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-600">
              <p>&copy; 2024 TOUCH THE STARS. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-10">
                <Link to="/" className="hover:text-gray-300 transition-colors">Privacy</Link>
                <Link to="/" className="hover:text-gray-300 transition-colors">Terms</Link>
                <Link to="/" className="hover:text-gray-300 transition-colors">Shipping</Link>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}
