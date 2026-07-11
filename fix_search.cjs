const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/const matchesSearch, Truck, Box/g, 'const matchesSearch');
code = code.replace(/<Search, Truck, Box/g, '<Search');
code = code.replace(/Search, Truck, Box\}/g, 'Search, Truck, Box}');
fs.writeFileSync('src/App.tsx', code);
