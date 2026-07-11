import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface HomePageProps {
  onNavigateShop: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function HomePage({ onNavigateShop, products, onSelectProduct }: HomePageProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
    }
  }, [products]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[80vh] flex flex-col justify-center items-center text-center p-8 bg-zinc-50 relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="space-y-16 max-w-4xl relative z-10 w-full">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-6xl md:text-8xl tracking-tighter uppercase text-black">
              BLAZEBRO®
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 uppercase tracking-[0.2em] font-mono">
              // HIGH-PERFORMANCE BRUTALIST CONSTRUCTS.
            </p>
          </div>
          
          <div className="h-px w-24 bg-black mx-auto" />

          <button 
            onClick={onNavigateShop}
            className="bg-black text-white hover:bg-accent hover:text-black transition-colors px-10 py-5 font-mono font-bold tracking-widest text-sm flex items-center gap-3 cursor-pointer mx-auto shadow-xl"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
          >
            <ShoppingBag size={18} />
            [ ENTER THE SHOP ]
            <ArrowRight size={18} />
          </button>
        </div>

        {featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <button 
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className={`group p-4 border border-black/10 hover:border-black transition-all bg-white hover:shadow-lg text-left ${index > 0 ? 'hidden md:block' : ''}`}
              >
                <div className="aspect-square bg-zinc-100 mb-4 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="font-bold uppercase text-sm">{product.name}</h4>
                <p className="text-xs text-zinc-500 uppercase">{product.category}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
