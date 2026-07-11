const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<\/Anim      \{\/\* FIXED BOTTOM NAV DOCK \*\/\}/g;
code = code.replace(regex, '</AnimatePresence>\n\n      {/* FIXED BOTTOM NAV DOCK */}');

const endRegex = /  \}\n  \};\n\}\n  \}  \};\n\}/g; // Wait, let's just replace the end manually.

fs.writeFileSync('src/App.tsx', code);
