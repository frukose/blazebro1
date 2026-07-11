const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Restore the `{!selectedProduct ? ... : (`
const selectedProductRegex = /\{selectedProduct \? \(\s*\/\* DEDICATED PRODUCT DETAILS PAGE \*\//;
const selectedProductReplacement = `{!selectedProduct ? (
            <div className="space-y-12">
               {/* Hero Block */}
               <section className="relative overflow-hidden border border-black/10 bg-zinc-100/40 group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0d0d] to-transparent z-10" />
                 <div className="flex flex-col items-center justify-center py-20 px-4 text-center z-20 relative">
                   <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-black tracking-tighter uppercase mb-4">MANDILAS BATCH DISTRIBUTION</h2>
                   <p className="text-xs text-black/70 font-mono tracking-widest uppercase max-w-md mx-auto">Heavyweight Steeze. No Story. Pick your gear and dispatch.</p>
                 </div>
               </section>
               
               {/* Categories */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/10 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={\`text-xs px-4 py-2 border select-none cursor-pointer tracking-widest transition-colors font-bold \${
                          selectedCategory === cat 
                            ? 'border-black bg-[#f2f2f2] text-[#0d0d0d]' 
                            : 'border-black/10 hover:border-black text-black/70 hover:text-white'
                        }\`}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Product Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                 {filteredProducts.map(product => {
                    const imgUrl = getProductImage(product.image);
                    return (
                      <div 
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="group cursor-pointer flex flex-col gap-3"
                      >
                        <div className="aspect-square relative overflow-hidden bg-zinc-900 border-b border-black/10">
                          <img 
                            src={imgUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {product.stock <= 2 && (
                            <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-red-950/90 text-red-400 text-[7px] md:text-[8px] px-1.5 py-0.5 border border-red-500/30 tracking-wider">
                              {product.stock} LEFT
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] text-black/40 font-mono tracking-widest uppercase">{product.category}</div>
                          <h4 className="font-display font-bold text-sm text-black group-hover:text-accent transition-colors uppercase leading-none">
                            {product.name}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-black/5">
                          <div className="flex items-center gap-2">
                            {settings.storeDiscount > 0 ? (
                              <>
                                <span className="font-mono text-xs sm:text-sm font-bold text-accent tracking-wide">
                                  {formatNaira(product.price * (1 - settings.storeDiscount / 100))}
                                </span>
                                <span className="font-mono text-[9px] text-zinc-500 line-through">
                                  {formatNaira(product.price)}
                                </span>
                                <span className="bg-accent/20 text-accent text-[8px] px-1 font-bold">-{settings.storeDiscount}%</span>
                              </>
                            ) : (
                              <span className="font-mono text-xs sm:text-sm font-bold text-black tracking-wide">
                                {formatNaira(product.price)}
                              </span>
                            )}
                          </div>
                          <button 
                            className="text-black/30 group-hover:text-black transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    );
                 })}
               </div>
             </div>
          ) : (
            /* DEDICATED PRODUCT DETAILS PAGE */`;

code = code.replace(selectedProductRegex, selectedProductReplacement);

// 2. Restore bottom half of Product details, the `</main>`, the Footer, the Cart, the Bulk
const endRegex = /\/\/ GARMENT TECH SPECIFICATIONS<\/div>\s*<\/div>\s*<div className="flex justify-between items-center text-\[10px\] text-black\/40 pt-2">\s*<span>MANDILAS BATCH DISTRIBUTION IN OPERATION<\/span>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/motion\.div>\s*<\/div>\s*\)\}\s*<\/AnimatePresence>/;

const endReplacement = `// GARMENT TECH SPECIFICATIONS</div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] text-zinc-600 font-mono">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-black/[0.02] border border-black/5 p-2">
                          <span className="text-accent mt-0.5">■</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-black/10">
                    <button 
                      onClick={(e) => { e.stopPropagation(); addToCart(selectedProduct, 'OS'); }}
                      className="w-full bg-black text-white hover:bg-accent hover:text-white transition-colors py-4 font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-3 cursor-pointer"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                    >
                      <ShoppingBag size={18} />
                      [ SECURE OUTPOST ALLOCATION ]
                    </button>
                  </div>

                </div>
            </motion.div>
          )}
        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-zinc-100/40 py-12 px-4 md:px-8 mt-12 pb-24 md:pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 font-mono">
          <div className="space-y-4 max-w-sm">
            <h2 className="font-display font-extrabold text-2xl tracking-tighter uppercase">BLAZEBRO®</h2>
            <p className="text-xs text-zinc-600 uppercase leading-relaxed">
              Heavyweight Steeze. No Story. Pick your gear and dispatch.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] text-black/30 uppercase font-mono tracking-widest block mb-1.5">// EXPLORE CORE PAGES</span>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveBottomPage('bulk')}
                className="text-[10px] text-accent hover:text-black uppercase tracking-wider text-left transition-colors font-mono font-bold cursor-pointer"
              >
                [ 05. BULK & PREORDERS ]
              </button>
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

      {/* BOTTOM PAGE MODAL (BULK) */}
      <AnimatePresence>
        {activeBottomPage === 'bulk' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-black/10 p-6 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative font-mono"
              style={{ clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))' }}
            >
              <button onClick={() => setActiveBottomPage(null)} className="absolute top-4 right-4 text-black/40 hover:text-black cursor-pointer border border-black/10 hover:border-black p-1">
                <X size={16} />
              </button>
              <div className="space-y-6">
                <div className="text-[10px] text-accent font-bold bg-accent/10 px-2.5 py-0.5 border border-accent/20 tracking-widest uppercase inline-block">
                  WHOLESALE MATRIX // 05. BULK & PREORDERS
                </div>
                <h2 className="font-display font-extrabold text-2xl md:text-3xl text-black uppercase leading-none">
                  BULK DISPATCH & PREORDER PIPELINES
                </h2>
                <div className="border-t border-b border-black/10 py-4 space-y-4 text-xs text-zinc-700">
                  <p className="text-[10px] text-black/50 leading-relaxed uppercase">
                    EQUIP YOUR CLIQUE OR MERCHANDISE OUTPOSTS. SECURE MASS DISCOUNTS AND PRE-LAUNCH ALLOCATIONS DIRECT FROM THE MANDILAS DEPOT.
                  </p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-black/40 pt-2">
                  <span>MANDILAS BATCH DISTRIBUTION IN OPERATION</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>`;

code = code.replace(endRegex, endReplacement);
fs.writeFileSync('src/App.tsx', code);
