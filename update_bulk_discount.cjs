const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<ul className="space-y-1 text-\[9px\] text-zinc-600">[\s\S]*?<\/ul>/;
code = code.replace(regex, `<p className="text-[9px] text-zinc-600 mt-2">
                          DISCOUNTS ARE APPLIED TO LARGE VOLUME ORDERS. CONTACT LOGISTICS FOR CURRENT GLOBAL DISCOUNT RATES AND VOLUME-SPECIFIC OVERRIDES.
                        </p>`);

fs.writeFileSync('src/App.tsx', code);
