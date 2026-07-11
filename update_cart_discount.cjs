const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update getCartTotal
code = code.replace(
  /const getCartTotal = \(\) => \{\s*return cart\.reduce\(\(acc, item\) => acc \+ \(item\.product\.price \* item\.quantity\), 0\);\s*\};/,
  `const getCartTotal = () => {
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    return settings.storeDiscount > 0 ? total * (1 - settings.storeDiscount / 100) : total;
  };`
);

// Update handleCheckout
// find: orderText += \`  PRICE: \${formatNaira(item.product.price * item.quantity)}\n\n\`;
code = code.replace(
  /orderText \+= \`  PRICE: \$\{formatNaira\(item\.product\.price \* item\.quantity\)\}\\n\\n\`;/g,
  `const itemPrice = settings.storeDiscount > 0 ? item.product.price * (1 - settings.storeDiscount / 100) : item.product.price;
      orderText += \`  PRICE: \${formatNaira(itemPrice * item.quantity)}\\n\\n\`;`
);

// In the cart rendering:
// <span className="text-xs font-bold text-black font-mono">{formatNaira(item.product.price * item.quantity)}</span>
code = code.replace(
  /<span className="text-xs font-bold text-black font-mono">\{formatNaira\(item\.product\.price \* item\.quantity\)\}<\/span>/g,
  `<span className="text-xs font-bold text-black font-mono">
                                {formatNaira((settings.storeDiscount > 0 ? item.product.price * (1 - settings.storeDiscount / 100) : item.product.price) * item.quantity)}
                              </span>`
);

fs.writeFileSync('src/App.tsx', code);
