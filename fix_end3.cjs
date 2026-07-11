const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startOfAnim = code.lastIndexOf('</AnimatePresence>');
if (startOfAnim !== -1) {
  code = code.substring(0, startOfAnim) + `</AnimatePresence>

      {/* FIXED BOTTOM NAV DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-45 bg-black/95 backdrop-blur-md border-t border-black/10 px-4 py-2.5 flex items-center justify-between font-mono gap-4 select-none">
        <div className="hidden md:flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          <span className="text-[8px] text-black/40 tracking-widest uppercase">BLAZEBRO® OUTPOST SYS [ONLINE]</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-1 mx-auto md:mr-0 text-[#a3a3a3]">
          <button 
            onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setSearchQuery(''); window.location.hash = ''; setActiveBottomPage(null); window.scrollTo(0, 0); }}
            className="text-accent hover:text-white transition-colors flex flex-col items-center gap-1 cursor-pointer"
            title="SHOP ALL"
          >
            <Store size={20} strokeWidth={1.5} />
            <span className="text-[10px] uppercase font-bold tracking-widest mt-1">SHOP ALL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync('src/App.tsx', code);
}
