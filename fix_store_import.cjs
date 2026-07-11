const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import \{ Store, useState, useEffect, FormEvent \} from 'react';/, "import { useState, useEffect, FormEvent } from 'react';");
code = code.replace(/import \{\n  ShoppingBag,/, "import {\n  Store,\n  ShoppingBag,");
fs.writeFileSync('src/App.tsx', code);
