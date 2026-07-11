const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navBlock = `<div className="hidden sm:flex items-center gap-6 font-mono text-[10px] tracking-widest font-bold uppercase mr-4">
              <button onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setActiveBottomPage(null); window.scrollTo(0, 0); }} className="text-white/60 hover:text-white transition-colors cursor-pointer">HOME</button>
              <button onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setActiveBottomPage(null); window.scrollTo(0, 500); }} className="text-white/60 hover:text-white transition-colors cursor-pointer">SHOP</button>
              <button onClick={() => setActiveBottomPage('bulk')} className="text-white/60 hover:text-white transition-colors cursor-pointer">BULK</button>
            </div>`;

code = code.replace(
  /\{\/\* Desktop Navigation Control Center \*\/\}\s*<div className="hidden sm:flex items-center gap-3">/g,
  `{/* Desktop Navigation Control Center */}
          <div className="hidden sm:flex items-center">
            ${navBlock}
            <div className="hidden sm:flex items-center gap-3">`
);

fs.writeFileSync('src/App.tsx', code);
