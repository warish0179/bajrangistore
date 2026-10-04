const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding NexMart database...");

  // Clean existing data
  await prisma.supportMessage.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.orderTimeline.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.sellerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash("admin123", 10);
  const sellerPassword = await bcrypt.hash("seller123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  // 1. Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Alex Vance (Admin)",
      email: "admin@nexmart.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "+91 98765 43210",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const sellerUser1 = await prisma.user.create({
    data: {
      name: "Marcus Tech (Seller)",
      email: "seller@nexmart.com",
      passwordHash: sellerPassword,
      role: "SELLER",
      phone: "+91 98111 22334",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      name: "Elena Trends (Seller)",
      email: "fashion@nexmart.com",
      passwordHash: sellerPassword,
      role: "SELLER",
      phone: "+91 98222 33445",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "customer@nexmart.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      phone: "+91 99887 76655",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@nexmart.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      phone: "+91 97766 55443",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    },
  });

  // 2. Seller Profiles
  const sellerProfile1 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser1.id,
      storeName: "Apex Tech Hub",
      storeSlug: "apex-tech-hub",
      description: "Official authorized partner for premium electronics, flagship smartphones, gaming gear and smart home devices.",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
      rating: 4.9,
      totalSales: 3420,
      gstNumber: "29AAAAA0000A1Z5",
      phone: "+91 98111 22334",
    },
  });

  const sellerProfile2 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser2.id,
      storeName: "Aura Lifestyle & Fashion",
      storeSlug: "aura-lifestyle",
      description: "Curated modern wardrobe essentials, designer watches, premium leather goods, and street couture.",
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&auto=format&fit=crop&q=80",
      rating: 4.7,
      totalSales: 1890,
      gstNumber: "27BBBBB1111B2Z6",
      phone: "+91 98222 33445",
    },
  });

  // 3. Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      fullName: "Rahul Sharma",
      phone: "+91 99887 76655",
      street: "Flat 402, Skyline Residency, Indiranagar 100 Feet Rd",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
      isDefault: true,
      type: "HOME",
    },
  });

  await prisma.address.create({
    data: {
      userId: customer1.id,
      fullName: "Rahul Sharma (Work)",
      phone: "+91 99887 76655",
      street: "Tower B, 7th Floor, Prestige Tech Cloud Park, Marathahalli",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560103",
      country: "India",
      isDefault: false,
      type: "WORK",
    },
  });

  // 4. Categories & Subcategories
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics & Gadgets",
      slug: "electronics",
      description: "Flagship phones, pro laptops, wireless earbuds & audio gear",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      icon: "Smartphone",
      featured: true,
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: "Fashion & Apparel",
      slug: "fashion",
      description: "Contemporary streetwear, footwear, designer jackets & everyday style",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
      icon: "Shirt",
      featured: true,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: "Home, Kitchen & Living",
      slug: "home-living",
      description: "Modern minimalist interior decor, kitchen robotics & ergonomics",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      icon: "Home",
      featured: true,
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: "Beauty & Grooming",
      slug: "beauty-grooming",
      description: "Clean organic skincare, luxury fragrances, grooming essentials",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      icon: "Sparkles",
      featured: true,
    },
  });

  const catAudio = await prisma.category.create({
    data: {
      name: "Audio & Acoustics",
      slug: "audio-sound",
      description: "Hi-Res noise cancelling headphones, audiophile monitors & party speakers",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      icon: "Headphones",
      featured: true,
    },
  });

  const catSports = await prisma.category.create({
    data: {
      name: "Sports & Fitness",
      slug: "sports-fitness",
      description: "Smart wearables, gym essentials, athletic gear & recovery tech",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      icon: "Activity",
      featured: true,
    },
  });

  // 5. Products with Variants, Images, Specs
  const productsData = [
    {
      title: "NexPro Ultra 16 Flagship Smartphone (5G, 256GB / 512GB)",
      slug: "nexpro-ultra-16-flagship-smartphone",
      brand: "NexTech",
      categoryId: catElectronics.id,
      sellerId: sellerProfile1.id,
      basePrice: 89999,
      salePrice: 79999,
      discountPercent: 11,
      rating: 4.9,
      reviewCount: 428,
      stock: 45,
      isFeatured: true,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "smartphone,5g,flagship,camera,oled",
      description: "Engineered for uncompromising speed and clarity. Featuring an ultra-bright 6.8-inch Dynamic AMOLED 144Hz display, titanium aerospace frame, and a pro-grade 200MP quadruple camera array powered by neural image processing.",
      highlights: JSON.stringify([
        "6.8-inch QHD+ 144Hz Adaptive LTPO Dynamic AMOLED Display",
        "Snapdragon 8 Gen 4 Ultra 3nm Octa-Core Processor",
        "200MP Quad Camera with 10x Optical Periscope Zoom & 8K Video",
        "5,400mAh Battery with 120W HyperCharge (0 to 100% in 19 mins)",
        "IP68 Water and Dust Resistance with Armor Titanium chassis"
      ]),
      specs: JSON.stringify({
        "Display": "6.8\" Quad HD+ AMOLED 144Hz, 3000 nits peak brightness",
        "Processor": "Octa Core 3.4GHz Ultra Bionic 3nm",
        "RAM / Storage": "12GB / 16GB LPDDR5X, UFS 4.0",
        "Battery": "5400 mAh with 120W wired + 50W wireless charge",
        "Rear Camera": "200MP OIS + 50MP Ultra-Wide + 48MP Periscope + 12MP Telephoto",
        "Front Camera": "32MP 4K60HDR",
        "OS": "NexOS 4 (Android 15 based with 5 yrs OS updates)"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80", isPrimary: false },
        { url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Space Titanium / 256GB", sku: "NEX-16-TIT-256", price: 89999, salePrice: 79999, stock: 25, attributes: JSON.stringify({ color: "Titanium", storage: "256GB" }) },
        { name: "Midnight Onyx / 512GB", sku: "NEX-16-ONYX-512", price: 99999, salePrice: 88999, stock: 20, attributes: JSON.stringify({ color: "Midnight Onyx", storage: "512GB" }) },
      ]
    },
    {
      title: "Aura Acoustic Pro Over-Ear Wireless Headphones (Active Noise Cancellation)",
      slug: "aura-acoustic-pro-headphones-anc",
      brand: "AuraSound",
      categoryId: catAudio.id,
      sellerId: sellerProfile1.id,
      basePrice: 29999,
      salePrice: 19999,
      discountPercent: 33,
      rating: 4.8,
      reviewCount: 312,
      stock: 60,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: true,
      flashDealEndsAt: new Date(Date.now() + 24 * 3600 * 1000),
      tags: "audio,headphones,anc,bluetooth,hi-res",
      description: "Immerse yourself in concert-grade sound. Custom 45mm neodymium drivers, hybrid active noise cancellation with 8 precision microphones, and spatial audio with dynamic head tracking for unmatched depth.",
      highlights: JSON.stringify([
        "Industry-leading Hybrid Adaptive Active Noise Cancellation",
        "Up to 60 Hours battery life with quick charge (10 min = 5 hours)",
        "Custom 45mm Bio-Cellulose dynamic drivers for ultra-low distortion",
        "Spatial Audio with head tracking & lossless LDAC codec support",
        "Memory foam protein leather earcups for all-day ergonomic comfort"
      ]),
      specs: JSON.stringify({
        "Driver Unit": "45mm Neodymium Bio-Cellulose",
        "Frequency Response": "4Hz - 45,000Hz (Hi-Res Audio Certified)",
        "Bluetooth Version": "Bluetooth 5.4 with Multipoint connection",
        "Battery Life": "60h (ANC Off) / 45h (ANC On)",
        "Microphones": "8 microphones with AI environmental noise isolation",
        "Weight": "254 grams"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80", isPrimary: false },
        { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Matte Black", sku: "AURA-ANC-BLK", price: 29999, salePrice: 19999, stock: 35, attributes: JSON.stringify({ color: "Black" }) },
        { name: "Platinum Silver", sku: "AURA-ANC-SLV", price: 29999, salePrice: 19999, stock: 25, attributes: JSON.stringify({ color: "Silver" }) },
      ]
    },
    {
      title: "ZenithBook M4 Pro 16\" Studio Laptop (32GB RAM, 1TB SSD, Liquid OLED)",
      slug: "zenithbook-m4-pro-studio-laptop",
      brand: "Zenith",
      categoryId: catElectronics.id,
      sellerId: sellerProfile1.id,
      basePrice: 189999,
      salePrice: 169999,
      discountPercent: 10,
      rating: 4.95,
      reviewCount: 184,
      stock: 22,
      isFeatured: true,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "laptop,creator,workstation,m4,oled",
      description: "The ultimate weapon for software engineers, 3D artists, and music producers. Featuring unified neural acceleration, 18-hour continuous battery stamina, whisper-quiet vapor chamber cooling, and studio-grade ports.",
      highlights: JSON.stringify([
        "16.2-inch 3.5K 120Hz Liquid OLED panel (1600 nits HDR)",
        "Next-gen 14-core CPU + 30-core GPU neural architecture",
        "32GB unified high-bandwidth memory + 1TB PCIe Gen5 SSD",
        "Magnesium-aluminum unibody with precision haptic glass trackpad",
        "6-speaker sound system with force-cancelling woofers"
      ]),
      specs: JSON.stringify({
        "Screen": "16.2\" 3456x2234 Liquid OLED 120Hz ProMotion",
        "CPU": "14-Core High Performance Creator Chipset",
        "GPU": "30-Core Hardware Ray Tracing GPU",
        "Memory": "32GB Unified Memory",
        "Storage": "1TB NVMe Gen5 (7400 MB/s)",
        "Ports": "3x Thunderbolt 5, HDMI 2.1, SDXC card slot, MagSafe charge",
        "Weight": "1.98 kg"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Space Gray / 32GB / 1TB", sku: "ZEN-16-GRY-1TB", price: 189999, salePrice: 169999, stock: 12, attributes: JSON.stringify({ color: "Space Gray", ram: "32GB", storage: "1TB" }) },
        { name: "Silver / 64GB / 2TB", sku: "ZEN-16-SLV-2TB", price: 239999, salePrice: 219999, stock: 10, attributes: JSON.stringify({ color: "Silver", ram: "64GB", storage: "2TB" }) },
      ]
    },
    {
      title: "Kore Carbon Chronograph Men's Automatic Luxury Watch",
      slug: "kore-carbon-chronograph-mens-watch",
      brand: "Kore Geneve",
      categoryId: catFashion.id,
      sellerId: sellerProfile2.id,
      basePrice: 34999,
      salePrice: 24999,
      discountPercent: 28,
      rating: 4.7,
      reviewCount: 96,
      stock: 30,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: true,
      flashDealEndsAt: new Date(Date.now() + 18 * 3600 * 1000),
      tags: "watch,luxury,fashion,automatic,chronograph",
      description: "A testament to mechanical excellence. Encased in forged carbon fiber with sapphire crystal glass, 28-jewel automatic movement, and a breathable FKM vulcanized rubber strap.",
      highlights: JSON.stringify([
        "Forged Carbon fiber bezel with aerospace 316L stainless steel case",
        "28-Jewel Swiss-calibrated automatic movement with 48h power reserve",
        "Anti-reflective scratchproof sapphire crystal glass",
        "100M / 10 ATM Water Resistance rating",
        "Luminescent Super-LumiNova markers for night visibility"
      ]),
      specs: JSON.stringify({
        "Case Diameter": "42 mm",
        "Case Thickness": "11.8 mm",
        "Movement": "Automatic Self-Winding Chronograph Calibre",
        "Water Resistance": "100 Meters / 10 ATM",
        "Strap Material": "High-grade FKM Rubber with deployant buckle"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Stealth Black Carbon", sku: "KORE-CHRONO-BLK", price: 34999, salePrice: 24999, stock: 15, attributes: JSON.stringify({ color: "Stealth Black" }) },
        { name: "Rose Gold Accent Carbon", sku: "KORE-CHRONO-GLD", price: 37999, salePrice: 26999, stock: 15, attributes: JSON.stringify({ color: "Rose Gold" }) },
      ]
    },
    {
      title: "OmniGrip Performance Pro Trail Running Shoes",
      slug: "omnigrip-performance-trail-running-shoes",
      brand: "OmniStrides",
      categoryId: catSports.id,
      sellerId: sellerProfile2.id,
      basePrice: 8999,
      salePrice: 5499,
      discountPercent: 38,
      rating: 4.65,
      reviewCount: 215,
      stock: 80,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: false,
      tags: "shoes,running,fitness,trail,comfort",
      description: "Engineered for high-mileage comfort over rugged terrains and city marathons. Features nitrogen-infused rebound foam, carbon propulsion plate, and Vibram Megagrip traction lug soles.",
      highlights: JSON.stringify([
        "Supercritical nitrogen-infused EVA midsole for maximum energy return",
        "Full-length curved carbon propulsion plate for smoother forward rolling",
        "Breathable engineered ripstop mesh upper with moisture wicking",
        "Vibram Megagrip outsole with 4.5mm multi-directional traction lugs"
      ]),
      specs: JSON.stringify({
        "Drop": "8mm (Heel 36mm / Forefoot 28mm)",
        "Weight": "235 grams (Size 9)",
        "Terrain": "Trail, Mountain, Road, Mixed",
        "Closure": "Quicklace speed lacing system"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Crimson Red / Size 8 UK", sku: "OMNI-RED-8", price: 8999, salePrice: 5499, stock: 20, attributes: JSON.stringify({ color: "Crimson Red", size: "8 UK" }) },
        { name: "Crimson Red / Size 9 UK", sku: "OMNI-RED-9", price: 8999, salePrice: 5499, stock: 25, attributes: JSON.stringify({ color: "Crimson Red", size: "9 UK" }) },
        { name: "Crimson Red / Size 10 UK", sku: "OMNI-RED-10", price: 8999, salePrice: 5499, stock: 15, attributes: JSON.stringify({ color: "Crimson Red", size: "10 UK" }) },
        { name: "Stealth Grey / Size 9 UK", sku: "OMNI-GRY-9", price: 8999, salePrice: 5499, stock: 20, attributes: JSON.stringify({ color: "Stealth Grey", size: "9 UK" }) },
      ]
    },
    {
      title: "RoboChef Smart Induction Espresso & Multi-Brewer Machine",
      slug: "robochef-smart-induction-espresso-machine",
      brand: "RoboChef Kitchen",
      categoryId: catHome.id,
      sellerId: sellerProfile1.id,
      basePrice: 42999,
      salePrice: 31999,
      discountPercent: 25,
      rating: 4.85,
      reviewCount: 142,
      stock: 35,
      isFeatured: true,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "kitchen,coffee,espresso,smart home,appliances",
      description: "Barista-grade coffee at the touch of a button. Features dual thermo-block boilers, 19-bar Italian pressure pump, integrated conical burr grinder with 30 micro-settings, and automatic microfoam milk steaming.",
      highlights: JSON.stringify([
        "Commercial 19-bar Italian Ulka pressure pump",
        "Built-in 250g bean hopper with stainless steel conical burrs",
        "Touchscreen PID temperature control and shot timer",
        "Automatic steam wand creating silky velvet microfoam for latte art",
        "Wi-Fi connectivity to customize brew profiles from your phone"
      ]),
      specs: JSON.stringify({
        "Pump Pressure": "19 Bar",
        "Water Tank Capacity": "2.2 Liters (Removable)",
        "Heating System": "Dual Thermo-Jet with 3-second rapid warmup",
        "Power Rating": "1650W",
        "Grind Settings": "30 Levels with precise digital dosing"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Brushed Stainless Steel", sku: "ROBO-BREW-SILVER", price: 42999, salePrice: 31999, stock: 20, attributes: JSON.stringify({ finish: "Brushed Steel" }) },
        { name: "Matte Midnight Black", sku: "ROBO-BREW-BLK", price: 44999, salePrice: 33999, stock: 15, attributes: JSON.stringify({ finish: "Matte Black" }) },
      ]
    },
    {
      title: "LuxeSilk Botanical Night Renewal Serum & Peptide Complex (50ml)",
      slug: "luxesilk-botanical-night-renewal-serum",
      brand: "LuxeOrganics",
      categoryId: catBeauty.id,
      sellerId: sellerProfile2.id,
      basePrice: 3999,
      salePrice: 2499,
      discountPercent: 37,
      rating: 4.9,
      reviewCount: 388,
      stock: 120,
      isFeatured: false,
      isDealOfTheDay: false,
      isFlashDeal: true,
      flashDealEndsAt: new Date(Date.now() + 12 * 3600 * 1000),
      tags: "beauty,skincare,serum,anti-aging,organic",
      description: "Revitalize your skin overnight. Infused with pure Bakuchiol, quad-peptide complex, hyaluronic acid spheres, and niacinamide to boost firmness, smoothen texture, and restore luminous radiance.",
      highlights: JSON.stringify([
        "Formulated with 2% Bakuchiol (gentle natural retinol alternative)",
        "Multi-molecular weight hyaluronic acid for deep dermal hydration",
        "Cruelty-free, vegan certified, paraben and sulfate free",
        "Dermatologically tested and non-comedogenic for all skin types"
      ]),
      specs: JSON.stringify({
        "Volume": "50 ml / 1.7 fl oz",
        "Key Ingredients": "Bakuchiol, Peptides, Niacinamide, Squalane",
        "Skin Type": "Dry, Normal, Sensitive, Combination",
        "Formulation": "Lightweight silky fast-absorbing elixir"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1608248597359-009c91f1b6ee?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Standard 50ml Dropper Bottle", sku: "LUXE-SERUM-50ML", price: 3999, salePrice: 2499, stock: 120, attributes: JSON.stringify({ size: "50ml" }) },
      ]
    },
    {
      title: "Verve Premium Italian Leather Bomber Jacket (Handcrafted)",
      slug: "verve-italian-leather-bomber-jacket",
      brand: "Verve Atelier",
      categoryId: catFashion.id,
      sellerId: sellerProfile2.id,
      basePrice: 18999,
      salePrice: 12999,
      discountPercent: 31,
      rating: 4.8,
      reviewCount: 77,
      stock: 40,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: false,
      tags: "jacket,leather,fashion,winter,outerwear",
      description: "Crafted from 100% full-grain top-tier nappa lambskin leather. Features antique brass YKK zippers, diamond-quilted thermal interior lining, and ribbed merino wool cuffs for timeless luxury.",
      highlights: JSON.stringify([
        "100% Genuine Full-Grain Lambskin Nappa Leather",
        "Heavy-duty antiqued brass hardware with smooth gliding YKK zippers",
        "Satin quilt interior with dual concealed interior passport pockets",
        "Ribbed knitted collar and waist hem for snug cold-weather warmth"
      ]),
      specs: JSON.stringify({
        "Shell Material": "100% Genuine Lambskin Leather",
        "Lining": "100% Poly-satin quilted with polyfill insulation",
        "Pockets": "2 exterior welt pockets, 2 interior welt security pockets",
        "Care": "Professional leather clean only"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Cognac Tan / Medium", sku: "VERVE-JCK-TAN-M", price: 18999, salePrice: 12999, stock: 15, attributes: JSON.stringify({ color: "Cognac Tan", size: "M" }) },
        { name: "Cognac Tan / Large", sku: "VERVE-JCK-TAN-L", price: 18999, salePrice: 12999, stock: 15, attributes: JSON.stringify({ color: "Cognac Tan", size: "L" }) },
        { name: "Obsidian Black / Large", sku: "VERVE-JCK-BLK-L", price: 18999, salePrice: 12999, stock: 10, attributes: JSON.stringify({ color: "Obsidian Black", size: "L" }) },
      ]
    },
    {
      title: "PulseFit Smart GPS Multisport Health & Recovery Watch",
      slug: "pulsefit-smart-gps-multisport-watch",
      brand: "PulseTech",
      categoryId: catSports.id,
      sellerId: sellerProfile1.id,
      basePrice: 22999,
      salePrice: 14999,
      discountPercent: 34,
      rating: 4.75,
      reviewCount: 290,
      stock: 65,
      isFeatured: false,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "smartwatch,fitness,gps,heartrate,sleep",
      description: "Your 24/7 athletic performance coach. Features dual-frequency GNSS positioning, HRV recovery analytics, SpO2 blood oxygen tracking, 14-day battery reserve, and AMOLED sunlight display.",
      highlights: JSON.stringify([
        "Dual-frequency multi-satellite GPS for pin-point running route maps",
        "Advanced sleep stages, HRV (Heart Rate Variability) stress recovery index",
        "1.43-inch Always-On Sapphire AMOLED display with scratch resistance",
        "5 ATM 50-meter waterproof rating with open water swim tracking"
      ]),
      specs: JSON.stringify({
        "Battery": "Up to 14 days normal usage / 36 hours continuous GPS",
        "Connectivity": "Bluetooth 5.3, Wi-Fi, NFC Contactless Pay",
        "Sensors": "Gen 5 Optical Heart Rate, Pulse Ox, Barometric Altimeter, Compass",
        "Compatibility": "iOS and Android with sync to Strava and Apple Health"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Shadow Black / Silicone Band", sku: "PULSE-GPS-BLK", price: 22999, salePrice: 14999, stock: 40, attributes: JSON.stringify({ color: "Shadow Black" }) },
        { name: "Glacier White / Silicone Band", sku: "PULSE-GPS-WHT", price: 22999, salePrice: 14999, stock: 25, attributes: JSON.stringify({ color: "Glacier White" }) },
      ]
    },
    {
      title: "LumaSound Cinema Pulse 5.1 Dolby Atmos Soundbar with Wireless Subwoofer",
      slug: "lumasound-cinema-pulse-dolby-atmos-soundbar",
      brand: "LumaSound",
      categoryId: catAudio.id,
      sellerId: sellerProfile1.id,
      basePrice: 38999,
      salePrice: 26999,
      discountPercent: 30,
      rating: 4.8,
      reviewCount: 165,
      stock: 28,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: false,
      tags: "soundbar,home theater,dolby atmos,audio,wireless",
      description: "Transform your living room into an IMAX theater. True 5.1.2 physical channel configuration, up-firing Dolby Atmos speakers, 450W total peak output, and a booming 8-inch wireless subwoofer.",
      highlights: JSON.stringify([
        "True Dolby Atmos & DTS:X 3D spatial acoustic virtualization",
        "450 Watts of peak room-filling sound with dedicated center speech channel",
        "8-inch long-throw wireless subwoofer for visceral, bone-rattling bass",
        "HDMI eARC with 4K HDR10+ and Dolby Vision passthrough",
        "AirPlay 2, Spotify Connect, and Bluetooth 5.3 streaming"
      ]),
      specs: JSON.stringify({
        "Channels": "5.1.2 Dedicated Surround",
        "Total Power": "450W Peak / 220W RMS",
        "Subwoofer Type": "8-inch Down-firing Wireless Ported",
        "Inputs": "HDMI eARC, Optical, AUX 3.5mm, USB, Bluetooth",
        "Dimensions": "Soundbar: 980 x 65 x 105 mm, Sub: 240 x 380 x 300 mm"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Gunmetal Acoustic Fabric", sku: "LUMA-51-SND", price: 38999, salePrice: 26999, stock: 28, attributes: JSON.stringify({ color: "Gunmetal" }) },
      ]
    },
  ];

  for (const item of productsData) {
    const { images, variants, ...prodFields } = item;
    const product = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            sortOrder: idx,
            alt: item.title,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            salePrice: v.salePrice,
            stock: v.stock,
            attributes: v.attributes,
          })),
        },
      },
    });

    // Add a couple of realistic reviews for the product
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer1.id,
        rating: 5,
        title: "Phenomenal build quality & exceeds expectations!",
        comment: "Received the package within 24 hours in pristine tamper-evident packaging. The performance is blisteringly fast and the design feels every bit as premium as flagship brands. Strongly recommended!",
        helpfulCount: 24,
        verifiedPurchase: true,
      },
    });

    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer2.id,
        rating: 4,
        title: "Very happy with the purchase, great value",
        comment: "Everything works seamlessly out of the box. Delivery was swift. The materials feel very solid and long-lasting.",
        helpfulCount: 11,
        verifiedPurchase: true,
      },
    });
  }

  // 6. Promotional Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Mega Fest Mega Savings 2026",
        subtitle: "Up to 70% Off on Flagships, 4K Smart Laptops, and Luxury Fashion",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80",
        link: "/products",
        buttonText: "Explore Deals",
        badge: "LIMITED TIME ONLY",
        type: "HERO",
        sortOrder: 1,
      },
      {
        title: "Audiophile Soundscapes",
        subtitle: "Next-gen Spatial Audio & Active Noise Cancellation from ₹19,999",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=80",
        link: "/category/audio-sound",
        buttonText: "Hear the Difference",
        badge: "NEW LAUNCH",
        type: "HERO",
        sortOrder: 2,
      },
      {
        title: "Urban Minimalist Couture",
        subtitle: "Handcrafted Italian Leather & Bespoke Timepieces for the Modern Wardrobe",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80",
        link: "/category/fashion",
        buttonText: "Shop Collection",
        badge: "TRENDING NOW",
        type: "HERO",
        sortOrder: 3,
      },
    ],
  });

  // 7. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "NEX50",
        description: "50% off on first order up to ₹500",
        discountType: "PERCENT",
        discountValue: 50,
        minOrderAmount: 999,
        maxDiscount: 500,
        isActive: true,
      },
      {
        code: "SUPER1000",
        description: "Flat ₹1,000 off on cart value above ₹9,999",
        discountType: "FIXED",
        discountValue: 1000,
        minOrderAmount: 9999,
        maxDiscount: 1000,
        isActive: true,
      },
      {
        code: "FESTIVE20",
        description: "20% festive discount up to ₹2,500 on all electronics",
        discountType: "PERCENT",
        discountValue: 20,
        minOrderAmount: 4999,
        maxDiscount: 2500,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free express shipping on all orders",
        discountType: "FIXED",
        discountValue: 99,
        minOrderAmount: 499,
        maxDiscount: 99,
        isActive: true,
      },
    ],
  });

  // 8. Sample Orders for customer1
  const firstProduct = await prisma.product.findFirst({
    include: { variants: true, images: true },
  });

  if (firstProduct) {
    const order1 = await prisma.order.create({
      data: {
        orderNumber: "NEX-2026-8942",
        userId: customer1.id,
        totalAmount: firstProduct.salePrice,
        discountAmount: 1000,
        shippingFee: 0,
        taxAmount: 250,
        finalAmount: firstProduct.salePrice - 1000 + 250,
        status: "SHIPPED",
        paymentStatus: "PAID",
        paymentMethod: "UPI",
        transactionId: "UPI-TXN-9847291834",
        trackingNumber: "DTDC-EXP-9921448",
        courierName: "BlueDart Express",
        shippingAddress: JSON.stringify({
          fullName: "Rahul Sharma",
          phone: "+91 99887 76655",
          street: "Flat 402, Skyline Residency, Indiranagar 100 Feet Rd",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          country: "India",
        }),
        items: {
          create: [
            {
              productId: firstProduct.id,
              variantId: firstProduct.variants[0]?.id || null,
              productTitle: firstProduct.title,
              variantName: firstProduct.variants[0]?.name || "Default",
              productImage: firstProduct.images[0]?.url || "",
              price: firstProduct.salePrice,
              quantity: 1,
              total: firstProduct.salePrice,
            },
          ],
        },
        timeline: {
          create: [
            {
              status: "CONFIRMED",
              title: "Order Placed & Verified",
              description: "Payment confirmed via UPI. Order sent to merchant for packing.",
              location: "NexMart Automated Gateway",
              timestamp: new Date(Date.now() - 48 * 3600 * 1000),
            },
            {
              status: "PROCESSING",
              title: "Packed & Quality Checked",
              description: "Items packed with secure tamper-proof thermal bubble wrap.",
              location: "Apex Tech Fulfillment Hub, Bengaluru",
              timestamp: new Date(Date.now() - 36 * 3600 * 1000),
            },
            {
              status: "SHIPPED",
              title: "Dispatched via BlueDart Air Express",
              description: "Package in transit to nearest regional distribution hub.",
              location: "BlueDart Central Sort Facility, Whitefield",
              timestamp: new Date(Date.now() - 12 * 3600 * 1000),
            },
          ],
        },
      },
    });

    // Delivered order
    await prisma.order.create({
      data: {
        orderNumber: "NEX-2026-7819",
        userId: customer1.id,
        totalAmount: 19999,
        discountAmount: 500,
        shippingFee: 0,
        taxAmount: 180,
        finalAmount: 19679,
        status: "DELIVERED",
        paymentStatus: "PAID",
        paymentMethod: "CARD",
        transactionId: "CARD-AUTH-654819",
        trackingNumber: "BD-9821419",
        courierName: "Delhivery Air",
        shippingAddress: JSON.stringify({
          fullName: "Rahul Sharma",
          phone: "+91 99887 76655",
          street: "Flat 402, Skyline Residency, Indiranagar 100 Feet Rd",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560038",
          country: "India",
        }),
        items: {
          create: [
            {
              productId: firstProduct.id,
              variantId: firstProduct.variants[0]?.id || null,
              productTitle: "Aura Acoustic Pro Over-Ear Wireless Headphones",
              variantName: "Matte Black",
              productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80",
              price: 19999,
              quantity: 1,
              total: 19999,
            },
          ],
        },
        timeline: {
          create: [
            {
              status: "CONFIRMED",
              title: "Order Placed",
              description: "Paid with HDFC Millennia Credit Card ending in 4082.",
              location: "Online",
              timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000),
            },
            {
              status: "SHIPPED",
              title: "Shipped",
              description: "Dispatched with Delhivery Air Tracking #BD-9821419.",
              location: "Apex Warehouse Hub",
              timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000),
            },
            {
              status: "DELIVERED",
              title: "Delivered Successfully",
              description: "Handed over to customer Rahul Sharma. OTP verified at doorstep.",
              location: "Indiranagar, Bengaluru",
              timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000),
            },
          ],
        },
      },
    });
  }

  // 9. Sample Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customer1.id,
        title: "Order Shipped! 🚀",
        message: "Your order NEX-2026-8942 is on its way via BlueDart. Expected delivery tomorrow.",
        type: "ORDER",
        link: "/account/orders/NEX-2026-8942",
        read: false,
      },
      {
        userId: customer1.id,
        title: "⚡ Flash Deal Alert: 33% Off on Aura Acoustic Pro",
        message: "Your bookmarked headphones are on a limited 24h flash sale. Stock running out fast!",
        type: "PRICE_DROP",
        link: "/products/aura-acoustic-pro-headphones-anc",
        read: false,
      },
      {
        userId: customer1.id,
        title: "Welcome to NexMart Club 🎉",
        message: "Use code NEX50 on your cart for 50% discount up to ₹500 on all orders above ₹999.",
        type: "PROMO",
        link: "/products",
        read: true,
      },
    ],
  });

  // 10. Initial automated support welcome messages
  await prisma.supportMessage.create({
    data: {
      userId: customer1.id,
      sessionId: "session-" + customer1.id,
      sender: "BOT",
      message: "👋 Welcome to NexMart 24x7 Customer Care! How can I help you today? You can check your order status, request a return, or talk to an agent.",
      quickActions: JSON.stringify([
        "Track My Order",
        "Return / Refund Policy",
        "Payment & EMI Options",
        "Chat with Live Agent",
      ]),
    },
  });

  console.log("Database seeded successfully with rich production catalog!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
