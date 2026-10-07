const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BajrangiStore multi-role production ecosystem...");

  // Clean existing tables
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

  // 1. Core Users for the 4 Roles
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
      name: "Vikram Singhania (Apex Electronics)",
      email: "seller@bajrangistore.com",
      passwordHash: sellerPassword,
      role: "SELLER",
      phone: "+91 98111 22334",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      walletBalance: 8400,
    },
  });

  const deliveryUser = await prisma.user.create({
    data: {
      name: "Ramesh Kumar (Express Rider)",
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
      walletBalance: 2500, // Preloaded ₹2,500 wallet balance for demo!
    },
  });

  // 2. Seller Profile
  const sellerProfile = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser.id,
      storeName: "Apex Digital Retailers",
      storeSlug: "apex-digital",
      description: "Authorized flagship distributor for premium smartphones, acoustics, laptops, and certified electronics on BajrangiStore.",
      logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
      rating: 4.9,
      totalSales: 4890,
      gstNumber: "29AABCS8942P1Z8",
      panNumber: "AABCS8942P",
      bankAccount: "Jio Payments Bank •••• 2565",
      commissionRate: 5.0,
      phone: "+91 98111 22334",
    },
  });

  // 3. Delivery Worker Profile
  const deliveryProfile = await prisma.deliveryProfile.create({
    data: {
      userId: deliveryUser.id,
      vehicleType: "BIKE",
      vehicleNumber: "KA-05-EX-4891",
      licenseNumber: "DL-KA0520210089421",
      isOnline: true,
      currentCity: "Bengaluru",
      activeDeliveriesCount: 1,
      completedDeliveriesCount: 142,
      totalEarnings: 18450,
      rating: 4.95,
    },
  });

  // 4. Store Payment Settings
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

  // 5. Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: customerUser.id,
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
      userId: customerUser.id,
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

  // 6. Categories
  const catElectronics = await prisma.category.create({
    data: {
      name: "Electronics & Smart Tech",
      slug: "electronics",
      description: "Flagship phones, pro laptops, cameras & smart wearables",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      icon: "Smartphone",
      featured: true,
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: "Fashion & Lifestyle",
      slug: "fashion",
      description: "Contemporary streetwear, luxury chronographs & leather jackets",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
      icon: "Shirt",
      featured: true,
    },
  });

  const catAudio = await prisma.category.create({
    data: {
      name: "Audio & Acoustics",
      slug: "audio-sound",
      description: "Hi-Res noise cancelling headphones & spatial soundbars",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      icon: "Headphones",
      featured: true,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: "Home & Appliances",
      slug: "home-living",
      description: "Smart kitchen coffee robotics & ergonomic living decor",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
      icon: "Home",
      featured: true,
    },
  });

  const catSports = await prisma.category.create({
    data: {
      name: "Fitness & Outdoors",
      slug: "sports-fitness",
      description: "Pro trail runners, multisport GPS watches & athletic gear",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      icon: "Activity",
      featured: true,
    },
  });

  const catBeauty = await prisma.category.create({
    data: {
      name: "Beauty & Grooming",
      slug: "beauty-grooming",
      description: "Botanical night renewal elixirs & luxury grooming",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      icon: "Sparkles",
      featured: true,
    },
  });

  // 7. Products
  const products = [
    {
      title: "Bajrangi Titanium Ultra 16 Flagship 5G (512GB Storage, 16GB RAM)",
      slug: "bajrangi-titanium-ultra-16-5g",
      brand: "Bajrangi Tech",
      sku: "BJR-TIT-ULTRA16",
      categoryId: catElectronics.id,
      sellerId: sellerProfile.id,
      basePrice: 89999,
      salePrice: 79999,
      discountPercent: 11,
      rating: 4.95,
      reviewCount: 512,
      stock: 35,
      isFeatured: true,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "smartphone,flagship,5g,camera,titanium",
      description: "Engineered for pure speed and unbreakable resilience. Powered by the next-gen 3nm AI processor, aerospace titanium alloy frame, 200MP Quad Camera with 100x Space Zoom, and 120W HyperSpeed charging.",
      highlights: JSON.stringify([
        "6.8-inch QHD+ 144Hz Adaptive LTPO Dynamic AMOLED (3200 nits peak)",
        "Octa-Core 3nm Ultra Neural Chipset with ray tracing",
        "200MP Quad Camera with 10x Optical Periscope Zoom & 8K Dolby Vision",
        "5,500mAh Solid-State Battery with 120W wired + 50W wireless warp charge",
        "IP68 Water/Dust resistance with Sapphire Armor glass"
      ]),
      specs: JSON.stringify({
        "Processor": "3nm Octa-Core High-Octane Silicon",
        "Display": "6.8\" Quad HD+ 144Hz Curved AMOLED",
        "RAM / ROM": "16GB LPDDR5X + 512GB UFS 4.0",
        "Camera": "200MP OIS + 50MP Ultra-Wide + 48MP Telephoto",
        "Battery": "5,500 mAh (0 to 100% in 18 minutes)",
        "Warranty": "2 Years Official Brand Doorstep Warranty"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Space Titanium / 512GB", sku: "BJR-16-TIT-512", price: 89999, salePrice: 79999, stock: 20, attributes: JSON.stringify({ color: "Titanium", storage: "512GB" }) },
        { name: "Saffron Gold / 512GB", sku: "BJR-16-GLD-512", price: 92999, salePrice: 82999, stock: 15, attributes: JSON.stringify({ color: "Saffron Gold", storage: "512GB" }) },
      ]
    },
    {
      title: "Bajrangi Pulse ANC Studio Over-Ear Headphones (Spatial Audio)",
      slug: "bajrangi-pulse-anc-studio-headphones",
      brand: "Bajrangi Audio",
      sku: "BJR-PULSE-ANC",
      categoryId: catAudio.id,
      sellerId: sellerProfile.id,
      basePrice: 24999,
      salePrice: 16999,
      discountPercent: 32,
      rating: 4.88,
      reviewCount: 380,
      stock: 55,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: true,
      flashDealEndsAt: new Date(Date.now() + 24 * 3600 * 1000),
      tags: "audio,headphones,anc,bluetooth,spatial",
      description: "Experience pristine high-fidelity soundscapes. Custom 45mm Bio-Cellulose acoustic drivers, 48dB hybrid active noise cancellation, lossless LDAC wireless audio, and 60-hour marathon battery life.",
      highlights: JSON.stringify([
        "Industry-leading 48dB Hybrid Adaptive Active Noise Cancellation",
        "Spatial 360 Audio with dynamic head-tracking",
        "60 Hours continuous playback with USB-C quick charge (10 min = 6 hrs)",
        "Memory foam protein leather earcups with pressure-relief headband"
      ]),
      specs: JSON.stringify({
        "Drivers": "45mm Neodymium Bio-Cellulose",
        "ANC Reduction": "Up to 48dB with 8 AI environmental mics",
        "Battery Stamina": "60 Hours (ANC Off) / 45 Hours (ANC On)",
        "Bluetooth": "Bluetooth 5.4 with Multipoint connection"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Matte Midnight Black", sku: "BJR-ANC-BLK", price: 24999, salePrice: 16999, stock: 35, attributes: JSON.stringify({ color: "Midnight Black" }) },
        { name: "Saffron Accents Edition", sku: "BJR-ANC-GLD", price: 25999, salePrice: 17999, stock: 20, attributes: JSON.stringify({ color: "Saffron Edition" }) },
      ]
    },
    {
      title: "ZenithBook M4 Pro 16\" Studio Laptop (32GB RAM, 1TB SSD, 3.5K OLED)",
      slug: "zenithbook-m4-pro-studio-laptop",
      brand: "Zenith Pro",
      sku: "ZEN-M4PRO-16",
      categoryId: catElectronics.id,
      sellerId: sellerProfile.id,
      basePrice: 189999,
      salePrice: 169999,
      discountPercent: 10,
      rating: 4.96,
      reviewCount: 194,
      stock: 18,
      isFeatured: true,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "laptop,creator,workstation,oled,32gb",
      description: "Built for heavy compile workflows, 3D modeling, 8K video timelines, and machine learning. Featuring 16.2-inch 3.5K 120Hz Liquid OLED, 14-core workstation processor, and silent vapor-chamber cooling.",
      highlights: JSON.stringify([
        "16.2-inch 3.5K 120Hz Liquid OLED panel (1600 nits HDR)",
        "14-Core High Performance creator chip with hardware ray tracing",
        "32GB Unified Memory + 1TB PCIe Gen5 NVMe SSD",
        "All-day 18-hour battery life with 140W fast GaN charger"
      ]),
      specs: JSON.stringify({
        "Display": "16.2\" 3456x2234 Liquid OLED 120Hz ProMotion",
        "CPU / GPU": "14-Core CPU, 30-Core GPU Neural Engine",
        "Memory": "32GB High-Bandwidth Unified",
        "Storage": "1TB Gen5 NVMe SSD (7400 MB/s)"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Space Gray / 32GB / 1TB", sku: "ZEN-16-32-1TB", price: 189999, salePrice: 169999, stock: 18, attributes: JSON.stringify({ color: "Space Gray", ram: "32GB" }) },
      ]
    },
    {
      title: "Bajrangi Kronos Carbon Chronograph Automatic Watch",
      slug: "bajrangi-kronos-carbon-chronograph-watch",
      brand: "Bajrangi Horology",
      sku: "BJR-KRONOS-CARBON",
      categoryId: catFashion.id,
      sellerId: sellerProfile.id,
      basePrice: 34999,
      salePrice: 24999,
      discountPercent: 28,
      rating: 4.82,
      reviewCount: 110,
      stock: 25,
      isFeatured: true,
      isDealOfTheDay: false,
      isFlashDeal: true,
      flashDealEndsAt: new Date(Date.now() + 18 * 3600 * 1000),
      tags: "watch,luxury,fashion,automatic,carbon",
      description: "Forged from aerospace carbon fiber and surgical 316L stainless steel. Encased with scratchproof double-domed sapphire crystal, 28-jewel automatic movement, and vulcanized FKM sports strap.",
      highlights: JSON.stringify([
        "Forged Carbon fiber bezel with aerospace 316L stainless steel",
        "28-Jewel automatic self-winding movement with 48h power reserve",
        "Anti-reflective scratchproof sapphire crystal glass",
        "100M / 10 ATM Water Resistance rating"
      ]),
      specs: JSON.stringify({
        "Case Diameter": "42 mm",
        "Case Thickness": "11.8 mm",
        "Glass": "Double-Domed Anti-Reflective Sapphire Crystal",
        "Water Resistance": "100 Meters / 10 ATM"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=80", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&auto=format&fit=crop&q=80", isPrimary: false },
      ],
      variants: [
        { name: "Stealth Carbon Black", sku: "BJR-CRB-BLK", price: 34999, salePrice: 24999, stock: 25, attributes: JSON.stringify({ color: "Stealth Black" }) },
      ]
    },
    {
      title: "OmniStrides Nitro Pro Trail Running Shoes",
      slug: "omnistrides-nitro-pro-trail-running-shoes",
      brand: "OmniStrides",
      sku: "OMNI-NITRO-PRO",
      categoryId: catSports.id,
      sellerId: sellerProfile.id,
      basePrice: 8999,
      salePrice: 5499,
      discountPercent: 38,
      rating: 4.7,
      reviewCount: 240,
      stock: 60,
      isFeatured: false,
      isDealOfTheDay: false,
      isFlashDeal: false,
      tags: "shoes,running,sports,trail,marathon",
      description: "Built for endurance and speed across rugged trails and urban marathons. Features supercritical nitrogen foam, carbon propulsion plate, and Vibram Megagrip traction soles.",
      highlights: JSON.stringify([
        "Supercritical nitrogen-infused EVA midsole with 80% energy return",
        "Full-length curved carbon propulsion plate for smoother forward rolling",
        "Vibram Megagrip 4.5mm multi-terrain traction lug soles"
      ]),
      specs: JSON.stringify({
        "Drop": "8mm (Heel 36mm / Forefoot 28mm)",
        "Weight": "235 grams (Size 9)",
        "Upper": "Engineered Ripstop Breathable Mesh"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=80", isPrimary: true },
      ],
      variants: [
        { name: "Crimson Blaze / Size 9 UK", sku: "OMNI-RED-9UK", price: 8999, salePrice: 5499, stock: 30, attributes: JSON.stringify({ color: "Crimson Blaze", size: "9 UK" }) },
        { name: "Crimson Blaze / Size 10 UK", sku: "OMNI-RED-10UK", price: 8999, salePrice: 5499, stock: 30, attributes: JSON.stringify({ color: "Crimson Blaze", size: "10 UK" }) },
      ]
    },
    {
      title: "RoboChef Smart Barista 19-Bar Espresso Machine",
      slug: "robochef-smart-barista-espresso-machine",
      brand: "RoboChef",
      sku: "ROBO-BARISTA-19",
      categoryId: catHome.id,
      sellerId: sellerProfile.id,
      basePrice: 42999,
      salePrice: 31999,
      discountPercent: 25,
      rating: 4.88,
      reviewCount: 165,
      stock: 22,
      isFeatured: true,
      isDealOfTheDay: true,
      isFlashDeal: false,
      tags: "kitchen,coffee,espresso,smart home",
      description: "Café-quality lattes and espresso shots with touch of a button. Features dual thermo-block boilers, 19-bar Italian pressure pump, integrated conical burr grinder, and automatic microfoam milk steaming.",
      highlights: JSON.stringify([
        "Commercial 19-bar Italian pressure pump with digital PID temperature control",
        "Integrated stainless steel conical burr grinder with 30 micro-adjustments",
        "Automatic steam wand creating silky velvet microfoam for latte art"
      ]),
      specs: JSON.stringify({
        "Pump": "19 Bar Italian Ulka",
        "Boilers": "Dual Thermo-Block with 3-second rapid warmup",
        "Tank": "2.2L Removable Water Reservoir"
      }),
      images: [
        { url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=900&auto=format&fit=crop&q=80", isPrimary: true },
      ],
      variants: [
        { name: "Brushed Steel Edition", sku: "ROBO-STEEL-19", price: 42999, salePrice: 31999, stock: 22, attributes: JSON.stringify({ finish: "Brushed Steel" }) },
      ]
    },
  ];

  for (const item of products) {
    const { images, variants, ...prodFields } = item;
    const createdProduct = await prisma.product.create({
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

    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: customerUser.id,
        rating: 5,
        title: "Spectacular performance and unmatched doorstep delivery speed!",
        comment: "Received the package within 18 hours in tamper-evident sealed packaging. Verified by OTP with delivery agent Ramesh. Premium build and exceptional performance!",
        helpfulCount: 38,
        verifiedPurchase: true,
      },
    });
  }

  // 8. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "BAJRANGI1000",
        description: "Flat ₹1,000 off on all carts above ₹9,999",
        discountType: "FIXED",
        discountValue: 1000,
        minOrderAmount: 9999,
        maxDiscount: 1000,
        isActive: true,
      },
      {
        code: "BAJRANGI50",
        description: "50% off on your order up to ₹500",
        discountType: "PERCENT",
        discountValue: 50,
        minOrderAmount: 999,
        maxDiscount: 500,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free express delivery across India",
        discountType: "FIXED",
        discountValue: 70,
        minOrderAmount: 499,
        maxDiscount: 70,
        isActive: true,
      },
    ],
  });

  // 9. Hero Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Bajrangi Grand Festival 2026",
        subtitle: "Up to 70% Off on Flagship Phones, Studio OLED Laptops & Chronographs",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop&q=80",
        link: "/products",
        buttonText: "Shop Grand Deals",
        badge: "SACRED TRUST • HYPER SPEED",
        type: "HERO",
        sortOrder: 1,
      },
      {
        title: "Titanium Ultra 16 Flagship",
        subtitle: "The Ultimate 3nm Powerhouse with 200MP Quad Camera & 120W Warp Charge",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600&auto=format&fit=crop&q=80",
        link: "/products/bajrangi-titanium-ultra-16-5g",
        buttonText: "Discover Power",
        badge: "FLAGSHIP LAUNCH",
        type: "HERO",
        sortOrder: 2,
      },
      {
        title: "Audiophile Soundscapes",
        subtitle: "48dB Adaptive Noise Cancellation & 60-Hour Battery from ₹16,999",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1600&auto=format&fit=crop&q=80",
        link: "/category/audio-sound",
        buttonText: "Hear the Difference",
        badge: "SPATIAL AUDIO",
        type: "HERO",
        sortOrder: 3,
      },
    ],
  });

  // 10. Sample Orders illustrating all multi-role lifecycle stages:
  const firstProd = await prisma.product.findFirst({
    include: { variants: true, images: true },
  });

  // Order 1: Assigned to Delivery Worker, currently OUT_FOR_DELIVERY with OTP 8942!
  const liveOrder = await prisma.order.create({
    data: {
      orderNumber: "BJR-2026-8942",
      userId: customerUser.id,
      deliveryWorkerId: deliveryProfile.id,
      totalAmount: 16999,
      discountAmount: 1000,
      shippingFee: 0,
      taxAmount: 850,
      finalAmount: 16849,
      status: "OUT_FOR_DELIVERY",
      paymentStatus: "PAID",
      paymentMethod: "UPI_QR",
      transactionId: "UTR-9835400188-7841",
      deliveryOtp: "8942",
      trackingNumber: "BJR-EXP-9921448",
      courierName: "Bajrangi Express Logistics",
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
            productId: firstProd.id,
            productTitle: "Bajrangi Pulse ANC Studio Over-Ear Headphones",
            variantName: "Matte Midnight Black",
            productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
            price: 16999,
            quantity: 1,
            total: 16999,
          },
        ],
      },
      timeline: {
        create: [
          {
            status: "ORDER_PLACED",
            title: "Order Placed & Verified",
            description: "Paid via UPI QR (UTR: UTR-9835400188-7841). Verified by Admin Receiving Center.",
            location: "Bajrangi Payment Gateway",
            timestamp: new Date(Date.now() - 6 * 3600 * 1000),
          },
          {
            status: "PACKED",
            title: "Packed by Seller",
            description: "Apex Digital Retailers packed item in tamper-proof bubble seal.",
            location: "Apex Fulfillment Hub, Koramangala",
            timestamp: new Date(Date.now() - 4 * 3600 * 1000),
          },
          {
            status: "ASSIGNED_TO_DELIVERY",
            title: "Assigned to Delivery Partner Ramesh Kumar",
            description: "Rider dispatched on Hero Splendor (KA-05-EX-4891).",
            location: "Bengaluru Hub",
            timestamp: new Date(Date.now() - 2 * 3600 * 1000),
          },
          {
            status: "OUT_FOR_DELIVERY",
            title: "Out for Doorstep Delivery",
            description: "Agent Ramesh Kumar is en route with your package. Share Delivery OTP: 8942 upon arrival.",
            location: "Indiranagar Circle",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
          },
        ],
      },
    },
  });

  // Payment Transaction for Order 1
  await prisma.paymentTransaction.create({
    data: {
      orderId: liveOrder.id,
      userId: customerUser.id,
      amount: 16849,
      paymentMethod: "UPI_QR",
      transactionRef: "UTR-9835400188-7841",
      status: "APPROVED",
      verifiedBy: adminUser.id,
      adminNote: "Verified against Jio Payments Bank statement (Warish Raj). Approved.",
    },
  });

  // Order 2: In PROCESSING, ready for delivery assignment
  const pendingOrder = await prisma.order.create({
    data: {
      orderNumber: "BJR-2026-7731",
      userId: customerUser.id,
      totalAmount: 79999,
      discountAmount: 1000,
      shippingFee: 0,
      taxAmount: 4000,
      finalAmount: 82999,
      status: "PACKED",
      paymentStatus: "PENDING_VERIFICATION",
      paymentMethod: "BANK_TRANSFER",
      transactionId: "BANK-NEFT-9841029410",
      deliveryOtp: "5512",
      trackingNumber: "BJR-EXP-773199",
      courierName: "Bajrangi HyperLogistics",
      shippingAddress: JSON.stringify({
        fullName: "Rahul Sharma",
        phone: "+91 99887 76655",
        street: "Tower B, 7th Floor, Prestige Tech Cloud Park, Marathahalli",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560103",
        country: "India",
      }),
      items: {
        create: [
          {
            productId: firstProd.id,
            productTitle: "Bajrangi Titanium Ultra 16 Flagship 5G",
            variantName: "Space Titanium / 512GB",
            productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900",
            price: 79999,
            quantity: 1,
            total: 79999,
          },
        ],
      },
      timeline: {
        create: [
          {
            status: "ORDER_PLACED",
            title: "Order Placed - Bank Transfer UTR Submitted",
            description: "Buyer submitted NEFT ref: BANK-NEFT-9841029410 to Jio Payments Bank account.",
            location: "Bajrangi Payment Portal",
          },
          {
            status: "PACKED",
            title: "Packed & Ready for Delivery Pickup",
            description: "Awaiting delivery worker assignment in Admin Controller.",
            location: "Apex Warehouse Hub",
          },
        ],
      },
    },
  });

  // Pending Transaction in Admin Receiving Center
  await prisma.paymentTransaction.create({
    data: {
      orderId: pendingOrder.id,
      userId: customerUser.id,
      amount: 82999,
      paymentMethod: "BANK_TRANSFER",
      transactionRef: "BANK-NEFT-9841029410",
      status: "PENDING_VERIFICATION",
      adminNote: "Customer submitted bank transfer to Warish Raj (000521713102565). Awaiting admin confirmation.",
    },
  });

  // 11. Support Ticket
  await prisma.supportTicket.create({
    data: {
      ticketNumber: "TCK-BJR-901",
      userId: customerUser.id,
      subject: "Address delivery slot preference request for order BJR-2026-8942",
      category: "DELIVERY",
      priority: "MEDIUM",
      status: "OPEN",
      messages: JSON.stringify([
        {
          sender: "CUSTOMER",
          text: "Hi BajrangiStore team, please deliver my package after 3 PM as I will be in office meetings until then.",
          timestamp: new Date(Date.now() - 2 * 3600 * 1000),
        },
        {
          sender: "AGENT",
          text: "Hello Rahul! We have alerted our assigned delivery rider Ramesh Kumar. He will coordinate delivery after 3 PM.",
          timestamp: new Date(Date.now() - 1 * 3600 * 1000),
        },
      ]),
    },
  });

  // 12. Customer Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: customerUser.id,
        title: "Rider is Out for Delivery! 🚀",
        message: "Rider Ramesh Kumar is en route with order BJR-2026-8942. Please share OTP 8942 upon arrival.",
        type: "DELIVERY",
        link: "/account/orders/BJR-2026-8942",
      },
      {
        userId: customerUser.id,
        title: "Welcome Bonus: ₹500 in your BajrangiStore Wallet! 🎁",
        message: "Use your wallet balance at checkout for instant 1-click deductions.",
        type: "PROMO",
        link: "/account",
      },
    ],
  });

  console.log("BajrangiStore seeded successfully with all 4 roles, real payment configs, and live orders!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
