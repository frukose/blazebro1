const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update SystemSettings initial state
code = code.replace(
  /allowAiAdvisor: false\s*\n\s*\}/,
  'allowAiAdvisor: false,\n    storeDiscount: 0\n  }'
);

// 2. Remove sizing from activeBottomPage type
code = code.replace(
  /useState<'about' \| 'shipping' \| 'sizing' \| 'location' \| 'bulk' \| null>\(null\);/,
  "useState<'about' | 'shipping' | 'location' | 'bulk' | null>(null);"
);

// 3. Admin settings: Add storeDiscount input
const adminSettingsRegex = /(<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?)(<\/div>\s*<\/div>\s*\{\/\* Admin Controls \*\/)/;
code = code.replace(adminSettingsRegex, `$1
                  <div>
                    <label className="block text-[10px] text-zinc-500 mb-1 uppercase font-bold">STORE DISCOUNT (%)</label>
                    <input 
                      type="number"
                      value={settings.storeDiscount || 0}
                      onChange={(e) => setSettings({...settings, storeDiscount: parseInt(e.target.value) || 0})}
                      className="w-full bg-[#121212] border border-white/10 p-2 text-white font-mono text-sm focus:border-accent outline-none"
                    />
                  </div>
$2`);

fs.writeFileSync('src/App.tsx', code);
