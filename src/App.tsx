import { useState, useEffect, FormEvent } from 'react';
import HomePage from './components/HomePage';
import { Store } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2, 
  X, 
  Plus, 
  Activity, 
  Lock, 
  Smartphone, 
  MapPin, 
  Compass, 
  Settings as SettingsIcon, 
  Sparkles, 
  Check, 
  ArrowRight,
  Info,
  RefreshCw,
  Cpu,
  LogOut,
  Home,
  Sliders,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Globe,
  Search, Truck, Box, Database, CloudLightning
} from 'lucide-react';

// @ts-ignore
import blz01_img from './assets/images/blz_01_exoshell_1783502853451.jpg';
// @ts-ignore
import blz02_img from './assets/images/blz_02_thermal_hood_1783502868962.jpg';
// @ts-ignore
import blz03_img from './assets/images/blz_03_cargo_pants_1783502884275.jpg';
// @ts-ignore
import blz04_img from './assets/images/blz_04_boots_1783502896693.jpg';

import { Product, CartItem, Order, SystemSettings, AdminStats } from './types';

// Map generated image strings to standard Vite assets
const imageMap: Record<string, string> = {
  IMAGE_BLZ_01: blz01_img,
  IMAGE_BLZ_02: blz02_img,
  IMAGE_BLZ_03: blz03_img,
  IMAGE_BLZ_04: blz04_img,
};

export default function App() {
  // Storefront catalog & state
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings & Stats
  const [settings, setSettings] = useState<SystemSettings>({
    whatsappNumber: "2348031234567",
    latitude: "6.4542",
    longitude: "3.3887",
    tagline: "BLAZEBRO // HIGH-PERFORMANCE BRUTALIST CONSTRUCTS.",
    adminPasscode: "1337",
    allowAiAdvisor: false,
    storeDiscount: 0
  });
  const [stats, setStats] = useState<AdminStats>({
    views: 128,
    whatsappClicks: 14,
    potentialRevenue: 2245000
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Supabase Integration States
  interface SupabaseStatus {
    configured: boolean;
    url: string;
    connected: boolean;
    error: string | null;
    sql: string;
  }
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseStatus | null>(null);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [supabaseSyncMessage, setSupabaseSyncMessage] = useState<string | null>(null);

  // Navigation / Views
  const [activeView, useStateView] = useState<'home' | 'shop' | 'admin'>('home');
  const setActiveView = (view: 'home' | 'shop' | 'admin') => {
    useStateView(view);
  };
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [activeBottomPage, setActiveBottomPage] = useState<'bulk' | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Product Creator/Editor state inside Admin
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [newSpecInput, setNewSpecInput] = useState('');

  // Load state on mount with hash router for secret admin view
  useEffect(() => {
    fetchProducts();
    fetchSettings();
    fetchStats();
    fetchOrders();
    incrementViews();
    fetchSupabaseStatus();

    // Reset hash and set active view to home on load to ensure we always start at the homepage
    window.location.hash = '';
    setActiveView('home');

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setActiveView('admin');
      } else if (hash === '#shop' || hash.startsWith('#product-')) {
        setActiveView('shop');
      } else if (hash === '#home' || hash === '') {
        setActiveView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Show passcode modal automatically when activeView is 'admin' and not unlocked
  useEffect(() => {
    if (activeView === 'admin' && !isAdminUnlocked) {
      setShowPasscodeModal(true);
    }
  }, [activeView, isAdminUnlocked]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Error loading settings:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  const incrementViews = async () => {
    try {
      const res = await fetch('/api/stats/increment-views', { method: 'POST' });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  const fetchSupabaseStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseStatus(data);
    } catch (err) {
      console.error("Error loading Supabase status:", err);
    }
  };

  // Dynamic Product Page Routing Helpers
  const selectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.location.hash = `product-${product.code}`;
  };

  const goBackToCatalog = () => {
    setSelectedProduct(null);
    window.location.hash = '';
  };

  // Synchronize product detail selection state with the hash router changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-') && products.length > 0) {
        const code = hash.replace('#product-', '');
        const found = products.find(p => p.code === code);
        if (found) {
          setSelectedProduct(found);
        }
      } else if (!hash.startsWith('#product-') && activeView !== 'admin') {
        setSelectedProduct(null);
      }
    };

    // Run on initial mount or when products list changes
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products, activeView]);

  // UI Helper to resolve image paths (handling map strings vs external links)
  const getProductImage = (imageKey: string) => {
    return imageMap[imageKey] || imageKey || "https://picsum.photos/seed/blazebro/600/600";
  };

  // Naira Price Formatter
  const formatNaira = (value: number) => {
    return "₦" + value.toLocaleString('en-NG');
  };

  // Cart operations
  const addToCart = (product: Product, size: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.size === size);
    if (existing) {
      setCart(cart.map(item => 
        (item.product.id === product.id && item.size === size)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size, quantity: 1 }]);
    }
    setCartOpen(true);
  };

  const updateCartQty = (productId: string, size: string, change: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId && item.size === size) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const getCartTotal = () => {
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    return settings.storeDiscount > 0 ? total * (1 - settings.storeDiscount / 100) : total;
  };

  // Checkout Deep-Link Generator (Logs order & fires WhatsApp)
  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const customerName = formData.get('customerName') as string;
    
    if (!customerName || cart.length === 0) return;

    const total = getCartTotal();
    const orderId = `BLZ-ORD-${Date.now().toString().slice(-6)}`;

    const orderData = {
      id: orderId,
      customerName,
      items: cart.map(item => ({
        productId: item.product.id,
        code: item.product.code,
        name: item.product.name,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price
      })),
      total,
      status: 'PENDING_WHATSAPP' as const
    };

    // Log the order to our Server-side API for robust admin tracking
    try {
      const logRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (logRes.ok) {
        fetchOrders();
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to log order on backend:", err);
    }

    // Format the highly stylized brutalist WhatsApp message
    let orderText = `*BLAZEBRO // INCOMING ORDER RECORD*\n`;
    orderText += `*ORDER IDENTIFIER:* ${orderId}\n`;
    orderText += `*OUTPOST GPS:* ${settings.latitude}° N, ${settings.longitude}° E\n`;
    orderText += `===============================\n`;
    orderText += `*CLIENT NAME:* ${customerName.toUpperCase()}\n`;
    orderText += `-------------------------------\n`;
    
    cart.forEach(item => {
      orderText += `• ${item.product.code} // ${item.product.name}\n`;
      orderText += `  SIZE: [ ${item.size} ] // QTY: [ ${item.quantity} ]\n`;
      const itemPrice = settings.storeDiscount > 0 ? item.product.price * (1 - settings.storeDiscount / 100) : item.product.price;
      orderText += `  PRICE: ${formatNaira(itemPrice * item.quantity)}\n\n`;
    });

    orderText += `===============================\n`;
    orderText += `*TOTAL ACQUISITION DEBT:* ${formatNaira(total)}\n`;
    orderText += `===============================\n`;
    orderText += `_SYSTEM STATUS: COGNITIVE WHATSAPP DISPATCH_`;

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(orderText)}`;
    
    // Clear cart and redirect
    setCart([]);
    setCartOpen(false);
    
    // Trigger redirection
    window.open(whatsappUrl, '_blank');
  };

  // Passcode gate for Admin Panel
  const handleAdminUnlock = (e: FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    if (passcodeInput === settings.adminPasscode) {
      setIsAdminUnlocked(true);
      setShowPasscodeModal(false);
      setActiveView('admin');
      setPasscodeInput('');
    } else {
      setAdminError("PASSACODE REJECTED. ENCRYPTION PROTOCOL INTACT.");
    }
  };

  // Product management operations (API-backed)
  const saveProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.code || !editingProduct.name) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });
      if (res.ok) {
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("TERMINATE PRODUCT FILE IN DATA MATRIX?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Update Settings via API
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const categories = ['ALL', 'JACKETS', 'HOODIES', 'PANTS', 'FOOTWEAR'];
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category.toUpperCase() === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      p.code.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      (p.specs && p.specs.some(spec => spec.toLowerCase().includes(q)));
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (cat: string) => {
    if (cat === 'ALL') return products.length;
    return products.filter(p => p.category.toUpperCase() === cat.toUpperCase()).length;
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-black selection:text-white relative overflow-x-hidden pb-16 md:pb-20">
      
      {/* Main Brand Header */}
      <header className="border-b border-black/10 sticky top-0 bg-black/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          
          {/* Logo / Title and Mobile Cart */}
          <div className="flex justify-between items-center gap-4">
            <div 
              onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setSearchQuery(''); window.location.hash = ''; setActiveBottomPage(null); }}
              className="cursor-pointer group select-none text-left"
            >
              <h1 className="font-display font-extrabold text-xl md:text-2xl tracking-tighter text-[#ffffff] leading-none flex items-center gap-1 uppercase">
                BLAZEBRO <span className="text-[10px] font-mono font-medium text-black/40 tracking-wider align-super">®</span>
              </h1>
              <p className="text-[8px] text-[#666666] tracking-widest mt-0.5 group-hover:text-[#ffffff] transition-colors uppercase">
                // Heavyweight Steeze • No Story
              </p>
            </div>

            {/* Mobile Cart Activator */}
            <div className="flex sm:hidden items-center gap-2">
              <button 
                onClick={() => setCartOpen(true)}
                className="border border-black/10 hover:border-black p-2 flex items-center justify-center relative cursor-pointer text-black/80 hover:text-white"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                <ShoppingBag size={14} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-black font-bold text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Real-time Search Input Bar */}
          {activeView === 'shop' && (
            <div className="w-full max-w-[180px] sm:max-w-[200px] sm:mx-4 self-start sm:self-auto">
              <div className="relative flex items-center">
                <Search size={11} className="absolute left-2.5 text-zinc-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH SHOP..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 px-7.5 py-1 text-[9px] text-white outline-none font-mono uppercase tracking-wider transition-all placeholder:text-zinc-500"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Desktop Navigation Control Center */}
          <div className="hidden sm:flex items-center">
            <div className="hidden sm:flex items-center gap-6 font-mono text-[10px] tracking-widest font-bold uppercase mr-4">
              <button onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setActiveBottomPage(null); window.scrollTo(0, 0); }} className="text-white/60 hover:text-white transition-colors cursor-pointer">HOME</button>
              <button onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setActiveBottomPage(null); window.scrollTo(0, 500); }} className="text-white/60 hover:text-white transition-colors cursor-pointer">SHOP ALL</button>
            </div>
            <div className="hidden sm:flex items-center gap-3">
            <button 
              onClick={() => setCartOpen(true)}
              className="border border-black/10 hover:border-black p-2.5 flex items-center justify-center relative cursor-pointer text-black/80 hover:text-white"
              style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))' }}
            >
              <ShoppingBag size={15} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-black font-bold text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* HOME VIEW */}
      {activeView === 'home' && (
        <HomePage 
          onNavigateShop={() => setActiveView('shop')} 
          products={products}
          onSelectProduct={(p) => {
            selectProduct(p);
            setActiveView('shop');
          }}
        />
      )}

      {/* SHOP VIEW */}
      {activeView === 'shop' && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          
          {!selectedProduct ? (
            <div className="space-y-12">
               {/* Hero Block */}

               {/* Live Brutalist Scrolling Ticker Tape */}
               <div className="border-t border-b border-black/10 bg-black py-2.5 overflow-hidden select-none">
                 <div className="flex whitespace-nowrap gap-8 animate-pulse-subtle font-mono text-[9px] text-zinc-300 uppercase tracking-widest font-bold">
                   <span className="text-[#D4AF37]">■ SYSTEM ACCESS // PUBLIC ALLOCATION ENGAGED</span>
                   <span>•</span>
                   <span>DELIVERIES DISPATCHED NATIONWIDE VIA SECURE LOGISTICS MATRIX</span>
                   <span>•</span>
                   <span className="text-[#D4AF37]">■ COGNITIVE WHATSAPP CART CONNECTED</span>
                   <span>•</span>
                   <span>REFRESH CYCLE DIRECT FROM MANDILAS HUB</span>
                   <span>•</span>
                   <span className="text-[#D4AF37]">■ ALL APPAREL CRAFTED UNDER INTENSE R&D</span>
                   <span>•</span>
                   <span>STATION STATUS: SECURED</span>
                 </div>
               </div>
               
               {/* Categories */}
               <div id="catalog-grid" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-black/10 pb-4">
                  <div>
                    <div className="text-[9px] text-[#D4AF37] font-bold tracking-widest uppercase mb-1">// SECURED CATALOG MATRIX</div>
                    <h3 className="font-display font-extrabold text-2xl uppercase tracking-tighter leading-none text-black">
                      AVAILABLE EQUIPMENT
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const count = getCategoryCount(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-[10px] px-3.5 py-2 border select-none cursor-pointer tracking-widest transition-all font-mono font-bold uppercase flex items-center gap-1.5 ${
                            selectedCategory === cat 
                              ? 'border-black bg-black text-white shadow-sm' 
                              : 'border-black/10 hover:border-black bg-white hover:bg-black text-black/70 hover:text-white'
                          }`}
                          style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                        >
                          {cat} <span className={`text-[8px] px-1 font-mono ${selectedCategory === cat ? 'text-[#D4AF37]' : 'text-black/40'}`}>({count})</span>
                        </button>
                      );
                    })}
                  </div>
               </div>

               {/* Product Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {filteredProducts.map(product => {
                     const imgUrl = getProductImage(product.image);
                     return (
                       <div 
                         key={product.id}
                         onClick={() => selectProduct(product)}
                         className="group cursor-pointer flex flex-col justify-between border border-black/5 hover:border-[#D4AF37]/50 p-2.5 sm:p-4 bg-white transition-all duration-300 shadow-sm relative hover:shadow-md"
                         style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
                       >
                         <div className="space-y-2 sm:space-y-3">
                           {/* Code Badge */}
                           <div className="flex justify-between items-center text-[8px] font-mono">
                             <span className="bg-black/5 text-black px-1.5 py-0.5 tracking-widest uppercase font-bold">[ {product.code} ]</span>
                             <span className="text-zinc-400 uppercase">{product.category}</span>
                           </div>

                           <div className="aspect-square relative overflow-hidden bg-zinc-900 border border-black/5">
                             <img 
                               src={imgUrl} 
                               alt={product.name} 
                               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                               referrerPolicy="no-referrer"
                             />
                             {product.stock <= 2 && (
                               <div className="absolute bottom-2 left-2 bg-red-950 text-red-300 text-[6px] sm:text-[7px] px-1.5 py-0.5 border border-red-500/30 font-bold tracking-widest">
                                 LOW STOCK // {product.stock} UNITS
                               </div>
                             )}
                           </div>

                           <div className="space-y-1">
                             <h4 className="font-display font-extrabold text-xs sm:text-sm text-black group-hover:text-[#D4AF37] transition-colors uppercase leading-tight line-clamp-1">
                               {product.name}
                             </h4>
                             <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase leading-snug line-clamp-2">
                               {product.description}
                             </p>
                           </div>
                         </div>

                         <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-black/5">
                           {/* Mini spec bullet points for professional details */}
                           <div className="space-y-1">
                             {product.specs && product.specs.slice(0, 2).map((spec, i) => (
                               <div key={i} className="text-[7px] sm:text-[8px] text-zinc-400 font-mono tracking-wide flex items-center gap-1 uppercase truncate">
                                 <span className="text-[#D4AF37]">■</span> {spec}
                               </div>
                             ))}
                           </div>

                           <div className="flex justify-between items-center pt-1">
                             <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                               {settings.storeDiscount > 0 ? (
                                 <>
                                   <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold text-[#D4AF37] tracking-wide">
                                     {formatNaira(product.price * (1 - settings.storeDiscount / 100))}
                                   </span>
                                   <span className="font-mono text-[8px] sm:text-[9px] text-zinc-400 line-through">
                                     {formatNaira(product.price)}
                                   </span>
                                   <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[7px] sm:text-[8px] px-1 font-bold border border-[#D4AF37]/20">-{settings.storeDiscount}%</span>
                                 </>
                               ) : (
                                 <span className="font-mono text-[10px] sm:text-xs md:text-sm font-bold text-black tracking-wide">
                                   {formatNaira(product.price)}
                                 </span>
                               )}
                             </div>
                             
                             <button 
                               className="bg-black/5 group-hover:bg-[#D4AF37] group-hover:text-black text-black/50 p-1 sm:p-1.5 transition-colors duration-300 cursor-pointer"
                               style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                             >
                               <Plus size={10} className="sm:w-3 sm:h-3" strokeWidth={2.5} />
                             </button>
                           </div>
                         </div>
                       </div>
                     );
                  })}
                </div>
              </div>
          ) : (
            /* DEDICATED PRODUCT DETAILS PAGE */
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Breadcrumb Navigation / Go Back */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-black/10">
                <div className="flex items-center gap-2 text-[10px] tracking-widest font-mono text-black/50 uppercase">
                  <span className="hover:text-white cursor-pointer" onClick={goBackToCatalog}>SHOP</span>
                  <span>/</span>
                  <span className="hover:text-white cursor-pointer" onClick={() => { setSelectedCategory(selectedProduct.category); goBackToCatalog(); }}>{selectedProduct.category}</span>
                  <span>/</span>
                  <span className="text-accent font-bold">[ {selectedProduct.code} ]</span>
                </div>
                
                <button
                  onClick={goBackToCatalog}
                  className="text-xs border border-black/25 hover:border-black px-4 py-2 bg-transparent text-black flex items-center gap-2 cursor-pointer font-bold uppercase transition-all"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                >
                  <span>← Back to Catalog</span>
                </button>
              </div>

              {/* Main Product Spec Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Huge High-Contrast Product Image */}
                <div className="lg:col-span-6 border border-black/10 bg-zinc-100/40 relative aspect-square overflow-hidden group">
                  <img 
                    src={getProductImage(selectedProduct.image)} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover grayscale contrast-125 brightness-95" 
                    referrerPolicy="no-referrer"
                  />
                  {/* Brand watermark stamp */}
                  <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1 text-[8px] border border-black/10 tracking-widest text-[#bbb] font-bold">
                    BLAZEBRO // BASE HQ DISPATCH
                  </div>
                  {selectedProduct.stock <= 2 && (
                    <div className="absolute top-4 right-4 bg-red-950/90 text-red-400 text-[8px] px-2.5 py-1 border border-red-500/30 tracking-wider font-bold">
                      CRITICAL STOCK LEVEL // ONLY {selectedProduct.stock} UNITS REMAINING
                    </div>
                  )}
                </div>

                {/* Right Column: Spec Sheet & Purchasing */}
                <div className="lg:col-span-6 space-y-8">
                  
                  {/* Title & Core Meta */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-accent font-bold bg-accent/10 px-2.5 py-0.5 border border-accent/20 tracking-widest uppercase">
                        SHOP CODE: {selectedProduct.code}
                      </span>
                      <span className="text-[9px] bg-black/5 border border-black/10 text-black/60 px-2 py-0.5 uppercase tracking-wider font-bold">
                        {selectedProduct.category}
                      </span>
                    </div>

                    <h1 className="font-display font-extrabold text-3xl md:text-5xl text-black tracking-tighter uppercase leading-none">
                      {selectedProduct.name}
                    </h1>

                    <div className="text-2xl font-bold text-black tracking-tight border-b border-black/10 pb-4 font-mono">
                      {formatNaira(selectedProduct.price)}
                    </div>
                  </div>


                  <div className="pt-6 border-t border-black/10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(selectedProduct, 'OS'); }}
                      className="w-full bg-black text-white hover:bg-accent hover:text-white transition-colors py-4 font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-3 cursor-pointer"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                    >
                      <ShoppingBag size={18} />
                      [ SECURE PIECE ]
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </main>
      )}

      {/* ADMIN SYSTEM VIEW */}
      {activeView === 'admin' && isAdminUnlocked && (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 font-mono">
          <div className="space-y-8">
            
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/10">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[8px] font-mono tracking-widest text-emerald-600 uppercase">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  STATION TERMINAL APPROVED // SESSION ONLINE
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-black tracking-tighter uppercase mt-2">
                  CONTROL INDEX
                </h1>
              </div>
              
              <button
                onClick={() => {
                  setIsAdminUnlocked(false);
                  setActiveView('shop');
                  window.location.hash = '';
                }}
                className="text-xs border border-black/25 hover:border-black px-4 py-2 bg-black text-white hover:bg-zinc-800 flex items-center gap-2 cursor-pointer font-bold uppercase transition-all"
                style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
              >
                <LogOut size={14} />
                <span>LOGOUT SECURE SESSION</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="border border-black/10 p-4 bg-zinc-50">
                <span className="text-[8px] text-zinc-400 block">// TOTAL PRODUCTS</span>
                <span className="text-2xl font-bold font-mono">{products.length}</span>
              </div>
              <div className="border border-black/10 p-4 bg-zinc-50">
                <span className="text-[8px] text-zinc-400 block">// STORE DISCOUNT</span>
                <span className="text-2xl font-bold font-mono text-[#D4AF37]">{settings.storeDiscount}%</span>
              </div>
              <div className="border border-black/10 p-4 bg-zinc-50">
                <span className="text-[8px] text-zinc-400 block">// STATION DISPATCH</span>
                <span className="text-sm font-bold font-mono block truncate">+{settings.whatsappNumber}</span>
              </div>
              <div className="border border-black/10 p-4 bg-zinc-50">
                <span className="text-[8px] text-zinc-400 block">// LOCATION</span>
                <span className="text-xs font-bold font-mono block truncate">{settings.latitude}° N, {settings.longitude}° E</span>
              </div>
            </div>

            {/* Config & Settings Panel */}
            <div className="border border-black/10 p-6 bg-white space-y-4">
              <h3 className="text-xs font-bold text-black border-b border-black/10 pb-2 flex items-center gap-2">
                <Sliders size={14} /> SYSTEM CONFIGURATION MATRICES
              </h3>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  updateSettings({
                    whatsappNumber: formData.get('whatsappNumber') as string,
                    storeDiscount: Number(formData.get('storeDiscount')),
                    latitude: formData.get('latitude') as string,
                    longitude: formData.get('longitude') as string,
                  });
                  alert("SYSTEM PROTOCOLS RECONFIGURED SUCCESSFULLY.");
                }} 
                className="grid grid-cols-1 sm:grid-cols-4 gap-4"
              >
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-400 uppercase font-bold">WHATSAPP NUMBER</label>
                  <input required name="whatsappNumber" type="text" defaultValue={settings.whatsappNumber} className="w-full bg-zinc-50 border border-black/10 px-3 py-2 text-xs outline-none focus:border-black/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-400 uppercase font-bold">DISCOUNT %</label>
                  <input required name="storeDiscount" type="number" min="0" max="100" defaultValue={settings.storeDiscount} className="w-full bg-zinc-50 border border-black/10 px-3 py-2 text-xs outline-none focus:border-black/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-400 uppercase font-bold">LATITUDE</label>
                  <input required name="latitude" type="text" defaultValue={settings.latitude} className="w-full bg-zinc-50 border border-black/10 px-3 py-2 text-xs outline-none focus:border-black/40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] text-zinc-400 uppercase font-bold">LONGITUDE</label>
                  <input required name="longitude" type="text" defaultValue={settings.longitude} className="w-full bg-zinc-50 border border-black/10 px-3 py-2 text-xs outline-none focus:border-black/40" />
                </div>
                <div className="sm:col-span-4 pt-2">
                  <button type="submit" className="bg-black text-white px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-accent hover:text-white transition-colors cursor-pointer" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                    SAVE SYSTEM PROPERTIES
                  </button>
                </div>
              </form>
            </div>

            {/* Supabase Integration Panel */}
            <div className="border border-black/10 p-6 bg-white space-y-4 text-left">
              <h3 className="text-xs font-bold text-black border-b border-black/10 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database size={14} /> SUPABASE CLOUD SYNC CONTROLLER
                </span>
                <span className={`text-[9px] px-2 py-0.5 font-bold uppercase tracking-widest ${supabaseStatus?.connected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                  {supabaseStatus?.connected ? '● CONNECTED' : '○ DISCONNECTED'}
                </span>
              </h3>

              {!supabaseStatus?.configured ? (
                <div className="bg-zinc-50 border border-amber-500/10 p-4 space-y-3">
                  <p className="text-[11px] text-zinc-600 leading-relaxed uppercase font-mono">
                    // WARNING: SUPABASE ENVIRONMENT VARIABLES NOT DETECTED.
                  </p>
                  <p className="text-xs text-zinc-500">
                    To enable persistent cloud storage, add <code className="bg-zinc-200 px-1 py-0.5 rounded text-[10px]">SUPABASE_URL</code> and <code className="bg-zinc-200 px-1 py-0.5 rounded text-[10px]">SUPABASE_ANON_KEY</code> to your environment settings.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[8px] text-zinc-400 uppercase font-bold block">SUPABASE ENDPOINT</span>
                      <span className="font-mono bg-zinc-50 border border-black/5 px-3 py-2 block truncate text-[11px]">
                        {supabaseStatus.url}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] text-zinc-400 uppercase font-bold block">CONNECTION STATUS</span>
                      <div className="bg-zinc-50 border border-black/5 px-3 py-2 flex items-center justify-between text-[11px]">
                        <span className="font-mono">{supabaseStatus.connected ? 'ACTIVE PIPELINE' : 'OFFLINE OR TABLE MISSING'}</span>
                        <button 
                          onClick={fetchSupabaseStatus}
                          className="text-[10px] uppercase font-bold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={10} /> RE-CHECK
                        </button>
                      </div>
                    </div>
                  </div>

                  {supabaseStatus.error && (
                    <div className="bg-rose-50 border border-rose-200 p-4 space-y-3">
                      <p className="text-[10px] text-rose-600 uppercase font-mono font-bold">
                        // PIPELINE ERROR: {supabaseStatus.error}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-600">
                          Please initialize the required table by running this SQL script in your <strong>Supabase SQL Editor</strong>:
                        </p>
                        <pre className="bg-zinc-900 text-zinc-300 p-3 text-[10px] font-mono overflow-x-auto whitespace-pre rounded select-all border border-black/20 leading-relaxed">
                          {supabaseStatus.sql}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={async () => {
                        setIsSyncingSupabase(true);
                        setSupabaseSyncMessage(null);
                        try {
                          const res = await fetch('/api/supabase/sync', { method: 'POST' });
                          const data = await res.json();
                          if (res.ok) {
                            setSupabaseSyncMessage("SUCCESS // ALL PRODUCT & SHOPPING DATA ARCHIVED TO SUPABASE PIPELINE.");
                            fetchSupabaseStatus();
                            fetchProducts();
                            fetchSettings();
                            fetchStats();
                            fetchOrders();
                          } else {
                            setSupabaseSyncMessage(`ERROR // SYNC FAILURE: ${data.error}`);
                          }
                        } catch (err: any) {
                          setSupabaseSyncMessage(`ERROR // PIPELINE FAILURE: ${err.message}`);
                        } finally {
                          setIsSyncingSupabase(false);
                        }
                      }}
                      disabled={isSyncingSupabase}
                      className="bg-black text-white hover:bg-accent hover:text-white transition-colors px-6 py-2.5 text-[10px] uppercase font-bold tracking-widest disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                    >
                      {isSyncingSupabase ? (
                        <>
                          <RefreshCw className="animate-spin" size={12} />
                          SYNCING DATA TO CLOUD...
                        </>
                      ) : (
                        <>
                          <CloudLightning size={12} />
                          FORCE EXPORT LOCAL TO SUPABASE
                        </>
                      )}
                    </button>
                  </div>

                  {supabaseSyncMessage && (
                    <p className={`text-[10px] font-mono font-bold uppercase ${supabaseSyncMessage.startsWith('ERROR') ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {supabaseSyncMessage}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Product Directory Management List */}
            <div className="border border-black/10 p-6 bg-white space-y-4">
              <h3 className="text-xs font-bold text-black border-b border-black/10 pb-2 flex items-center gap-2">
                <ShoppingBag size={14} /> ACTIVE PRODUCT MANIFEST
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-black/10 text-zinc-400 font-bold uppercase text-[9px]">
                      <th className="py-2">CODE</th>
                      <th className="py-2">NAME</th>
                      <th className="py-2">CATEGORY</th>
                      <th className="py-2">PRICE</th>
                      <th className="py-2">STOCK</th>
                      <th className="py-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id} className="border-b border-black/5 hover:bg-zinc-50 transition-colors">
                        <td className="py-3 font-bold text-accent">[{p.code}]</td>
                        <td className="py-3 uppercase font-medium">{p.name}</td>
                        <td className="py-3 uppercase text-[10px] text-zinc-500">{p.category}</td>
                        <td className="py-3 font-bold">{formatNaira(p.price)}</td>
                        <td className="py-3 font-bold">{p.stock}</td>
                        <td className="py-3 text-right">
                          <button 
                            onClick={() => {
                              if (confirm(`DELETE PROTOCOL FOR PRODUCT [${p.code}]?`)) {
                                deleteProduct(p.id);
                              }
                            }} 
                            className="text-red-600 hover:underline text-[10px] uppercase font-bold cursor-pointer"
                          >
                            DELETE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-white py-12 px-4 md:px-8 mt-12 pb-24 md:pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 font-mono">
          
          {/* Brand Panel */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="font-display font-extrabold text-2xl tracking-tighter uppercase text-black">BLAZEBRO®</h2>
            <p className="text-[11px] text-zinc-600 uppercase leading-relaxed max-w-xs">
              TACTICAL CONSTRUCTS. EXTREME MOBILITY CONFIGURATIONS. OUTPOST INLAGOS, NIGERIA.
            </p>
            <div className="pt-2">
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-1 border border-emerald-500/20 font-bold uppercase tracking-widest text-[8px] inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                SYSTEM PORT: SECURED
              </span>
            </div>
          </div>

          {/* Column 1: Core Navigation Updated */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest block">// CORE SECTIONS</span>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setSearchQuery(''); window.scrollTo(0, 0); }}
                className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider text-left transition-colors font-bold cursor-pointer"
              >
                [ 01. DEPLOY ALL SHOP ]
              </button>
              {['JACKETS', 'HOODIES', 'PANTS', 'FOOTWEAR'].map((cat, idx) => (
                <button 
                  key={cat}
                  onClick={() => { 
                    setActiveView('shop'); 
                    setSelectedProduct(null); 
                    setSelectedCategory(cat); 
                    setSearchQuery('');
                    setTimeout(() => {
                      document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider text-left transition-colors font-bold cursor-pointer"
                >
                  [ 0{idx + 2}. TACTICAL {cat} ]
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Dispatch Matrix */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest block">// DISPATCH MATRICES</span>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => setCartOpen(true)}
                className="text-[10px] text-zinc-600 hover:text-black uppercase tracking-wider text-left transition-colors font-bold cursor-pointer"
              >
                [ 06. ACTIVE SECURE BAG ]
              </button>
            </div>
          </div>

          {/* Column 3: Terminal Details Hidden */}
          <div className="hidden">
            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-widest block">// STATION DETAILS</span>
            <div className="space-y-2 text-[10px] text-zinc-600 uppercase leading-relaxed">
              <div>
                <span className="font-bold text-black block">DEPOT HQ COORDINATES:</span>
                {settings.latitude}° N, {settings.longitude}° E
              </div>
              <div className="pt-1">
                <span className="font-bold text-black block">DISPATCH PIPELINE:</span>
                <a 
                  href={`https://wa.me/${settings.whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#D4AF37] hover:underline font-bold"
                >
                  +{settings.whatsappNumber} [WA]
                </a>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* CART MODAL */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="w-full max-w-sm bg-white h-full flex flex-col border-l border-black/10"
            >
              <div className="flex justify-between items-center p-4 border-b border-black/10 bg-zinc-100/40">
                <h3 className="font-display font-extrabold text-xl tracking-tighter uppercase">SECURED BAG</h3>
                <button onClick={() => setCartOpen(false)} className="p-2 text-black/50 hover:text-black transition-colors cursor-pointer border border-black/10 hover:border-black">
                  <X size={16} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-xs text-black/50 font-mono uppercase text-center mt-10">YOUR BAG IS EMPTY</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border border-black/10 p-3 bg-zinc-100/40">
                      <img src={getProductImage(item.product.image)} className="w-16 h-16 object-cover border border-black/5" alt={item.product.name} />
                      <div className="flex-1 flex flex-col justify-between font-mono">
                        <div>
                          <div className="text-[10px] text-black/50 uppercase">{item.product.code}</div>
                          <h4 className="font-bold text-sm leading-tight uppercase truncate max-w-[150px]">{item.product.name}</h4>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="text-xs font-bold text-accent">
                            {formatNaira((settings.storeDiscount > 0 ? item.product.price * (1 - settings.storeDiscount / 100) : item.product.price) * item.quantity)}
                          </div>
                          <div className="flex items-center gap-3 border border-black/10 px-2 py-1 bg-white">
                            <button onClick={() => updateCartQty(item.product.id, item.size, -1)} className="text-black/50 hover:text-black font-bold cursor-pointer">-</button>
                            <span className="text-[10px] font-bold">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product.id, item.size, 1)} className="text-black/50 hover:text-black font-bold cursor-pointer">+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-black/10 bg-zinc-100/40 font-mono">
                  <div className="flex justify-between items-center mb-4 font-bold border-b border-black/5 pb-2">
                    <span className="text-xs uppercase text-black/60">TOTAL</span>
                    <span className="text-lg text-accent">{formatNaira(getCartTotal())}</span>
                  </div>
                  <form onSubmit={handleCheckout} className="space-y-3">
                    <input required type="text" name="customerName" placeholder="ENTER YOUR NAME" className="w-full bg-white border border-black/10 px-4 py-3 text-xs uppercase outline-none focus:border-black/50" />
                    <button type="submit" className="w-full bg-black text-white hover:bg-accent py-4 font-bold tracking-widest text-xs flex justify-center uppercase transition-colors cursor-pointer" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                      PROCEED TO WHATSAPP
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PASSCODE GATE MODAL */}
      <AnimatePresence>
        {showPasscodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white border border-black p-6 font-mono text-black relative"
              style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
            >
              <div className="flex justify-between items-center pb-4 border-b border-black/10 mb-4">
                <span className="text-[10px] bg-black text-white px-2 py-0.5 tracking-widest font-bold">// SECURE ACCESS</span>
                <button 
                  onClick={() => {
                    setShowPasscodeModal(false);
                    setActiveView('home');
                    window.location.hash = '';
                  }} 
                  className="text-black/50 hover:text-zinc-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 className="font-display font-extrabold text-xl tracking-tighter uppercase mb-1">SYSTEM GATEWAY</h3>
              <p className="text-[9px] text-zinc-500 uppercase mb-4 font-bold">AUTHORIZATION CODE REQUIRED TO UNLOCK STATION CONTROL PANEL.</p>

              <form onSubmit={handleAdminUnlock} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest block">PASSCODE [DEFAULT: 1337]</label>
                  <input 
                    required 
                    type="password" 
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="ENTER PROTOCOL KEY" 
                    className="w-full bg-zinc-100 border border-black/10 px-4 py-3 text-xs tracking-widest font-mono text-center outline-none focus:border-black/40" 
                  />
                </div>

                {adminError && (
                  <div className="text-[8px] text-red-600 bg-red-50 border border-red-200/50 p-2 font-bold uppercase tracking-wider">
                    ⚠️ {adminError}
                  </div>
                )}

                <button type="submit" className="w-full bg-black text-white hover:bg-accent py-3 font-bold tracking-widest text-xs flex justify-center uppercase transition-colors cursor-pointer" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}>
                  DECRYPT & AUTHENTICATE
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FIXED BOTTOM NAV DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-45 bg-black/95 backdrop-blur-md border-t border-black/15 px-4 py-3 flex items-center justify-between font-mono select-none">
        <div className="hidden md:flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="text-[8px] text-[#888] tracking-widest uppercase font-bold">BLAZEBRO® OUTPOST SYS [ONLINE]</span>
        </div>
        
        <div className="flex items-center justify-around w-full md:w-auto md:justify-end gap-2 md:gap-8 text-[#a3a3a3] max-w-lg mx-auto md:mr-0">
          
          {/* Home Tab */}
          <button 
            onClick={() => { setActiveView('home'); window.location.hash = ''; window.scrollTo(0, 0); }}
            className={`transition-colors flex flex-col items-center gap-1 cursor-pointer ${activeView === 'home' ? 'text-accent' : 'hover:text-white'}`}
          >
            <Home size={18} strokeWidth={2} />
            <span className="text-[8px] uppercase font-bold tracking-widest">HOME</span>
          </button>

          {/* Shop/Home Tab */}
          <button 
            onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setSearchQuery(''); window.location.hash = ''; window.scrollTo(0, 0); }}
            className={`transition-colors flex flex-col items-center gap-1 cursor-pointer ${activeView === 'shop' && selectedCategory === 'ALL' ? 'text-accent' : 'hover:text-white'}`}
          >
            <Store size={18} strokeWidth={2} />
            <span className="text-[8px] uppercase font-bold tracking-widest">SHOP</span>
          </button>

          {/* Categories Tab (scrolls directly to catalog filters) */}
          <button 
            onClick={() => {
              setActiveView('shop');
              setSelectedProduct(null);
              setTimeout(() => {
                document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <Sliders size={18} strokeWidth={2} />
            <span className="text-[8px] uppercase font-bold tracking-widest">SHOP</span>
          </button>

          {/* Cart Tab with Active Item Counter Badge */}
          <button 
            onClick={() => setCartOpen(true)}
            className="hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer relative"
          >
            <ShoppingBag size={18} strokeWidth={2} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-black font-extrabold text-[8px] w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
            <span className="text-[8px] uppercase font-bold tracking-widest">BAG</span>
          </button>

          {/* WhatsApp Direct Chat Tab */}
          <a 
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer"
          >
            <Smartphone size={18} strokeWidth={2} />
            <span className="text-[8px] uppercase font-bold tracking-widest">WA CHAT</span>
          </a>

          {/* System Terminal (Admin Gateway) removed for now */}
        </div>
      </div>
    </div>
  );
}
