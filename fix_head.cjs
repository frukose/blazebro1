const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ motion, AnimatePresence \} from 'motion\/react';\n  Store,/, "import { motion, AnimatePresence } from 'motion/react';\nimport {\n  ShoppingBag,");
fs.writeFileSync('src/App.tsx', code);
