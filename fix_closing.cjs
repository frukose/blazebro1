const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
`                    </button>
                  </div>

                </div>
            </motion.div>`,
`                    </button>
                  </div>

                </div>
              </div>
            </motion.div>`);

fs.writeFileSync('src/App.tsx', code);
