const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('Store')) {
  code = code.replace(/import \{/, "import { Store,");
}

fs.writeFileSync('src/App.tsx', code);
