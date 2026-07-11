const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/--color-accent: #ffffff;/, '--color-accent: #D4AF37;');
code = code.replace(/--color-accent-hover: #e2e2e2;/, '--color-accent-hover: #B8860B;');
code = code.replace(/--color-brand-bg: #080808;/, '--color-brand-bg: #ffffff;');

fs.writeFileSync('src/index.css', code);
