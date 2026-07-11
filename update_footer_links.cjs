const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<button \s*onClick=\{\(\) => setActiveBottomPage\('sizing'\)\}[\s\S]*?\[ 03\. SIZING MANUAL \]\s*<\/button>/;
code = code.replace(regex, "");

fs.writeFileSync('src/App.tsx', code);
