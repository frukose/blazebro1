const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. In Catalog Grid (around line 800)
// <span className="font-mono text-xs sm:text-sm font-bold text-black tracking-wide">
//   {formatNaira(product.price)}
// </span>
const catalogPriceRegex = /<span className="font-mono text-xs sm:text-sm font-bold text-black tracking-wide">\s*\{formatNaira\(product\.price\)\}\s*<\/span>/;
const newCatalogPrice = `<div className="flex items-center gap-2">
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
                            </div>`;
code = code.replace(catalogPriceRegex, newCatalogPrice);

// 2. In Product Modal (around line 530)
// <div className="text-xl md:text-2xl font-mono font-bold text-accent tracking-wider">
//   {formatNaira(selectedProduct.price)}
// </div>
const modalPriceRegex = /<div className="text-xl md:text-2xl font-mono font-bold text-accent tracking-wider">\s*\{formatNaira\(selectedProduct\.price\)\}\s*<\/div>/;
const newModalPrice = `<div className="flex items-center gap-3">
                        {settings.storeDiscount > 0 ? (
                          <>
                            <div className="text-xl md:text-2xl font-mono font-bold text-accent tracking-wider">
                              {formatNaira(selectedProduct.price * (1 - settings.storeDiscount / 100))}
                            </div>
                            <div className="text-sm font-mono text-zinc-500 line-through">
                              {formatNaira(selectedProduct.price)}
                            </div>
                            <div className="bg-accent/20 border border-accent/30 text-accent text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest">
                              {settings.storeDiscount}% STORE DISCOUNT
                            </div>
                          </>
                        ) : (
                          <div className="text-xl md:text-2xl font-mono font-bold text-accent tracking-wider">
                            {formatNaira(selectedProduct.price)}
                          </div>
                        )}
                      </div>`;
code = code.replace(modalPriceRegex, newModalPrice);

fs.writeFileSync('src/App.tsx', code);
