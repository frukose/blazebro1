const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6 gap-y-1 mx-auto md:mr-0 text-\[8px\] sm:text-\[9px\] font-bold tracking-widest text-\[#a3a3a3\]">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const newDock = `<div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-1 mx-auto md:mr-0 text-[#a3a3a3]">
          <button 
            onClick={() => setActiveBottomPage('about')}
            className="hover:text-accent transition-colors flex flex-col items-center gap-1 cursor-pointer"
            title="ABOUT"
          >
            <Info size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setActiveBottomPage('shipping')}
            className="hover:text-accent transition-colors flex flex-col items-center gap-1 cursor-pointer"
            title="SHIPPING"
          >
            <Truck size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setActiveBottomPage('location')}
            className="hover:text-accent transition-colors flex flex-col items-center gap-1 cursor-pointer"
            title="HQ BASE"
          >
            <MapPin size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setActiveBottomPage('bulk')}
            className="text-accent hover:text-black transition-colors flex flex-col items-center gap-1 cursor-pointer relative"
            title="BULK & PREORDERS"
          >
            <Box size={20} strokeWidth={1.5} />
            <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[6px] px-1 py-0.5 rounded-full font-bold animate-pulse">HOT</span>
          </button>
        </div>`;

code = code.replace(regex, `${newDock}\n      </div>\n\n    </div>\n  );\n}`);

fs.writeFileSync('src/App.tsx', code);
