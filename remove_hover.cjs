const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace glitch images in the modal/related products
const regex1 = /<img\s+src=\{getProductImage\(product\.image\)\}\s+alt=\{product\.name\}\s+className="main-glitch-img w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"\s+referrerPolicy="no-referrer"\s+\/>\s+<img\s+src=\{getProductImage\(product\.image\)\}\s+alt=\{`\$\{product\.name\} Glitch Shift Alpha`\}\s+className="hover-glitch-layer-1[^"]+"\s+referrerPolicy="no-referrer"\s+\/>\s+<img\s+src=\{getProductImage\(product\.image\)\}\s+alt=\{`\$\{product\.name\} Glitch Shift Beta`\}\s+className="hover-glitch-layer-2[^"]+"\s+referrerPolicy="no-referrer"\s+\/>/g;

code = code.replace(regex1, `<img 
                            src={getProductImage(product.image)} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />`);

// Replace glitch images in the main grid
const regex2 = /<img\s+src=\{imgUrl\}\s+alt=\{product\.name\}\s+className="main-glitch-img w-full h-full object-cover grayscale contrast-\[1\.1\] brightness-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"\s+referrerPolicy="no-referrer"\s+\/>\s+<img\s+src=\{imgUrl\}\s+alt=\{`\$\{product\.name\} Glitch Shift Alpha`\}\s+className="hover-glitch-layer-1[^"]+"\s+referrerPolicy="no-referrer"\s+\/>\s+<img\s+src=\{imgUrl\}\s+alt=\{`\$\{product\.name\} Glitch Shift Beta`\}\s+className="hover-glitch-layer-2[^"]+"\s+referrerPolicy="no-referrer"\s+\/>/g;

code = code.replace(regex2, `<img 
                            src={imgUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />`);

fs.writeFileSync('src/App.tsx', code);
