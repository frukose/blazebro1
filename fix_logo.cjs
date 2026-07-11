const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => \{ setActiveView\('shop'\); setSelectedProduct\(null\); setSearchQuery\(''\); window\.location\.hash = ''; \}\}/g,
  "onClick={() => { setActiveView('shop'); setSelectedProduct(null); setSelectedCategory('ALL'); setSearchQuery(''); window.location.hash = ''; setActiveBottomPage(null); }}"
);

fs.writeFileSync('src/App.tsx', code);
