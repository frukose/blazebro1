const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/return matchesCategory && matchesSearch, Truck, Box;/g, 'return matchesCategory && matchesSearch;');
fs.writeFileSync('src/App.tsx', code);
