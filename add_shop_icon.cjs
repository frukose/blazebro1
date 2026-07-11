const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Store')) {
  code = code.replace(/import \{/g, 'import { Store,');
}

const shopButton = `<button 
            onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setSearchQuery(''); window.location.hash = ''; setActiveBottomPage(null); }}
            className="text-accent hover:text-black transition-colors flex flex-col items-center gap-1 cursor-pointer"
            title="SHOP ALL"
          >
            <Store size={20} strokeWidth={1.5} />
          </button>`;

code = code.replace(/<div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-1 mx-auto md:mr-0 text-\[#a3a3a3\]">/g, 
  '<div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-1 mx-auto md:mr-0 text-[#a3a3a3]">\n          ' + shopButton);

fs.writeFileSync('src/App.tsx', code);
