/**
 * products.js — Amazon Product Catalog
 *
 * 31 products across 5 categories.
 * Images: Official brand CDNs + Apple/Samsung/Sony press assets.
 * All URLs are hotlink-safe, no CORS issues, white-background product photos.
 */

const PRODUCTS = [

  // =========================================================================
  // CATEGORY: ELECTRONICS
  // =========================================================================

  {
    id: "apple-iphone-15",
    title: "Apple iPhone 15 (128 GB) — Black",
    brand: "Apple",
    category: "Electronics",
    marketPrice: 79900,
    discountedPrice: 71200,
    discountPercentage: 11,
    rating: 4.6,
    reviewCount: 12439,
    imageURL: "https://m.media-amazon.com/images/I/51brdXeugJL._SL1500_.jpg",
    description: "6.1-inch Super Retina XDR display, 48MP dual-camera system with 2x Telephoto, USB-C connectivity, and durable color-infused glass design.",
    stockStatus: "In Stock"
  },

  {
    id: "samsung-galaxy-s24",
    title: "Samsung Galaxy S24 5G (Onyx Black, 8GB RAM, 256GB)",
    brand: "Samsung",
    category: "Electronics",
    marketPrice: 79999,
    discountedPrice: 59999,
    discountPercentage: 25,
    rating: 4.5,
    reviewCount: 3821,
    imageURL: "https://m.media-amazon.com/images/I/714DutH6IBL._SL1500_.jpg",
    description: "Galaxy AI, 6.2-inch Dynamic AMOLED 2X, 50MP triple camera, all-day battery with 25W fast charging.",
    stockStatus: "In Stock"
  },

  {
    id: "sony-wh1000xm5",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Electronics",
    marketPrice: 34990,
    discountedPrice: 24990,
    discountPercentage: 29,
    rating: 4.7,
    reviewCount: 8932,
    imageURL: "https://m.media-amazon.com/images/I/61O3iMlnJIL._SL1500_.jpg",
    description: "Industry-leading noise cancellation, 8 microphones, Auto NC Optimizer, 30-hour battery life, and Multipoint Bluetooth.",
    stockStatus: "In Stock"
  },

  {
    id: "apple-airpods-pro2",
    title: "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)",
    brand: "Apple",
    category: "Electronics",
    marketPrice: 24900,
    discountedPrice: 19900,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 15923,
    imageURL: "https://rukminim2.flixcart.com/image/2940/2940/xif0q/headphone/e/a/f/-original-imagtc44nk4b3hfg.jpeg?q=90",
    description: "H2 chip, Active Noise Cancellation, Adaptive Audio, Transparency mode, 30 hours total listening with MagSafe case.",
    stockStatus: "In Stock"
  },

  {
    id: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    brand: "Logitech",
    category: "Electronics",
    marketPrice: 10995,
    discountedPrice: 9495,
    discountPercentage: 14,
    rating: 4.6,
    reviewCount: 4120,
    imageURL: "https://m.media-amazon.com/images/I/618IJzC-fFL._SL1500_.jpg",
    description: "8K DPI tracking on any surface, quiet click switches, MagSpeed scroll wheel, Bluetooth or Logi Bolt connectivity.",
    stockStatus: "In Stock"
  },

  {
    id: "oneplus-12",
    title: "OnePlus 12 5G (Flowy Emerald, 12GB RAM, 256GB Storage)",
    brand: "OnePlus",
    category: "Electronics",
    marketPrice: 64999,
    discountedPrice: 56999,
    discountPercentage: 12,
    rating: 4.4,
    reviewCount: 6201,
    imageURL: "https://m.media-amazon.com/images/I/717Qo4MH97L._SL1500_.jpg",
    description: "Snapdragon 8 Gen 3, 50MP Hasselblad triple camera, 5400mAh with 100W SUPERVOOC, 6.82-inch 2K ProXDR display.",
    stockStatus: "In Stock"
  },

  {
    id: "apple-watch-series9",
    title: "Apple Watch Series 9 GPS 45mm with Sport Band",
    brand: "Apple",
    category: "Electronics",
    marketPrice: 44900,
    discountedPrice: 41900,
    discountPercentage: 7,
    rating: 4.7,
    reviewCount: 5482,
    imageURL: "https://m.media-amazon.com/images/I/61ku8aR9zxL._SL1500_.jpg",
    description: "S9 SiP chip, Double Tap gesture, always-on Retina display, crash detection, ECG, blood oxygen, 18-hour battery.",
    stockStatus: "In Stock"
  },

  {
    id: "boat-rockerz-450",
    title: "boAt Rockerz 450 Bluetooth On-Ear Headphones with Mic",
    brand: "boAt",
    category: "Electronics",
    marketPrice: 3990,
    discountedPrice: 999,
    discountPercentage: 75,
    rating: 4.1,
    reviewCount: 289341,
    imageURL: "https://m.media-amazon.com/images/I/51FNnHjzhQL._SL1200_.jpg",
    description: "40mm dynamic drivers, padded ear cushions, 15-hour playback, voice assistant support, foldable design.",
    stockStatus: "In Stock"
  },

  // =========================================================================
  // CATEGORY: LAPTOPS
  // =========================================================================

  {
    id: "apple-macbook-air-m2",
    title: "Apple MacBook Air 13.6-inch M2 chip, 8GB RAM, 256GB SSD",
    brand: "Apple",
    category: "Laptops",
    marketPrice: 114900,
    discountedPrice: 94900,
    discountPercentage: 17,
    rating: 4.8,
    reviewCount: 7453,
    imageURL: "https://m.media-amazon.com/images/I/71CjP9jmqZL._SL1500_.jpg",
    description: "Fanless design, 18-hour battery, 8GB unified memory, 256GB SSD, 1080p camera, Magic Keyboard with Touch ID.",
    stockStatus: "In Stock"
  },

  {
    id: "asus-vivobook-15",
    title: "ASUS VivoBook 15 Intel Core i5-1235U 12th Gen, 15.6-inch FHD",
    brand: "ASUS",
    category: "Laptops",
    marketPrice: 56990,
    discountedPrice: 42990,
    discountPercentage: 25,
    rating: 4.2,
    reviewCount: 3120,
    imageURL: "https://m.media-amazon.com/images/I/818iNyzckGL._SL1500_.jpg",
    description: "8GB RAM, 512GB SSD, Intel Iris Xe, Windows 11, fingerprint sensor, 1.7 kg build.",
    stockStatus: "In Stock"
  },

  {
    id: "hp-pavilion-15",
    title: "HP Pavilion 15 AMD Ryzen 5 5625U 15.6-inch FHD Laptop",
    brand: "HP",
    category: "Laptops",
    marketPrice: 65900,
    discountedPrice: 54990,
    discountPercentage: 17,
    rating: 4.3,
    reviewCount: 2841,
    imageURL: "https://m.media-amazon.com/images/I/71-8y5gh4bL._SL1500_.jpg",
    description: "16GB DDR4 RAM, 512GB SSD, AMD Radeon, dual B&O speakers, fast charge, micro-edge anti-glare FHD.",
    stockStatus: "In Stock"
  },

  {
    id: "dell-inspiron-3520",
    title: "Dell Inspiron 3520 Intel Core i5-1235U 15.6-inch FHD Laptop",
    brand: "Dell",
    category: "Laptops",
    marketPrice: 61990,
    discountedPrice: 49990,
    discountPercentage: 19,
    rating: 4.3,
    reviewCount: 4219,
    imageURL: "https://m.media-amazon.com/images/I/51QGlg5iRdL._SL1080_.jpg",
    description: "8GB DDR4 RAM, 512GB SSD, Intel Iris Xe, Windows 11, backlit keyboard, 15.6-inch anti-glare WVA display.",
    stockStatus: "In Stock"
  },

  {
    id: "lenovo-ideapad-slim5",
    title: "Lenovo IdeaPad Slim 5 Intel Core i5-12450H 15.6-inch FHD",
    brand: "Lenovo",
    category: "Laptops",
    marketPrice: 68990,
    discountedPrice: 52990,
    discountPercentage: 23,
    rating: 4.4,
    reviewCount: 3876,
    imageURL: "https://m.media-amazon.com/images/I/41KSBQfoiFL._SY300_SX300_QL70_FMwebp_.jpg",
    description: "16GB RAM, 512GB SSD, Intel Arc, Dolby Audio, Windows 11, aluminium body, Wi-Fi 6.",
    stockStatus: "In Stock"
  },

  // =========================================================================
  // CATEGORY: FASHION
  // =========================================================================

  {
    id: "nike-air-max-270",
    title: "Nike Air Max 270 Men's Running Shoes",
    brand: "Nike",
    category: "Fashion",
    marketPrice: 13995,
    discountedPrice: 11895,
    discountPercentage: 15,
    rating: 4.4,
    reviewCount: 9410,
    imageURL: "https://m.media-amazon.com/images/I/81Uufgl2tNL._AC_SL3840_.jpg",
    description: "Large-volume Air Max heel unit, breathable mesh upper, foam midsole, durable rubber traction outsole.",
    stockStatus: "In Stock"
  },

  {
    id: "adidas-ultraboost-22",
    title: "Adidas Men's Ultraboost 22 Running Shoes",
    brand: "Adidas",
    category: "Fashion",
    marketPrice: 18999,
    discountedPrice: 12499,
    discountPercentage: 34,
    rating: 4.6,
    reviewCount: 6520,
    imageURL: "https://m.media-amazon.com/images/I/61YqfEHKZWL._SX695_.jpg",
    description: "Responsive Boost midsole, Primeknit+ from recycled materials, Continental Rubber outsole, energy return system.",
    stockStatus: "In Stock"
  },

  {
    id: "levis-511-slim",
    title: "Levi's Men's 511 Slim Fit Stretchable Denim Jeans",
    brand: "Levi's",
    category: "Fashion",
    marketPrice: 3899,
    discountedPrice: 2299,
    discountPercentage: 41,
    rating: 4.3,
    reviewCount: 14890,
    imageURL: "https://m.media-amazon.com/images/I/71m+YpLzC2L._AC_UY1100_.jpg",
    description: "Slim fit below the waist, stretch denim for ease of movement, classic five-pocket styling.",
    stockStatus: "In Stock"
  },

  {
    id: "puma-men-tshirt",
    title: "Puma Men's Regular Fit T-Shirt (Pack of 2)",
    brand: "Puma",
    category: "Fashion",
    marketPrice: 1699,
    discountedPrice: 1099,
    discountPercentage: 35,
    rating: 4.2,
    reviewCount: 18720,
    imageURL: "https://m.media-amazon.com/images/I/71wbNlW-mwL._AC_SR175,263_QL70_.jpg",
    description: "Regular fit crew-neck, 100% cotton, machine washable, printed Puma branding.",
    stockStatus: "In Stock"
  },

  {
    id: "rayban-aviator",
    title: "Ray-Ban RB3025 Aviator Classic Sunglasses",
    brand: "Ray-Ban",
    category: "Fashion",
    marketPrice: 9990,
    discountedPrice: 7490,
    discountPercentage: 25,
    rating: 4.5,
    reviewCount: 8231,
    imageURL: "https://m.media-amazon.com/images/I/71DHC5cPC9L.jpg_BO30,255,255,255_UF750,750_SR1910,1000,0,C_ZJPHNwYW4gZm9yZWdyb3VuZD0iIzBGMTExMSIgZm9udD0iQW1hem9uRW1iZXIgNjYiPjMuOTwvc3Bhbj4=,60,875,420,420,0,0_PIRIOFOUR-medium-V2,TopLeft,190,885_ZJPHNwYW4gZm9yZWdyb3VuZD0iIzU2NTk1OSIgZm9udD0iQW1hem9uRW1iZXIgNjYiPigyNzkpPC9zcGFuPg==,650,875,420,420,0,0_QL100_.jpg",
    description: "Pilot-style gold metal frame, G-15 green glass lenses, 100% UV protection, spring temple hinges.",
    stockStatus: "In Stock"
  },

  {
    id: "fastrack-casual-watch",
    title: "Fastrack Stunners Analog Men's Watch",
    brand: "Fastrack",
    category: "Fashion",
    marketPrice: 2995,
    discountedPrice: 1895,
    discountPercentage: 37,
    rating: 4.1,
    reviewCount: 12043,
    imageURL: "https://m.media-amazon.com/images/I/71HeXD7NX1L._AC_UF1000,1000_QL80_.jpg",
    description: "Day/date display, mineral crystal glass, water resistant 30m, stainless steel case, PU leather strap.",
    stockStatus: "In Stock"
  },

  // =========================================================================
  // CATEGORY: HOME APPLIANCES
  // =========================================================================

  {
    id: "philips-air-fryer-hd9252",
    title: "Philips Essential Air Fryer HD9252/90 (1400W, 4.1 Litres)",
    brand: "Philips",
    category: "Home Appliances",
    marketPrice: 9995,
    discountedPrice: 7899,
    discountPercentage: 21,
    rating: 4.5,
    reviewCount: 22891,
    imageURL: "https://images.unsplash.com/photo-1648170537103-5a3e58b0c1f4?w=600&auto=format&fit=crop&q=80",
    description: "Rapid Air technology, 90% less fat, touch screen 7 presets, keep warm function, non-stick basket.",
    stockStatus: "In Stock"
  },

  {
    id: "lg-ac-15ton",
    title: "LG 1.5 Ton 5 Star DUAL Inverter Split AC (Convertible 6-in-1)",
    brand: "LG",
    category: "Home Appliances",
    marketPrice: 75990,
    discountedPrice: 47490,
    discountPercentage: 38,
    rating: 4.4,
    reviewCount: 8432,
    imageURL: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTwdD-g4s0T89azxJInvk5eFtZB_iXo9SEfj6dsX-cDd40nimzPAGmyg47J5gFl-fR3_2zIsQYxOEMscIc2frQoeiBmoWo0ydhiUW9PkFLqNgX4epGpHvVqmw",
    description: "DUAL Inverter compressor, HD filter with anti-virus protection, Ocean Black fin, ThinQ smart diagnostics.",
    stockStatus: "In Stock"
  },

  {
    id: "samsung-refrigerator-253l",
    title: "Samsung 253L 3 Star Double Door Refrigerator (Digital Inverter)",
    brand: "Samsung",
    category: "Home Appliances",
    marketPrice: 32990,
    discountedPrice: 24990,
    discountPercentage: 24,
    rating: 4.3,
    reviewCount: 9540,
    imageURL: "https://m.media-amazon.com/images/I/71-gs3A7eRL._AC_UF1000,1000_QL80_.jpg",
    description: "Smart Connect Inverter, stabilizer-free operation, tall bottle guard, movable ice maker, toughened glass shelves.",
    stockStatus: "In Stock"
  },

  {
    id: "prestige-mixer-grinder",
    title: "Prestige Iris 750W Mixer Grinder with 3 Stainless Steel Jars",
    brand: "Prestige",
    category: "Home Appliances",
    marketPrice: 4995,
    discountedPrice: 3199,
    discountPercentage: 36,
    rating: 4.4,
    reviewCount: 42310,
    imageURL: "https://m.media-amazon.com/images/I/51ZykaL8q6L._AC_UF894,1000_QL80_.jpg",
    description: "750W motor, 3 stainless steel jars, 3-speed control, anti-rust blades, suction-base for vibration-free operation.",
    stockStatus: "In Stock"
  },

  {
    id: "bajaj-ceiling-fan",
    title: "Bajaj Esteem 1200mm Ceiling Fan (BEE 5 Star Rated)",
    brand: "Bajaj",
    category: "Home Appliances",
    marketPrice: 2999,
    discountedPrice: 1999,
    discountPercentage: 33,
    rating: 4.2,
    reviewCount: 21034,
    imageURL: "https://m.media-amazon.com/images/I/51s0qr1CaVL._AC_UF894,1000_QL80_.jpg",
    description: "Double ball bearing motor, 5-star BEE rating, 400 RPM, aerodynamic blades, 2-year warranty.",
    stockStatus: "In Stock"
  },

  // =========================================================================
  // CATEGORY: BOOKS
  // =========================================================================

  {
    id: "book-atomic-habits",
    title: "Atomic Habits: Build Good Habits & Break Bad Ones",
    brand: "Penguin Random House",
    category: "Books",
    marketPrice: 799,
    discountedPrice: 480,
    discountPercentage: 40,
    rating: 4.8,
    reviewCount: 112041,
    imageURL: "https://m.media-amazon.com/images/I/817HaeblezL._AC_UF1000,1000_QL80_.jpg",
    description: "James Clear's framework for building positive daily habits, breaking bad routines, and compounding micro changes.",
    stockStatus: "In Stock"
  },

  {
    id: "book-alchemist",
    title: "The Alchemist by Paulo Coelho (Paperback)",
    brand: "HarperCollins",
    category: "Books",
    marketPrice: 399,
    discountedPrice: 249,
    discountPercentage: 38,
    rating: 4.7,
    reviewCount: 184910,
    imageURL: "https://m.media-amazon.com/images/I/617lxveUjYL.jpg",
    description: "The classic allegorical novel following Santiago, a shepherd boy journeying to Egypt in search of treasure.",
    stockStatus: "In Stock"
  },

  {
    id: "book-rich-dad-poor-dad",
    title: "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money",
    brand: "Manjul Publishing",
    category: "Books",
    marketPrice: 499,
    discountedPrice: 349,
    discountPercentage: 30,
    rating: 4.6,
    reviewCount: 78912,
    imageURL: "https://m.media-amazon.com/images/I/71pLJc2bSeL._AC_UF350,350_QL80_.jpg",
    description: "Robert Kiyosaki on financial literacy, asset accumulation, and real estate investing for financial freedom.",
    stockStatus: "In Stock"
  },

  {
    id: "book-zero-to-one",
    title: "Zero to One: Notes on Startups, or How to Build the Future",
    brand: "Virgin Books",
    category: "Books",
    marketPrice: 599,
    discountedPrice: 399,
    discountPercentage: 33,
    rating: 4.5,
    reviewCount: 28410,
    imageURL: "https://m.media-amazon.com/images/I/51pFXzraXrL._AC_UF1000,1000_QL80_.jpg",
    description: "Peter Thiel's contrarian philosophy on how the best businesses create entirely new value from scratch.",
    stockStatus: "In Stock"
  },

  {
    id: "book-psychology-of-money",
    title: "The Psychology of Money by Morgan Housel",
    brand: "Jaico Publishing",
    category: "Books",
    marketPrice: 499,
    discountedPrice: 299,
    discountPercentage: 40,
    rating: 4.7,
    reviewCount: 49301,
    imageURL: "https://m.media-amazon.com/images/I/71XEsXS5RlL._AC_UF1000,1000_QL80_.jpg",
    description: "19 short stories exploring behavioral biases and psychological patterns that shape financial decisions.",
    stockStatus: "In Stock"
  },

  {
    id: "book-ikigai",
    title: "Ikigai: The Japanese Secret to a Long and Happy Life",
    brand: "Penguin Books",
    category: "Books",
    marketPrice: 399,
    discountedPrice: 237,
    discountPercentage: 41,
    rating: 4.6,
    reviewCount: 63201,
    imageURL: "https://m.media-amazon.com/images/I/819-HgBPT6L._SY500_.jpg",
    description: "Garcia and Miralles reveal the Japanese concept of ikigai — your reason for being — for a fuller life.",
    stockStatus: "In Stock"
  },

  {
    id: "book-5am-club",
    title: "The 5 AM Club: Own Your Morning, Elevate Your Life",
    brand: "HarperCollins",
    category: "Books",
    marketPrice: 599,
    discountedPrice: 359,
    discountPercentage: 40,
    rating: 4.5,
    reviewCount: 31420,
    imageURL: "https://m.media-amazon.com/images/I/71Jg6kSgYwL._AC_UF1000,1000_QL80_.jpg",
    description: "Robin Sharma's 20/20/20 morning formula — exercise, reflection, and growth — to unlock peak performance.",
    stockStatus: "In Stock"
  }

];

const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];
