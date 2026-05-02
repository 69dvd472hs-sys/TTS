import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, ChevronLeft, ChevronRight, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { fetchProductByHandle, ShopifyProduct } from '../services/shopifyService';
import { useCart } from '../App';
import { cn } from '../lib/utils';

export default function ProductDetails() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    if (handle) {
      fetchProductByHandle(handle).then(data => {
        setProduct(data);
        setLoading(false);
      });
    }
    window.scrollTo(0, 0);
  }, [handle]);

  if (loading) return (
    <div className="pt-40 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-t-2 border-black animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="pt-40 text-center">
      <h1 className="text-2xl font-serif">Product not found</h1>
      <Link to="/" className="text-sm underline mt-4 inline-block">Return Home</Link>
    </div>
  );

  const images = product.images.edges.map(e => e.node.url);
  const activeImage = images[activeImageIndex];
  const price = product.priceRange.minVariantPrice;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      variantId: product.variants.edges[0].node.id,
      title: product.title,
      price: price.amount,
      image: images[0]
    });
  };

  return (
    <div className="pt-32 pb-40 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
        {/* Image Gallery */}
        <div className="flex-1 space-y-4">
          <div className="relative aspect-[3/4] bg-gray-50 border border-black/5 overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImageIndex(prev => (prev + 1) % images.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, i) => (
              <button 
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={cn(
                  "w-24 aspect-square overflow-hidden flex-shrink-0 border-2 transition-all",
                  activeImageIndex === i ? "border-black" : "border-transparent opacity-40 hover:opacity-100"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 max-w-lg pt-4">
          <div className="space-y-12">
            <header className="space-y-6">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">
                <Link to="/" className="hover:text-black">Orbital</Link>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="text-black">Inventory / In Stock</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif mb-6 uppercase tracking-tighter italic leading-[0.9]">{product.title}</h1>
              <div className="flex items-baseline gap-4 border-b border-black/5 pb-8">
                <span className="text-3xl font-black tracking-tight">${parseFloat(price.amount).toFixed(2)}</span>
                <span className="text-xs text-gray-400 font-bold tracking-widest">{price.currencyCode} / TAX INCL.</span>
              </div>
            </header>

            <div className="text-xs text-gray-500 leading-relaxed font-bold uppercase tracking-[0.15em] max-w-md">
              {product.description}
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400">Select Quantity</p>
                <div className="flex items-center gap-10 w-fit bg-gray-50 px-8 py-5 border border-black/5">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="hover:text-gray-400 transition-colors"><Minus size={14} strokeWidth={3} /></button>
                  <span className="w-8 text-center font-black text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="hover:text-gray-400 transition-colors"><Plus size={14} strokeWidth={3} /></button>
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                className="group relative w-full bg-black text-white py-6 overflow-hidden flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
              >
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em]">Initialize Checkout</span>
                <div className="absolute inset-0 bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>

            <div className="space-y-4 pt-10">
               <details className="group border-b border-black/5 pb-4">
                  <summary className="list-none flex justify-between items-center cursor-pointer text-[10px] font-black uppercase tracking-[0.3em]">
                    <span>Technical Specifications</span>
                    <Plus size={14} className="group-open:rotate-45 transition-transform" />
                  </summary>
                  <div className="pt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-loose">
                    • 100% Orbit-Grade Cotton Fleece <br/>
                    • Reinforced Double-Stitched Seams <br/>
                    • Custom Hardware Accents <br/>
                    • Made for Daily Exploration
                  </div>
               </details>
               <details className="group border-b border-black/5 pb-4">
                  <summary className="list-none flex justify-between items-center cursor-pointer text-[10px] font-black uppercase tracking-[0.3em]">
                    <span>Logistics & Returns</span>
                    <Plus size={14} className="group-open:rotate-45 transition-transform" />
                  </summary>
                  <div className="pt-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Standard shipping: 3-5 business days. <br/>
                    Free returns within 30 days of arrival.
                  </div>
               </details>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-sell or related */}
      <section className="mt-40 border-t border-black/5 pt-32 max-w-7xl mx-auto">
        <h3 className="text-4xl font-serif mb-16 uppercase tracking-tighter italic text-center">Orbital Synergy</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <p className="col-span-full text-center text-[10px] text-gray-400 uppercase tracking-[0.5em] font-black">Syncing additional data...</p>
        </div>
      </section>
    </div>
  );
}
