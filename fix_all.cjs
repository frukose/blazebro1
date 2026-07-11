const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/setSearch, Truck, BoxQuery/g, 'setSearchQuery');
code = code.replace(/Real-time Search, Truck, Box Input Bar/g, 'Real-time Search Input Bar');

fs.writeFileSync('src/App.tsx', code);
