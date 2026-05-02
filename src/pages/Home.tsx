import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { fetchProducts, ShopifyProduct } from '../services/shopifyService';
import { cn } from '../lib/utils';

const ProductCard = ({ product, index }: { product: ShopifyProduct; index: number; key?: string | number }) => {
  const imageUrl = product.images.edges[0]?.node.url || '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group relative"
    >
      <Link to={`/product/${product.handle}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-6 border border-black/5">
          <img 
            src={imageUrl} 
            alt={product.title}
            className="w-full h-full object-cover grayscale-0 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
             <span className="bg-black text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1">Drop 01</span>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 group-hover:translate-x-1 transition-transform">{product.title}</h3>
            <span className="text-[10px] font-black tracking-widest text-gray-400">0{index + 1}</span>
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-2">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Inventory: Low</p>
            <span className="text-sm font-black">${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-brand-navy">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center px-8 md:px-20 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 select-none">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-50 grayscale-[0.2]"
          >
            <source src="/input_file_1.mp4" type="video/mp4" />
            {/* Fallback Image */}
            <img 
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=2000" 
              alt="Streetwear Hero" 
              className="w-full h-full object-cover grayscale opacity-20"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-brand-navy/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 pt-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-8 h-[1px] bg-white/40" />
              <p className="text-[9px] uppercase tracking-[0.7em] font-black text-white/60">Drop 01 / Celestial Laboratory</p>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-7xl md:text-[9rem] lg:text-[12rem] font-bold leading-[0.7] tracking-[-0.04em] mb-12 uppercase text-white"
            >
              Reach <br />
              <div className="flex items-center gap-6">
                <span className="font-serif italic font-light lowercase text-[0.4em] tracking-tight opacity-40 translate-y-4">the</span>
                <span>Stars</span>
              </div>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-8 items-start sm:items-center"
            >
              <Link 
                to="/" 
                className="group relative px-16 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] overflow-hidden rounded-full transition-transform hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 transition-colors group-hover:text-white">Shop Collection</span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Link>
              <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/60 group hover:text-white transition-colors">
                Orbital Archive
                <ArrowRight size={16} className="group-hover:translate-x-3 transition-transform duration-500" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 2, type: 'spring' }}
            className="hidden lg:flex relative w-full max-w-lg aspect-square items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-white/5 blur-[120px] rounded-full animate-pulse" />
              <img 
                src="/input_file_0.png" 
                alt="Brand Mark" 
                className="w-full h-full object-contain animate-float drop-shadow-[0_0_100px_rgba(255,255,255,0.15)] relative z-10 invert brightness-200" 
              />
              <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow scale-125" />
              <div className="absolute inset-0 border border-white/5 rounded-full animate-spin-slow-reverse scale-150 opacity-40" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-8 md:left-20 flex gap-16 text-[9px] font-black uppercase tracking-[0.5em] text-white/40">
          <div className="flex flex-col gap-1">
            <span className="text-white/60">Latitude</span>
            <span>48.8566° N</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/60">Longitude</span>
            <span>2.3522° E</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-white/60">Status</span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </section>

      {/* Brand Ethos */}
      <section className="py-32 px-8 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.6em] font-bold text-brand-gold/60 mb-8">Manifesto</p>
            <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-12 italic">
              We don't just dress the body, <br/>we dress the ambition.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-lg mb-12 uppercase tracking-widest font-medium">
              Touch The Stars is a creative laboratory where classical art meets the raw energy of urban movement. Each piece is a fragment of a larger orbital narrative.
            </p>
            <Link to="/" className="text-xs font-bold uppercase tracking-widest border-b border-brand-gold pb-2 hover:opacity-50 transition-opacity text-brand-gold">
              Explore Our Ethos
            </Link>
          </div>
          <div className="flex-1 relative aspect-square group overflow-hidden rounded-3xl">
            <img 
              src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000" 
              alt="Process" 
              className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <span className="text-[10px] font-black uppercase tracking-widest">Lab / 001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400">Inventory</p>
            <h2 className="text-5xl font-serif uppercase tracking-tighter italic">Essential Gear</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Show All', 'Outerwear', 'Tops', 'Accessories'].map(cat => (
              <button 
                key={cat}
                className={cn(
                  "px-6 py-3 text-[9px] uppercase tracking-[0.3em] font-black rounded-full border transition-all",
                  cat === 'Show All' ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <button className="text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-2 hover:opacity-50 transition-opacity">
            View All Products
          </button>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="px-8 pb-32">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden aspect-[16/7]">
           <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
            alt="Showroom" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-8">
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">Designed in Paris, Crafted Globally.</h2>
            <p className="max-w-xl text-white/80 mb-8 leading-relaxed">
              Every detail is considered. From the ethical sourcing of our fabrics to the precision of our stitching.
            </p>
            <Link to="/" className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-100 transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
