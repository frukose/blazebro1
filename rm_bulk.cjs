const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('{/* BOTTOM PAGE MODAL (BULK) */}');
const endIdx = code.indexOf('{/* FIXED BOTTOM NAV DOCK */}');

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Removed bulk modal');
} else {
  console.log('Could not find modal markers', startIdx, endIdx);
}
