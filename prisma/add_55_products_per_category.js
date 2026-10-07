const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Expanded brand pool & unique item templates for all 10 categories
const newCatalogData = {
  "mobiles-tablets": [
    { title: "Apple iPhone 15 Plus (128GB Storage, Pink)", brand: "Apple", mrp: 89900, discountPercent: 11, specs: { Display: "6.7\" Super Retina XDR", Processor: "A16 Bionic", Battery: "All-day battery life", Camera: "48MP Dual Camera" } },
    { title: "Apple iPhone 13 (128GB, Starlight White)", brand: "Apple", mrp: 59900, discountPercent: 18, specs: { Display: "6.1\" Super Retina XDR", Processor: "A15 Bionic", Camera: "12MP Dual System with Cinematic Mode" } },
    { title: "Apple iPad Mini 6th Gen (8.3\" Liquid Retina, 64GB, Purple)", brand: "Apple", mrp: 49900, discountPercent: 8, specs: { Display: "8.3\" Liquid Retina", Chip: "A15 Bionic", ApplePencil: "Pencil 2 Support" } },
    { title: "Samsung Galaxy S23 FE 5G (Mint, 128GB Storage)", brand: "Samsung", mrp: 54999, discountPercent: 32, specs: { Display: "6.4\" Dynamic AMOLED 2X 120Hz", Camera: "50MP OIS Triple Cam", RAM: "8GB" } },
    { title: "Samsung Galaxy A35 5G (Awesome Lilac, 128GB)", brand: "Samsung", mrp: 30999, discountPercent: 15, specs: { Display: "6.6\" FHD+ Super AMOLED 120Hz", Camera: "50MP OIS Triple", Battery: "5000mAh" } },
    { title: "Samsung Galaxy M34 5G (Prism Silver, 6000mAh Battery)", brand: "Samsung", mrp: 24499, discountPercent: 35, specs: { Display: "120Hz Super AMOLED", Battery: "6000mAh Monster", Camera: "50MP No Shake Cam" } },
    { title: "Samsung Galaxy Tab A9+ 11\" (Wi-Fi, 64GB, Graphite)", brand: "Samsung", mrp: 20999, discountPercent: 28, specs: { Display: "11.0\" 90Hz Display", Sound: "Quad Speakers Dolby Atmos", RAM: "4GB" } },
    { title: "OnePlus 12R 5G (Cool Blue, 16GB RAM, 256GB Storage)", brand: "OnePlus", mrp: 45999, discountPercent: 10, specs: { Display: "1.5K 120Hz ProXDR 4th Gen LTPO", Chip: "Snapdragon 8 Gen 2", Battery: "5500mAh 100W SUPERVOOC" } },
    { title: "OnePlus Nord 3 5G (Tempest Gray, 128GB)", brand: "OnePlus", mrp: 33999, discountPercent: 24, specs: { Processor: "MediaTek Dimensity 9000", Camera: "50MP Sony IMX890 OIS", Display: "120Hz Super Fluid AMOLED" } },
    { title: "OnePlus Pad 2 (12.1\" 3K 144Hz, Snapdragon 8 Gen 3)", brand: "OnePlus", mrp: 42999, discountPercent: 7, specs: { Screen: "12.1\" 3K 144Hz 7:5 Ratio", Audio: "6-Speaker Sound System", Battery: "9510mAh 67W" } },
    { title: "Google Pixel 8a (128GB, Aloe Green, Google AI)", brand: "Google", mrp: 52999, discountPercent: 12, specs: { Processor: "Google Tensor G3", Camera: "64MP + 13MP Ultra-wide", AI: "Best Take, Magic Editor" } },
    { title: "Google Pixel 7 Pro (12GB RAM, 128GB, Hazel)", brand: "Google", mrp: 84999, discountPercent: 38, specs: { Display: "6.7\" QHD+ LTPO 120Hz", Camera: "5x Optical Telephoto 30x Super Res Zoom" } },
    { title: "Xiaomi Redmi 13C 5G (Startrail Green, 128GB)", brand: "Xiaomi", mrp: 13999, discountPercent: 25, specs: { Processor: "Dimensity 6100+ 5G", Display: "90Hz 6.74\" HD+", Battery: "5000mAh" } },
    { title: "Xiaomi Pad 6 (11\" 2.8K 144Hz, Snapdragon 870, 128GB)", brand: "Xiaomi", mrp: 28999, discountPercent: 21, specs: { Display: "11\" 2.8K 144Hz 1 Billion Colors", Audio: "Quad Speakers Dolby Atmos" } },
    { title: "Vivo V30 Pro 5G (ZEISS Triple Main Camera, Classic Black)", brand: "Vivo", mrp: 46999, discountPercent: 12, specs: { Camera: "50MP Sony IMX920 ZEISS OIS", Display: "1.5K 120Hz 3D Curved AMOLED" } },
    { title: "Vivo T3 5G (Cosmic Blue, 128GB, Sony OIS Camera)", brand: "Vivo", mrp: 22999, discountPercent: 18, specs: { Processor: "Dimensity 7200 4nm", Display: "120Hz AMOLED 1800 nits" } },
    { title: "Realme GT 6T 5G (Fluid Silver, 256GB, Snapdragon 7+ Gen 3)", brand: "Realme", mrp: 35999, discountPercent: 14, specs: { Screen: "6000 nits Ultra Bright AMOLED", Charger: "120W SUPERVOOC Charge" } },
    { title: "Realme P1 5G (Phoenix Red, 128GB, Dimensity 7050)", brand: "Realme", mrp: 18999, discountPercent: 20, specs: { Screen: "120Hz AMOLED Rainwater Smart Touch", Battery: "5000mAh 45W Charge" } },
    { title: "Motorola Edge 50 Fusion (Marshmallow Blue Vegan Leather)", brand: "Motorola", mrp: 25999, discountPercent: 15, specs: { Screen: "144Hz Curved pOLED", Camera: "50MP Sony LYT-700C OIS", Rating: "IP68 Water Resistance" } },
    { title: "Motorola Moto G84 5G (Viva Magenta Vegan Leather, 256GB)", brand: "Motorola", mrp: 22999, discountPercent: 22, specs: { Display: "10-bit 120Hz pOLED", Audio: "Dolby Atmos Stereo", RAM: "12GB" } },
    { title: "Nothing Phone (2a) (128GB, Black, Glyph Interface)", brand: "Nothing", mrp: 25999, discountPercent: 8, specs: { Processor: "Dimensity 7200 Pro 4nm", OS: "Nothing OS 2.5 Clean", Camera: "50MP + 50MP Dual OIS" } },
    { title: "CMF Phone 1 by Nothing (Interchangeable Back, 128GB)", brand: "Nothing", mrp: 17999, discountPercent: 11, specs: { Design: "Modular Back Cover with Accessories", Screen: "120Hz Super AMOLED" } },
    { title: "iQOO Neo 9 Pro 5G (Fiery Red Dual Tone, 256GB)", brand: "iQOO", mrp: 41999, discountPercent: 14, specs: { Chip: "Snapdragon 8 Gen 2 with Supercomputing Q1", Camera: "50MP Sony IMX920 OIS" } },
    { title: "iQOO Z9 5G (Graphene Blue, 128GB, Dimensity 7200)", brand: "iQOO", mrp: 24999, discountPercent: 20, specs: { Screen: "120Hz Ultra-Bright AMOLED", Audio: "Dual Stereo Speakers 300% Volume" } },
    { title: "POCO F6 5G (Titanium, Snapdragon 8s Gen 3, 256GB)", brand: "POCO", mrp: 33999, discountPercent: 12, specs: { Chip: "Flagship Snapdragon 8s Gen 3 4nm", Screen: "1.5K 120Hz CrystalRes AMOLED" } },
    { title: "POCO M6 Pro 5G (Power Black, 128GB, Snapdragon 4 Gen 2)", brand: "POCO", mrp: 14999, discountPercent: 30, specs: { Screen: "6.79\" FHD+ 90Hz AdaptiveSync", Battery: "5000mAh 18W" } },
    { title: "Honor 200 Pro 5G (Ocean Cyan, Studio Portrait AI)", brand: "Honor", mrp: 64999, discountPercent: 15, specs: { Portrait: "Harcourt Studio Portrait AI Engine", Screen: "1.5K Quad-Curved Eye-Comfort OLED" } },
    { title: "Asus ROG Phone 8 Pro (Phantom Black, 512GB Gaming)", brand: "Asus", mrp: 104999, discountPercent: 10, specs: { Display: "165Hz LTPO AMOLED", Controls: "AirTrigger Ultrasonic Sensors", Cooling: "GameCool 8 System" } },
    { title: "Lenovo Tab P12 (12.7\" 3K Display, JBL Quad Speakers)", brand: "Lenovo", mrp: 34999, discountPercent: 23, specs: { Display: "12.7\" 3K (2944x1840)", Battery: "10200mAh", Stylus: "Lenovo Tab Pen Plus Included" } },
    { title: "Nokia G42 5G (So Purple, 128GB, QuickFix Repairable)", brand: "Nokia", mrp: 15999, discountPercent: 22, specs: { Camera: "50MP AI Triple Camera", Battery: "3-day 5000mAh Battery" } }
  ],
  "electronics-audio": [
    { title: "Sony WH-1000XM4 Industry Leading Noise Canceling Headphones", brand: "Sony", mrp: 29990, discountPercent: 33, specs: { Battery: "30 Hours ANC", Codec: "LDAC Hi-Res Audio", Mic: "Speak-to-Chat Technology" } },
    { title: "Sony WF-1000XM5 True Wireless Earbuds with Dual Processors", brand: "Sony", mrp: 29990, discountPercent: 20, specs: { Drivers: "Dynamic Driver X", Mics: "Multi-noise sensor mics with AI bone conduction" } },
    { title: "Sony HT-S40R 5.1ch Real Surround Sound Soundbar (600W)", brand: "Sony", mrp: 34990, discountPercent: 26, specs: { Channels: "5.1ch Real Surround Sound with Wireless Rear Speakers", Power: "600W Total Output" } },
    { title: "Sony Alpha 7 IV Full-Frame Hybrid Mirrorless Camera Body", brand: "Sony", mrp: 242490, discountPercent: 13, specs: { Sensor: "33MP Full-Frame Exmor R CMOS", Video: "4K 60p 10-Bit 4:2:2", Focus: "Real-time Eye AF" } },
    { title: "boAt Airdopes 141 True Wireless Earbuds (42H Playtime)", brand: "boAt", mrp: 4490, discountPercent: 78, specs: { Playtime: "42 Hours Combined", Latency: "ENx Environmental Noise Cancellation with BEAST Mode" } },
    { title: "boAt Rockerz 550 Over-Ear Wireless Headphones (50mm Drivers)", brand: "boAt", mrp: 4999, discountPercent: 64, specs: { Drivers: "50mm Dynamic Audio Drivers", Battery: "20 Hours Continuous Playback" } },
    { title: "boAt Stone 1200 14W Portable Bluetooth Speaker with RGB", brand: "boAt", mrp: 6990, discountPercent: 43, specs: { Power: "14W Signature Stereo Sound", Waterproof: "IPX7 Water Resistance" } },
    { title: "JBL Flip 6 Waterproof Portable Bluetooth Speaker (Original Pro Sound)", brand: "JBL", mrp: 13999, discountPercent: 36, specs: { Protection: "IP67 Waterproof & Dustproof", Battery: "12 Hours Playtime", Sound: "2-Way Speaker System" } },
    { title: "JBL Bar 500 Pro Dolby Atmos 5.1ch Soundbar with Wireless Subwoofer", brand: "JBL", mrp: 54999, discountPercent: 27, specs: { Sound: "Dolby Atmos 3D Surround", Subwoofer: "10\" Wireless Bass Subwoofer", Power: "590W Output" } },
    { title: "JBL PartyBox 110 Portable Bluetooth Party Speaker (160W)", brand: "JBL", mrp: 35999, discountPercent: 25, specs: { Lighting: "Dynamic Light Show synced to beat", Battery: "12 Hours Built-in Rechargeable" } },
    { title: "Bose QuietComfort Ultra Wireless Noise Cancelling Headphones", brand: "Bose", mrp: 35900, discountPercent: 11, specs: { Audio: "World-class Active Noise Cancelling with Immersive Spatial Audio", Battery: "24 Hours Playtime" } },
    { title: "Bose SoundLink Flex Portable Bluetooth Outdoor Speaker (Stone Blue)", brand: "Bose", mrp: 15900, discountPercent: 12, specs: { PositionIQ: "PositionIQ Technology detects orientation", Rating: "IP67 Waterproof & Dustproof" } },
    { title: "Sennheiser Momentum 4 Wireless ANC Headphones (60H Battery)", brand: "Sennheiser", mrp: 34990, discountPercent: 29, specs: { Battery: "Astonishing 60-Hour Battery Life", Drivers: "42mm Transducer Audiophile Sound" } },
    { title: "Sennheiser HD 660S2 Open-Back Audiophile Studio Headphones", brand: "Sennheiser", mrp: 54990, discountPercent: 18, specs: { Design: "Open-Back Reference Class", Impedance: "300 Ohms Precision Transducers" } },
    { title: "Marshall Emberton II Portable Bluetooth Speaker (Black and Brass)", brand: "Marshall", mrp: 17499, discountPercent: 14, specs: { Sound: "True Stereophonic 360 Sound", Battery: "30+ Hours Portable Playback" } },
    { title: "Marshall Stanmore III Iconic Home Bluetooth Speaker", brand: "Marshall", mrp: 41999, discountPercent: 10, specs: { Acoustics: "Wider Soundstage with Tweeters angled outwards", Pairing: "Bluetooth 5.2 & RCA Inputs" } },
    { title: "Harman Kardon Onyx Studio 8 Wireless Bluetooth Speaker", brand: "Harman Kardon", mrp: 29999, discountPercent: 33, specs: { Materials: "Anodized Aluminum Handle with Eco Fabric", Sound: "Self-Tuning Acoustic Calibration" } },
    { title: "Canon EOS R50 Mirrorless Vlogging Camera with 18-45mm Lens", brand: "Canon", mrp: 75995, discountPercent: 17, specs: { Sensor: "24.2MP APS-C CMOS", Video: "Uncropped 6K Oversampled 4K 30p" } },
    { title: "GoPro HERO12 Black Waterproof Action Camera (5.3K60 Video)", brand: "GoPro", mrp: 44990, discountPercent: 18, specs: { Stabilization: "HyperSmooth 6.0 with 360 Horizon Lock", HDR: "High Dynamic Range 5.3K & 4K" } },
    { title: "Apple AirPods Pro 2 with USB-C MagSafe Charging Case", brand: "Apple", mrp: 24900, discountPercent: 8, specs: { Chip: "H2 Apple Silicon", ANC: "2x More Active Noise Cancellation", Audio: "Adaptive Audio" } },
    { title: "Apple AirPods Max Wireless Over-Ear Headphones (Silver)", brand: "Apple", mrp: 59900, discountPercent: 5, specs: { Drivers: "Apple-designed 40mm Dynamic Driver", Canopy: "Breathable Knit Mesh Canopy" } },
    { title: "Apple HomePod Mini Smart Siri Speaker (Space Gray)", brand: "Apple", mrp: 10900, discountPercent: 5, specs: { Sound: "360-Degree Computational Audio", Smart: "Siri Assistant with Smart Home Hub" } },
    { title: "Noise ColorFit Pro 5 Smartwatch with 1.85\" AMOLED & BT Calling", brand: "Noise", mrp: 8999, discountPercent: 61, specs: { Display: "1.85\" AMOLED with 600 nits brightness", Tracking: "Post-workout analytics & HR/SpO2" } },
    { title: "Insta360 X3 360 Action Camera with 1/2\" 48MP Sensors", brand: "Insta360", mrp: 45999, discountPercent: 15, specs: { Resolution: "5.7K 360 Video with Active HDR", Screen: "2.29\" Ultra-responsive Touchscreen" } },
    { title: "Audio-Technica ATH-M50xBT2 Wireless Over-Ear Monitor Headphones", brand: "Audio-Technica", mrp: 21500, discountPercent: 26, specs: { Drivers: "45mm Large-aperture Drivers", Battery: "Up to 50 Hours on full charge" } },
    { title: "Shure SM7B Cardioid Dynamic Broadcast Studio Vocal Microphone", brand: "Shure", mrp: 42999, discountPercent: 16, specs: { Pattern: "Cardioid Dynamic Frequency Response 50Hz-20kHz", Shielding: "Electromagnetic Hum Rejection" } },
    { title: "Anker Soundcore Motion+ 30W Hi-Res Bluetooth Speaker", brand: "Anker", mrp: 12999, discountPercent: 38, specs: { Audio: "Hi-Res Audio with Qualcomm aptX", Tweeters: "Ultra-wide frequency range 50Hz to 40kHz" } },
    { title: "Belkin BoostCharge 3-in-1 Fast Wireless Charging Station for Apple", brand: "Belkin", mrp: 14999, discountPercent: 20, specs: { Output: "15W MagSafe Fast Charging for iPhone, Watch & AirPods", Stand: "Premium Stainless Steel Finish" } },
    { title: "DJI Osmo Pocket 3 Gimbal Vlogging Camera (1\" CMOS Sensor)", brand: "DJI", mrp: 49990, discountPercent: 10, specs: { Sensor: "1-inch CMOS & 4K/120fps", Screen: "2\" Rotatable OLED Touchscreen" } },
    { title: "Realme Buds Air 6 Pro with Dual Drivers & 50dB ANC", brand: "Realme", mrp: 7999, discountPercent: 38, specs: { Drivers: "11mm Bass Driver + 6mm Micro-planar Tweeter", ANC: "50dB Smart Active Noise Cancellation" } }
  ],
  "laptops-computers": [
    { title: "Apple MacBook Air 13\" M3 Chip (16GB Unified RAM, 512GB SSD, Midnight)", brand: "Apple", mrp: 134900, discountPercent: 7, specs: { Chip: "Apple M3 8-core CPU, 10-core GPU", Screen: "13.6\" Liquid Retina with True Tone", Battery: "Up to 18 Hours" } },
    { title: "Apple MacBook Pro 14\" M3 Pro (18GB Unified RAM, 512GB, Space Black)", brand: "Apple", mrp: 199900, discountPercent: 5, specs: { Chip: "M3 Pro 11-core CPU, 14-core GPU", Display: "14.2\" Liquid Retina XDR 120Hz ProMotion" } },
    { title: "Apple Mac Mini M2 Chip (8GB RAM, 512GB SSD Fast Desktop)", brand: "Apple", mrp: 79900, discountPercent: 10, specs: { CPU: "M2 8-core CPU, 10-core GPU", Ports: "2x Thunderbolt 4, HDMI, USB-A, Gigabit Ethernet" } },
    { title: "Dell XPS 13 Plus 9320 OLED Touch Laptop (Intel Core i7 13th Gen, 16GB, 1TB)", brand: "Dell", mrp: 189990, discountPercent: 16, specs: { Display: "13.4\" 3.5K OLED InfinityEdge Touch", Keyboard: "Zero-lattice Keyboard with Capacitive Touch Row" } },
    { title: "Dell Alienware m16 R2 Gaming Laptop (Intel Ultra 7, RTX 4070 8GB, 32GB, 1TB)", brand: "Dell", mrp: 214990, discountPercent: 14, specs: { Screen: "16\" QHD+ 240Hz 3ms ComfortView Plus", GPU: "NVIDIA GeForce RTX 4070 140W TGP" } },
    { title: "Dell Inspiron 15 3520 (Intel Core i5 12th Gen, 16GB RAM, 512GB SSD, FHD 120Hz)", brand: "Dell", mrp: 61990, discountPercent: 24, specs: { CPU: "Intel Core i5-1235U 10-Core", Screen: "15.6\" FHD 120Hz Anti-glare", OS: "Windows 11 Home + MS Office" } },
    { title: "HP Spectre x360 2-in-1 14\" OLED Laptop (Intel Core Ultra 7 155H, 32GB, 1TB)", brand: "HP", mrp: 174999, discountPercent: 12, specs: { Screen: "14\" 2.8K 120Hz OLED Touch 16:10", Webcam: "9MP IR Camera with Auto Frame & Night Mode" } },
    { title: "HP Omen 16 Gaming Laptop (AMD Ryzen 7 7840HS, RTX 4060, 16GB, 1TB)", brand: "HP", mrp: 139999, discountPercent: 18, specs: { Screen: "16.1\" QHD 240Hz 3ms IPS", Cooling: "Omen Tempest Cooling Technology" } },
    { title: "HP Pavilion 15 (AMD Ryzen 5 7530U, 16GB RAM, 512GB SSD, Silver)", brand: "HP", mrp: 68999, discountPercent: 25, specs: { Display: "15.6\" FHD Micro-Edge Anti-Glare", Audio: "Audio by B&O Dual Speakers" } },
    { title: "Lenovo Legion Pro 5i Gaming Laptop (Intel Core i7 14th Gen, RTX 4070, 32GB, 1TB)", brand: "Lenovo", mrp: 198990, discountPercent: 15, specs: { Screen: "16\" WQXGA 240Hz 500 nits PureSight Gaming", AI: "Lenovo LA1 AI Chip Optimization" } },
    { title: "Lenovo ThinkPad X1 Carbon Gen 11 (Intel Core i7, 16GB, 1TB, Ultra Lightweight)", brand: "Lenovo", mrp: 219990, discountPercent: 20, specs: { Chassis: "Carbon Fiber & Magnesium 1.12kg", Security: "Fingerprint & IR Face Recognition" } },
    { title: "Lenovo IdeaPad Slim 3 15\" (Intel Core i5 13th Gen, 16GB, 512GB SSD)", brand: "Lenovo", mrp: 69990, discountPercent: 28, specs: { Durability: "Military Grade MIL-STD-810H Tested", RapidCharge: "15-min charge for 2 hours battery" } },
    { title: "Asus ROG Zephyrus G14 OLED Gaming Ultrabook (AMD Ryzen 9, RTX 4060, 16GB, 1TB)", brand: "Asus", mrp: 179990, discountPercent: 11, specs: { Screen: "14\" 3K 120Hz 0.2ms ROG Nebula OLED", Weight: "Ultra-thin 1.5kg CNC Aluminum Chassis" } },
    { title: "Asus Zenbook 14 OLED Ultraportable Laptop (Intel Core Ultra 7, 16GB, 1TB)", brand: "Asus", mrp: 124990, discountPercent: 14, specs: { Display: "14\" 3K 120Hz ASUS Lumina OLED", Battery: "75Wh All-Day Battery 1.2kg" } },
    { title: "Asus TUF Gaming F15 (Intel Core i5 11th Gen, RTX 2050 4GB, 16GB, 512GB)", brand: "Asus", mrp: 74990, discountPercent: 32, specs: { Screen: "15.6\" FHD 144Hz Adaptive-Sync", Keyboard: "RGB Backlit with Highlighted WASD" } },
    { title: "Acer Predator Helios 16 Gaming Laptop (Intel Core i9 14th Gen, RTX 4080 12GB)", brand: "Acer", mrp: 249999, discountPercent: 12, specs: { Screen: "16\" WQXGA 240Hz Mini-LED 1000 nits", Thermal: "Dual 5th Gen AeroBlade 3D Fans Liquid Metal" } },
    { title: "Acer Swift Go 14 AI Thin & Light Laptop (Intel Core Ultra 5, 16GB, 512GB)", brand: "Acer", mrp: 84999, discountPercent: 20, specs: { Screen: "14\" OLED WQXGA+ 90Hz", NPU: "Dedicated Intel AI Boost NPU" } },
    { title: "MSI Katana 15 Gaming Laptop (Intel Core i7 13th Gen, RTX 4050 6GB, 16GB, 1TB)", brand: "MSI", mrp: 112990, discountPercent: 25, specs: { Screen: "15.6\" FHD 144Hz IPS Level", Keyboard: "4-Zone RGB Gaming Keyboard with Number Pad" } },
    { title: "Logitech MX Master 3S Wireless Performance Mouse (8K DPI, Quiet Clicks)", brand: "Logitech", mrp: 10995, discountPercent: 18, specs: { Sensor: "Darkfield 8000 DPI tracks on glass", Scroll: "MagSpeed Electromagnetic Scrolling 1000 lines/sec" } },
    { title: "Logitech MX Keys S Wireless Advanced Illuminated Keyboard", brand: "Logitech", mrp: 12995, discountPercent: 15, specs: { Keys: "Spherically-dished Perfect Stroke keys", Lighting: "Smart illumination with proximity sensors" } },
    { title: "Logitech G502 HERO High Performance Wired Gaming Mouse (25K DPI)", brand: "Logitech", mrp: 5495, discountPercent: 36, specs: { Sensor: "HERO 25K Sensor 1:1 tracking", Weights: "5 customizable 3.6g weights included" } },
    { title: "Keychron K2 V2 Wireless Bluetooth Mechanical Keyboard (Hot-swappable, RGB)", brand: "Keychron", mrp: 9999, discountPercent: 15, specs: { Layout: "75% Compact 84-Key Layout", Switches: "Gateron G Pro Mechanical Switches Mac/Windows" } },
    { title: "Razer DeathAdder V3 Pro Wireless Ergonomic Esports Mouse", brand: "Razer", mrp: 16999, discountPercent: 23, specs: { Weight: "63g Ultra-lightweight Design", Sensor: "Focus Pro 30K Optical Sensor" } },
    { title: "Samsung 32\" Odyssey Neo G8 4K UHD 240Hz 1ms Curved Gaming Monitor", brand: "Samsung", mrp: 120000, discountPercent: 28, specs: { Display: "32\" 4K UHD Quantum Mini-LED 1000R Curve", Refresh: "240Hz 1ms response time AMD FreeSync Premium Pro" } },
    { title: "LG UltraGear 27\" QHD Nano IPS 180Hz 1ms Gaming Monitor (27GS85Q)", brand: "LG", mrp: 42000, discountPercent: 31, specs: { Panel: "27\" Nano IPS QHD (2560x1440)", Sync: "NVIDIA G-SYNC Compatible & VESA DisplayHDR 400" } },
    { title: "SanDisk Extreme 1TB Portable External NVMe SSD (Up to 1050MB/s)", brand: "SanDisk", mrp: 18000, discountPercent: 44, specs: { Speed: "Up to 1050MB/s Read Speed NVMe", Durability: "2-meter drop protection & IP55 water resistance" } },
    { title: "WD Black SN850X 2TB NVMe M.2 Internal Gaming SSD with Heatsink", brand: "Western Digital", mrp: 24999, discountPercent: 30, specs: { Speed: "Insane speeds up to 7300MB/s PCIe Gen4", Heatsink: "Built-in low profile heatsink for PC & PS5" } },
    { title: "Corsair RM850x 850W 80 PLUS Gold Fully Modular ATX Power Supply", brand: "Corsair", mrp: 16999, discountPercent: 24, specs: { Efficiency: "80 PLUS Gold Certified", Fan: "135mm Magnetic Levitation Fan with Zero RPM mode" } },
    { title: "Crucial Pro 32GB Kit (2x16GB) DDR5 5600MHz Desktop Memory", brand: "Crucial", mrp: 11999, discountPercent: 25, specs: { Speed: "DDR5 5600MT/s Intel XMP 3.0 & AMD EXPO", HeatSpreader: "Low profile sleek matte black aluminum" } },
    { title: "Razer BlackWidow V4 Pro Mechanical Gaming Keyboard with Command Dial", brand: "Razer", mrp: 24999, discountPercent: 16, specs: { Switches: "Razer Green Clicky Mechanical Switches", Underglow: "Per-key and 3-side Chroma RGB underglow" } }
  ],
  "fashion-apparel": [
    { title: "Levi's 511 Slim Fit Men's Stretch Denim Jeans (Dark Indigo)", brand: "Levi's", mrp: 3999, discountPercent: 35, specs: { Fit: "Slim Through Thigh & Leg", Fabric: "99% Cotton 1% Elastane Stretch Denim" } },
    { title: "Levi's Classic Barstow Western Denim Button-Down Shirt", brand: "Levi's", mrp: 3299, discountPercent: 30, specs: { Style: "Iconic Western snap flap pockets and curved hem", Material: "100% Breathable Cotton Denim" } },
    { title: "Allen Solly Men's Classic Solid Regular Fit Polo T-Shirt (Navy)", brand: "Allen Solly", mrp: 1299, discountPercent: 38, specs: { Collar: "Ribbed Polo Collar with 2-Button Placket", Fabric: "100% Combed Mercerized Cotton" } },
    { title: "Allen Solly Men's Smart Casual Flat Front Chino Trousers", brand: "Allen Solly", mrp: 2299, discountPercent: 35, specs: { Fit: "Contemporary Slim Fit", Pockets: "4 Pocket Styling with Zip Fly" } },
    { title: "Van Heusen Men's Formal Antibacterial Easy-Care Dress Shirt", brand: "Van Heusen", mrp: 2499, discountPercent: 40, specs: { Collar: "Semi-cutaway Spread Collar", Technology: "Anti-odor Stain Repellent Finish" } },
    { title: "Van Heusen Men's 2-Piece Formal Slim Fit Business Suit (Charcoal)", brand: "Van Heusen", mrp: 14999, discountPercent: 42, specs: { Jacket: "2-Button Single Breasted with Notched Lapel", Lining: "Silky Satin Interior with Welt Pockets" } },
    { title: "Zara Men's 100% Pure Textured Linen Camp Collar Shirt", brand: "Zara", mrp: 3990, discountPercent: 20, specs: { Fit: "Relaxed Summer Silhouette", Fabric: "100% European Flax Linen" } },
    { title: "Zara Women's Structured Double Breasted Tailored Blazer", brand: "Zara", mrp: 6990, discountPercent: 15, specs: { Lapel: "Peak Lapel with Tortoiseshell Buttons", Fabric: "Structured Crepe Fabric" } },
    { title: "Nike Sportswear Club Fleece Pullover Hoodie (Black & White Swoosh)", brand: "Nike", mrp: 3995, discountPercent: 20, specs: { Material: "80% Cotton 20% Polyester Brushed Back Fleece", Hood: "Drawcord adjustable lined hood" } },
    { title: "Nike Dri-FIT Men's Athletic Training Short Sleeve T-Shirt", brand: "Nike", mrp: 1995, discountPercent: 25, specs: { Technology: "Nike Dri-FIT moisture-wicking technology", Fit: "Standard Athletic Fit" } },
    { title: "Adidas Originals Trefoil Classic French Terry Hoodie (Core Black)", brand: "Adidas", mrp: 4999, discountPercent: 30, specs: { Logo: "High-density embroidered Trefoil on chest", Fabric: "Heavyweight 100% Sustainable Cotton French Terry" } },
    { title: "Adidas Tiro 23 League Athletic Slim Track Pants", brand: "Adidas", mrp: 3299, discountPercent: 35, specs: { Ankle: "Ankle zips for easy on/off over cleats", Technology: "AEROREADY sweat-absorbing fabric" } },
    { title: "Puma Men's Ferrari Scuderia Motorsport Polo T-Shirt", brand: "Puma", mrp: 3999, discountPercent: 38, specs: { Branding: "Official Ferrari Shield TPU badge & Puma Cat Logo", Fabric: "Structured Pique Cotton" } },
    { title: "Puma ESS Logo Men's Fleece Slim Joggers (Medium Gray Heather)", brand: "Puma", mrp: 2799, discountPercent: 45, specs: { Waist: "Elasticated ribbed waistband with internal drawcord", Pockets: "Dual side slash pockets" } },
    { title: "H&M Men's Regular Fit Resort Linen Blend Short-Sleeve Shirt", brand: "H&M", mrp: 2299, discountPercent: 20, specs: { Pattern: "Tropical Botanical Floral Print", Fabric: "55% Linen 45% Cotton" } },
    { title: "H&M Women's Rib-Knit High-Waisted Flared Trousers", brand: "H&M", mrp: 1999, discountPercent: 25, specs: { Fit: "Fitted through thigh with flared hem", Fabric: "Soft stretchy ribbed cotton blend" } },
    { title: "Biba Women's Printed Floral Anarkali Kurta & Churidar Set with Dupatta", brand: "Biba", mrp: 5999, discountPercent: 45, specs: { Work: "Intricate Gota Patti and Zari thread border", Fabric: "100% Pure Breathable Chanderi Silk" } },
    { title: "Biba Women's Straight Fit Festive Embroidered Kurti (Emerald Green)", brand: "Biba", mrp: 2999, discountPercent: 40, specs: { Neck: "Mandarin Collar with button placket", Sleeves: "Three-Quarter Sleeves with cuff details" } },
    { title: "Manyavar Men's Jacquard Silk Blend Kurta Pajama Set (Festive Golden)", brand: "Manyavar", mrp: 4999, discountPercent: 20, specs: { Fabric: "Art Silk Jacquard with Resham embroidery", Bottom: "Matching Churidar included" } },
    { title: "Manyavar Traditional Embroidered Silk Nehru Modi Jacket (Navy Blue)", brand: "Manyavar", mrp: 3499, discountPercent: 25, specs: { Closure: "Full button placket with brass shank buttons", Pockets: "3 functional welt pockets with pocket square" } },
    { title: "Raymond Premium Fine Woolen Blend Suiting Fabric 3-Meter Length", brand: "Raymond", mrp: 6999, discountPercent: 35, specs: { Material: "70% Australian Merino Wool 30% Polyamide", Weave: "Wrinkle-resistant twill suiting drape" } },
    { title: "Raymond Men's Tailored Fit 100% Pure Egyptian Giza Cotton Shirt", brand: "Raymond", mrp: 3299, discountPercent: 30, specs: { ThreadCount: "120s 2-ply long staple Giza Cotton", Buttons: "Mother-of-pearl finished buttons" } },
    { title: "Fabindia Men's Hand Block Printed Short Cotton Kurta", brand: "Fabindia", mrp: 1890, discountPercent: 15, specs: { Craft: "Traditional Dabu Bagru block printing", Fabric: "Handcrafted pure khadi cotton" } },
    { title: "Tommy Hilfiger Men's Core Signature Flag Pique Polo", brand: "Tommy Hilfiger", mrp: 4599, discountPercent: 28, specs: { Logo: "Signature embroidered micro flag on chest", Cut: "Custom Fit tapered through waist" } },
    { title: "Calvin Klein Men's Monogram Logo Heavyweight Crewneck Sweatshirt", brand: "Calvin Klein", mrp: 7999, discountPercent: 35, specs: { Graphic: "Iconic CK monogram high-density screen print", Fabric: "100% Organic Loopback Cotton Fleece" } },
    { title: "US Polo Assn Men's Solid Interlock Casual Slim Chinos (Khaki)", brand: "US Polo Assn", mrp: 2799, discountPercent: 42, specs: { Stretch: "4-way flexible stretch cotton twill", Waist: "Inner grip waistband to keep shirt tucked" } },
    { title: "W for Woman Festive Geometric Print A-Line Palazzos & Tunic", brand: "W for Woman", mrp: 3999, discountPercent: 38, specs: { Styling: "Contemporary fusion Indo-western ensemble", Fabric: "Fluid viscose crepe with metallic accents" } },
    { title: "Under Armour Men's Tech 2.0 Short Sleeve Moisture-Wicking Tee", brand: "Under Armour", mrp: 1999, discountPercent: 20, specs: { Feel: "Ultra-soft natural feel with quick-drying tech", AntiOdor: "Anti-odor technology prevents microbial growth" } },
    { title: "Peter England Men's Wrinkle-Free Regular Fit Formal Trouser", brand: "Peter England", mrp: 1799, discountPercent: 35, specs: { Wash: "Machine washable easy stain release", Fit: "Comfortable regular rise formal drape" } },
    { title: "Aurelia Women's Traditional Foil Print Flared Festive Skirt", brand: "Aurelia", mrp: 2499, discountPercent: 40, specs: { Flare: "Generous 4-meter volume flare with drawstring tie", Detailing: "Gold metallic foil motifs on rich ruby red" } }
  ],
  "footwear": [
    { title: "Nike Air Jordan 1 Low Men's Basketball Lifestyle Sneakers (Bred Toe)", brand: "Nike", mrp: 8995, discountPercent: 10, specs: { Cushioning: "Encapsulated Air-Sole unit in heel", Upper: "Genuine full-grain leather and synthetic overlays" } },
    { title: "Nike Air Zoom Pegasus 40 Men's Road Running Shoes", brand: "Nike", mrp: 10495, discountPercent: 25, specs: { Foam: "Nike React Foam with dual Zoom Air units", Upper: "Single-layer engineered mesh for lightweight breathability" } },
    { title: "Nike Air Max 90 Classic Men's OG Retro Sneakers (White & Black)", brand: "Nike", mrp: 11895, discountPercent: 20, specs: { Sole: "Iconic visible Max Air cushioning with waffle tread", Accents: "Stitched leather overlays with classic TPU accents" } },
    { title: "Adidas Ultraboost Light Men's High-Performance Running Shoes", brand: "Adidas", mrp: 18999, discountPercent: 35, specs: { Boost: "Lightest ever Light BOOST midsole with 30% less weight", Upper: "Adidas PRIMEKNIT+ textile foot-hugging fit" } },
    { title: "Adidas Originals Stan Smith Classic Leather Shoes (White & Fairway Green)", brand: "Adidas", mrp: 8999, discountPercent: 25, specs: { Silhouette: "Timeless court sneaker profile", Material: "Synthetic vegan leather upper with perforated 3-Stripes" } },
    { title: "Adidas Samba OG Classic Gum Sole Indoor Sneakers (Cloud White)", brand: "Adidas", mrp: 10999, discountPercent: 12, specs: { Toe: "Suede T-toe overlay protection", Outsole: "Authentic retro textured gum rubber outsole" } },
    { title: "Puma Velocity NITRO 3 Men's Cushioned Running Shoes", brand: "Puma", mrp: 11999, discountPercent: 30, specs: { Cushion: "Advanced NITRO Foam infused with nitrogen for explosive bounce", Grip: "PUMAGRIP durable rubber compound" } },
    { title: "Puma Suede Classic XXI Low-Top Heritage Sneakers (Peacoat Navy)", brand: "Puma", mrp: 6999, discountPercent: 38, specs: { Upper: "100% Premium plush suede leather", Insole: "Comfort sockliner for all-day cushioned steps" } },
    { title: "Asics GEL-Kayano 30 Stability Road Running Shoes", brand: "Asics", mrp: 15999, discountPercent: 22, specs: { Stability: "4D GUIDANCE SYSTEM provides adaptive stability", Cushioning: "PureGEL technology and FF BLAST PLUS ECO cushioning" } },
    { title: "Asics GEL-Nimbus 26 Maximum Cushioning Neutral Running Shoes", brand: "Asics", mrp: 15999, discountPercent: 18, specs: { Outsole: "HYBRID ASICSGRIP outsole rubber", Comfort: "Soft knit collar and tongue construction" } },
    { title: "New Balance 574 Core Men's Classic Heritage Sneakers (Grey)", brand: "New Balance", mrp: 8999, discountPercent: 20, specs: { Midsole: "ENCAP midsole cushioning combines lightweight foam with durable rim", Materials: "Suede and mesh upper" } },
    { title: "New Balance Fresh Foam X 1080v13 Plush Running Shoes", brand: "New Balance", mrp: 16999, discountPercent: 15, specs: { Cushion: "Fresh Foam X midsole delivers pinnacle plushness", Upper: "Engineered breathable mesh with second-skin fit" } },
    { title: "Woodland Men's Camel Brown Oiled Nubuck High-Ankle Trekking Boots", brand: "Woodland", mrp: 5495, discountPercent: 32, specs: { Leather: "Heavy-duty waterproof oiled nubuck leather", Outsole: "Grooved rubber lug sole with anti-slip traction" } },
    { title: "Woodland Men's Handcrafted Casual Leather Boat Shoes & Loafers", brand: "Woodland", mrp: 4495, discountPercent: 35, specs: { Lining: "Cushioned leather lining with cushioned footbed", Construction: "Hand-stitched moccasin toe" } },
    { title: "Red Tape Men's Handcrafted Genuine Leather Chelsea Boots (Tan)", brand: "Red Tape", mrp: 6999, discountPercent: 65, specs: { Upper: "100% Genuine crust leather with burnished finish", Entry: "Elasticated side gores with rear pull loop" } },
    { title: "Red Tape Men's Memory Foam Ultra-Light Athleisure Walking Sneakers", brand: "Red Tape", mrp: 5499, discountPercent: 70, specs: { Insole: "High-rebound Memory Foam footbed", Sole: "Flexible EVA sole with shock absorption" } },
    { title: "Crocs Classic Unisex Lightweight Water-Friendly Clogs (Navy)", brand: "Crocs", mrp: 2995, discountPercent: 25, specs: { Material: "Original Croslite foam cushioning", Ventilation: "Ventilation ports shed water and debris" } },
    { title: "Crocs Echo Clog Modern Sculpted Streetwear Slides (Atmosphere)", brand: "Crocs", mrp: 5495, discountPercent: 20, specs: { Design: "Bold sculpted streetwear aesthetic with LiteRide drop-in footbed", Heel: "Turbo heel strap with a comfort pad" } },
    { title: "Skechers Men's Go Walk 7 Slip-Ins Hands Free Walking Shoes", brand: "Skechers", mrp: 6999, discountPercent: 25, specs: { Tech: "Hands Free Slip-ins for easy step-in fit", Cushion: "Lightweight, responsive ULTRA GO cushioning" } },
    { title: "Skechers Men's Arch Fit D'Lux Memory Foam Orthotic Sneakers", brand: "Skechers", mrp: 7499, discountPercent: 28, specs: { Insole: "Podiatrist-certified arch support developed with 20 years of data", Shape: "Removable insole helps mold to your foot" } },
    { title: "Bata Men's Handcrafted Genuine Leather Derby Formal Shoes (Black)", brand: "Bata", mrp: 2999, discountPercent: 30, specs: { Sole: "Non-slip TPR dress sole with stacked heel", Leather: "Supple polished bovine leather upper" } },
    { title: "Bata Comfit Women's Orthopedic Cushion Slip-On Ballerinas", brand: "Bata", mrp: 1899, discountPercent: 25, specs: { Sole: "Dual-density massaging footbed", Upper: "Soft synthetic leather with elastic topline" } },
    { title: "Clarks Men's Originals Desert Boot in Beeswax Leather", brand: "Clarks", mrp: 12999, discountPercent: 22, specs: { Sole: "Signature natural crepe rubber outsole", Heritage: "Designed by Nathan Clark in 1950" } },
    { title: "Clarks Men's Tilden Walk Leather Formal Oxford Shoes", brand: "Clarks", mrp: 7999, discountPercent: 30, specs: { Tech: "Cushion Soft technology with OrthoLite footbed", Finish: "Rich smooth full-grain dress leather" } },
    { title: "Under Armour Men's Charged Assert 9 Running Shoes (Black & White)", brand: "Under Armour", mrp: 5999, discountPercent: 30, specs: { Cushion: "Charged Cushioning midsole uses compression molded foam", Overlays: "Durable leather overlays lock in your midfoot" } },
    { title: "Converse Chuck Taylor All Star Classic High Top Canvas Sneakers", brand: "Converse", mrp: 4999, discountPercent: 15, specs: { Canvas: "Lightweight and durable 12oz canvas upper", Patch: "Iconic Chuck Taylor ankle star patch and vulcanized rubber sole" } },
    { title: "Vans Old Skool Unisex Skate Shoes (Black & White Side Stripe)", brand: "Vans", mrp: 4999, discountPercent: 18, specs: { Outsole: "Signature rubber waffle tread for maximum grip", Toe: "Reinforced toecaps to withstand repeated wear" } },
    { title: "Birkenstock Arizona Birko-Flor Two-Strap Sandals (Mocha)", brand: "Birkenstock", mrp: 6990, discountPercent: 10, specs: { Footbed: "Anatomically shaped cork-latex footbed with suede lining", Straps: "Skin-friendly, hard-wearing synthetic Birko-Flor" } },
    { title: "Salomon Speedcross 6 Trail Running & Hiking Shoes", brand: "Salomon", mrp: 14999, discountPercent: 20, specs: { Grip: "Mud Contagrip with deep aggressive chevron lugs", Lacing: "Quicklace one-pull tightening system" } },
    { title: "Hoka One One Clifton 9 Lightweight Daily Road Running Shoes", brand: "Hoka", mrp: 14999, discountPercent: 15, specs: { Weight: "Super lightweight 248g", Midsole: "Compression molded EVA foam with early stage Meta-Rocker" } }
  ],
  "home-kitchen": [
    { title: "Philips Daily Collection Compact Airfryer with Rapid Air Tech 4.1L", brand: "Philips", mrp: 11995, discountPercent: 42, specs: { Technology: "Rapid Air technology with unique starfish design", Capacity: "4.1 Liter basket with 1400W power" } },
    { title: "Philips Viva Collection 750W Heavy Duty Mixer Grinder 4 Jars", brand: "Philips", mrp: 6495, discountPercent: 35, specs: { Motor: "750W Turbo motor with advanced air ventilation", Jars: "4 leak-proof stainless steel jars" } },
    { title: "Philips EasyTouch Plus Standing Garment Clothes Steamer 1600W", brand: "Philips", mrp: 8995, discountPercent: 30, specs: { Steam: "32g/min continuous steam with 5 steam levels", Board: "Extra-large adjustable double pole board" } },
    { title: "Prestige Iris Plus 750W Mixer Grinder with 3 Stainless Steel & Juicer Jar", brand: "Prestige", mrp: 6295, discountPercent: 48, specs: { Blades: "Multi-functional heavy stainless steel blades", Safety: "Overload protection thermal switch" } },
    { title: "Prestige Deluxe Alpha Stainless Steel Pressure Cooker 5.0 Litre", brand: "Prestige", mrp: 3890, discountPercent: 28, specs: { Base: "Alpha induction compatible heavy sandwich bottom", Safety: "Controlled Gasket-Release System" } },
    { title: "Prestige Omega Deluxe Granite 3-Piece Non-Stick Cookware Set with Glass Lid", brand: "Prestige", mrp: 4500, discountPercent: 40, specs: { Coating: "5-layer durable German technology granite coating", Compatibility: "Gas and Induction compatible" } },
    { title: "Hawkins Contura Hard Anodized Deep Body Pressure Cooker 3 Litre", brand: "Hawkins", mrp: 2600, discountPercent: 15, specs: { Body: "Non-reactive hard anodized black body absorbs heat faster", Lid: "Inside-fitting safety lid cannot be opened until pressure drops" } },
    { title: "Hawkins Futura Hard Anodized Nonstick Deep Fry Pan Kadhai 2.5L", brand: "Hawkins", mrp: 2150, discountPercent: 18, specs: { Handle: "Stay-cool rosewood handles with stainless steel brackets", Base: "Heavy 4.06mm thick base retains heat evenly" } },
    { title: "Dyson V12 Detect Slim Cordless Stick Vacuum Cleaner (Laser Detect)", brand: "Dyson", mrp: 55900, discountPercent: 18, specs: { Laser: "Illuminated cleaner head reveals invisible micro-dust", Motor: "Hyperdymium motor spins at 125,000rpm" } },
    { title: "Dyson Purifier Cool TP07 Formaldehyde Air Purifier & Tower Fan", brand: "Dyson", mrp: 49900, discountPercent: 20, specs: { Filtration: "HEPA H13 sealed filtration captures 99.95% particles down to 0.1 microns", Smart: "Dyson MyDyson App control" } },
    { title: "Kent Grand Plus RO+UV+UF+TDS Mineral Water Purifier 9L", brand: "Kent", mrp: 20500, discountPercent: 24, specs: { Purification: "Multiple purification by RO+UV+UF+Alkaline TDS Control", Storage: "9 Litres storage with high 20L/hr purification capacity" } },
    { title: "Eureka Forbes Aquaguard Marvel NXT 10-Stage Copper RO+UV Purifier", brand: "Eureka Forbes", mrp: 22000, discountPercent: 32, specs: { Technology: "Active Copper Zinc Booster Infusion", Cartridge: "Superior mineral magnet cartridge" } },
    { title: "Bajaj Majesty 1603 T 16-Litre Oven Toaster Griller (OTG) with Grill Rack", brand: "Bajaj", mrp: 5999, discountPercent: 40, specs: { Capacity: "16 Litres for baking cakes, grilling tikkas & toasting", Timer: "60-minute timer with auto shut-off chime" } },
    { title: "Bajaj Splendora 3-Litre 3KW Instant Water Geyser (ABS Outer Body)", brand: "Bajaj", mrp: 4990, discountPercent: 38, specs: { Tank: "SS 304 stainless steel inner tank", Pressure: "6.5 Bar pressure rated for high-rise buildings" } },
    { title: "Havells Stealth Air 1200mm Dust Resistant Ceiling Fan with Remote", brand: "Havells", mrp: 8590, discountPercent: 35, specs: { AirDelivery: "High air delivery 280 m3/min with aerodynamic whisper blades", Coating: "Hydrophobic PU coating repels dust accumulation" } },
    { title: "Milton Thermosteel Flip Lid Insulated Water Flask 1000ml (24H Hot & Cold)", brand: "Milton", mrp: 1290, discountPercent: 25, specs: { Insulation: "Double-walled vacuum insulation with copper coating inside", Steel: "100% Rust-proof Grade 304 food-safe stainless steel" } },
    { title: "Milton Pro Cook Granito 3-Piece Induction Cookware Set with Glass Lids", brand: "Milton", mrp: 3999, discountPercent: 45, specs: { Thickness: "3mm heavy gauge virgin aluminum", Handles: "Soft-touch ergonomically molded bakelite handles" } },
    { title: "Bosch TrueMixx Pro 1000W Heavy Duty Mixer Grinder with Stone Pounding Tech", brand: "Bosch", mrp: 10499, discountPercent: 28, specs: { Technology: "Patented Stone Pounding Technology for authentic traditional masala texture", Blades: "Active Flow Breaker jars with blunt PoundingBlades" } },
    { title: "Bosch 13 Place Settings Free-Standing Dishwasher Series 4 (Polinox)", brand: "Bosch", mrp: 49990, discountPercent: 18, specs: { Programs: "6 Wash Programs with Intensive Kadhai 70C cycle", Efficiency: "VarioSpeed Plus cuts wash time by up to 66%" } },
    { title: "Pigeon by Stovekraft 4-Burner Glass Top Gas Cooktop with Spill Tray", brand: "Pigeon", mrp: 6995, discountPercent: 55, specs: { Glass: "Toughened heat-resistant thermal glass top", Burners: "4 Heavy forged high-efficiency tri-pin brass burners" } },
    { title: "Wonderchef Nutri-Blend 400W Mixer Grinder Blender with 2 Unbreakable Jars", brand: "Wonderchef", mrp: 4000, discountPercent: 40, specs: { Motor: "22000 RPM super-fast copper motor extracts every drop of micro-nutrients", Design: "Compact bullet shape designed by Chef Sanjeev Kapoor" } },
    { title: "IFB 30 L Convection Microwave Oven with 101 Auto-Cook Menus (30FRC2)", brand: "IFB", mrp: 20490, discountPercent: 22, specs: { Cavity: "Stainless steel cavity with fermented dough & yogurt modes", Features: "Disinfect, Steam Clean and Deodorize cycle" } },
    { title: "Morphy Richards Europa Drip 600W Espresso & Filter Coffee Maker", brand: "Morphy Richards", mrp: 5495, discountPercent: 36, specs: { Cups: "Brews up to 6 cups of rich aroma coffee at once", Filter: "Removable nylon mesh filter with anti-drip mechanism" } },
    { title: "Borosil Klip N Store Microwave Safe Glass Food Containers Set of 4", brand: "Borosil", mrp: 2190, discountPercent: 30, specs: { Glass: "100% Borosilicate glass withstands up to 400C", Lid: "Airtight & leak-proof clip lock lids" } },
    { title: "Bajaj SWX 4 Deluxe 800W Non-Stick Sandwich Griller & Toaster", brand: "Bajaj", mrp: 2750, discountPercent: 35, specs: { Plates: "Teflon non-stick coated fixed grill plates", Indicator: "Dual neon power & ready-to-cook heat indicators" } },
    { title: "Cello Max Fresh Super 4-Container Insulated Stainless Steel Lunch Box", brand: "Cello", mrp: 1699, discountPercent: 35, specs: { Steel: "Mirror-finish food grade stainless steel containers", Jacket: "High-density thermal foam insulated zippered fabric bag" } },
    { title: "Kaff 60cm Curved Glass Auto-Clean Kitchen Chimney (1200 m3/h)", brand: "Kaff", mrp: 24990, discountPercent: 48, specs: { Suction: "1200 m3/h high airflow suction motor", Clean: "Thermal dry auto-clean technology with oil collector tray" } },
    { title: "Kent Instant Egg Boiler with 3 Boiling Modes 360W", brand: "Kent", mrp: 1800, discountPercent: 39, specs: { Capacity: "Boils 7 eggs simultaneously in 3 minutes", Modes: "Soft, Medium and Hard boiling with auto turn-off" } },
    { title: "Prestige Induction Cooktop PIC 20.0 with Indian Menu Presets", brand: "Prestige", mrp: 3995, discountPercent: 42, specs: { Power: "1600W with dual heat sensors", Controls: "Feather touch push button controls with aerodynamic cooling" } },
    { title: "Havells Adore 500W Hand Blender with Stainless Steel Stem", brand: "Havells", mrp: 2595, discountPercent: 38, specs: { Stem: "Detachable food grade 304 SS stem for blending hot soups", Blades: "Super sharp multi-utility cutting blades" } }
  ],
  "beauty-grooming": [
    { title: "Lakme 9 to 5 Complexion Care CC Cream Foundation SPF 30 PA++ 30g", brand: "Lakme", mrp: 360, discountPercent: 15, specs: { Shade: "Honey Beige with sheer natural matte finish", Protection: "Broad spectrum SPF 30 PA++" } },
    { title: "Lakme Absolute Matte Melt Liquid Lip Color (Red Smoke, 6ml)", brand: "Lakme", mrp: 800, discountPercent: 30, specs: { Texture: "Feather-light velvety matte formula with rosehip oil", Wear: "Long-lasting 16-hour transfer-proof wear" } },
    { title: "Lakme Eyeconic Smudge-Proof Waterproof Kajal Twin Pack (Classic Deep Black)", brand: "Lakme", mrp: 390, discountPercent: 20, specs: { Duration: "Up to 24-hour waterproof smudge-proof wear", Formula: "Ophthalmologically tested with soothing chamomilla" } },
    { title: "L'Oreal Paris Revitalift 1.5% Pure Hyaluronic Acid Face Serum 30ml", brand: "L'Oreal Paris", mrp: 1099, discountPercent: 35, specs: { Hydration: "Instant +42% radiant hydration, visibly plumps fine lines", Formula: "0% Parabens, 0% Fragrance, lightweight watery gel" } },
    { title: "L'Oreal Paris Extraordinary Oil Hair Serum with 6 Rare Floral Extracts 100ml", brand: "L'Oreal Paris", mrp: 649, discountPercent: 28, specs: { Benefit: "Transforms dry frizzy hair with 4x instant glass-like shine", Heat: "Protects against heat styling up to 230C" } },
    { title: "L'Oreal Paris Infallible Matte Resistance 16H Liquid Lipstick (105 Breakfast in Bed)", brand: "L'Oreal Paris", mrp: 999, discountPercent: 25, specs: { Finish: "Powdery powdery matte infused with hyaluronic acid", Proof: "Smudge-proof, kiss-proof and transfer-resistant" } },
    { title: "Nivea Creme Soft Hydrating Multipurpose Cold Cream 200ml Tin", brand: "Nivea", mrp: 349, discountPercent: 20, specs: { Ingredients: "Enriched with Eucerit and Jojoba oil for intensive moisture", SkinType: "Dermatologically tested for all skin types" } },
    { title: "Nivea Men Deep Impact Roll-On Deodorant Anti-Perspirant 50ml", brand: "Nivea", mrp: 215, discountPercent: 25, specs: { Formula: "Black Charcoal formula acts powerfully against bacteria", Freshness: "48-hour sweat protection with woody masculine scent" } },
    { title: "Nivea Cocoa Nourish 48H Deep Moisture Body Lotion with Cocoa Butter 400ml", brand: "Nivea", mrp: 525, discountPercent: 30, specs: { Moisture: "Deep Moisture Serum keeps very dry skin soft for 48 hours", Scent: "Delightful rich warm cocoa aroma" } },
    { title: "Mamaearth Vitamin C Daily Glow Face Serum with 10% Vitamin C & Turmeric 30ml", brand: "Mamaearth", mrp: 699, discountPercent: 20, specs: { Brightening: "Fades dark pigmentation spots and boosts collagen", Certification: "Made Safe Certified, 0% Silicones & Toxins" } },
    { title: "Mamaearth Onion Hair Fall Control Shampoo with Plant Keratin 400ml", brand: "Mamaearth", mrp: 599, discountPercent: 25, specs: { HairCare: "Strengthens follicles and reduces hair breakage", SulfateFree: "Gentle sulfate-free and paraben-free cleansing" } },
    { title: "The Derma Co 10% Niacinamide Face Serum with Zinc for Acne Marks 30ml", brand: "The Derma Co", mrp: 599, discountPercent: 20, specs: { Actives: "10% Niacinamide + 1% Zinc PCA controls sebum & unclogs pores", Result: "Safe visible reduction in acne scars in 3 weeks" } },
    { title: "The Derma Co 1% Hyaluronic Sunscreen Aqua Gel SPF 50 PA++++ 50g", brand: "The Derma Co", mrp: 499, discountPercent: 18, specs: { Texture: "Zero white cast ultra-lightweight watery sunscreen", Protection: "Blocks UVA, UVB & Blue Light from screens" } },
    { title: "Cetaphil Gentle Skin Cleanser for Sensitive Skin 500ml Pump Bottle", brand: "Cetaphil", mrp: 1475, discountPercent: 18, specs: { Formula: "Hypoallergenic soap-free hydrating formula with Vitamin B3 & Pro-Vitamin B5", Preserves: "Maintains skin's natural moisture barrier" } },
    { title: "Cetaphil Moisturizing Cream for Very Dry & Sensitive Skin 100g", brand: "Cetaphil", mrp: 595, discountPercent: 15, specs: { Relief: "Clinically proven 48-hour hydration with sweet almond oil", Barrier: "Non-comedogenic, fragrance-free dermatologist recommended" } },
    { title: "Neutrogena Hydro Boost Water Gel Moisturizer with Hyaluronic Acid 50g", brand: "Neutrogena", mrp: 1150, discountPercent: 22, specs: { Absorption: "Absorbs instantly like pure water, quench-locks dry skin", Barrier: "Contains prebiotic yeast extract to stimulate natural hyaluronic acid" } },
    { title: "Neutrogena Ultra Sheer Dry-Touch Sunblock SPF 50+ Broad Spectrum 80ml", brand: "Neutrogena", mrp: 750, discountPercent: 20, specs: { Tech: "Helioplex Technology provides superior broad-spectrum protection", Finish: "Matte, non-greasy dry-touch finish" } },
    { title: "Maybelline New York Colossal Waterproof Mascara (Glam Black, 10ml)", brand: "Maybelline", mrp: 449, discountPercent: 25, specs: { Volume: "Instantly adds 2x pumped-up volume without clumps", Brush: "Mega brush with collagen-infused plumping formula" } },
    { title: "Maybelline New York Fit Me Matte + Poreless Liquid Foundation 30ml", brand: "Maybelline", mrp: 649, discountPercent: 30, specs: { Finish: "Refines pores and matches natural skin tone with seamless blend", Shades: "Infused with micro-powders that control shine" } },
    { title: "Philips Series 3000 Stainless Steel Cordless Beard Trimmer (BT3231/15)", brand: "Philips", mrp: 2195, discountPercent: 25, specs: { Blades: "Skin-friendly rounded self-sharpening titanium-coated blades", Battery: "60 minutes cordless use with DuraPower battery technology" } },
    { title: "Braun Series 9 Pro Wet & Dry Electric Shaver with SmartCare Center", brand: "Braun", mrp: 39999, discountPercent: 20, specs: { Cutting: "5 synchronized shaving elements with ProLift trimmer", Technology: "Sonic Technology delivers 10,000 micro-vibrations per minute" } },
    { title: "The Ordinary Niacinamide 10% + Zinc 1% High-Strength Blemish Serum 30ml", brand: "The Ordinary", mrp: 600, discountPercent: 10, specs: { Target: "Regulates sebum activity and minimizes enlarged pore appearance", Purity: "Vegan, alcohol-free, silicone-free, gluten-free" } },
    { title: "The Ordinary Glycolic Acid 7% Exfoliating Toning Solution 240ml", brand: "The Ordinary", mrp: 1250, discountPercent: 10, specs: { Exfoliation: "AHA solution gently exfoliates skin surface for renewed radiance", Soothing: "Contains Tasmanian Pepperberry derivative to reduce irritation" } },
    { title: "Biotique Bio Green Apple Fresh Daily Purifying Shampoo & Conditioner 650ml", brand: "Biotique", mrp: 430, discountPercent: 35, specs: { Ayurvedic: "100% botanical extracts with pure green apple and sea algae", Scalp: "Leaves oily hair full of natural bounce and shine" } },
    { title: "Plum Green Tea Alcohol-Free Face Toner with Glycolic Acid 200ml", brand: "Plum", mrp: 390, discountPercent: 25, specs: { Cleanse: "Shrinks enlarged pores and curbs acne-causing bacteria", Ethics: "100% Vegan, Cruelty-free & PETA approved" } },
    { title: "Minimalist 10% Vitamin C Face Serum with Centella Asiatica 30ml", brand: "Minimalist", mrp: 699, discountPercent: 15, specs: { Form: "Formulated with stable Ethyl Ascorbic Acid (86% pure Vitamin C)", Tone: "Evens out dull skin tone and prevents photo-damage" } },
    { title: "Forest Essentials Delicate Facial Cleanser Kashmiri Saffron & Neem 200ml", brand: "Forest Essentials", mrp: 1550, discountPercent: 10, specs: { Heritage: "Traditional Ayurvedic formulation of saffron, kewda and neem", Result: "Gently purifies skin while leaving it soft and supple" } },
    { title: "Garnier Micellar Cleansing Water All-in-1 Makeup Remover 400ml", brand: "Garnier", mrp: 399, discountPercent: 25, specs: { Micelles: "Micelle technology acts like a magnet to capture dirt and makeup", Gentle: "No harsh rubbing required, safe for eyes and lips" } },
    { title: "Kama Ayurveda Pure Rose Water Face Mist Hydro-Distilled 200ml", brand: "Kama Ayurveda", mrp: 1495, discountPercent: 12, specs: { Provenance: "Steam-distilled from hand-plucked roses of Kannauj", Usage: "Natural astringent balances skin pH and tightens pores" } },
    { title: "Beardo Godfather Beard Oil with Mineral Complex & Almond 30ml", brand: "Beardo", mrp: 350, discountPercent: 25, specs: { Growth: "Deeply nourishes beard roots and softens coarse bristles", Fragrance: "Signature masculine aromatic woody scent" } }
  ],
  "grocery-gourmet": [
    { title: "Tata Sampann 100% Unpolished Organic Toor Dal 1kg (High Protein)", brand: "Tata Sampann", mrp: 215, discountPercent: 15, specs: { Processing: "Unpolished - does not undergo artificial polishing with water, oil or marble", Nutrition: "Naturally rich in plant protein and dietary fiber" } },
    { title: "Tata Sampann Low Sodium Himalayan Pink Rock Salt 1kg Pouch", brand: "Tata Sampann", mrp: 120, discountPercent: 12, specs: { Source: "Mined directly from pristine ancient Himalayan rock beds", Minerals: "Rich in 84 natural micro-minerals including potassium & magnesium" } },
    { title: "Fortune Sunlite Refined Sunflower Oil 5 Litre Canister (Rich in Vitamin E)", brand: "Fortune", mrp: 785, discountPercent: 18, specs: { Health: "Enriched with Vitamin A and Vitamin D for good eye and bone health", Cooking: "High smoke point ideal for deep frying and Indian cooking" } },
    { title: "Fortune Biryani Special Premium Aged Basmati Rice 5kg Bag", brand: "Fortune", mrp: 650, discountPercent: 22, specs: { Grain: "Extra-long slender pearls elongate up to 24mm when cooked", Aroma: "Aged for 2 years for authentic royal dum biryani aroma" } },
    { title: "Daawat Rozana Gold Basmati Rice 5kg (Naturally Sweet Flavor)", brand: "Daawat", mrp: 495, discountPercent: 20, specs: { Variety: "Mid-slender grain perfect for daily pulav, fried rice and khichdi", Clean: "100% sortex-cleaned hygienically packed" } },
    { title: "Aashirvaad Select 100% Sharbati Whole Wheat Atta 5kg (Rotis Stay Soft)", brand: "Aashirvaad", mrp: 330, discountPercent: 10, specs: { Wheat: "Harvested from golden wheat fields of Sehore, Madhya Pradesh", Texture: "Absorbs more water so chapatis stay soft for over 12 hours" } },
    { title: "Aashirvaad Svasti Pure Cow Ghee Traditional Bilona Curd Churned 1 Litre", brand: "Aashirvaad", mrp: 710, discountPercent: 12, specs: { Process: "Prepared using traditional slow-cooking process with aromatic granulate", Purity: "100% pure golden cow milk fat free from adulterants" } },
    { title: "Saffola Gold Pro Healthy Heart Multi-Source Cooking Oil 5 Litre Can", brand: "Saffola", mrp: 940, discountPercent: 15, specs: { Blend: "Advanced blend of 70% Rice Bran Oil & 30% Sunflower Oil with Oryzanol", Heart: "Reduces LDL bad cholesterol and absorbs up to 33% less oil" } },
    { title: "Saffola Masala Oats Classic Masala Fiber-Rich Breakfast 500g Pouch", brand: "Saffola", mrp: 210, discountPercent: 20, specs: { WholeGrain: "100% natural wholegrain rolled oats with dehydrated veggies", Ready: "Delicious hot spicy meal ready in just 3 minutes" } },
    { title: "Tata Tea Gold Fine Darjeeling & Assam Long Leaf Tea 500g Pack", brand: "Tata Tea", mrp: 385, discountPercent: 15, specs: { Blend: "Rich valley grown Assam tea with 15% gently rolled Darjeeling long leaves", Flavour: "Irresistible golden amber liquor with delicate muscatel aroma" } },
    { title: "Nescafe Classic 100% Pure Instant Coffee Glass Jar 200g", brand: "Nescafe", mrp: 720, discountPercent: 18, specs: { Beans: "Made with carefully selected Robusta coffee beans dark roasted", Aroma: "Signature rich full-bodied morning pick-me-up coffee" } },
    { title: "Nescafe Gold Blend Premium Arabica Roast Freeze-Dried Coffee 100g", brand: "Nescafe", mrp: 595, discountPercent: 15, specs: { Process: "Freeze-dried technology locks in smooth rounded Arabica notes", Origin: "Crafted with mountain-grown Arabica beans" } },
    { title: "Kellogg's Real Almond & Honey Crunchy Muesli 1kg Mega Saver Pack", brand: "Kellogg's", mrp: 699, discountPercent: 25, specs: { Mix: "5 nutritious multigrains: wheat, corn, rice, barley and rolled oats", Crunch: "Packed with crunchy California almonds and natural honey" } },
    { title: "Kellogg's Chocos Magic Chocolate Crunchy Breakfast Cereal 1.2kg", brand: "Kellogg's", mrp: 545, discountPercent: 20, specs: { Nutrition: "Made with whole wheat flour, rich in protein, calcium and B-vitamins", Flavor: "Turns plain cold milk into rich chocolate milk" } },
    { title: "Hershey's Exotic Dark Chocolate Blueberry & Acai Gourmet Pouch 100g", brand: "Hershey's", mrp: 160, discountPercent: 15, specs: { Cocoa: "Smooth dark cocoa outer layer packed with exotic whole fruit centers", Taste: "Harmonious balance of tart berries and bittersweet cocoa" } },
    { title: "Hershey's Chocolate Flavor Dessert Syrup 1.2kg Squeeze Bottle", brand: "Hershey's", mrp: 320, discountPercent: 18, specs: { Use: "Perfect drizzle over ice creams, pancakes, cakes and chocolate milkshakes", Pour: "Mess-free convenient flip cap squeeze bottle" } },
    { title: "Dabur 100% Pure Raw Forest Honey 1kg Plastic Squeezy Jar (No Added Sugar)", brand: "Dabur", mrp: 440, discountPercent: 22, specs: { Purity: "Tested using Nuclear Magnetic Resonance (NMR) for zero adulteration", Benefits: "Boosts metabolism, digestive vitality and natural immunity" } },
    { title: "Dabur Chyawanprash 2X Immunity 3x Energy Herbal Paste 1kg Jar", brand: "Dabur", mrp: 415, discountPercent: 18, specs: { Herbs: "Time-tested formulation of over 40 potent Ayurvedic herbs with Amla", Clinical: "Clinically proven to double body's disease-fighting ability" } },
    { title: "Brooke Bond Red Label Natural Care Cardamom & Ginger Tea 1kg", brand: "Brooke Bond", mrp: 580, discountPercent: 15, specs: { Ingredients: "Infused with 5 Ayurvedic ingredients: Tulsi, Ashwagandha, Mulethi, Ginger & Cardamom", Health: "Builds immunity against common coughs and colds" } },
    { title: "Cadbury Bournvita Chocolate Health Nutrition Drink Refill Pack 1kg", brand: "Cadbury", mrp: 450, discountPercent: 12, specs: { Nutrients: "Packed with Vitamin D, Iron, Zinc and Vitamin B12", Growth: "Supports inner strength, active muscles and mental stamina" } },
    { title: "Cadbury Dairy Milk Silk Hazelnut Chocolate Bar 143g", brand: "Cadbury", mrp: 215, discountPercent: 10, specs: { Texture: "Melt-in-mouth silky milk chocolate packed with roasted whole Turkish hazelnuts", Indulgence: "The ultimate celebratory sweet treat" } },
    { title: "Borges Extra Virgin Olive Oil Cold Extracted Glass Bottle 1 Litre", brand: "Borges", mrp: 1650, discountPercent: 30, specs: { Extraction: "First cold pressed within 24 hours of harvest in Mediterranean groves", Culinary: "Ideal for salad dressings, pasta tossing and sourdough dips" } },
    { title: "Nutraj California Jumbo Raw Natural Whole Almonds (Badam) 500g", brand: "Nutraj", mrp: 549, discountPercent: 28, specs: { Quality: "Grade A non-GMO California whole almonds", Nutrition: "High in dietary fiber, Vitamin E and healthy omega fatty acids" } },
    { title: "Organic India Tulsi Ginger Certified Organic Green Tea 100 Tea Bags", brand: "Organic India", mrp: 795, discountPercent: 20, specs: { Certification: "USDA Certified Organic & Non-GMO Project Verified", Blend: "Cleansing Holy Basil (Tulsi) infused with warming zesty ginger" } },
    { title: "Blue Tokai Coffee Roasters Vienna Roast Dark Roast Ground Coffee 250g", brand: "Blue Tokai", mrp: 480, discountPercent: 10, specs: { Roast: "Vienna Dark Roast with oaky dark chocolate notes", Grind: "Precision ground for South Indian Filter / Moka Pot" } },
    { title: "Tata Salt Vacuum Evaporated Iodized Salt 1kg Pack (Desh Ka Namak)", brand: "Tata Salt", mrp: 28, discountPercent: 5, specs: { Quality: "Vacuum evaporated guaranteed purity with optimal iodine levels", Health: "Essential for healthy physical and mental development" } },
    { title: "Epigamia Greek Yogurt Natural High Protein Cup 400g (No Added Sugar)", brand: "Epigamia", mrp: 180, discountPercent: 15, specs: { Protein: "Strained traditional Greek yogurt with 2x natural protein", Gut: "Packed with active live gut-friendly probiotic cultures" } },
    { title: "Wingreens Farms Traditional Creamy Garlic Dip & Spread 180g Tub", brand: "Wingreens Farms", mrp: 160, discountPercent: 20, specs: { Flavour: "Fresh crushed garlic cloves blended with silky cold-pressed oil", Pairing: "Perfect with toasted pita chips, falafel wraps and french fries" } },
    { title: "Disano 100% All Natural Crunchy Peanut Butter Unsweetened 1kg", brand: "Disano", mrp: 499, discountPercent: 40, specs: { Ingredients: "100% Roasted California-style Peanuts with zero hydrogenated oil", Protein: "30g plant protein per 100g serving with zero cholesterol" } },
    { title: "Paper Boat Aamras Alphonso Mango Juice Drink 1 Litre Tetrapak", brand: "Paper Boat", mrp: 140, discountPercent: 15, specs: { Mango: "Made with 45% real Ratnagiri Alphonso mango pulp", Natural: "No artificial colors, flavors or preservatives" } }
  ],
  "sports-fitness": [
    { title: "Decathlon Domyos Hexagonal Rubber Coated Dumbbells Pair 7.5kg", brand: "Decathlon", mrp: 3999, discountPercent: 20, specs: { Design: "Hexagonal anti-roll shape protects flooring from dents", Handle: "Knurled chrome steel handle provides superior non-slip grip" } },
    { title: "Decathlon Kiprun Non-Slip Cushioning Ankle Running Socks Pack of 3", brand: "Decathlon", mrp: 599, discountPercent: 25, specs: { Material: "Technical moisture-wicking synthetic yarn reduces blister friction", Arch: "Reinforced elastic arch band for locked-down fit" } },
    { title: "Yonex Nanoray 10F Graphite Badminton Racket (Strung, with Full Cover)", brand: "Yonex", mrp: 2990, discountPercent: 35, specs: { Weight: "4U (80-84g) lightweight head-light balance", Frame: "Aero Frame with TFA CAP for maximum shuttle speed and vibration dampening" } },
    { title: "Yonex Mavis 350 Precision Nylon Shuttlecocks Tube of 6 (Yellow)", brand: "Yonex", mrp: 1250, discountPercent: 18, specs: { Durability: "Precision molded durable nylon skirt outlasts feather shuttles 4x", Flight: "Quick recovery flight pattern closest to tournament feather shuttles" } },
    { title: "Nivia Storm Football Rubber Molded Size 5 Match Ball (FIFA Quality)", brand: "Nivia", mrp: 1050, discountPercent: 30, specs: { Construction: "32-panel rubber molded construction suitable for hard, grassy and wet turf", Bladder: "Air-lock reinforced butyl bladder retains pressure for weeks" } },
    { title: "Nivia Top Grip Rubberized Heavy Duty Basketball Size 7", brand: "Nivia", mrp: 980, discountPercent: 28, specs: { Grip: "Pebbled deep channel rubber casing for maximum hand control outdoors", Approved: "Meets FIBA tournament specifications" } },
    { title: "Cosco Premier Volleyball Molded Synthetic Leather Size 4", brand: "Cosco", mrp: 950, discountPercent: 25, specs: { Outer: "Supple synthetic leather cover with soft hand-feel on spikes", Usage: "Ideal for outdoor beach and indoor hardwood court matches" } },
    { title: "Cosco Heavy Duty Tournament Rubber Tennis Balls Can of 3 (Fluorescent Yellow)", brand: "Cosco", mrp: 395, discountPercent: 20, specs: { Core: "Pressurized rubber core maintains uniform bounce on hard courts", Felt: "High-visibility extra duty needle-felt cover" } },
    { title: "Boldfit Heavy Duty Resistance Bands Set of 5 with Carry Bag", brand: "Boldfit", mrp: 1499, discountPercent: 55, specs: { Levels: "5 tension levels from 10 lbs to 50 lbs (stackable up to 150 lbs)", Material: "100% Natural Malaysian latex with snap-resistant carabiners" } },
    { title: "Boldfit High Density EVA Foam Roller 45cm for Muscle Myofascial Recovery", brand: "Boldfit", mrp: 1299, discountPercent: 45, specs: { Grid: "3D textured multi-density massage zones target deep tissue knots", Core: "Solid hollow ABS core supports up to 180kg without deforming" } },
    { title: "Strauss Anti-Skid Extra Thick Yoga & Exercise Mat 10mm with Carry Strap", brand: "Strauss", mrp: 1999, discountPercent: 50, specs: { Thickness: "10mm ultra-cushioned high-density NBR foam protects knees and spine", Surface: "Double-sided ribbed non-slip texture prevents mat slipping" } },
    { title: "Strauss High Speed Ball Bearing Skipping Rope with Adjustable Cable", brand: "Strauss", mrp: 699, discountPercent: 55, specs: { Bearings: "360-degree dual ball bearings ensure smooth 200 RPM rotations", Cable: "3-meter vinyl-coated steel wire cable cuts through air resistance" } },
    { title: "Speedo Biofuse 2.0 Anti-Fog UV Shield Swimming Goggles (Smoked Lens)", brand: "Speedo", mrp: 2499, discountPercent: 20, specs: { Seals: "Super-soft flexible gel seals adapt to face contours", PushButton: "Patented push-button mechanism for rapid micro-adjustments" } },
    { title: "Speedo Men's Essential Endurance+ Jammer Swimsuit (Chlorine-Resistant)", brand: "Speedo", mrp: 2999, discountPercent: 25, specs: { Fabric: "100% Chlorine-resistant Endurance+ quick-drying fabric", Fit: "Streamlined compression fit with internal drawstring waist" } },
    { title: "Everlast Pro Style Elite Training Boxing Gloves 14oz (Matte Black)", brand: "Everlast", mrp: 4499, discountPercent: 30, specs: { Foam: "Closed-cell dual-layer sandwich foam absorbs heavy impact", Wrist: "Evershield reinforced wrist padding prevents hyperextension" } },
    { title: "Everlast Heavy Canvas Unfilled Hanging Punching Bag 40-Inch", brand: "Everlast", mrp: 3499, discountPercent: 35, specs: { Material: "Reinforced synthetic polycanvas with heavy webbed nylon straps", Swivel: "Includes 360-degree rotating steel ceiling swivel mount" } },
    { title: "Garmin Forerunner 265 GPS AMOLED Running & Triathlon Smartwatch", brand: "Garmin", mrp: 50490, discountPercent: 10, specs: { Screen: "Vibrant 1.3\" AMOLED touchscreen with traditional 5-button control", Battery: "Up to 13 days in smartwatch mode, 20 hours GPS tracking" } },
    { title: "Garmin HRM-Pro Plus Premium Chest Strap Heart Rate Monitor", brand: "Garmin", mrp: 14990, discountPercent: 12, specs: { Accuracy: "Transmits real-time accurate HR data via ANT+ and Bluetooth BLE", Dynamics: "Captures vertical oscillation, ground contact time & stride length" } },
    { title: "Spalding NBA Official Size 7 Heritage Composite Leather Basketball", brand: "Spalding", mrp: 3999, discountPercent: 30, specs: { Cover: "Full composite leather with soft tacky feel for gym hardwood", Seams: "Deep shooter's seams facilitate fingertip alignment" } },
    { title: "Wilson Pro Staff 97 V14 Precision Performance Tennis Racket", brand: "Wilson", mrp: 26999, discountPercent: 15, specs: { Weight: "315g unstrung weight for advanced control and surgical precision", Construction: "Braid 45 carbon fiber arrangement enhances pocketing feel" } },
    { title: "Li-Ning Axforce 80 High-Carbon Badminton Racket (Chen Long Edition)", brand: "Li-Ning", mrp: 16990, discountPercent: 28, specs: { Frame: "TB Nano Dynamic-Optimum Frame with 6.6mm slim shaft", Tension: "Supports professional high stringing tension up to 31 lbs" } },
    { title: "Bowflex SelectTech 552 Rapid Dial Adjustable Dumbbells Pair (2kg to 24kg)", brand: "Bowflex", mrp: 39999, discountPercent: 20, specs: { Dial: "Replaces 15 pairs of traditional dumbbells with intuitive dial turn", Weight: "Adjusts in 1kg increments for progressive strength overload" } },
    { title: "TRX All-in-One Home Suspension Bodyweight Gym Training System", brand: "TRX", mrp: 14999, discountPercent: 25, specs: { Anchors: "Includes door anchor and suspension strap tested to support 400kg", Workouts: "Unlocks 300+ full-body compound workouts using bodyweight resistance" } },
    { title: "CamelBak Podium Big Chill 750ml Double-Walled Insulated Bike Bottle", brand: "CamelBak", mrp: 2299, discountPercent: 18, specs: { JetValve: "Self-sealing Jet Valve eliminates splatters and spills", Insulation: "Aerogel insulation keeps water cold 2x longer" } },
    { title: "Kobo Heavy Duty Cast Iron Kettlebell 16kg (Hammer Tone Finish)", brand: "Kobo", mrp: 4999, discountPercent: 40, specs: { Casting: "Solid one-piece cast iron with no welds or weak spots", Handle: "Smooth wide textured handle allows two-handed explosive swings" } },
    { title: "Vector X Professional Table Tennis Set (2 Rackets + 3 Balls + Cover)", brand: "Vector X", mrp: 1499, discountPercent: 45, specs: { Rubber: "ITTF approved tacky inverted rubber with 2mm high-elastic sponge", Blade: "5-ply Scandinavian birch wood blade for spin and speed" } },
    { title: "Proline Fitness Multi-Position Adjustable Incline Decline Flat Weight Bench", brand: "Proline", mrp: 12999, discountPercent: 40, specs: { Steel: "2x2 inch heavy 14-gauge triangular steel frame supports 300kg", Positions: "7 backrest ladder adjustments from 90 upright to 20 decline" } },
    { title: "Nivia Orthopedic Neoprene Knee Support Compression Sleeve Pair", brand: "Nivia", mrp: 899, discountPercent: 35, specs: { Compression: "Graduated 3D circular knit prevents meniscus strains during squats", Breathable: "Perforated neoprene vents excess sweat during intense cardio" } },
    { title: "Decathlon Quechua 20L Lightweight Daypack Hiking Backpack", brand: "Decathlon", mrp: 1299, discountPercent: 20, specs: { Comfort: "Padded back panel and ventilated 3D mesh shoulder straps", Compartments: "Main compartment, internal zip pocket and dual water bottle side meshes" } },
    { title: "PowerMax Fitness TDM-97 1.5HP Motorized Folding Electric Treadmill", brand: "PowerMax", mrp: 38990, discountPercent: 45, specs: { Motor: "1.5HP continuous DC motor with speed up to 10 km/h", Cushion: "Dual spring shock absorption deck protects runner joints" } }
  ],
  "toys-kids": [
    { title: "Lego Technic Porsche 911 RSR 42096 Advanced Sports Car Building Kit (1580 Pieces)", brand: "Lego", mrp: 17999, discountPercent: 15, specs: { Features: "Visible working differential, independent suspension and six-cylinder boxer engine", Scale: "Authentic 1:10 replica with aerodynamic bodywork and white rims" } },
    { title: "Lego Creator Expert Botanical Collection Flower Bouquet 10280 (756 Pieces)", brand: "Lego", mrp: 5999, discountPercent: 12, specs: { Design: "Created entirely from plant-based plastic elements made with sugarcane", Blooms: "Includes roses, snapdragons, poppies, asters and daisies" } },
    { title: "Lego City Police Station 60316 Modular 3-Level Jailbreak Toy Playset (668 Pieces)", brand: "Lego", mrp: 6999, discountPercent: 18, specs: { Vehicles: "Includes police patrol car, helicopter and criminal's customized garbage truck", Figures: "5 minifigures including 3 Lego City TV characters and police dog" } },
    { title: "Hot Wheels 20-Car Collector Gift Pack Die-Cast 1:64 Scale Vehicles", brand: "Hot Wheels", mrp: 2999, discountPercent: 20, specs: { Assortment: "Classic muscle cars, hypercars, trucks and vintage convertibles", Materials: "Die-cast metal body with low-friction fast-rolling racing axles" } },
    { title: "Hot Wheels Track Builder Multi-Loop Stunt Box with 1 Die-Cast Car", brand: "Hot Wheels", mrp: 3499, discountPercent: 25, specs: { Stunts: "Connect tracks for 10-foot long high-speed multi-loop stunts", Storage: "All track pieces snap compactly inside the portable storage box" } },
    { title: "Nerf Elite 2.0 Commander RD-6 Rotating Drum Dart Blaster (12 Official Darts)", brand: "Nerf", mrp: 1499, discountPercent: 30, specs: { Drum: "6-dart rotating cylinder fires darts up to 90 feet (27 meters)", Tactical: "3 tactical rails and barrel/stock attachment points for customization" } },
    { title: "Nerf DinoSquad Armorstrike Motorized Drop-In Drum Dart Blaster", brand: "Nerf", mrp: 3299, discountPercent: 28, specs: { Design: "Fearsome Ankylosaurus dinosaur design details", Drum: "8-dart rotating drum with 8 additional dart storage on handle" } },
    { title: "Barbie Malibu Dreamhouse 3-Story Transforming Dollhouse with 70+ Accessories", brand: "Barbie", mrp: 14999, discountPercent: 22, specs: { Rooms: "8 rooms across 3 floors including working elevator, party room with DJ booth", Slide: "Spiral slide leads straight into water pool" } },
    { title: "Barbie Color Reveal Mermaid Surprise Dolls with 7 Reveal Surprises", brand: "Barbie", mrp: 1999, discountPercent: 25, specs: { Reveal: "Fill tube with warm water, dip doll in and swirl to reveal doll look", Transformations: "Cold water transforms makeup and hair color again and again" } },
    { title: "Hasbro Gaming Monopoly Classic Family Board Game with Die-Cast Tokens", brand: "Hasbro", mrp: 1299, discountPercent: 20, specs: { Gameplay: "Fast-dealing property trading game for 2 to 8 players", Includes: "Full gameboard, 8 classic tokens, 28 Title Deed cards and Monopoly money" } },
    { title: "Hasbro Jenga Classic Hardwood Blocks Stacking Game (54 Precision Blocks)", brand: "Hasbro", mrp: 1199, discountPercent: 18, specs: { Material: "Genuine polished precision-crafted hardwood blocks", Challenge: "Test of dexterity, patience and gravity-defying strategy" } },
    { title: "Fisher-Price Deluxe Kick & Play Piano Gym with Smart Stages Technology", brand: "Fisher-Price", mrp: 4999, discountPercent: 25, specs: { Stages: "4 ways to play as baby grows: Lay & play, Tummy time, Sit & play, Take along", Music: "Light-up piano keys play real notes and 65+ songs and sounds" } },
    { title: "Fisher-Price Rock-a-Stack Color Sorting Stacking Ring Toy for Toddlers", brand: "Fisher-Price", mrp: 499, discountPercent: 20, specs: { Skills: "Teaches relative size sorting, color recognition and hand-eye coordination", Base: "Bat-at rocker base wobbles back and forth playfully" } },
    { title: "Play-Doh Kitchen Creations Ultimate Barbecue Playset with 10 Colors", brand: "Play-Doh", mrp: 1899, discountPercent: 30, specs: { Tools: "Grill press shapes burgers, hot dogs and play steaks", Compound: "Includes 10 non-toxic squishy Play-Doh modeling compound cans" } },
    { title: "Play-Doh Drill 'n Fill Dentist Playset with Cavity Making Molds", brand: "Play-Doh", mrp: 1699, discountPercent: 25, specs: { BatteryDrill: "Electric hand-powered drill buzzes to drill cavities", Braces: "Roller stamps realistic braces and toothbrush squeezes toothpaste" } },
    { title: "Beyblade Burst QuadDrive Cosmic Vector Battle Stadium Arena Set", brand: "Beyblade", mrp: 4499, discountPercent: 35, specs: { Stadium: "Cosmic Vector Beystadium with 4 Quad levels for intense trajectory battles", Tops: "Includes 2 right-spinning QuadDrive battle tops and 2 launchers" } },
    { title: "Mattel Uno Flip! Double-Sided Reversible Card Game (Light & Dark Sides)", brand: "Mattel", mrp: 299, discountPercent: 15, specs: { FlipRule: "Play the Flip card and the entire deck and all hands flip to Dark side", Penalties: "Dark side features aggressive Draw 5 and Skip Everyone penalty cards" } },
    { title: "Mattel Pictionary Air Next-Generation Digital Drawing Party Game", brand: "Mattel", mrp: 1999, discountPercent: 35, specs: { Tech: "Draw in the air with light-up pen and sketch appears live on smartphone/TV screen", App: "Free Pictionary Air app records hilarious team guesses" } },
    { title: "Funskool Giggles Multi-Activity Musical Sturdy Baby Walker with Blocks", brand: "Funskool", mrp: 1999, discountPercent: 25, specs: { Stability: "Wide anti-tip wheelbase provides firm stability for first baby steps", Activities: "Shape sorting slots, sliding clock hands and spinning rattle beads" } },
    { title: "Funskool Travel Mastermind Code-Breaking Family Strategy Game", brand: "Funskool", mrp: 549, discountPercent: 20, specs: { Logic: "Deductive reasoning battle between CodeMaker and CodeBreaker", Design: "Compact travel case locks pegs securely in place on road trips" } },
    { title: "Melissa & Doug 100-Piece Triple-Loop Wooden Railway Train Track Set", brand: "Melissa & Doug", mrp: 9999, discountPercent: 22, specs: { Wood: "Solid natural birch wood tracks connect seamlessly", Compatibility: "Compatible with all popular wooden railway engine systems" } },
    { title: "Paw Patrol The Mighty Movie Transforming City Fire Rescue Truck with Marshall", brand: "Paw Patrol", mrp: 5999, discountPercent: 28, specs: { Action: "Ladder extends over 2 feet high with flashing emergency lights and sounds", Figure: "Includes Marshall pup figure in his official translucent movie uniform" } },
    { title: "Thomas & Friends Motorized TrackMaster Talking Percy Train Engine", brand: "Thomas & Friends", mrp: 1799, discountPercent: 20, specs: { Voices: "Push the button on top to hear Percy speak iconic phrases and whistle chimes", Track: "Flip the switch to send Percy racing along any TrackMaster plastic rails" } },
    { title: "Rubik's Official 3x3 Magnetic Speed Cube for Speed Cubing Competitions", brand: "Rubik's", mrp: 1499, discountPercent: 25, specs: { Magnets: "48 internal micro-magnets provide instantaneous snapping alignment", Mechanism: "Upgraded spherical core prevents lock-ups and corner twists" } },
    { title: "LeapFrog 2-in-1 Touch & Learn Bilingual Interactive Activity Tablet", brand: "LeapFrog", mrp: 2799, discountPercent: 20, specs: { Screen: "Touch-sensitive screen switches between puppy play mode and pretend tablet", Curriculum: "Introduces letters, numbers, early phonics, shapes and animal habits" } },
    { title: "Skillmatics Educational Board Game Guess in 10 Countries of the World", brand: "Skillmatics", mrp: 599, discountPercent: 25, specs: { Cards: "50 game cards packed with fascinating geographic clues and trivia", Question: "Ask up to 10 clever yes/no questions to guess the secret country" } },
    { title: "Shifu Orboot Earth Interactive AR Globe for Kids (No Borders, App Driven)", brand: "Shifu", mrp: 2499, discountPercent: 30, specs: { ARTech: "Scan globe with smartphone/tablet to bring 400+ 3D animals & monuments to life", Explorer: "Interactive quizzes and voice-acted cultural tales across 6 continents" } },
    { title: "Funskool Play-Doh Rainbow 8-Pack Non-Toxic Squishy Dough", brand: "Play-Doh", mrp: 499, discountPercent: 15, specs: { Colors: "8 vibrant compound cans: red, orange, yellow, green, blue, purple, white, pink", Safety: "Safe, non-toxic, non-staining recipe trusted by parents worldwide" } },
    { title: "Mattel Scrabble Original English Crossword Word Board Game", brand: "Mattel", mrp: 999, discountPercent: 20, specs: { Board: "Includes official 100 letter tiles, 4 letter racks and game guide", Brain: "The world's favorite vocabulary and strategic wordplay game" } },
    { title: "Smartivity Hydraulic Crane STEM Educational DIY Wooden Toy Kit", brand: "Smartivity", mrp: 999, discountPercent: 25, specs: { Physics: "Build a working hydraulic crane using syringes and water pressure", Material: "Engineered laser-cut pine wood with zero glue or tools required" } }
  ]
};

// Generates 55+ distinct products for a given category
function generate55MoreItems(catSlug) {
  const specificList = newCatalogData[catSlug] || [];
  const items = [...specificList];

  const brandPicks = {
    "mobiles-tablets": ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Vivo", "Realme", "Motorola", "Nothing", "iQOO", "POCO", "Asus", "Lenovo"],
    "electronics-audio": ["Sony", "boAt", "JBL", "Bose", "Sennheiser", "Marshall", "Harman Kardon", "Canon", "GoPro", "Apple", "Noise", "Audio-Technica"],
    "laptops-computers": ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Logitech", "Keychron", "Razer", "Samsung", "LG", "Corsair"],
    "fashion-apparel": ["Levi's", "Allen Solly", "Van Heusen", "Zara", "Nike", "Adidas", "Puma", "H&M", "Biba", "Manyavar", "Raymond", "Fabindia"],
    "footwear": ["Nike", "Adidas", "Puma", "Asics", "New Balance", "Woodland", "Red Tape", "Crocs", "Skechers", "Bata", "Clarks", "Converse", "Vans"],
    "home-kitchen": ["Philips", "Prestige", "Hawkins", "Dyson", "Kent", "Eureka Forbes", "Bajaj", "Havells", "Milton", "Bosch", "Pigeon", "Wonderchef"],
    "beauty-grooming": ["Lakme", "L'Oreal Paris", "Nivea", "Mamaearth", "The Derma Co", "Cetaphil", "Neutrogena", "Maybelline", "Philips", "Braun", "The Ordinary"],
    "grocery-gourmet": ["Tata Sampann", "Fortune", "Daawat", "Aashirvaad", "Saffola", "Tata Tea", "Nescafe", "Kellogg's", "Hershey's", "Dabur", "Borges"],
    "sports-fitness": ["Decathlon", "Yonex", "Nivia", "Cosco", "Boldfit", "Strauss", "Speedo", "Everlast", "Garmin", "Spalding", "Wilson", "Bowflex"],
    "toys-kids": ["Lego", "Hot Wheels", "Nerf", "Barbie", "Hasbro", "Fisher-Price", "Play-Doh", "Beyblade", "Mattel", "Funskool", "Rubik's", "Melissa & Doug"]
  };

  const genericTitles = {
    "mobiles-tablets": ["Ultra 5G Flagship Edition", "Pro Max Cellular Device", "Special Edition AMOLED Mobile", "Gaming Handset Boosted Turbo", "Slim Fold Enterprise Handset"],
    "electronics-audio": ["True Wireless Earbuds with ANC", "Portable High-Fidelity Bluetooth Speaker", "Over-Ear Studio Reference Headphones", "3D Cinematic Dolby Atmos Soundbar", "4K Ultra-Smooth Action Camera"],
    "laptops-computers": ["Ultrabook Laptop 16GB RAM 512GB SSD", "High-FPS Gaming Laptop RTX Dedicated", "Ergonomic Precision Wireless Mouse", "Custom Mechanical Mechanical Keyboard", "Ultra-Wide QHD IPS Curved Monitor"],
    "fashion-apparel": ["Slim Fit Breathable Cotton Chinos", "Pure Linen Casual Camp Shirt", "Comfort Fleece Zip-Up Hoodie", "Tailored Fit Formal Dress Suit", "Designer Ethnic Embroidered Kurta Set"],
    "footwear": ["Cushioned Distance Road Running Shoes", "Retro Streetwear Leather Sneakers", "Handcrafted Oiled Leather Chelsea Boots", "Ergonomic Slip-In Orthopedic Loafers", "Water-Resistant All-Terrain Hiking Boots"],
    "home-kitchen": ["Digital Rapid Air Smart Fryer 5L", "1000W Heavy Duty 4-Jar Mixer Grinder", "Tri-Ply Stainless Steel Pressure Cooker", "Cordless Lightweight Stick Vacuum", "RO+UV Multi-Stage Alkaline Water Purifier"],
    "beauty-grooming": ["Hydrating Hyaluronic Acid Glow Serum", "Pure Cold-Pressed Botanical Elixir Oil", "Waterproof Smudge-Resistant Liquid Eyeliner", "Precision Beard & Hair Trimmer 40 Lengths", "Broad Spectrum SPF 50 Mineral Sunscreen"],
    "grocery-gourmet": ["Unpolished Organic Pulses 1kg", "Cold-Pressed Pure Cooking Oil 1L", "Aged Traditional Long Grain Basmati Rice 5kg", "Gourmet Single Origin Arabica Coffee 250g", "100% Pure Raw Mountain Forest Honey 500g"],
    "sports-fitness": ["Solid Cast Iron Hex Dumbbell Pair 12kg", "High-Carbon Graphite Badminton Racket", "FIFA Match Standard Molded Football", "High Density Non-Slip Yoga & Fitness Mat", "Thermal Insulated Stainless Shaker 750ml"],
    "toys-kids": ["Speed Champion Building Block Supercar", "Die-Cast Collector 1:64 Scale Vehicle Set", "Tactical Foam Dart Rapid Blaster", "Classic Deluxe Family Strategy Board Game", "Non-Toxic Clay Modeling Dough Set 12-Pack"]
  };

  const imagesForCat = {
    "mobiles-tablets": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
    ],
    "electronics-audio": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"
    ],
    "laptops-computers": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800"
    ],
    "fashion-apparel": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800"
    ],
    "footwear": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800"
    ],
    "home-kitchen": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
      "https://images.unsplash.com/photo-1585698114474-b52971d2b8fe?w=800",
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800"
    ],
    "beauty-grooming": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
      "https://images.unsplash.com/photo-1608248597359-5974c5d57b0d?w=800"
    ],
    "grocery-gourmet": [
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800",
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800"
    ],
    "sports-fitness": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800"
    ],
    "toys-kids": [
      "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
    ]
  };

  const pool = genericTitles[catSlug] || ["Pro Edition", "Premium Selection"];
  const brands = brandPicks[catSlug] || ["Samsung", "Sony", "Philips", "Nike", "Apple"];
  const catImgs = imagesForCat[catSlug] || ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800"];

  let count = items.length;
  // Make sure we have 55 items in this additional batch!
  while (count < 55) {
    const brand = brands[count % brands.length];
    const titleBase = pool[count % pool.length];
    const mrp = Math.floor(1499 + count * 520 + ((count % 5) * 850));
    const discount = 10 + ((count * 4) % 40);

    items.push({
      title: `${brand} ${titleBase} Mark-${count + 1}`,
      brand: brand,
      mrp: mrp,
      discountPercent: discount,
      specs: {
        "Brand": brand,
        "Authenticity": "100% Genuine Brand Sourced",
        "Series": `Signature Pro 2026-${count + 1}`,
        "Quality Check": "Dermatologically/Lab Certified Passed"
      }
    });
    count++;
  }

  return items;
}

async function main() {
  console.log("=== STARTING BATCH INJECTION: ADDING 55 PRODUCTS TO ALL CATEGORIES ===");

  const sellerProfile = await prisma.sellerProfile.findFirst();
  if (!sellerProfile) {
    throw new Error("No seller profile found in database!");
  }

  const categories = await prisma.category.findMany();
  console.log(`Found ${categories.length} categories to enrich.`);

  let grandTotalAdded = 0;

  for (const cat of categories) {
    const initialCount = await prisma.product.count({ where: { categoryId: cat.id } });
    console.log(`\nProcessing category: ${cat.name} (${cat.slug}) | Current count: ${initialCount}`);

    const newItems = generate55MoreItems(cat.slug);
    console.log(`Generated ${newItems.length} fresh products for ${cat.name}`);

    let addedForCat = 0;
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      const batchNum = initialCount + i + 1;
      const cleanBrandSlug = item.brand.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const cleanTitleSlug = item.title.toLowerCase().replace(/[^a-z0-9]/g, "-").substring(0, 30);
      const uniqueSlug = `${cleanBrandSlug}-${cleanTitleSlug}-${Date.now().toString().slice(-4)}-${batchNum}`;
      const sku = `${item.brand.substring(0, 3).toUpperCase()}-${cat.slug.substring(0, 3).toUpperCase()}-${3000 + batchNum}`;
      
      const basePrice = item.mrp || 2499;
      const discount = item.discountPercent || 15;
      const salePrice = Math.round(basePrice * (1 - discount / 100));

      const imgPool = [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
      ];
      const primaryImg = imgPool[(i + batchNum) % imgPool.length];

      await prisma.product.create({
        data: {
          title: item.title,
          slug: uniqueSlug,
          brand: item.brand, // Strict rule: genuine brand only, NEVER BajrangiStore!
          manufacturer: `${item.brand} Global Industries`,
          modelNumber: `${item.brand.substring(0, 2).toUpperCase()}-2026-${batchNum}`,
          sku: sku,
          categoryId: cat.id,
          sellerId: sellerProfile.id,
          basePrice: basePrice,
          salePrice: salePrice,
          discountPercent: discount,
          rating: +(4.1 + Math.random() * 0.8).toFixed(1),
          reviewCount: Math.floor(35 + Math.random() * 950),
          stock: Math.floor(20 + Math.random() * 150),
          isFeatured: batchNum % 6 === 0,
          isDealOfTheDay: batchNum % 11 === 0,
          isFlashDeal: batchNum % 14 === 0,
          warranty: "1 Year Official Manufacturer Brand Warranty",
          returnPolicy: "7 Days Hassle-Free Replacement & Doorstep Return",
          tags: `${item.brand.toLowerCase()},${cat.slug},bestseller,trending,authentic`,
          description: `Original ${item.brand} genuine product featuring cutting-edge engineering, authentic warranty coverage, and high-speed doorstep dispatch from BajrangiStore.`,
          highlights: JSON.stringify([
            `Authentic ${item.brand} certified materials and hardware`,
            "100% Brand New in factory sealed packaging",
            "Eligible for Free Doorstep Express Delivery & 7-Day Return Policy",
            "Full official brand invoice and warranty documentation included"
          ]),
          specs: JSON.stringify(item.specs || {
            "Brand": item.brand,
            "Origin": "Official Brand Manufacturing",
            "Condition": "Brand New Sealed",
            "Authentication": "100% Genuine Certified"
          }),
          images: {
            create: [
              { url: primaryImg, isPrimary: true, sortOrder: 0 },
              { url: imgPool[(i + 1) % imgPool.length], isPrimary: false, sortOrder: 1 }
            ]
          },
          variants: {
            create: [
              {
                name: "Standard Retail Edition",
                sku: `${sku}-STD`,
                price: basePrice,
                salePrice: salePrice,
                stock: 40,
                attributes: JSON.stringify({ edition: "Standard Retail", warranty: "1 Year" })
              }
            ]
          }
        }
      });

      addedForCat++;
      grandTotalAdded++;
    }

    const finalCount = await prisma.product.count({ where: { categoryId: cat.id } });
    console.log(`✅ [${cat.name}] successfully updated: ${initialCount} -> ${finalCount} products (+${addedForCat})`);
  }

  console.log(`\n========================================`);
  console.log(`GRAND TOTAL PRODUCTS ADDED: ${grandTotalAdded}`);
  const overallCount = await prisma.product.count();
  console.log(`TOTAL PRODUCTS NOW IN BAJRANGISTORE: ${overallCount}`);
  
  const distinctBrands = await prisma.product.findMany({
    select: { brand: true },
    distinct: ["brand"]
  });
  console.log(`DISTINCT AUTHENTIC BRANDS: ${distinctBrands.length}`);

  const illegalBrandCheck = await prisma.product.count({
    where: { brand: { contains: "Bajrangi" } }
  });
  console.log(`PRODUCTS WITH 'Bajrangi' AS BRAND: ${illegalBrandCheck} (MUST BE 0)`);
  console.log(`========================================\n`);
}

main()
  .catch((e) => {
    console.error("Error adding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
