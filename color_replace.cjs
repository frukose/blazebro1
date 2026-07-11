const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replaceAll('bg-[#080808]', 'bg-white');
code = code.replaceAll('bg-[#121212]', 'bg-[#f4f4f4]');
code = code.replaceAll('bg-[#0d0d0d]', 'bg-[#f0f0f0]');
code = code.replaceAll('bg-[#1a1a1a]', 'bg-[#e0e0e0]');
code = code.replaceAll('bg-[#0a0a0a]', 'bg-[#fafafa]');
code = code.replaceAll('bg-zinc-950', 'bg-zinc-100');
code = code.replaceAll('bg-black/85', 'bg-white/85');

code = code.replaceAll('text-[#f2f2f2]', 'text-black');
code = code.replaceAll('text-[#eaeaea]', 'text-[#222222]');
code = code.replaceAll('text-[#8c8c8c]', 'text-[#666666]');
code = code.replaceAll('text-white', 'text-black');

code = code.replaceAll('text-zinc-300', 'text-zinc-700');
code = code.replaceAll('text-zinc-400', 'text-zinc-600');

code = code.replaceAll('border-white', 'border-black');
code = code.replaceAll('hover:border-white', 'hover:border-black');

code = code.replaceAll('bg-white', 'bg-black');
code = code.replaceAll('hover:bg-white', 'hover:bg-black');
code = code.replaceAll('hover:text-black', 'hover:text-white');

code = code.replaceAll('selection:bg-[#e2e2e2]', 'selection:bg-black');
code = code.replaceAll('selection:text-[#080808]', 'selection:text-white');

// The glitch effect classes
// They are using contrast and brightness, might still work for light themes, or maybe we remove/adjust them.
// Let's leave them for now.

// Wait, if I replace `bg-white` to `bg-black`, then what was `bg-white/5` becomes `bg-black/5`. That's correct.
// But what about the `text-white` -> `text-black` replacement before it?
// `text-white` becomes `text-black`.

// Let's test the replacements:
// first, let's just run them and see.
fs.writeFileSync('src/App.tsx', code);
