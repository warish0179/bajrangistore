const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Helper to generate realistic products
function createProductsForCategory(catId, catSlug, sellerId, templates) {
  const result = [];
  templates.forEach((tmpl, idx) => {
    const num = idx + 1;
    const slug = `${tmpl.slug}-${num}`;
    const sku = `${tmpl.brand.substring(0, 3).toUpperCase()}-${catSlug.substring(0, 3).toUpperCase()}-${1000 + num}`;
    const basePrice = tmpl.mrp;
    const discount = tmpl.discountPercent || Math.floor(10 + Math.random() * 35);
    const salePrice = Math.round(basePrice * (1 - discount / 100));

    result.push({
      title: tmpl.title,
      slug: slug,
      brand: tmpl.brand, // Actual Brand!
      manufacturer: tmpl.manufacturer || `${tmpl.brand} Corporation`,
      modelNumber: tmpl.modelNumber || `${tmpl.brand.substring(0, 2).toUpperCase()}-${2025 + (num % 3)}`,
      sku: sku,
      categoryId: catId,
      sellerId: sellerId,
      basePrice: basePrice,
      salePrice: salePrice,
      discountPercent: discount,
      rating: +(4.2 + (Math.random() * 0.7)).toFixed(1),
      reviewCount: Math.floor(45 + Math.random() * 850),
      stock: Math.floor(15 + Math.random() * 120),
      isFeatured: num % 7 === 0,
      isDealOfTheDay: num % 12 === 0,
      isFlashDeal: num % 15 === 0,
      warranty: tmpl.warranty || "1 Year Manufacturer Brand Warranty",
      returnPolicy: "7 Days Free Replacement & Return",
      tags: `${tmpl.brand.toLowerCase()},${catSlug},bestseller,genuine`,
      description: tmpl.description || `Original ${tmpl.brand} product with certified authenticity, manufacturer warranty, and ultra-fast express delivery from BajrangiStore.`,
      highlights: JSON.stringify(tmpl.highlights || [
        `Genuine ${tmpl.brand} certified hardware & materials`,
        "Rigorous quality benchmarked with hassle-free doorstep returns",
        "Includes official warranty documentation & invoice",
        "Eligible for Free Hyper-Express Doorstep Delivery"
      ]),
      specs: JSON.stringify(tmpl.specs || {
        "Brand": tmpl.brand,
        "Origin": "Genuine Manufacturer Supply",
        "Condition": "Brand New Factory Sealed",
        "Quality Check": "100% Certified Passed"
      }),
      images: tmpl.images || [
        { url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", isPrimary: false }
      ],
      variants: tmpl.variants || [
        {
          name: "Standard Edition",
          sku: `${sku}-STD`,
          price: basePrice,
          salePrice: salePrice,
          stock: 30,
          attributes: JSON.stringify({ variant: "Standard" })
        }
      ]
    });
  });
  return result;
}

// 50+ realistic product templates per major category with real brands
const catalogData = {
  "mobiles-tablets": [
    { title: "Apple iPhone 15 Pro Max (256GB Storage, Natural Titanium)", brand: "Apple", mrp: 159900, discountPercent: 7, slug: "apple-iphone-15-pro-max-256gb", images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800", isPrimary: true }], specs: { Display: "6.7\" Super Retina XDR OLED 120Hz", Processor: "A17 Pro 3nm", RAM: "8GB", Camera: "48MP + 12MP + 12MP 5x Telephoto" } },
    { title: "Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray, AI Built-in)", brand: "Samsung", mrp: 139999, discountPercent: 9, slug: "samsung-galaxy-s24-ultra-5g", images: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", isPrimary: true }], specs: { Display: "6.8\" Dynamic AMOLED 2X 120Hz", Processor: "Snapdragon 8 Gen 3 for Galaxy", RAM: "12GB", Camera: "200MP Quad OIS" } },
    { title: "OnePlus 12 5G (16GB RAM, 512GB Storage, Emerald Green)", brand: "OnePlus", mrp: 69999, discountPercent: 8, slug: "oneplus-12-5g-emerald", images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", isPrimary: true }] },
    { title: "Google Pixel 8 Pro (128GB Storage, Obsidian)", brand: "Google", mrp: 106999, discountPercent: 15, slug: "google-pixel-8-pro-obsidian", images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", isPrimary: true }] },
    { title: "Xiaomi 14 Ultra (16GB RAM, 512GB, Leica Quad Camera)", brand: "Xiaomi", mrp: 99999, discountPercent: 10, slug: "xiaomi-14-ultra-leica", images: [{ url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800", isPrimary: true }] },
    { title: "Realme 12 Pro+ 5G (Submarine Blue, 256GB)", brand: "Realme", mrp: 31999, discountPercent: 14, slug: "realme-12-pro-plus-5g", images: [{ url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800", isPrimary: true }] },
    { title: "Vivo X100 Pro 5G (ZEISS APO Telephoto, 512GB)", brand: "Vivo", mrp: 89999, discountPercent: 11, slug: "vivo-x100-pro-5g", images: [{ url: "https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=800", isPrimary: true }] },
    { title: "Apple iPad Air 11\" M2 Chip (128GB, Wi-Fi, Space Gray)", brand: "Apple", mrp: 59900, discountPercent: 6, slug: "apple-ipad-air-m2-11inch", images: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", isPrimary: true }] },
    { title: "Samsung Galaxy Tab S9 Ultra (14.6\" Dynamic AMOLED, S-Pen)", brand: "Samsung", mrp: 108999, discountPercent: 12, slug: "samsung-galaxy-tab-s9-ultra", images: [{ url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800", isPrimary: true }] },
    { title: "Motorola Edge 50 Ultra (Pantone Peach Fuzz, 512GB)", brand: "Motorola", mrp: 64999, discountPercent: 15, slug: "motorola-edge-50-ultra", images: [{ url: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800", isPrimary: true }] },
    { title: "Nothing Phone (2) (12GB RAM, 256GB, Glyph Interface)", brand: "Nothing", mrp: 44999, discountPercent: 20, slug: "nothing-phone-2-glyph", images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", isPrimary: true }] },
    { title: "iQOO 12 5G (Snapdragon 8 Gen 3, Alpha Edition, 256GB)", brand: "iQOO", mrp: 59999, discountPercent: 12, slug: "iqoo-12-5g-alpha", images: [{ url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800", isPrimary: true }] },
    { title: "Apple iPhone 14 (128GB, Midnight Blue)", brand: "Apple", mrp: 69900, discountPercent: 16, slug: "apple-iphone-14-128gb", images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800", isPrimary: true }] },
    { title: "Samsung Galaxy A55 5G (Awesome Navy, 128GB)", brand: "Samsung", mrp: 42999, discountPercent: 14, slug: "samsung-galaxy-a55-5g", images: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", isPrimary: true }] },
    { title: "OnePlus Nord CE 4 5G (Celadon Marble, 128GB)", brand: "OnePlus", mrp: 24999, discountPercent: 10, slug: "oneplus-nord-ce-4-5g", images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", isPrimary: true }] },
    { title: "POCO X6 Pro 5G (Dimensity 8300-Ultra, Yellow, 256GB)", brand: "POCO", mrp: 28999, discountPercent: 18, slug: "poco-x6-pro-5g-yellow", images: [{ url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800", isPrimary: true }] },
    { title: "Redmi Note 13 Pro+ 5G (Fusion Purple, 200MP OIS)", brand: "Xiaomi", mrp: 33999, discountPercent: 12, slug: "redmi-note-13-pro-plus-5g", images: [{ url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800", isPrimary: true }] },
    { title: "Apple iPad 10th Gen (10.9\", A14 Bionic, Blue)", brand: "Apple", mrp: 39900, discountPercent: 13, slug: "apple-ipad-10th-gen-blue", images: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", isPrimary: true }] },
    { title: "Samsung Galaxy Z Fold 5 (512GB, Icy Blue)", brand: "Samsung", mrp: 164999, discountPercent: 15, slug: "samsung-galaxy-z-fold-5", images: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", isPrimary: true }] },
    { title: "Samsung Galaxy Z Flip 5 (256GB, Mint)", brand: "Samsung", mrp: 99999, discountPercent: 22, slug: "samsung-galaxy-z-flip-5", images: [{ url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", isPrimary: true }] },
    { title: "Google Pixel 7a (8GB RAM, 128GB, Sea)", brand: "Google", mrp: 43999, discountPercent: 25, slug: "google-pixel-7a-sea", images: [{ url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800", isPrimary: true }] },
    { title: "OnePlus Open Foldable 5G (Voyager Black, 512GB)", brand: "OnePlus", mrp: 149999, discountPercent: 8, slug: "oneplus-open-foldable-5g", images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800", isPrimary: true }] },
    { title: "Apple iPad Pro 13\" M4 OLED (256GB, Space Black)", brand: "Apple", mrp: 129900, discountPercent: 5, slug: "apple-ipad-pro-13-m4", images: [{ url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800", isPrimary: true }] },
    { title: "Motorola Razr 40 Ultra (Viva Magenta, 256GB)", brand: "Motorola", mrp: 89999, discountPercent: 35, slug: "motorola-razr-40-ultra", images: [{ url: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800", isPrimary: true }] },
    { title: "Realme Narzo 70 Pro 5G (Glass Green, 128GB)", brand: "Realme", mrp: 21999, discountPercent: 18, slug: "realme-narzo-70-pro-5g", images: [{ url: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800", isPrimary: true }] }
  ]
};

// Auto-expand catalogData to guarantee 52 products for each of the 10 major categories
const brandPool = {
  "mobiles-tablets": ["Apple", "Samsung", "OnePlus", "Xiaomi", "Google", "Vivo", "Realme", "Motorola", "Nothing", "iQOO", "POCO"],
  "electronics-audio": ["Sony", "boAt", "JBL", "Noise", "Bose", "Sennheiser", "Marshall", "Canon", "GoPro", "Apple", "Harman Kardon"],
  "laptops-computers": ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Logitech", "Keychron", "Samsung", "LG", "MSI"],
  "fashion-apparel": ["Levi's", "Allen Solly", "Van Heusen", "Zara", "Nike", "Adidas", "Puma", "H&M", "Biba", "Manyavar", "Raymond"],
  "footwear": ["Nike", "Adidas", "Puma", "Asics", "New Balance", "Woodland", "Red Tape", "Crocs", "Skechers", "Bata", "Clarks"],
  "home-kitchen": ["Philips", "Prestige", "Hawkins", "Dyson", "Kent", "Eureka Forbes", "Bajaj", "Havells", "Milton", "Pigeon", "Bosch"],
  "beauty-grooming": ["Lakme", "L'Oreal Paris", "Nivea", "Mamaearth", "The Derma Co", "Cetaphil", "Neutrogena", "Maybelline", "Philips", "Braun"],
  "grocery-gourmet": ["Tata Sampann", "Fortune", "Daawat", "Aashirvaad", "Saffola", "Tata Tea", "Nescafe", "Kellogg's", "Hershey's", "Dabur"],
  "sports-fitness": ["Decathlon", "Yonex", "Nivia", "Cosco", "Boldfit", "Strauss", "Speedo", "Everlast", "Garmin", "Spalding"],
  "toys-kids": ["Lego", "Hot Wheels", "Nerf", "Barbie", "Hasbro", "Fisher-Price", "Funskool", "Play-Doh", "Beyblade", "Mattel"]
};

const categoryDefinitions = [
  { slug: "mobiles-tablets", name: "Mobiles & Tablets", icon: "Smartphone", description: "Flagship smartphones, iPads, 5G handsets & tablets" },
  { slug: "electronics-audio", name: "Electronics & Audio", icon: "Headphones", description: "Studio ANC headphones, wireless earbuds, smart TVs & cameras" },
  { slug: "laptops-computers", name: "Laptops & Computers", icon: "Laptop", description: "Creator workstations, ultrabooks, gaming rigs & mechanical accessories" },
  { slug: "fashion-apparel", name: "Fashion & Clothing", icon: "Shirt", description: "Men's, women's, ethnic designer apparel & luxury watches" },
  { slug: "footwear", name: "Footwear & Shoes", icon: "Footprints", description: "Athletic running shoes, luxury sneakers, boots & formals" },
  { slug: "home-kitchen", name: "Home & Appliances", icon: "Home", description: "Air fryers, robotic vacuums, water purifiers & cookware" },
  { slug: "beauty-grooming", name: "Beauty & Personal Care", icon: "Sparkles", description: "Dermatological serums, organic skincare & electric trimmers" },
  { slug: "grocery-gourmet", name: "Grocery & Gourmet", icon: "ShoppingBag", description: "Unpolished organic pulses, pure oils, basmati & gourmet coffee" },
  { slug: "sports-fitness", name: "Sports & Fitness", icon: "Activity", description: "Gym equipment, badminton rackets, footballs & GPS trackers" },
  { slug: "toys-kids", name: "Toys & Kids", icon: "Smile", description: "Lego architecture, die-cast cars, board games & early learning" }
];

function generate52ItemsForCategory(catSlug) {
  const brands = brandPool[catSlug] || ["Samsung", "Sony", "Philips", "Nike", "Apple"];
  const baseItems = catalogData[catSlug] || [];
  const items = [...baseItems];

  const genericTitles = {
    "mobiles-tablets": ["Pro 5G Smartphone", "Max Cellular Tablet", "Ultra Thin Foldable", "Gaming Phone Special Edition", "FastCharge Lite Mobile"],
    "electronics-audio": ["Wireless Noise Cancelling Earbuds", "Portable Bluetooth Speaker Waterproof", "Over-Ear Hi-Fi Studio Headphones", "Smart Soundbar with Subwoofer", "Action Camera 4K60 Ultra HD"],
    "laptops-computers": ["15.6\" FHD Creator Laptop", "Gaming Ultrabook RTX 4060", "Wireless Ergonomic Mouse", "RGB Mechanical Gaming Keyboard", "27\" 165Hz IPS QHD Monitor"],
    "fashion-apparel": ["Slim Fit Stretch Cotton Jeans", "Pure Linen Casual Button-Down Shirt", "Athletic Fleece Pullover Hoodie", "Tailored Formal Suit Blazer", "Embroidered Traditional Festive Kurta"],
    "footwear": ["Cushioned Road Running Shoes", "Classic Leather Casual Sneakers", "Memory Foam Slip-On Walking Loafers", "Waterproof Outdoor Hiking Boots", "Lightweight Breathable Training Shoes"],
    "home-kitchen": ["Digital Air Fryer XXL 6.2L", "750W Heavy Duty Mixer Grinder 4 Jars", "Tri-Ply Stainless Steel Pressure Cooker", "Cordless Stick Vacuum Cleaner", "RO + UV Alkaline Water Purifier 8L"],
    "beauty-grooming": ["Hydrating Face Gel with Hyaluronic Acid", "100% Pure Organic Cold-Pressed Argan Oil", "Waterproof Precision Liquid Eyeliner", "Beard Trimmer 40 Length Settings", "SPF 50+ PA++++ Mineral Sunscreen Matte"],
    "grocery-gourmet": ["Unpolished Organic Toor Dal 1kg", "Cold-Pressed Kachi Ghani Mustard Oil 1L", "Aged Premium Traditional Basmati Rice 5kg", "Pure Roasted Arabica Beans Coffee 250g", "100% Pure Indigenous Forest Honey 500g"],
    "sports-fitness": ["Cast Iron Hex Dumbbell Pair 10kg", "High-Tension Carbon Badminton Racket", "FIFA Standard Match Training Football", "Non-Slip High Density Yoga Mat 8mm", "Stainless Steel Protein Shaker Bottle 750ml"],
    "toys-kids": ["Speed Champions Supercar Building Kit", "Die-Cast 1:64 Collector Vehicles Pack", "Foam Dart Tactical Target Blaster", "Deluxe Family Strategy Board Game", "Non-Toxic Clay Modeling Dough Set 12-Colors"]
  };

  const imagesForCat = {
    "mobiles-tablets": ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"],
    "electronics-audio": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"],
    "laptops-computers": ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800"],
    "fashion-apparel": ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800"],
    "footwear": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"],
    "home-kitchen": ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800", "https://images.unsplash.com/photo-1585698114474-b52971d2b8fe?w=800", "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800"],
    "beauty-grooming": ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800", "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800", "https://images.unsplash.com/photo-1608248597359-5974c5d57b0d?w=800"],
    "grocery-gourmet": ["https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800"],
    "sports-fitness": ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800", "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800", "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"],
    "toys-kids": ["https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"]
  };

  const pool = genericTitles[catSlug] || ["Premium Product", "Pro Edition"];
  const catImgs = imagesForCat[catSlug] || ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800"];

  let count = items.length;
  while (count < 52) {
    const brand = brands[count % brands.length];
    const titleBase = pool[count % pool.length];
    const mrp = Math.floor(1299 + (count * 450) + ((count % 7) * 999));
    const discount = 15 + ((count * 3) % 45);
    const imgUrl = catImgs[count % catImgs.length];

    items.push({
      title: `${brand} ${titleBase} Series ${count + 1}`,
      brand: brand,
      mrp: mrp,
      discountPercent: discount,
      slug: `${brand.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${titleBase.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${count + 1}`,
      images: [
        { url: imgUrl, isPrimary: true },
        { url: catImgs[(count + 1) % catImgs.length], isPrimary: false }
      ]
    });
    count++;
  }

  return items;
}

async function main() {
  console.log("Seeding BajrangiStore 50+ products per category ecosystem...");

  // Clean old records
  await prisma.returnRequest.deleteMany({});
  await prisma.otpVerification.deleteMany({});
  await prisma.supportTicket.deleteMany({});
  await prisma.paymentTransaction.deleteMany({});
  await prisma.paymentSetting.deleteMany({});
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
  await prisma.deliveryProfile.deleteMany({});
  await prisma.sellerProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const adminPassword = await bcrypt.hash("admin123", 10);
  const sellerPassword = await bcrypt.hash("seller123", 10);
  const deliveryPassword = await bcrypt.hash("delivery123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  // Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Warish Raj (Admin Controller)",
      email: "admin@bajrangistore.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      phone: "+91 98354 00188",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      walletBalance: 25000,
    },
  });

  const sellerUser = await prisma.user.create({
    data: {
      name: "Vikram Singhania",
      email: "seller@bajrangistore.com",
      passwordHash: sellerPassword,
      role: "SELLER",
      phone: "+91 98111 22334",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      walletBalance: 12500,
    },
  });

  const deliveryUser = await prisma.user.create({
    data: {
      name: "Ramesh Kumar",
      email: "delivery@bajrangistore.com",
      passwordHash: deliveryPassword,
      role: "DELIVERY_WORKER",
      phone: "+91 98450 11223",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      walletBalance: 1200,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "customer@bajrangistore.com",
      passwordHash: customerPassword,
      role: "CUSTOMER",
      phone: "+91 99887 76655",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      walletBalance: 25000,
    },
  });

  // Profiles
  const sellerProfile = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser.id,
      storeName: "Apex Digital Retailers",
      storeSlug: "apex-digital",
      description: "Authorized flagship distributor for verified global brands on BajrangiStore.",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200",
      rating: 4.9,
      totalSales: 4890,
      gstNumber: "29AABCS8942P1Z8",
      panNumber: "AABCS8942P",
      bankAccount: "Jio Payments Bank •••• 2565",
      commissionRate: 5.0,
      status: "APPROVED",
      isApproved: true,
      businessAddress: "Plot 42, Electronics City Phase 1, Bengaluru, Karnataka 560100",
      pickupAddress: "Warehouse 7B, Hosur Road Logistics Hub, Bengaluru 560068"
    },
  });

  await prisma.deliveryProfile.create({
    data: {
      userId: deliveryUser.id,
      fullName: "Ramesh Kumar",
      phone: "+91 98450 11223",
      vehicleType: "BIKE",
      vehicleNumber: "KA-05-EX-4891",
      licenseNumber: "KA05-20210049281",
      aadhaarNumber: "•••• •••• 8912",
      panNumber: "BKMPK8912L",
      bankAccount: "000521713102565",
      ifscCode: "JIOP0000001",
      upiId: "9835400188-k322-3@ibl",
      emergencyContact: "+91 98450 99887",
      status: "APPROVED",
      isOnline: true,
      currentCity: "Bengaluru",
      activeDeliveriesCount: 1,
      completedDeliveriesCount: 42,
      totalEarnings: 2730.0,
      rating: 4.9,
    },
  });

  // Saved Addresses for Customer
  const addr1 = await prisma.address.create({
    data: {
      userId: customerUser.id,
      fullName: "Rahul Sharma",
      phone: "+91 99887 76655",
      houseNumber: "Flat 402, Shanti Nilayam",
      street: "12th Main Road, 4th Cross",
      area: "HAL 2nd Stage, Indiranagar",
      landmark: "Near Sony World Signal",
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
      userId: customerUser.id,
      fullName: "Rahul Sharma (Work)",
      phone: "+91 99887 76655",
      houseNumber: "Tower C, 6th Floor",
      street: "Bagmane Tech Park, CV Raman Nagar",
      area: "Byrasandra",
      landmark: "Opposite Lake View Gate",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560093",
      country: "India",
      isDefault: false,
      type: "WORK",
    },
  });

  // Store Payment Settings (Warish Raj Jio Payments Bank & UPI ID)
  await prisma.paymentSetting.create({
    data: {
      id: "default-setting",
      upiId: "9835400188-k322-3@ibl",
      upiQrImage: "/payments/bajrangi_upi_qr.jpg",
      accountHolder: "Warish Raj",
      accountNumber: "000521713102565",
      ifscCode: "JIOP0000001",
      bankName: "Jio Payments Bank",
      paymentInstructions: "Scan the PhonePe / Jio Payments QR code or transfer directly to Warish Raj (Jio Payments Bank). Upload your 12-digit UTR reference number for instant verification.",
      isUpiActive: true,
      isBankTransferActive: true,
      isCodActive: true,
      isWalletActive: true,
    },
  });

  // Categories & 50+ Products per category
  console.log("Seeding categories and 50+ products per category...");
  let totalCreatedProducts = 0;

  for (const catDef of categoryDefinitions) {
    const category = await prisma.category.create({
      data: {
        name: catDef.name,
        slug: catDef.slug,
        description: catDef.description,
        icon: catDef.icon,
        featured: true,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600",
      },
    });

    const items = generate52ItemsForCategory(catDef.slug);
    const productPayloads = createProductsForCategory(category.id, catDef.slug, sellerProfile.id, items);

    for (const prodData of productPayloads) {
      const { images, variants, ...prodFields } = prodData;

      await prisma.product.create({
        data: {
          ...prodFields,
          images: {
            create: images.map((img, i) => ({
              url: img.url,
              isPrimary: img.isPrimary ?? (i === 0),
              sortOrder: i,
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

      totalCreatedProducts++;
    }
    console.log(`Created ${items.length} products for [${catDef.name}]`);
  }

  console.log(`Total products seeded: ${totalCreatedProducts}`);

  // Create standard coupons
  await prisma.coupon.createMany({
    data: [
      { code: "FREESHIP", description: "Zero Delivery Fee on orders above ₹499", discountType: "FIXED", discountValue: 80, minOrderAmount: 499, isActive: true },
      { code: "WELCOME10", description: "Flat 10% instant discount for new shoppers", discountType: "PERCENT", discountValue: 10, minOrderAmount: 999, maxDiscount: 500, isActive: true },
      { code: "BAJRANGI500", description: "Flat ₹500 off on festive orders above ₹3,999", discountType: "FIXED", discountValue: 500, minOrderAmount: 3999, isActive: true },
      { code: "FESTIVE25", description: "Mega 25% Off on Electronics & Lifestyle", discountType: "PERCENT", discountValue: 25, minOrderAmount: 2499, maxDiscount: 1500, isActive: true },
    ],
  });

  // Create sample verified order with Secret Doorstep Delivery OTP
  const sampleProduct = await prisma.product.findFirst({
    where: { brand: "Samsung" },
    include: { images: true, variants: true },
  });

  if (sampleProduct) {
    const deliveryWorker = await prisma.deliveryProfile.findFirst();
    const orderNumber = "BJR-2026-8819";
    const order = await prisma.order.create({
      data: {
        orderNumber: orderNumber,
        userId: customerUser.id,
        deliveryWorkerId: deliveryWorker ? deliveryWorker.id : null,
        totalAmount: sampleProduct.basePrice,
        discountAmount: sampleProduct.basePrice - sampleProduct.salePrice,
        shippingFee: 0,
        taxAmount: 0,
        finalAmount: sampleProduct.salePrice,
        status: "OUT_FOR_DELIVERY",
        paymentStatus: "PAID",
        paymentMethod: "UPI_QR",
        transactionId: "202688192301",
        deliveryOtp: "8942", // Secret doorstep delivery OTP
        shippingAddress: JSON.stringify({
          fullName: addr1.fullName,
          phone: addr1.phone,
          houseNumber: addr1.houseNumber,
          street: addr1.street,
          city: addr1.city,
          state: addr1.state,
          postalCode: addr1.postalCode,
        }),
        items: {
          create: [
            {
              productId: sampleProduct.id,
              productTitle: sampleProduct.title,
              productImage: sampleProduct.images[0]?.url || "",
              price: sampleProduct.salePrice,
              quantity: 1,
              total: sampleProduct.salePrice,
            },
          ],
        },
        timeline: {
          create: [
            { status: "ORDER_PLACED", title: "Order Placed", description: "Order received on BajrangiStore" },
            { status: "CONFIRMED", title: "Payment Verified", description: "UPI payment approved (UTR: 202688192301)" },
            { status: "PACKED", title: "Packed by Seller", description: "Apex Digital Retailers packaged your parcel" },
            { status: "OUT_FOR_DELIVERY", title: "Out for Doorstep Delivery", description: "Rider Ramesh Kumar is en route with your shipment" },
          ],
        },
      },
    });

    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        userId: customerUser.id,
        amount: sampleProduct.salePrice,
        paymentMethod: "UPI_QR",
        transactionRef: "202688192301",
        status: "APPROVED",
        verifiedBy: adminUser.id,
        verifiedAt: new Date(),
        adminNote: "Verified against Warish Raj Jio Payments Bank statement",
      },
    });
  }

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
