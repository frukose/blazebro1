import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Supabase Client (Lazy Load)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
let supabase: any = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase initial setup successful.");
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Database JSON path
const DB_PATH = path.join(process.cwd(), "products_db.json");

// Default initial database state
const INITIAL_PRODUCTS = [
  {
    id: "prod-01",
    code: "BLZ-01",
    name: "COLD-WEATHER EXOSHELL",
    price: 185000,
    category: "JACKETS",
    stock: 5,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    description: "HIGH-ALTITUDE SHIELD CONSTRUCTED FROM MIL-SPEC REINFORCED MEMBRANE. ASYMMETRIC WEATHERPROOF ZIP CLOSURES, COLLAPSIBLE RADAR HOOD SYSTEM, AND MODULAR STRAPPING MATRIX FOR MAXIMUM MOBILITY CONSTRAINTS.",
    specs: [
      "MIL-SPEC 3-LAYER EXOSHELL WATERPROOFING",
      "ASYMMETRIC YKK AQUAGUARD ZIP MATRIX",
      "COLLAPSIBLE RADAR-SHIELD HOOD CONSTRUCT",
      "4-POINT ANCHOR TACTICAL STRAP SYSTEMS",
      "COORDINATES // 6.4542° N, 3.3887° E LOGGED"
    ],
    image: "IMAGE_BLZ_01"
  },
  {
    id: "prod-02",
    code: "BLZ-02",
    name: "THERMAL GRID HOOD",
    price: 85000,
    category: "HOODIES",
    stock: 12,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    description: "HEAVYWEIGHT 480GSM COTTON-GRID FLEECE FORMULATED FOR STATIC DEGREES. FEATURES AN INTEGRATED SCUBA-PROFILE FACE SHIELD, DEEP-CARGO FRONT VENTRAL HOUSING, AND COATED D-RING REINFORCEMENTS.",
    specs: [
      "480GSM HEAVYWEIGHT COTTON MESH STRUCTURE",
      "COLLAPSIBLE VENTILATED COMBAT FACE SHIELD",
      "REINFORCED STEEL D-RING FASTENER SYSTEM",
      "VENTRAL ENVELOPE UTILITY CARGO SYSTEM",
      "WASH SPEC // REVERSE CYCLE COLD ONLY"
    ],
    image: "IMAGE_BLZ_02"
  },
  {
    id: "prod-03",
    code: "BLZ-03",
    name: "UTILITY ARCHIVE CARGO",
    price: 115000,
    category: "PANTS",
    stock: 8,
    sizes: ["S", "M", "L", "XL", "XXL", "3XL", "4XL"],
    description: "STRUCTURAL MULTI-DIMENSIONAL TROUSERS IN HIGH-TENACITY NYLON RIPSTOP. DUAL OVERSIZED POCKET ARCHIVES WITH INTERIOR SUB-COMPARTMENTS AND RETRACTABLE ANKLE RESTRAINT HARDWARE.",
    specs: [
      "HIGH-TENACITY 500D NYLON RIPSTOP BASE",
      "6-POCKET RETICULATED ARCHIVE HARNESSING",
      "STEEL ANKLE CINCH RESTRAINT ADJUSTERS",
      "ERGO-JOINT KNEE BENDING ARTICULATION",
      "REINFORCED CRUTCH SEAMS FOR EXTREME STRAIN"
    ],
    image: "IMAGE_BLZ_03"
  },
  {
    id: "prod-04",
    code: "BLZ-04",
    name: "MODULAR PLATFORM BOOT",
    price: 240000,
    category: "FOOTWEAR",
    stock: 4,
    sizes: ["41", "42", "43", "44", "45"],
    description: "TACTICAL PLATFORM FOOT CONSTRUCT FEATURING CHISELED GEOMETRIC OUTSOLE ARMATURE. WRAP-AROUND BALLISTIC STRAPPING HARDWARE WITH STEEL COUPLING SYSTEMS AND VULCANIZED REINFORCED TOE-CAPS.",
    specs: [
      "CHISELED GEOMETRIC HIGH-TRACTION MIDSOLE",
      "1000D BALLISTIC NYLON & LEATHER HARNESS",
      "VULCANIZED SHARP SHIELD TOE COATED PROTECTION",
      "INDUSTRIAL QUICK-RELEASE COUPLER MECHANISMS",
      "UNIT LOAD // MAXIMUM SHOCK COMPRESSION"
    ],
    image: "IMAGE_BLZ_04"
  }
];

const DEFAULT_SETTINGS = {
  whatsappNumber: "2348031234567", // Nigerian formatting
  latitude: "6.4542", // Lagos Coords
  longitude: "3.3887",
  tagline: "BLAZEBRO // HIGH-PERFORMANCE BRUTALIST CONSTRUCTS FOR URBAN OUTPOSTS.",
  adminPasscode: "1337",
  allowAiAdvisor: false,
  storeDiscount: 0
};

const INITIAL_STATS = {
  views: 128,
  whatsappClicks: 14,
  potentialRevenue: 2245000
};

// Database Memory Cache
let dbCache: any = null;

function loadLocalDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error loading products database:", err);
  }
  
  // Return default structure if file not found/corrupt
  const defaultState = {
    products: INITIAL_PRODUCTS,
    settings: DEFAULT_SETTINGS,
    stats: INITIAL_STATS,
    orders: []
  };
  saveLocalDb(defaultState);
  return defaultState;
}

function saveLocalDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local products database:", err);
  }
}

async function saveToSupabase(key: string, value: any) {
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("blazebro_store_data")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) {
      console.error(`Error saving ${key} to Supabase:`, error.message);
    }
  } catch (err: any) {
    console.error(`Failed to save ${key} to Supabase:`, err.message);
  }
}

async function saveToSupabaseAll(data: any) {
  if (!supabase) return;
  await Promise.all([
    saveToSupabase("products", data.products),
    saveToSupabase("settings", data.settings),
    saveToSupabase("stats", data.stats),
    saveToSupabase("orders", data.orders || [])
  ]);
}

async function initDbFromSupabase() {
  if (!supabase) {
    console.log("Supabase not configured. Using local JSON database.");
    dbCache = loadLocalDb();
    return;
  }

  try {
    console.log("Supabase configured! Attempting to load data...");
    const { data, error } = await supabase
      .from("blazebro_store_data")
      .select("*");

    if (error) {
      console.warn("Supabase table error or not found. Falling back to local JSON db.", error.message);
      dbCache = loadLocalDb();
      return;
    }

    if (data && data.length > 0) {
      const reconstructed: any = {
        products: INITIAL_PRODUCTS,
        settings: DEFAULT_SETTINGS,
        stats: INITIAL_STATS,
        orders: []
      };

      data.forEach((row: any) => {
        if (row.key === "products") reconstructed.products = row.value;
        if (row.key === "settings") reconstructed.settings = row.value;
        if (row.key === "stats") reconstructed.stats = row.value;
        if (row.key === "orders") reconstructed.orders = row.value;
      });

      dbCache = reconstructed;
      console.log("Loaded state successfully from Supabase!");
    } else {
      console.log("Supabase table is empty. Initializing with local JSON data...");
      dbCache = loadLocalDb();
      await saveToSupabaseAll(dbCache);
    }
  } catch (err: any) {
    console.error("Failed to fetch from Supabase:", err.message);
    dbCache = loadLocalDb();
  }
}

// Load state function
function loadDb() {
  if (!dbCache) {
    dbCache = loadLocalDb();
  }
  return dbCache;
}

// Save state function
function saveDb(data: any) {
  dbCache = data;
  saveLocalDb(data);
  if (supabase) {
    saveToSupabaseAll(data).catch(err => {
      console.error("Async Supabase save failed:", err);
    });
  }
}

// API Routes
app.get("/api/products", (req, res) => {
  const db = loadDb();
  res.json(db.products);
});

app.post("/api/products", (req, res) => {
  const db = loadDb();
  const product = req.body;
  
  if (!product.id) {
    // New product
    product.id = `prod-${Date.now()}`;
    db.products.push(product);
  } else {
    // Update existing product
    const idx = db.products.findIndex((p: any) => p.id === product.id);
    if (idx !== -1) {
      db.products[idx] = product;
    } else {
      db.products.push(product);
    }
  }
  saveDb(db);
  res.json({ success: true, product });
});

app.delete("/api/products/:id", (req, res) => {
  const db = loadDb();
  const { id } = req.params;
  db.products = db.products.filter((p: any) => p.id !== id);
  saveDb(db);
  res.json({ success: true });
});

app.get("/api/settings", (req, res) => {
  const db = loadDb();
  res.json(db.settings);
});

app.post("/api/settings", (req, res) => {
  const db = loadDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

app.get("/api/stats", (req, res) => {
  const db = loadDb();
  res.json(db.stats);
});

app.post("/api/stats/increment-views", (req, res) => {
  const db = loadDb();
  db.stats.views = (db.stats.views || 0) + 1;
  saveDb(db);
  res.json(db.stats);
});

app.get("/api/orders", (req, res) => {
  const db = loadDb();
  res.json(db.orders || []);
});

app.post("/api/orders", (req, res) => {
  const db = loadDb();
  const order = req.body;
  order.id = order.id || `ORD-${Date.now()}`;
  order.timestamp = order.timestamp || new Date().toISOString();
  
  if (!db.orders) db.orders = [];
  db.orders.unshift(order); // New orders at the top
  
  // Update admin analytics stats
  db.stats.whatsappClicks = (db.stats.whatsappClicks || 0) + 1;
  db.stats.potentialRevenue = (db.stats.potentialRevenue || 0) + order.total;
  
  saveDb(db);
  res.json({ success: true, order });
});

// Gemini endpoints
app.post("/api/ai/size-advisor", async (req, res) => {
  const { height, weight, productCode, productName, preferredFit } = req.body;
  
  if (!ai) {
    return res.status(503).json({ 
      error: "Gemini API key is not configured. Sizing analysis falls back to standard rules." 
    });
  }

  try {
    const prompt = `You are the AI Quantum Sizing Analyst for "BlazeBro", an avant-garde brutalist high-fashion techwear label based in Lagos (6.5244 N, 3.3792 E).
    
    The user wants a precise size recommendation for the item "${productCode} // ${productName}".
    User stats:
    - Height: ${height} cm
    - Weight: ${weight} kg
    - Desired Fit Mode: ${preferredFit} (options can be oversized, tailored, or standard)
    
    Write a highly specialized, futuristic, tactical and technical sizing recommendation report.
    Guidelines:
    1. Keep it brief and high-density, strictly under 110 words.
    2. Style it using monospaced characters, coordinates, and harsh military jargon. Use ALL CAPS for critical terms and parameters.
    3. Start directly with the size recommendation, e.g. "RECOMMENDED VECTOR SPEC: [SIZE] // CLASSIFICATION: [FIT STATUS]".
    4. Provide a technical sizing rationale (e.g., chest expansion tolerances, drape tension parameters, limb length adjustments).
    5. Ensure the tone is extremely cool, cold, precise, and cyberpunk-industrial. Do not use generic friendly marketing phrases.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Gemini sizing analysis failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/describe", async (req, res) => {
  const { name, category, specs } = req.body;
  
  if (!ai) {
    return res.status(503).json({ 
      error: "Gemini API is not configured. Falling back to default descriptions." 
    });
  }

  try {
    const prompt = `You are the Lead Creative Construct Director for "BlazeBro", a luxury technical brutalist clothing label.
    
    Generate a highly stylized, futuristic, industrial product description for a new item.
    - Product Name: ${name}
    - Category: ${category}
    - Key Technical Specs: ${JSON.stringify(specs)}
    
    Guidelines:
    1. Write a premium, cybernetic, avant-garde copy that makes the garment sound like cutting-edge high-fashion tactical gear.
    2. Style it in ALL-CAPS or high-tech lingo, using dense technical nouns (e.g., "RETICULATED MATRIX", "STRESS CINCH", "ARMORED HOUSING").
    3. Keep it ultra-impactful, short, and punchy, strictly under 75 words.
    4. Do not write generic friendly sentences. It must feel cold, highly crafted, premium, and industrial.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ description: response.text });
  } catch (error: any) {
    console.error("Gemini description failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// Supabase endpoints
app.get("/api/supabase/status", async (req, res) => {
  const configured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
  let connected = false;
  let errorMsg: string | null = null;

  if (configured && supabase) {
    try {
      const { data, error } = await supabase.from("blazebro_store_data").select("key").limit(1);
      if (error) {
        errorMsg = error.message;
        if (error.code === "PGRST116" || error.message.includes("does not exist") || error.message.includes("relation")) {
          errorMsg = "Table 'blazebro_store_data' does not exist in your Supabase database.";
        }
      } else {
        connected = true;
      }
    } catch (err: any) {
      errorMsg = err.message;
    }
  }

  res.json({
    configured,
    url: process.env.SUPABASE_URL || "",
    connected,
    error: errorMsg,
    sql: `CREATE TABLE blazebro_store_data (
  key TEXT PRIMARY KEY,
  value JSONB
);

-- Enable Row Level Security (RLS) but allow anonymous access for prototype simplicity
ALTER TABLE blazebro_store_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write" 
ON blazebro_store_data 
FOR ALL 
USING (true) 
WITH CHECK (true);`
  });
});

app.post("/api/supabase/sync", async (req, res) => {
  if (!supabase) {
    return res.status(400).json({ error: "Supabase is not configured." });
  }

  try {
    const db = loadDb();
    await saveToSupabaseAll(db);
    res.json({ success: true, message: "Successfully synced all local data to Supabase!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite & Static file handler
async function start() {
  // Initialize database from Supabase on start
  await initDbFromSupabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start();
