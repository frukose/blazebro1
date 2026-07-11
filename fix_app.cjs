const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update state
code = code.replace(
  /useState<'about' \| 'shipping' \| 'location' \| 'bulk' \| null>\(null\);/,
  "useState<'bulk' | null>(null);"
);

// 2. Remove footer nav buttons (ABOUT, SHIPPING, HQ BASE)
const footerNavRegex = /<button\s+onClick=\{\(\) => setActiveBottomPage\('about'\)\}[^>]+>\s+<Info size=\{20\}[^>]+\/>\s+<\/button>\s+<button\s+onClick=\{\(\) => setActiveBottomPage\('shipping'\)\}[^>]+>\s+<Truck size=\{20\}[^>]+\/>\s+<\/button>\s+<button\s+onClick=\{\(\) => setActiveBottomPage\('location'\)\}[^>]+>\s+<MapPin size=\{20\}[^>]+\/>\s+<\/button>/;

code = code.replace(footerNavRegex, '');

// 3. Remove explore core pages buttons
const exploreNavRegex = /<button\s+onClick=\{\(\) => setActiveBottomPage\('about'\)\}[^>]+>\s+\[ 01\. ABOUT COMPANY \]\s+<\/button>\s+<button\s+onClick=\{\(\) => setActiveBottomPage\('shipping'\)\}[^>]+>\s+\[ 02\. SHIPPING MATRIX \]\s+<\/button>\s+<button\s+onClick=\{\(\) => setActiveBottomPage\('location'\)\}[^>]+>\s+\[ 04\. MANDILAS HQ \]\s+<\/button>/;

code = code.replace(exploreNavRegex, '');

// 4. Remove about, shipping, location content
// We can use a regex that matches from `{activeBottomPage === 'about'` up to the closing `)}` right before `{activeBottomPage === 'bulk'`
const contentRegex = /\{activeBottomPage === 'about' && \(\s*<div[\s\S]*?\{activeBottomPage === 'bulk' && \(/;
code = code.replace(contentRegex, "{activeBottomPage === 'bulk' && (");

// 5. Clean up the bulk section grid and contact
// Find the grid: `<div className="grid grid-cols-1 md:grid-cols-2 gap-3">...</div>`
const bulkGridRegex = /<div className="grid grid-cols-1 md:grid-cols-2 gap-3">[\s\S]*?<\/div>\s*<\/div>\s*<div className="border border-black\/10 p-4 bg-zinc-100\/40 space-y-3">[\s\S]*?TALK TO LOGISTICS OFFICER →\s*<\/a>\s*<\/div>/;

code = code.replace(bulkGridRegex, '');

fs.writeFileSync('src/App.tsx', code);
