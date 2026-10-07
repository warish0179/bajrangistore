const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 55+ highly diverse product varieties tailored specifically for each of the 10 categories shown in the categories list
const varietiesData = {
  "beauty-grooming": [
    { title: "Dyson Supersonic Nural Intelligent Sensor Hair Dryer (Strawberry Bronze)", brand: "Dyson", mrp: 41900, discountPercent: 8, specs: { ScalpProtect: "ToF sensor measures distance to protect scalp moisture", Attachments: "5 styling attachments including Wave+Curl diffuser" } },
    { title: "Philips BHH880/10 Heated Hair Straightening Brush with Keratin Infusion", brand: "Philips", mrp: 3495, discountPercent: 25, specs: { Coating: "Keratin-infused tourmaline ceramic bristles", Tech: "ThermoProtect technology maintains constant temperature" } },
    { title: "Braun Silk-epil 9 Flex 9-300 Beauty Set Wet & Dry Epilator", brand: "Braun", mrp: 18999, discountPercent: 20, specs: { Head: "World's 1st fully flexible epilator head reaches every contour", MicroGrip: "Micro-Grip tweezer technology captures 0.5mm hair" } },
    { title: "Olay Regenerist Micro-Sculpting Face Cream with Niacinamide & Peptides 50g", brand: "Olay", mrp: 1699, discountPercent: 22, specs: { Benefit: "Visibly reduces 10 years of wrinkles in 28 days", Actives: "Amino-peptide complex + Niacinamide (Vitamin B3)" } },
    { title: "Innisfree Super Volcanic Pore Clay Mask 2X Deep Cleansing 100ml", brand: "Innisfree", mrp: 1100, discountPercent: 15, specs: { Clay: "Formulated with Jeju Volcanic Cluster Spheres", PoreCare: "Intensive 10-in-1 pore tightening and sebum clearing" } },
    { title: "Laneige Lip Sleeping Mask EX Intense Berry Hydration 20g", brand: "Laneige", mrp: 1450, discountPercent: 12, specs: { Technology: "Berry Fruit Complex & Vitamin C rich in antioxidants", Texture: "Melts away dead skin cells on lips overnight" } },
    { title: "Oral-B iO Series 9 Electric Toothbrush with Magnetic Technology (Onyx Black)", brand: "Oral-B", mrp: 24999, discountPercent: 28, specs: { AI: "3D Teeth Tracking with AI guides 100% brushing coverage", Display: "Interactive color display greets you and smiles when done" } },
    { title: "MAC Studio Fix Powder Plus Foundation 15g (NC25)", brand: "MAC", mrp: 3900, discountPercent: 10, specs: { Wear: "Non-fading 24-hour velvety matte coverage", Formula: "Oil-controlling and non-comedogenic" } },
    { title: "Titan Skinn Raw Eau De Parfum for Men Long Lasting 100ml", brand: "Titan", mrp: 2795, discountPercent: 18, specs: { Scent: "Crisp citrus blend of Bergamot and Mandarin with Indonesian Patchouli", Longevity: "Crafted in France with 8+ hours sillage" } },
    { title: "Titan Skinn Celeste Eau De Parfum for Women 100ml", brand: "Titan", mrp: 2795, discountPercent: 18, specs: { Notes: "Sparkling peach and blood orange bouquet with white floral heart", Origin: "Master perfumer formulation from Grasse, France" } },
    { title: "Kama Ayurveda Kumkumadi Miraculous Ayurvedic Night Serum 12ml", brand: "Kama Ayurveda", mrp: 3195, discountPercent: 10, specs: { Ayurvedic: "Prescribed in ancient text Ashtanga Hrudaya with rare saffron", Efficacy: "Clinically proven to brighten skin pigmentation by 28%" } },
    { title: "The Body Shop British Rose Shower Gel 250ml (Vegan Certified)", brand: "The Body Shop", mrp: 495, discountPercent: 15, specs: { Fragrance: "Infused with organically grown hand-picked English roses", Bottle: "100% recycled plastic packaging" } },
    { title: "Real Techniques Everyday Essentials 4-Piece Makeup Brush Set with Sponge", brand: "Real Techniques", mrp: 1999, discountPercent: 25, specs: { Bristles: "UltraPlush synthetic cruelty-free bristles", Includes: "RT 400 blush, RT 300 crease, RT 402 setting, RT 200 foundation brush" } },
    { title: "Beardo Dark Fantasy Activated Charcoal Peel-Off Face Mask 100g", brand: "Beardo", mrp: 350, discountPercent: 25, specs: { Charcoal: "Deep detoxifying activated bamboo charcoal", Removal: "Removes stubborn blackheads, whiteheads and pollutant deposits" } },
    { title: "Bombay Shaving Co 6-in-1 Precision Grooming Kit for Men", brand: "Bombay Shaving Co", mrp: 2999, discountPercent: 40, specs: { Trimmer: "Waterproof IPX7 body groomer with ceramic skin-safe blades", Attachments: "Beard, ear, nose, body and detail precision trimmers" } },
    { title: "Scholl Velvet Smooth Express Pedi Electric Foot File Callus Remover", brand: "Scholl", mrp: 1899, discountPercent: 30, specs: { Roller: "Extra coarse diamond crystal roller head", Safety: "Safety stop mechanism stops roller if pressed too hard" } },
    { title: "Isntree Hyaluronic Acid Watery Sun Gel SPF 50+ PA++++ 50ml", brand: "Isntree", mrp: 1650, discountPercent: 18, specs: { Moisture: "8 types of Hyaluronic Acid replenish deep moisture", Cast: "Zero sticky residue zero white cast certified reef-safe" } },
    { title: "Colgate ProClinical 150 Charcoal Battery Powered Sonic Toothbrush", brand: "Colgate", mrp: 999, discountPercent: 30, specs: { Sonic: "20,000 sonic vibrations per minute", Charcoal: "Charcoal-infused antibacterial multi-directional bristles" } },
    { title: "Old Spice Original Classic After Shave Splash Lotion 150ml Atomizer", brand: "Old Spice", mrp: 450, discountPercent: 15, specs: { Aroma: "The unmistakably masculine brisk classic fragrance", Cool: "Cools, tones and refreshes razor nicked skin instantly" } },
    { title: "Burt's Bees 100% Natural Moisturizing Beeswax Lip Balm with Peppermint", brand: "Burt's Bees", mrp: 499, discountPercent: 15, specs: { Wax: "Beeswax conditions skin while antioxidant Vitamin E moisturizes", Tingle: "Peppermint oil adds a refreshing cooling tingle" } },
    { title: "Dove Deeply Nourishing Body Wash with NutriumMoisture 800ml Pump", brand: "Dove", mrp: 525, discountPercent: 20, specs: { Cleansing: "Mild sulfate-free cleansers gentle on skin microbiome", Moisture: "Instant soft skin from the very first shower" } },
    { title: "Bella Vita Luxury Unisex Perfume Gift Set 4x20ml (Klub, White, Skai, Fresh)", brand: "Bella Vita", mrp: 849, discountPercent: 35, specs: { Variety: "4 distinct luxury EDP fragrances for daytime, office & party wear", Size: "Travel friendly pocket-size atomizers" } },
    { title: "Davidoff Cool Water Man Eau De Toilette 125ml Natural Spray", brand: "Davidoff", mrp: 5900, discountPercent: 35, specs: { Accord: "Iconic fresh aromatic marine scent with peppermint and lavender", Sillage: "Signature masculine oceanic classic" } },
    { title: "Jaguar Classic Black Eau De Toilette for Men 100ml", brand: "Jaguar", mrp: 3600, discountPercent: 40, specs: { Notes: "Green apple, tangerine and bitter orange with spicy cardamom base", Bottle: "Sleek chrome and black lacquered heavy glass flacon" } },
    { title: "Nyx Professional Makeup Matte Finish Long Lasting Setting Spray 60ml", brand: "Nyx", mrp: 875, discountPercent: 15, specs: { Hold: "Locks makeup in place for up to 16 hours without shine", Weight: "Ultra-fine translucent mist feels weightless on skin" } },
    { title: "Indulekha Bringha Ayurvedic Hair Fall Treatment Oil with Applicator 100ml", brand: "Indulekha", mrp: 432, discountPercent: 12, specs: { Roots: "Selfie comb applicator dispenses oil directly onto scalp roots", Clinical: "Clinically proven to grow new hair in 4 months" } },
    { title: "Kesh King Ayurvedic Anti Hairfall Hair Oil with 21 Rare Herbs 300ml", brand: "Kesh King", mrp: 399, discountPercent: 15, specs: { Herbology: "Prepared using Tel Pak Vidhi with Bhringraja, Amalaki and Brahmi", Certification: "Certified by National Institute of Ayurveda" } },
    { title: "Parachute Advansed Aloe Vera Enriched Coconut Hair Oil 400ml", brand: "Parachute", mrp: 280, discountPercent: 20, specs: { Softness: "Conditions hair making it 2x softer and silky smooth", Light: "Non-sticky featherlight formula with pleasant aroma" } },
    { title: "Himalaya Herbals Foot Care Cream with Sal Tree & Fenugreek 100g", brand: "Himalaya", mrp: 175, discountPercent: 15, specs: { Healing: "Soothes cracked dry heels in just 72 hours", Herbs: "Sal Tree extract has antimicrobial and anti-inflammatory properties" } },
    { title: "Vega 3-in-1 Hair Styler (Straightener, Curler & Crimper) VHSCC-01", brand: "Vega", mrp: 1999, discountPercent: 30, specs: { Styling: "Switch effortlessly between poker straight, crimped texture and bouncy curls", Plates: "Ceramic coated plates with 360 swivel cord" } }
  ],
  "electronics-audio": [
    { title: "Rode Wireless PRO Dual-Channel Compact Wireless Microphone System with 32-Bit Float", brand: "Rode", mrp: 44990, discountPercent: 12, specs: { Audio: "32-bit float on-board recording prevents audio clipping", Range: "Over 260m ultra-stable 2.4GHz series IV transmission" } },
    { title: "DJI Mic 2 (2 TX + 1 RX + Charging Case) Dual-Channel Intelligent Audio", brand: "DJI", mrp: 35990, discountPercent: 10, specs: { NoiseCancel: "Intelligent noise cancelling for ultra-clear dialogue", Battery: "18-hour operating time with magnetic fast charging case" } },
    { title: "Blue Yeti USB Condenser Multi-Pattern Microphone for Podcasting (Blackout)", brand: "Logitech", mrp: 12995, discountPercent: 20, specs: { Patterns: "4 Pickup Patterns: Cardioid, Omni, Bidirectional, Stereo", Controls: "Headphone volume, pattern selection, instant mute and mic gain" } },
    { title: "Bose Frames Tenor Audio Bluetooth Sunglasses with Polarized Lenses", brand: "Bose", mrp: 21900, discountPercent: 25, specs: { OpenEar: "Bose Open Ear Audio technology plays rich sound directly to your ears", Lenses: "Polarized scratch and shatter-resistant lenses" } },
    { title: "JBL GO 3 Ultra-Portable Waterproof Bluetooth Speaker (Squad Camo)", brand: "JBL", mrp: 3999, discountPercent: 28, specs: { Compact: "Pocket-sized design with integrated loop cord", Protection: "IP67 waterproof and dustproof for beach and shower" } },
    { title: "Logitech Brio 4K Ultra HD Pro Webcam with RightLight 3 HDR", brand: "Logitech", mrp: 24995, discountPercent: 32, specs: { Resolution: "4K UHD at 30fps or 1080p at 60fps", FieldOfView: "Adjustable 65, 78 and 90 degree field of view" } },
    { title: "Elgato Facecam Full HD 1080p60 Studio Grade Streaming Webcam", brand: "Elgato", mrp: 16999, discountPercent: 18, specs: { Sensor: "Sony STARVIS CMOS sensor optimized for indoor lighting", Lens: "All-glass Elgato Prime Lens f/2.4 24mm equivalent" } },
    { title: "Elgato Stream Deck MK.2 15 Customizable LCD Macro Keys", brand: "Elgato", mrp: 15999, discountPercent: 15, specs: { Keys: "15 tactile LCD keys trigger unlimited actions across apps", Custom: "Interchangeable magnetic faceplates and detachable stand" } },
    { title: "TP-Link Deco XE75 Pro Tri-Band WiFi 6E Mesh System (Pack of 2)", brand: "TP-Link", mrp: 29999, discountPercent: 25, specs: { Band: "WiFi 6E Tri-Band speeds up to 5400 Mbps with 6GHz band", Coverage: "Covers large homes up to 5,500 sq. ft with zero dead zones" } },
    { title: "Netgear Nighthawk Pro Gaming XR1000 WiFi 6 Router with DumaOS 3.0", brand: "Netgear", mrp: 28999, discountPercent: 20, specs: { Gaming: "DumaOS 3.0 reduces ping spikes by up to 93%", Speed: "AX5400 WiFi 6 Dual-Band speeds" } },
    { title: "Anker 737 Power Bank (PowerCore 24K) 140W High-Speed Output with Smart Display", brand: "Anker", mrp: 14999, discountPercent: 20, specs: { Output: "Ultra-powerful 140W fast-charging charges MacBook Pro to 50% in 40 mins", Display: "Smart digital display shows real-time output wattage and battery health" } },
    { title: "Ambrane 20000mAh 65W Fast Charging Metal Power Bank (Stylo Pro)", brand: "Ambrane", mrp: 3999, discountPercent: 38, specs: { Compatibility: "Powers Type-C laptops, iPhones, and Android devices simultaneously", Body: "Durable aluminum alloy metallic shell" } },
    { title: "TP-Link Tapo C225 Pan/Tilt 2K QHD AI Smart Home Security Camera", brand: "TP-Link", mrp: 4999, discountPercent: 35, specs: { Resolution: "2K QHD (2560x1440) with physical privacy mode", AI: "Smart AI detection identifies people, pets, baby crying and glass breaks" } },
    { title: "XGIMI MoGo 2 Pro 1080p Portable Projector with Auto Keystone & Dolby Audio", brand: "XGIMI", mrp: 49999, discountPercent: 18, specs: { Picture: "400 ISO Lumens 1080p FHD with 90% DCI-P3 color gamut", Setup: "Intelligent Screen Alignment and Obstacle Avoidance" } },
    { title: "Epson EpiqVision Mini EF-12 Smart Streaming Laser Projector (Sound by Yamaha)", brand: "Epson", mrp: 89999, discountPercent: 15, specs: { Display: "3-Chip 3LCD Laser Technology produces up to 150\" image", Audio: "Custom audiophile sound system tuned by Yamaha" } },
    { title: "Audio-Technica AT-LP60X-GM Fully Automatic Belt-Drive Stereo Turntable", brand: "Audio-Technica", mrp: 19990, discountPercent: 18, specs: { Speeds: "33-1/3 RPM and 45 RPM speeds with anti-resonance die-cast aluminum platter", Cartridge: "Integral Dual Magnet phono cartridge with replaceable diamond stylus" } },
    { title: "Amazon Echo Show 8 (2nd Gen) HD Smart Display with 13MP Auto-Framing Camera", brand: "Amazon", mrp: 13999, discountPercent: 36, specs: { Screen: "8\" HD touchscreen with adaptive color balance", Audio: "Stereo speakers deliver rich deep sound" } },
    { title: "Google Nest Hub (2nd Gen) Smart Home Display with Sleep Sensing (Chalk)", brand: "Google", mrp: 7999, discountPercent: 25, specs: { Display: "7\" touchscreen with Soli radar Sleep Sensing technology", Smart: "Controls thousands of compatible smart home lights and appliances" } },
    { title: "Sony ICD-TX660 Digital Voice Recorder with OLED Display & One-Push Recording", brand: "Sony", mrp: 14990, discountPercent: 15, specs: { Memory: "16GB built-in memory stores up to 5000 files", Thickness: "Ultra-slim 7.4mm metallic clip design fits into shirt pocket" } },
    { title: "Elgato HD60 X External Video Capture Card (4K60 HDR10 Pass-through)", brand: "Elgato", mrp: 19999, discountPercent: 15, specs: { Quality: "Capture 1080p60 HDR10 or 4K30 with zero-lag pass-through", Compatibility: "Plug and play with PS5, Xbox Series X/S, PC and Mac" } },
    { title: "Aura Carver 10.1\" HD Smart Digital WiFi Cloud Photo Frame (Gravel)", brand: "Aura", mrp: 16999, discountPercent: 15, specs: { Sharing: "Free unlimited cloud storage for friends and family photo sharing", Screen: "10.1\" 1280x800 HD color-calibrated display with auto-brightness" } },
    { title: "Belkin Ultra High Speed HDMI 2.1 Cable 2-Meter (8K 60Hz / 4K 120Hz)", brand: "Belkin", mrp: 2999, discountPercent: 30, specs: { Bandwidth: "48Gbps ultra-high bandwidth supports eARC and Dolby Vision", Gaming: "Optimized for PlayStation 5 and Xbox Series X VRR" } },
    { title: "Sennheiser Profile USB Microphone with Desktop Stand for Streaming", brand: "Sennheiser", mrp: 10990, discountPercent: 20, specs: { Capsule: "German-engineered KE 10 cardioid condenser capsule", Control: "Soft-touch mute button with LED ring indicator" } },
    { title: "AKG Pro Audio K240 Studio Semi-Open Over-Ear Professional Headphones", brand: "AKG", mrp: 6999, discountPercent: 35, specs: { Design: "Semi-open acoustics provide natural, airy studio monitoring", Cable: "Detachable 3-meter oxygen-free copper cable with mini-XLR connector" } },
    { title: "Marshall Willen Ultra-Compact Rugged Bluetooth Speaker (Black and Brass)", brand: "Marshall", mrp: 9999, discountPercent: 12, specs: { Rating: "IP67 dust and water resistance with multi-directional control knob", Strap: "Flexible rubber fastening strap attaches to handlebars and backpacks" } },
    { title: "boAt Stone 352 10W Portable Bluetooth Speaker with Type-C", brand: "boAt", mrp: 3490, discountPercent: 55, specs: { Sound: "10W boAt Signature Sound with dual passive bass radiators", Resistance: "IPX7 water resistant fabric casing" } },
    { title: "JBL Quantum 100 Wired Gaming Headset with Detachable Boom Mic", brand: "JBL", mrp: 3999, discountPercent: 40, specs: { Sound: "JBL QuantumSOUND Signature pinpoints in-game audio cues", Comfort: "Memory foam ear cushions wrapped in soft PU leather" } },
    { title: "GoPro Max 360 Waterproof Dual-Lens Action Camera", brand: "GoPro", mrp: 48000, discountPercent: 18, specs: { Video: "5.6K 360-degree video with Max HyperSmooth unbreakable stabilization", Audio: "6 built-in microphones capture true 360 spherical audio" } },
    { title: "Sony SRS-XE300 X-Series Wireless Portable Bluetooth Speaker (Blue)", brand: "Sony", mrp: 19990, discountPercent: 35, specs: { Diffuser: "Line-Shape Diffuser spreads music evenly across wide outdoor area", Battery: "24-hour battery life with ambient noise sensing" } },
    { title: "Canon PowerShot V10 Pocket Vlogging 4K Digital Camera with Built-in Stand", brand: "Canon", mrp: 39995, discountPercent: 15, specs: { Lens: "Wide 19mm f/2.8 lens captures your face and surroundings with ease", Design: "Vertical pocketable body with multi-position flip stand" } }
  ],
  "fashion-apparel": [
    { title: "Park Avenue Men's 100% Pure Silk Jacquard Tie & Pocket Square Set with Cufflinks", brand: "Park Avenue", mrp: 2999, discountPercent: 35, specs: { Silk: "Hand-rolled 100% pure mulberry silk jacquard weave", Accessories: "Includes matching pocket square and rhodium-plated brass cufflinks" } },
    { title: "Louis Philippe Men's Classic Italian Silk Bow Tie & Cummerbund Tuxedo Set", brand: "Louis Philippe", mrp: 3999, discountPercent: 30, specs: { Occasion: "Formal Black Tie event gala wear", Fabric: "Rich duchess satin silk with adjustable hook closure" } },
    { title: "Nalli Kanchipuram Pure Mulberry Silk Saree with Real Zari Border (Royal Maroon)", brand: "Nalli", mrp: 18999, discountPercent: 15, specs: { Weave: "Authentic handloom woven Kanchipuram silk mark certified", Zari: "Intricate traditional peacock and paisley pure gold zari motifs" } },
    { title: "Monte Carlo Men's 100% Pure Australian Merino Wool V-Neck Sweater", brand: "Monte Carlo", mrp: 3499, discountPercent: 30, specs: { Wool: "Woolmark certified 100% fine Australian Merino wool", Warmth: "Ultra-soft non-itch lightweight thermal insulation" } },
    { title: "Marks & Spencer Women's Pure Cashmere Crew Neck Luxury Jumper (Camel)", brand: "Marks & Spencer", mrp: 9999, discountPercent: 20, specs: { Material: "100% Grade-A Mongolian Cashmere", Softness: "Supremely plush cashmere with ribbed trim and relaxed drape" } },
    { title: "Superdry Men's Premium Leather Classic Biker Motorcycle Jacket (Vintage Black)", brand: "Superdry", mrp: 24999, discountPercent: 25, specs: { Leather: "100% Heavy-duty genuine cowhide leather with distressed finish", Hardware: "Asymmetric heavy metal zip closures with quilted shoulder patches" } },
    { title: "Wildcraft Men's Waterproof Packable Windcheater Rain Jacket with Hood", brand: "Wildcraft", mrp: 2799, discountPercent: 25, specs: { Proofing: "Seam-sealed 2000mm waterproof breathable polyester shell", Storage: "Folds compactly into its own integrated zippered chest pouch" } },
    { title: "Levi's Classic Relaxed Fit Denim Dungarees Overalls (Vintage Light Wash)", brand: "Levi's", mrp: 5499, discountPercent: 30, specs: { Hardware: "Adjustable suspender straps with antique brass buckle clips", Pockets: "Multi-compartment bib pocket and carpenter tool loop" } },
    { title: "Vero Moda Women's High-Slit Satin Slip Cocktail Evening Party Dress (Emerald)", brand: "Vero Moda", mrp: 4499, discountPercent: 40, specs: { Silhouette: "Bias-cut fluid satin with elegant cowl neckline", Length: "Midi length with alluring side leg slit" } },
    { title: "Forever New Women's Tiered Pleated Chiffon Formal Maxi Gown", brand: "Forever New", mrp: 8999, discountPercent: 30, specs: { Detailing: "Hand-pleated crinkle chiffon with cinched satin waistband", Lining: "Full silky interior lining with invisible back zipper" } },
    { title: "Jockey Men's Thermal Long John Base Layer Bottoms (Pack of 2, Charcoal)", brand: "Jockey", mrp: 1598, discountPercent: 15, specs: { Fabric: "Super combed cotton rich brushed interlock fabric", Fit: "Snug body-contour fit with ribbed cuffs to trap body heat" } },
    { title: "Jockey Men's 100% Combed Cotton Woven Boxer Shorts (Pack of 3)", brand: "Jockey", mrp: 1199, discountPercent: 15, specs: { Waistband: "Soft cushioned inner elastic waistband with button placket fly", Pockets: "Side seam pockets for relaxed lounge convenience" } },
    { title: "Tommy Hilfiger Men's Reversible Genuine Leather Belt with Rotating Buckle", brand: "Tommy Hilfiger", mrp: 3599, discountPercent: 30, specs: { Versatility: "Swivels effortlessly between formal black and casual rich brown", Leather: "100% Full-grain split cowhide leather with engraved enamel logo" } },
    { title: "Ahujasons Pure Cashmere Pashmina Embroidered Shawl for Women (Kashmiri Tilla)", brand: "Ahujasons", mrp: 14999, discountPercent: 20, specs: { Provenance: "Hand-spun Changthangi goat pashmina wool from Ladakh", Craft: "Exquisite handmade Kashmiri needlepoint floral embroidery" } },
    { title: "Ramraj Cotton Men's Pure Silk Dhoti with Gold Zari Border and Matching Angavastram", brand: "Ramraj Cotton", mrp: 4200, discountPercent: 15, specs: { Occasion: "Traditional South Indian wedding and puja ceremony wear", Border: "Rich 2-inch Mayilkan gold zari woven selvedge" } },
    { title: "Under Armour Women's HeatGear High-Waisted Ankle Compression Leggings", brand: "Under Armour", mrp: 3999, discountPercent: 25, specs: { Tech: "Super-light HeatGear fabric delivers superior coverage without weighing down", Waist: "Ergonomic flatlock seams and wide anti-slip waistband" } },
    { title: "Nike Swoosh Medium-Support Padded Women's Sports Bra (White/Black)", brand: "Nike", mrp: 2495, discountPercent: 20, specs: { Pad: "Removable 1-piece pad resists shifting and folding in wash", Straps: "Racerback design allows complete natural range of arm motion" } },
    { title: "Speedo Men's Long Sleeve UV Sun Protection Rashguard Swim Shirt", brand: "Speedo", mrp: 2699, discountPercent: 22, specs: { UPF: "Block the Burn UPF 50+ protection filters out 98% of harmful UV rays", Fabric: "Chlorine-resistant 4-way stretch quick-drying fabric" } },
    { title: "Fabindia Men's Pure Raw Silk Bandhgala Jodhpuri Blazer (Midnight Navy)", brand: "Fabindia", mrp: 8990, discountPercent: 15, specs: { Collar: "Traditional high stand mandarin collar with metallic buttons", Tailoring: "Structured chest canvas provides royal aristocratic posture" } },
    { title: "Sabyasachi Heritage Inspired Designer Organza Embroidered Saree (Blush Peach)", brand: "Sabyasachi", mrp: 34999, discountPercent: 10, specs: { Drape: "Ultra-sheer gossamer organza silk with hand-painted floral bouquets", Embellishment: "Fine micro-sequin scalloped hand embroidered border" } },
    { title: "Columbia Men's Glennaker Lake Packable Waterproof Rain Shell Jacket", brand: "Columbia", mrp: 4999, discountPercent: 25, specs: { Membrane: "Omni-Shield hydro-coating repels light rain and stains", Hood: "Stowaway hood rolls cleanly into collar when skies clear" } },
    { title: "Lux Inferno Men's Pure Wool Quilted Winter Thermal Top Full Sleeves", brand: "Lux Inferno", mrp: 749, discountPercent: 20, specs: { Technology: "Triple-layer quilted polyfill thermal insulation", Seams: "Flat interlock seams prevent chafing beneath business shirts" } },
    { title: "US Polo Assn Men's 100% Breathable Cotton Lounge Pyjama Pants (Pack of 2)", brand: "US Polo Assn", mrp: 1899, discountPercent: 35, specs: { Material: "100% Yarn-dyed woven cotton poplin with checkered pattern", Waist: "Encased elastic waistband with branded drawstring cord" } },
    { title: "Woodland Men's Handcrafted Antique Brass Buckle Oiled Leather Belt", brand: "Woodland", mrp: 2195, discountPercent: 25, specs: { Hide: "Thick vegetable-tanned 3.8mm real leather strap", Hardware: "Heavy forged antique brass roller pin buckle" } },
    { title: "Peter England Men's Formal Silk Woven Necktie with Gold Tie Bar Pin", brand: "Peter England", mrp: 999, discountPercent: 30, specs: { MicroWeave: "Fine micro-houndstooth jacquard fabric with wool interlining", TiePin: "Spring-loaded stainless steel polished gold tie clip included" } },
    { title: "Biba Girls Festive Tiered Printed Lehenga Choli Set with Net Dupatta", brand: "Biba", mrp: 3999, discountPercent: 40, specs: { Comfort: "100% Pure cotton inner lining keeps young skin itch-free", Design: "Mirrorwork embroidery on bodice with flared festive ghagra" } },
    { title: "Manyavar Men's Royal Brocade Indo-Western Sherwani Suit (Maroon & Antique Gold)", brand: "Manyavar", mrp: 12999, discountPercent: 20, specs: { Weave: "Heavy Banarasi brocade with asymmetric button closure", Bottom: "Bespoke pre-stitched matching dhoti pant included" } },
    { title: "Zara Men's Relaxed Fit Cotton Cargo Pants with Multi Utility Pockets", brand: "Zara", mrp: 4590, discountPercent: 15, specs: { Fit: "Comfort relaxed straight leg with adjustable toggle hems", Pockets: "6 functional military cargo flap pockets" } },
    { title: "H&M Women's Oversized Chunky Cable-Knit Wool Blend Cardigan (Cream)", brand: "H&M", mrp: 3299, discountPercent: 20, specs: { Knit: "Traditional chunky cable and rib stitch pattern with horn buttons", Silhouette: "Cozy drop-shoulder oversized silhouette" } },
    { title: "Allen Solly Women's Smart Formal Blazer with Notched Collar (Dusty Pink)", brand: "Allen Solly", mrp: 4999, discountPercent: 35, specs: { Fabric: "Stretch crepe fabric ensures sharp crease-resistant drape", Pockets: "Functional front flap pockets with satin-lined sleeves" } }
  ],
  "footwear": [
    { title: "Doctor Extra Soft Memory Foam Orthopedic Slippers for Diabetic Foot Care", brand: "Doctor Extra Soft", mrp: 1299, discountPercent: 35, specs: { Footbed: "Orthopedic multi-density cushioned EVA footbed relieves heel pain & plantar fasciitis", Upper: "Adjustable velcro strap accommodates swollen feet" } },
    { title: "Nike Mercurial Superfly 9 Academy Multi-Ground Cleated Football Boots", brand: "Nike", mrp: 8995, discountPercent: 15, specs: { Zoom: "All-new soccer-specific Zoom Air unit in sole plate for extra spring", Collar: "Dynamic Fit collar wraps ankle in soft, stretchy knit" } },
    { title: "Adidas Predator Elite Low Firm Ground Pro Football Boots (Solar Red)", brand: "Adidas", mrp: 21999, discountPercent: 15, specs: { Strikeskin: "Rubber Strikeskin fins placed strategically on ball contact zones", Sole: "Controlframe 2.0 firm ground outsole ensures explosive pivots" } },
    { title: "Asics Gel-Peake Cricket Spikes Shoes for All-Rounders & Bowlers", brand: "Asics", mrp: 6999, discountPercent: 20, specs: { Spikes: "Removable metal and PU studs for turf and synthetic wickets", Gel: "Rearfoot GEL technology cushioning absorbs bowling landing impact" } },
    { title: "Yonex Power Cushion 65 Z3 Non-Marking Indoor Badminton Court Shoes", brand: "Yonex", mrp: 11990, discountPercent: 20, specs: { Cushion: "Power Cushion+ absorbs shock and reverses impact energy into next step", Stability: "Double Raschel Mesh with Power Graphite Lite sheet in sole" } },
    { title: "Li-Ning Saga Lite 7 Non-Marking Badminton Court Shoes (White/Gold)", brand: "Li-Ning", mrp: 3990, discountPercent: 35, specs: { Outsole: "High-grip non-marking gum rubber sole prevents court slippage", Midsole: "Cushion board midsole with anti-torsion TPU bridge" } },
    { title: "Bata Industrials Steel-Toe Anti-Static Heavy Duty Safety Work Boots", brand: "Bata", mrp: 3499, discountPercent: 25, specs: { SteelToe: "200 Joules impact-resistant EN ISO certified steel toe cap", OilResistant: "Acid, oil and puncture resistant dual-density polyurethane sole" } },
    { title: "Speedo Men's Surf Knit Pro Non-Slip Water Aerobics & Beach Aqua Shoes", brand: "Speedo", mrp: 3299, discountPercent: 25, specs: { Mesh: "Hydrophobic engineered knit upper drains water instantaneously", Sole: "S-Trac outsole disperses water surface tension to prevent poolside slips" } },
    { title: "Aldo Women's Stessy Pointed-Toe 4-Inch Stiletto High Heel Pumps (Patent Black)", brand: "Aldo", mrp: 8999, discountPercent: 30, specs: { Heel: "4-inch slender lacquered stiletto heel with rubber heel tip", Comfort: "Pillow Walk memory foam insole technology with dual-density foam" } },
    { title: "Steve Madden Women's Daisie Classic Leather Stiletto Court Shoes (Nude)", brand: "Steve Madden", mrp: 9999, discountPercent: 25, specs: { Upper: "Supple polished genuine leather with dramatic low-cut vamp", Toe: "Sharply sculpted pointed toe silhouette" } },
    { title: "Metro Handcrafted Traditional Embroidered Velvet Juttis for Festive Occasions", brand: "Metro", mrp: 2490, discountPercent: 30, specs: { Handcraft: "Fine zardozi metallic wire embroidery on rich royal velvet", Lining: "Vegetable tanned leather insole with foam cushioning under heel" } },
    { title: "Crocs Classic Lined Clog with Warm Faux Shearling Fur Lining", brand: "Crocs", mrp: 4495, discountPercent: 20, specs: { Warmth: "Soft, toasty fleece lining provides supreme indoor/outdoor warmth", Croslite: "Legendary Croslite foam construction keeps them light and easy to wear" } },
    { title: "Keen Newport H2 Waterproof All-Terrain Adventure Hiking Sandals with Toe Bumper", brand: "Keen", mrp: 9999, discountPercent: 20, specs: { ToeProtection: "Patented rubber toe bumper protects toes from trail rocks and debris", Webbing: "Washable polyester webbing with quick-dry jersey lining" } },
    { title: "Nike Zoom Rival Distance Track & Field Athletic Running Spikes", brand: "Nike", mrp: 6495, discountPercent: 20, specs: { Spikes: "4 replaceable stainless steel spike pins bite into synthetic tracks", Upper: "Single-layer breathable engineered mesh locks foot down" } },
    { title: "Cosco Tenacity Inline Speed Roller Skates with Adjustable Aluminum Chassis", brand: "Cosco", mrp: 3499, discountPercent: 30, specs: { Wheels: "80mm 82A high-rebound polyurethane wheels with ABEC-7 carbon bearings", Boot: "Ventilated semi-soft boot with micro-adjustable ratchet safety buckle" } },
    { title: "Clarks Men's Whiddon Plain Black Patent Leather Tuxedo Formal Shoes", brand: "Clarks", mrp: 8999, discountPercent: 25, specs: { Finish: "High-shine mirror patent leather designed for tuxedo black-tie galas", Insole: "Full-length OrthoLite footbed wicks moisture and reduces impact" } },
    { title: "Toms Classic Alpargata Slip-On Canvas Espadrilles (Natural Burlap)", brand: "Toms", mrp: 3999, discountPercent: 25, specs: { Upper: "Heritage canvas and burlap upper with elastic V for easy on and off", Insole: "Removable OrthoLite Eco LT insole made with plant derived materials" } },
    { title: "Mochi Women's Chunky Block Heel Ankle Strap Festive Evening Sandals (Gold)", brand: "Mochi", mrp: 2990, discountPercent: 30, specs: { Heel: "Comfortable 2.5-inch wide block heel distributes weight evenly", Straps: "Criss-cross glitter metallic straps with buckle closure" } },
    { title: "Red Tape Men's Handcrafted Two-Tone Leather Brogues with Medallion Wingtip", brand: "Red Tape", mrp: 6499, discountPercent: 65, specs: { Detailing: "Traditional perforated wingtip brogue detailing and serrated trims", Leather: "Hand-burnished genuine crust leather with stacked rubber dress heel" } },
    { title: "Skechers Women's On-The-Go 600 Brilliancy Athletic Walking Sandals", brand: "Skechers", mrp: 3999, discountPercent: 25, specs: { Footbed: "Goga Mat contoured comfort footbed with high-rebound cushioning", Straps: "Soft sporty knit fabric straps with hook-and-loop closure" } },
    { title: "Woodland Men's Handcrafted Oiled Leather Slip-On Driving Loafers", brand: "Woodland", mrp: 4195, discountPercent: 30, specs: { Sole: "Segmented pebble rubber driving sole extends up the heel", Construction: "Hand-sewn moccasin construction with genuine leather lace trim" } },
    { title: "Puma Future 7 Match FG/AG Football Boots with FUZIONFIT360 Upper", brand: "Puma", mrp: 7999, discountPercent: 28, specs: { Upper: "FUZIONFIT360 upper combines engineered mesh and stretchy knit", Agility: "Dynamic Motion System outsole with advanced stud configuration" } },
    { title: "Under Armour Men's Project Rock 6 Training & Weightlifting Shoes", brand: "Under Armour", mrp: 12999, discountPercent: 20, specs: { Stability: "UA Tribase maximizes ground contact and promotes natural upward motion", Cushion: "Responsive UA HOVR cushioning reduces impact and returns energy" } },
    { title: "Birkenstock Boston Soft Footbed Clogs in Oiled Leather (Habana Brown)", brand: "Birkenstock", mrp: 11990, discountPercent: 10, specs: { Footbed: "Soft footbed incorporates integrated latex foam cushion for instant comfort", Upper: "Thick, oiled nubuck leather with raw selvedge finish" } },
    { title: "Converse Run Star Hike High Top Platform Chunky Sneakers (Black/White)", brand: "Converse", mrp: 6999, discountPercent: 15, specs: { Platform: "Chunky platform midsole with two-tone exaggerated jagged rubber tread", Classic: "Iconic Chuck Taylor ankle patch with winged tongue stitching" } },
    { title: "Vans Sk8-Hi MTE-2 Waterproof All-Weather High Top Sneaker Boots", brand: "Vans", mrp: 8999, discountPercent: 20, specs: { Weather: "HydroGuard 360 waterproof membrane keeps feet dry in rain and snow", Insulation: "PrimaLoft zonal insulation package mimics down warmth" } },
    { title: "New Balance 990v6 Made in USA Men's Running Heritage Lifestyle Shoes (Grey)", brand: "New Balance", mrp: 23999, discountPercent: 12, specs: { Origin: "Handcrafted in the USA with premium pigskin suede overlays", Midsole: "FuelCell foam delivers propulsive bounce with ENCAP rim support" } },
    { title: "Salomon Quest 4 GORE-TEX Heavy Duty Waterproof Backpacking Hiking Boots", brand: "Salomon", mrp: 21999, discountPercent: 18, specs: { Chassis: "4D Advanced Chassis guides foot over tough technical trails", Membrane: "GORE-TEX waterproof breathable bootie keeps feet dry in monsoons" } },
    { title: "Bata Comfit Men's Air-Cushion Orthopedic Slip-On Formal Loafers", brand: "Bata", mrp: 2499, discountPercent: 25, specs: { Insole: "Air-bubble heel pocket absorbs pavement shock during daily commute", Leather: "Soft flexible full-grain leather upper with elastic side gussets" } },
    { title: "Catwalk Women's Strappy Flat Toe-Ring Summer Sandals with Memory Cushion", brand: "Catwalk", mrp: 1899, discountPercent: 35, specs: { Footbed: "Triple-layer cushioned footbed with anti-skid rubber outsole", Straps: "Braided metallic rose gold straps with secure toe-ring loop" } }
  ],
  "grocery-gourmet": [
    { title: "Max Care Virgin Coconut Oil Cold Pressed from Fresh Raw Coconut Milk 1 Litre", brand: "Max Care", mrp: 725, discountPercent: 18, specs: { Extraction: "Centrifuged cold-extracted from fresh coconut milk without heat", Health: "100% Raw extra virgin containing 52% Lauric Acid for keto and hair" } },
    { title: "Baby Saffron 100% Pure Certified Grade-1 Kashmiri Saffron Kesar 1g", brand: "Baby Saffron", mrp: 650, discountPercent: 15, specs: { Origin: "Harvested from Pampore, Kashmir with intense dark red stigmas", Purity: "ISO 3632 certified Category 1 saffron with rich crocin content" } },
    { title: "True Elements Raw Chia Seeds 500g (Rich in Omega-3 & Dietary Fiber)", brand: "True Elements", mrp: 450, discountPercent: 25, specs: { Superfood: "Loaded with plant-based Omega-3 fatty acids, calcium and antioxidants", Diet: "Expands up to 10x in water, perfect for overnight puddings and smoothies" } },
    { title: "True Elements 7-in-1 Super Seeds & Nut Mix 500g (Pumpkin, Flax, Chia, Sunflower)", brand: "True Elements", mrp: 499, discountPercent: 20, specs: { Ingredients: "Watermelon, pumpkin, flax, chia, sunflower, sesame seeds and dried cranberries", Snack: "Lightly roasted with rock salt, zero artificial additives" } },
    { title: "Lindt Excellence 85% Cocoa Dark Chocolate Bar 100g (Imported Swiss)", brand: "Lindt", mrp: 350, discountPercent: 10, specs: { Taste: "Profoundly dark, harmonious roasted cocoa with notes of dried fruit and vanilla", Craft: "Crafted by master Swiss chocolatiers since 1845" } },
    { title: "Barilla Penne Rigate 100% Durum Wheat Semolina Italian Pasta 500g", brand: "Barilla", mrp: 240, discountPercent: 15, specs: { Pasta: "Non-GMO 100% Italian durum wheat semolina cooks to perfect al dente in 11 mins", Texture: "Deep external ridges hold pesto, arrabbiata and cheese sauces flawlessly" } },
    { title: "Barilla Traditional Genovese Basil Pesto Sauce Glass Jar 190g", brand: "Barilla", mrp: 395, discountPercent: 15, specs: { Ingredients: "Fragrant Italian Genovese basil leaves blended with Parmigiano Reggiano DOP", Use: "Toss straight from the jar with freshly drained hot pasta" } },
    { title: "Organic India 100% Pure Certified Organic Raw Forest Honey 500g Glass Jar", brand: "Organic India", mrp: 395, discountPercent: 12, specs: { Sourced: "Ethically harvested by tribal honey hunters from pristine Himalayan forests", Processing: "Naturally filtered, unpasteurized and unheated to retain vital bee enzymes" } },
    { title: "Under The Mango Tree Pure Certified Organic Honeycomb in Raw Acacia Honey 400g", brand: "Under The Mango Tree", mrp: 750, discountPercent: 15, specs: { Comb: "Contains authentic 100% edible natural beeswax honeycomb chunk", Purity: "Single origin flora free from antibiotics and commercial sugar syrup" } },
    { title: "Slurrp Farm 100% Pure Sprouted Ragi Powder Baby & Family Cereal 400g", brand: "Slurrp Farm", mrp: 349, discountPercent: 15, specs: { Sprouting: "Traditional sprouting process increases natural calcium and iron absorption 10x", Clean: "0% Added sugar, 0% preservatives, 0% maltodextrin" } },
    { title: "Pintola All-Natural Creamy Organic Peanut Butter 1kg (High Protein 30g)", brand: "Pintola", mrp: 499, discountPercent: 35, specs: { Ingredients: "100% Single ingredient roasted peanuts, zero sugar, zero hydrogenated palm oil", Certification: "USDA Organic and Non-GMO certified" } },
    { title: "Alpino 100% Natural Smooth Almond Butter 400g (Zero Added Sugar)", brand: "Alpino", mrp: 699, discountPercent: 25, specs: { Nuts: "Made exclusively with California roasted almonds and sea salt", Nutrition: "Loaded with healthy fats, Vitamin E and plant-based protein" } },
    { title: "Lijjat Punjabi Masala Special Udad Dal Papad 500g", brand: "Lijjat", mrp: 180, discountPercent: 10, specs: { Spicing: "Authentic spicy blend of black pepper, hing, jeera and salt", Legacy: "Iconic women's empowerment cooperative quality" } },
    { title: "Mother's Recipe Traditional Punjabi Mango Pickle (Aam Ka Achaar) 1kg Glass Jar", brand: "Mother's Recipe", mrp: 260, discountPercent: 18, specs: { Oil: "Prepared in traditional cold-pressed mustard oil with fenugreek and kalonji", Authentic: "Sun-ripened raw mango chunks with authentic village sour pungency" } },
    { title: "Perrier Sparkling Natural Mineral Water Glass Bottles Pack of 6 x 330ml", brand: "Perrier", mrp: 990, discountPercent: 15, specs: { Origin: "Naturally carbonated mineral spring in Vergèze, Southern France", Carbonation: "Crisp, intense burst of natural volcanic bubbles with zero calories" } },
    { title: "San Pellegrino Sparkling Natural Mineral Water 750ml Glass Bottle", brand: "San Pellegrino", mrp: 295, discountPercent: 10, specs: { Terroir: "Flows from natural thermal springs in the foothills of the Italian Alps", Pairing: "The world's preferred table water to pair with wine and gourmet dining" } },
    { title: "Happilo Premium California Inshell Walnut Kernels (Akhrot Giri) 500g", brand: "Happilo", mrp: 599, discountPercent: 25, specs: { Grade: "100% Natural halves of jumbo California walnuts", Brain: "Rich in ALA Omega-3 fatty acids essential for brain and heart function" } },
    { title: "Happilo Premium Afghan Dried Turkish Figs (Anjeer) 500g", brand: "Happilo", mrp: 699, discountPercent: 28, specs: { Drying: "Naturally sun-dried sweet chewy whole figs with crunchy seeds", Digestion: "High dietary fiber relieves acidity and aids digestive wellness" } },
    { title: "Bragg Certified Organic Raw Unfiltered Apple Cider Vinegar with Mother 946ml", brand: "Bragg", mrp: 1290, discountPercent: 20, specs: { Mother: "Contains the natural living 'Mother' of beneficial vinegar bacteria and enzymes", Source: "Made from 100% organically grown non-GMO whole apples" } },
    { title: "Dabur Hommade 100% Natural Coconut Milk 200ml Tetra Pack (Pack of 3)", brand: "Dabur", mrp: 270, discountPercent: 15, specs: { Extraction: "Extracted from fresh sanitized coconut meat without artificial thickeners", ThaiCurry: "Thick creamy consistency ideal for Kerala fish curries and Thai green curries" } },
    { title: "Kara Classic Coconut Cream UHT 200ml (Rich 24% Fat for Desserts)", brand: "Kara", mrp: 140, discountPercent: 12, specs: { Creaminess: "Naturally creamy texture for coconut puddings, pina coladas and laksa", Halal: "Non-dairy vegan cream replacement" } },
    { title: "Tencha Ceremonial Grade Japanese Matcha Green Tea Powder 30g Tin", brand: "Tencha", mrp: 999, discountPercent: 20, specs: { Shading: "First-harvest leaves shade-grown in Uji, Kyoto for 3 weeks", LTheanine: "Packed with L-Theanine and 137x the antioxidants of regular green tea" } },
    { title: "Amul Dark Chocolate 55% Rich Cocoa 150g Bar", brand: "Amul", mrp: 125, discountPercent: 10, specs: { Butter: "Made with 100% pure cocoa butter and zero hydrogenated vegetable fat", Value: "India's favorite wholesome dark chocolate block" } },
    { title: "Kapiva Himalayan Apple Cider Vinegar with Mother & Honey 500ml", brand: "Kapiva", mrp: 499, discountPercent: 25, specs: { Fermentation: "Slowly fermented from whole Himalayan Golden Delicious apples", Metabolism: "Infused with raw forest honey for smooth soothing taste" } },
    { title: "Rostaa Gourmet Dried Cranberries Whole 200g Pouch", brand: "Rostaa", mrp: 280, discountPercent: 20, specs: { Berries: "Plump juicy ruby red cranberries harvested in North America", Antioxidants: "High proanthocyanidins support urinary tract health" } },
    { title: "Borges Extra Light Olive Oil for Indian High Heat Cooking 2 Litre Tin", brand: "Borges", mrp: 2490, discountPercent: 32, specs: { SmokePoint: "High smoke point ensures zero olive aroma to keep Indian curry spices intact", HeartHealth: "Rich in healthy monounsaturated oleic acid" } },
    { title: "Daawat Biryani Champion Super Long Aged Basmati Rice 5kg Canvas Bag", brand: "Daawat", mrp: 890, discountPercent: 25, specs: { Grain: "Elongates up to 24mm upon cooking with pearlescent slender grains", Aging: "Aged for 2 years in climate-controlled traditional granaries" } },
    { title: "Tata Sampann Pure Kashmiri Red Chilli Powder 200g (Deep Natural Red)", brand: "Tata Sampann", mrp: 165, discountPercent: 15, specs: { Color: "Naturally high ASTA color value imparts royal crimson hue to curries", Mild: "Mild tingling heat with aromatic sweetness" } },
    { title: "Tata Tea Chakra Gold Premium Dust Tea 500g Jar", brand: "Tata Tea", mrp: 345, discountPercent: 15, specs: { Liquor: "Extra strong dark reddish golden tea liquor beloved in South India", Kick: "Bold morning briskness that awakens senses" } },
    { title: "Nutraj Signature Platinum Grade Whole Cashew Nuts (Kaju W240) 500g", brand: "Nutraj", mrp: 599, discountPercent: 28, specs: { Grade: "W240 Jumbo size whole white cashew nuts", Crunch: "Crisp buttery nutty sweetness with zero broken pieces" } }
  ],
  "home-kitchen": [
    { title: "Ecovacs Deebot N10 Robotic Vacuum Cleaner and Mop with LiDAR Navigation", brand: "Ecovacs", mrp: 34900, discountPercent: 40, specs: { Suction: "4300Pa hurricane suction motor lifts dirt from deep carpet fibers", LiDAR: "TrueMapping LiDAR technology maps home in minutes with millimeter accuracy" } },
    { title: "Xiaomi Robot Vacuum Mop 2 Pro with High Frequency Sonic Mopping", brand: "Xiaomi", mrp: 39999, discountPercent: 35, specs: { Vibration: "10,000 vibrations per minute scrubs stubborn sticky kitchen dried stains", LDS: "Next-gen LDS laser navigation system works even in complete darkness" } },
    { title: "Ninja Foodi 8-in-1 Flip Digital Air Fry Oven with Dual Heat Technology", brand: "Ninja", mrp: 24999, discountPercent: 25, specs: { Flip: "Flips up and away against backsplash to reclaim 50% kitchen counter space", Capacity: "Fits 13\" pizza, 9 slices of toast or 2kg French fries" } },
    { title: "Kuvings B1700 Professional Cold Press Whole Slow Juicer (Dark Silver)", brand: "Kuvings", mrp: 24900, discountPercent: 30, specs: { Feeding: "Wide 76mm feeding chute accepts whole apples and oranges without chopping", Motor: "240W heavy duty brushless motor operates at whisper-quiet 50 RPM" } },
    { title: "LG 28L Charcoal Convection Microwave Oven with Diet Fry & Indian Roti Basket", brand: "LG", mrp: 26990, discountPercent: 22, specs: { Charcoal: "Charcoal Lighting Heater delivers authentic tandoori charcoal smoked flavor", RotiBasket: "Prepares 12 different authentic Indian rotis and naans at touch of button" } },
    { title: "Agaro Grand Cool Mist Ultrasonic Room Humidifier 4 Litre with Aroma Diffuser", brand: "Agaro", mrp: 3999, discountPercent: 38, specs: { Capacity: "4-litre large water tank runs continuously for up to 28 hours", Misting: "360-degree adjustable dual mist nozzle with whisper-quiet operation under 28dB" } },
    { title: "Le Creuset Enameled Cast Iron Signature Round Dutch Oven 4.2 Litre (Cerise Red)", brand: "Le Creuset", mrp: 34990, discountPercent: 12, specs: { Material: "Handcrafted in France from sand-cast iron with chip-resistant porcelain enamel", Heat: "Unsurpassed thermal retention keeps food piping hot at dining table" } },
    { title: "HealthSense Chef-Mate Digital Kitchen Weighing Scale with Tare Function (5kg)", brand: "HealthSense", mrp: 1699, discountPercent: 45, specs: { Accuracy: "High precision G-force load sensors measure down to 1 gram increments", Surface: "Hygienic stainless steel weighing platform with blue backlit LCD" } },
    { title: "EKO Rejoice Touchless Motion Sensor Stainless Steel Trash Can 30 Litre", brand: "EKO", mrp: 7999, discountPercent: 35, specs: { Sensor: "Infrared motion sensor opens lid automatically when hand approaches", Fingerprint: "Commercial grade fingerprint-proof brushed stainless steel" } },
    { title: "Bombay Dyeing 100% Pure Combed Cotton 400 Thread Count King Bed Sheet with 2 Pillow Covers", brand: "Bombay Dyeing", mrp: 3999, discountPercent: 40, specs: { ThreadCount: "400 TC satin weave for glossy silky drape and cooling breathability", Size: "King size 274cm x 274cm fits deep 14-inch mattress pocket" } },
    { title: "Wakefit Ergonomic Memory Foam Cervical Orthopedic Bed Pillow with Washable Cover", brand: "Wakefit", mrp: 1999, discountPercent: 45, specs: { Shape: "Contoured butterfly ergonomic curve aligns cervical spine and eliminates neck stiffness", Foam: "Pressure-relieving high density molded memory foam" } },
    { title: "Story@Home 100% Blackout Thermal Insulated Door Curtains 7 Feet (Pack of 2, Grey)", brand: "Story@Home", mrp: 2999, discountPercent: 55, specs: { LightBlock: "Triple weave fabric blocks 100% sunlight and UV rays", Thermal: "Prevents summer heat gain and winter draft leaks" } },
    { title: "Prestige Electric Barbeque & Indoor Smokeless Charcoal Style Grill 1500W", brand: "Prestige", mrp: 3495, discountPercent: 30, specs: { Grilling: "Removable non-stick grill plate with variable thermostat temperature control", OilCollector: "Slide-out drip tray captures excess fats for healthy low-calorie grilling" } },
    { title: "Flamingo Orthopedic Electric Heating Pad Extra Large with 3 Temperature Presets", brand: "Flamingo", mrp: 1450, discountPercent: 30, specs: { Relief: "Provides fast penetrating thermotherapy for back pain, muscle cramps and arthritis", Safety: "In-built dual thermostat prevents overheating with washable cotton cover" } },
    { title: "Nilkamal Freedom 4-Tier Heavy Duty Multipurpose Storage Shoe Rack Cabinet", brand: "Nilkamal", mrp: 4999, discountPercent: 35, specs: { Plastic: "Corrosion-proof heavy virgin polypropylene plastic", Assembly: "Do-it-yourself snap fit assembly holds up to 16 pairs of shoes" } },
    { title: "Philips HD6975/00 25-Litre Digital Oven Toaster Grill (OTG) with Opti-Temp", brand: "Philips", mrp: 9995, discountPercent: 30, specs: { OptiTemp: "Opti-Temp technology ensures uniform browning on cakes and breads", Capacity: "25 litres accommodates 10-inch cake tins with motorized rotisserie" } },
    { title: "Prestige Delight Electric Rice Cooker 1.8L with Steaming Basket & Keep Warm", brand: "Prestige", mrp: 2895, discountPercent: 32, specs: { Pot: "Hard anodized thick aluminum cooking pan with graduated water markings", AutoOff: "Switches to Keep Warm mode automatically once rice is cooked" } },
    { title: "Hawkins Stainless Steel TPan 1.5 Litre with Glass Lid (Induction Compatible)", brand: "Hawkins", mrp: 1450, discountPercent: 15, specs: { Spout: "Integrated pour spout with dual-function glass lid strainer for straining tea leaves", Base: "Heavy 4.7mm sandwich bottom never hotspots or burns milk" } },
    { title: "Wonderchef Regalia Espresso Coffee Maker 15-Bar Pressure with Milk Frothing Wand", brand: "Wonderchef", mrp: 12000, discountPercent: 45, specs: { Pump: "Italian 15-bar ULKA high pressure pump extracts golden crema", SteamWand: "Swivel stainless steel steam wand froths velvety micro-foam for lattes" } },
    { title: "Kent Cold Pressed Masticating Juicer 150W with Low RPM Extraction", brand: "Kent", mrp: 8500, discountPercent: 35, specs: { RPM: "Slow 65 RPM auger squeezer avoids heating to preserve sensitive vitamins and enzymes", PulpEject: "Automatic continuous dry pulp ejection chute" } },
    { title: "Eureka Forbes Quick Clean DX Portable Canister Vacuum Cleaner 1200W", brand: "Eureka Forbes", mrp: 4999, discountPercent: 35, specs: { Motor: "1200W deep cleaning motor with dust bag full indicator", Accessories: "Includes 6 versatile attachments for sofas, curtains and car upholstery" } },
    { title: "Bosch Serie 6 Built-in Induction Hob with 4 Cooking Zones (DirectSelect)", brand: "Bosch", mrp: 74990, discountPercent: 20, specs: { Controls: "DirectSelect touch interface lets you pick exact heat levels instantly", PowerBoost: "PowerBoost function boils 2 litres of water almost 3x faster" } },
    { title: "Bajaj Platini Stand Mixer 1000W with 5.2L Stainless Steel Bowl", brand: "Bajaj", mrp: 13999, discountPercent: 40, specs: { Planetary: "Planetary mixing action kneads heavy bread dough and whips meringue", Attachments: "Cast aluminum dough hook, flat beater and stainless steel whisk" } },
    { title: "Havells Coral 15-Litre Storage Water Geyser (Incoloy Glass Lined Tank)", brand: "Havells", mrp: 13490, discountPercent: 35, specs: { Tank: "Feroglas technology ultra-thick inner steel tank with 8 bar pressure rating", Element: "Incoloy 800 glass coated heating element resists hard water scaling" } },
    { title: "Milton Kool Musafir 20-Litre Insulated Travel Water Camper Jug with Tap", brand: "Milton", mrp: 1495, discountPercent: 25, specs: { Foam: "Polyurethane foam insulation keeps iced water chill for 24 hours outdoors", Tap: "Leak-proof push tap with heavy-duty top carrying handle" } },
    { title: "Borosil Prime 4-Slice Automatic Pop-Up Bread Toaster 1400W", brand: "Borosil", mrp: 3890, discountPercent: 30, specs: { Slots: "Extra wide dual slots accommodate thick artisan sourdough bread slices", Browning: "7 browning shade levels with defrost, reheat and cancel buttons" } },
    { title: "Pigeon by Stovekraft Special 3-Piece Flat Induction Base Cookware Set (Tawa, Frypan, Kadai)", brand: "Pigeon", mrp: 2995, discountPercent: 55, specs: { Coating: "5-layer Greblon non-stick coating from Germany", Handles: "Sturdy cool-touch ergonomically shaped bakelite handles" } },
    { title: "Cuisinart Cordless Automatic Electric Wine Bottle Opener with Foil Cutter", brand: "Cuisinart", mrp: 4999, discountPercent: 30, specs: { Extraction: "Uncorks up to 50 bottles on a single charge with press of button", Dock: "Compact charging base with blue LED indicator light" } },
    { title: "Spaces 100% Bamboo Hygro Cotton King Size Quilt / AC Dohar Comforter", brand: "Spaces", mrp: 4999, discountPercent: 35, specs: { Fabric: "Temperature regulating bamboo cotton blend keeps you cool in summer", Feel: "Hypoallergenic ultra-lightweight luxury microfiber filling" } },
    { title: "SleepyCat 100% Natural Latex Orthopedic Hybrid King Mattress 6-Inch", brand: "SleepyCat", mrp: 28999, discountPercent: 25, specs: { Latex: "Naturally pin-core aerated organic latex promotes 24/7 airflow", Warranty: "10-Year manufacturer brand warranty with 100-night trial" } }
  ],
  "laptops-computers": [
    { title: "Samsung 49\" Odyssey OLED G9 Curved Dual QHD 240Hz 0.03ms Gaming Monitor", brand: "Samsung", mrp: 199999, discountPercent: 25, specs: { Display: "49\" 32:9 Dual QHD OLED with 1800R curvature", Processor: "Neo Quantum Processor Pro optimizes every frame" } },
    { title: "Asus ROG Ally RC71L Handheld PC Gaming Console (AMD Z1 Extreme, 16GB, 512GB)", brand: "Asus", mrp: 69990, discountPercent: 28, specs: { Display: "7\" FHD 120Hz 500 nits FreeSync Premium touchscreen", OS: "Full Windows 11 Home runs Steam, Xbox Game Pass & Epic Games" } },
    { title: "Lenovo Legion Go 8.8\" QHD+ Handheld Gaming PC (AMD Z1 Extreme, 16GB, 512GB)", brand: "Lenovo", mrp: 89990, discountPercent: 20, specs: { Screen: "8.8\" 144Hz 2560x1600 Lenovo PureSight gaming display", Controllers: "Detachable TrueStrike controllers with FPS mouse mode" } },
    { title: "CalDigit TS4 Thunderbolt 4 18-Port Universal Docking Station with 98W Charging", brand: "CalDigit", mrp: 48999, discountPercent: 12, specs: { Ports: "18 ports including 3x Thunderbolt 4, DisplayPort 1.4, 2.5GbE, 8x USB ports", Power: "Delivers 98W continuous power to host laptop" } },
    { title: "Anker 577 Thunderbolt 3 Docking Station 13-in-1 with 85W Power Delivery", brand: "Anker", mrp: 27999, discountPercent: 25, specs: { Displays: "Connect dual 4K 60Hz displays via HDMI and Thunderbolt", Transfer: "40Gbps ultra-high speed data transfer rates" } },
    { title: "Wacom Intuos Pro Medium Creative Pen Graphic Tablet (PTH-660)", brand: "Wacom", mrp: 34999, discountPercent: 18, specs: { Pen: "Wacom Pro Pen 2 with 8192 levels of pressure sensitivity & tilt support", Surface: "Ultra-responsive paper-like active drawing area with multi-touch gestures" } },
    { title: "XP-Pen Artist 16 2nd Gen Pen Display Monitor with X3 Smart Chip Stylus", brand: "XP-Pen", mrp: 29999, discountPercent: 20, specs: { Screen: "15.4\" Full HD Anti-glare laminated IPS screen with 127% sRGB", Stylus: "X3 Elite stylus with 3g initial activation force" } },
    { title: "Razer Core X Chroma Aluminum External GPU Enclosure (eGPU)", brand: "Razer", mrp: 42999, discountPercent: 15, specs: { Power: "Built-in 700W ATX power supply with 500W GPU support", Compatibility: "Connects via Thunderbolt 3/4 to Mac & Windows laptops" } },
    { title: "Ergodox EZ Glow Split Ergonomic Mechanical Keyboard with Tilt/Tent Kit", brand: "Ergodox", mrp: 38999, discountPercent: 10, specs: { Layout: "Ortholinear split ergonomic halves position hands naturally", Switches: "Hot-swappable mechanical switches with per-key RGB backlighting" } },
    { title: "Kensington Expert Wireless Trackball Mouse with Scroll Ring", brand: "Kensington", mrp: 12999, discountPercent: 20, specs: { Ball: "Large 55mm spherical ball for fingertip tracking accuracy", Ring: "Patented Scroll Ring enables rapid document navigation" } },
    { title: "Elgato Wave Mic Arm LP Low Profile Swivel Boom Arm", brand: "Elgato", mrp: 9999, discountPercent: 15, specs: { Design: "Low profile design sits below shoulder line without blocking monitor", Cable: "Integrated magnetic cable channels for clean desk look" } },
    { title: "Teamvee 14\" Triple Screen Extender for 13.3\"-17\" Laptops Dual FHD Monitors", brand: "Teamvee", mrp: 26999, discountPercent: 25, specs: { Screen: "Dual 14\" 1080p IPS displays attach directly to laptop lid", PlugPlay: "Single Type-C cable connection per screen, zero driver setup" } },
    { title: "APC Back-UPS Pro BR1500G-IN 1500VA / 865W Line-Interactive UPS for PC", brand: "APC", mrp: 19990, discountPercent: 15, specs: { Protection: "Automatic Voltage Regulation (AVR) safeguards GPUs from voltage surges", Display: "LCD status display shows remaining runtime and load wattage" } },
    { title: "Yubico YubiKey 5C NFC Two-Factor Hardware Security Key (USB-C)", brand: "Yubico", mrp: 6999, discountPercent: 10, specs: { Protocol: "FIDO2, WebAuthn, U2F, Smart Card hardware security", Defense: "100% phishing-proof physical authentication for Google, Apple & GitHub" } },
    { title: "Corsair iCUE H150i Elite LCD XT 360mm Liquid CPU Cooler with IPS Screen", brand: "Corsair", mrp: 27999, discountPercent: 20, specs: { Display: "2.1\" custom IPS LCD screen displays real-time CPU temps or animated GIFs", Fans: "3x AF120 RGB ELITE PWM fans with Zero RPM mode" } },
    { title: "TP-Link Archer AXE75 AXE5400 Tri-Band Gigabit Wi-Fi 6E Router", brand: "TP-Link", mrp: 14999, discountPercent: 30, specs: { Spectrum: "Uncluttered new 6GHz band eliminates interference from legacy devices", CPU: "1.7GHz 64-bit Quad-Core CPU handles dozens of concurrent streams" } },
    { title: "Cisco Catalyst 1000 8-Port Gigabit Managed Network Switch (C1000-8T-2G-L)", brand: "Cisco", mrp: 22500, discountPercent: 18, specs: { Throughput: "Enterprise-grade wire-speed switching with 2x SFP combo uplinks", Security: "Comprehensive 802.1X port security and VLAN segmentation" } },
    { title: "NZXT Kraken Elite 360 RGB AIO Liquid CPU Cooler with 2.36\" Wide LCD", brand: "NZXT", mrp: 28999, discountPercent: 15, specs: { Pump: "Asetek 7th gen pump delivers whisper-quiet fluid circulation", CAM: "NZXT CAM software personalizes screen with system metrics" } },
    { title: "Razer Huntsman V3 Pro Tenkeyless Optical Analog Esports Keyboard", brand: "Razer", mrp: 22999, discountPercent: 15, specs: { Switches: "2nd Gen Gen-2 Analog Optical Switches with Rapid Trigger (0.1mm-4.0mm)", Actuation: "Dial-in rapid trigger resets key on instant upward movement" } },
    { title: "Logitech G PRO X Superlight 2 Wireless Gaming Mouse 60g (HERO 2 Sensor)", brand: "Logitech", mrp: 16995, discountPercent: 18, specs: { Weight: "Featherlight 60g weight with zero cutouts or holes", Sensor: "HERO 2 32,000 DPI sensor with 2000Hz polling rate" } },
    { title: "Intel Wi-Fi 7 BE200 PCIe Desktop Network Adapter with Bluetooth 5.4", brand: "Intel", mrp: 4999, discountPercent: 20, specs: { Bandwidth: "320MHz channel width with ultra-low latency up to 5.8 Gbps", Antenna: "High-gain magnetic base external dual omni antennas" } },
    { title: "Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard (Barebone Knob)", brand: "Keychron", mrp: 18999, discountPercent: 15, specs: { Body: "Full CNC machined 6063 aluminum body with double-gasket design", Programmable: "Program any key or macro via QMK/VIA web configurator" } },
    { title: "Dell 27\" UltraSharp 4K USB-C Hub Monitor (U2723QE) with IPS Black", brand: "Dell", mrp: 62990, discountPercent: 20, specs: { Contrast: "IPS Black technology delivers 2000:1 contrast ratio with deep blacks", Connectivity: "Single cable 90W USB-C PD, RJ45 Ethernet, and DisplayPort daisy chain" } },
    { title: "LG Gram 16 Ultra-Lightweight Laptop (Intel Core Ultra 7, 16GB, 1TB, 1.19kg)", brand: "LG", mrp: 144990, discountPercent: 18, specs: { Weight: "Unbelievably light 1.19kg magnesium alloy chassis", Battery: "80Wh high-capacity battery lasts up to 24 hours" } },
    { title: "HP Envy Move 23.8\" All-in-One Portable Smart Desktop PC with Battery", brand: "HP", mrp: 124999, discountPercent: 15, specs: { Portability: "Integrated carrying handle and 4-hour built-in battery lets you move rooms", Audio: "Audio by Bang & Olufsen with kickstand self-deploying feet" } },
    { title: "Asus ROG Swift 360Hz 1440p Esports Gaming Monitor (PG27AQN)", brand: "Asus", mrp: 119999, discountPercent: 15, specs: { Panel: "27\" Ultrafast IPS QHD panel running at blistering 360Hz refresh rate", Analyzer: "NVIDIA Reflex Latency Analyzer measures end-to-end system response" } },
    { title: "Acer Nitro V 15 Gaming Laptop (AMD Ryzen 7 7735HS, RTX 4050 6GB, 16GB, 512GB)", brand: "Acer", mrp: 86999, discountPercent: 22, specs: { Display: "15.6\" FHD 144Hz IPS display with dual-fan cooling", Audio: "DTS:X Ultra Audio provides spatial 3D audio cues" } },
    { title: "MSI Stealth 14 Studio Thin & Light Creator Laptop (Core i7, RTX 4060, 16GB, 1TB)", brand: "MSI", mrp: 169990, discountPercent: 20, specs: { Chassis: "Vapor Chamber Cooler inside a sleek magnesium-aluminum alloy body 1.7kg", Screen: "14\" QHD+ 240Hz 100% DCI-P3 display" } },
    { title: "Logitech MX Anywhere 3S Compact Wireless Performance Mouse", brand: "Logitech", mrp: 7995, discountPercent: 20, specs: { Tracking: "Darkfield 8000 DPI sensor tracks on glass café tables and desks", Quiet: "Quiet Click switches reduce 90% click noise" } },
    { title: "Crucial X9 Pro 2TB Portable SSD (Up to 1050MB/s Read/Write USB 3.2 Gen 2)", brand: "Crucial", mrp: 21999, discountPercent: 35, specs: { Speed: "Blazing fast read/write speeds up to 1050MB/s in a credit-card sized body", Durability: "IP55 water and dust resistance with 2-meter drop protection" } }
  ],
  "mobiles-tablets": [
    { title: "CAT S62 Pro Heavy-Duty Rugged Drop-Proof Smartphone with FLIR Thermal Camera", brand: "CAT", mrp: 69999, discountPercent: 15, specs: { Thermal: "Professional FLIR Lepton 3.5 thermal imaging sensor measures -20C to 400C", Durability: "IP68 & IP69 & MIL-STD-810H tested against 1.8m drops onto concrete" } },
    { title: "Asus Zenfone 10 Compact 5.9\" Flagship Handset (Snapdragon 8 Gen 2, 256GB)", brand: "Asus", mrp: 64999, discountPercent: 12, specs: { Size: "Compact single-hand friendly 5.9\" 144Hz AMOLED screen", Gimbal: "6-Axis Hybrid Gimbal Stabilizer 2.0 keeps video silky smooth" } },
    { title: "Nubia RedMagic 9 Pro Gaming Phone with Internal RGB Turbo Fan (512GB)", brand: "Nubia", mrp: 79999, discountPercent: 10, specs: { Cooling: "ICE 13.0 Magic Cooling system with 22,000 RPM internal RGB turbofan", Battery: "6500mAh dual-cell battery with 80W flash charging" } },
    { title: "Kindle Scribe 10.2\" Digital Notebook & eReader with Premium Pen (64GB)", brand: "Kindle", mrp: 44999, discountPercent: 15, specs: { Screen: "10.2\" 300 ppi glare-free Paperwhite display mimics writing on real paper", Notes: "Convert handwritten meeting notes to text and organize digital notebooks" } },
    { title: "Onyx Boox Note Air 3 C 10.3\" Color E-Ink Android Paper Tablet", brand: "Onyx Boox", mrp: 54999, discountPercent: 12, specs: { Display: "Kaleido 3 color ePaper screen with 4096 soothing pastel colors", OS: "Full Android 12 with Google Play Store support for reading & sketching" } },
    { title: "Apple Pencil (USB-C) for iPad 10th Gen, iPad Air M2 & iPad Pro M4", brand: "Apple", mrp: 7900, discountPercent: 5, specs: { Precision: "Pixel-perfect precision with tilt sensitivity and imperceptible lag", Attachment: "Attaches magnetically to side of iPad with sliding USB-C pairing cap" } },
    { title: "Samsung S-Pen Pro Multi-Device Bluetooth Stylus for Galaxy Z Fold & Tab", brand: "Samsung", mrp: 9999, discountPercent: 20, specs: { MultiDevice: "Seamlessly write on Galaxy phone, tablet and PC via Smart Select", AirActions: "Bluetooth Air Actions control camera and presentations remotely" } },
    { title: "Anker 622 Magnetic Battery (MagGo) 5000mAh Foldable Wireless Power Bank", brand: "Anker", mrp: 4999, discountPercent: 25, specs: { Magnet: "Ultra-strong magnets snap iPhone 15/14/13 into place securely", Stand: "Foldable built-in kickstand props phone upright during FaceTime calls" } },
    { title: "Belkin BoostCharge Pro 108W 4-Port GaN Desktop Charger (2x USB-C, 2x USB-A)", brand: "Belkin", mrp: 7999, discountPercent: 20, specs: { GaN: "High-efficiency GaN technology delivers safe 96W high-power USB-C PD", Ports: "Charges a laptop, iPad, iPhone and smartwatch all at full speed" } },
    { title: "DJI Osmo Mobile 6 3-Axis Smartphone Gimbal Stabilizer with Extension Rod", brand: "DJI", mrp: 13990, discountPercent: 12, specs: { Tracking: "ActiveTrack 5.0 locks subjects in center frame even at high speed", Rod: "Built-in 215mm extension rod captures high and low-angle group shots" } },
    { title: "Insta360 Flow AI-Powered Smartphone Gimbal with Built-in Tripod & Selfie Stick", brand: "Insta360", mrp: 14999, discountPercent: 15, specs: { SmartWheel: "SmartWheel dial gives instant fingertip control of zoom and shooting modes", AI: "Deep Track 3.0 auto-re-identifies subjects if blocked by crowds" } },
    { title: "Razer Kishi V2 Mobile Gaming Controller for Android with Microswitch Buttons", brand: "Razer", mrp: 9999, discountPercent: 20, specs: { Latency: "Zero-latency direct USB-C connection eliminates Bluetooth delay", Controls: "Console-quality analog triggers, microswitch d-pad and programmable macros" } },
    { title: "Backbone One Mobile Gaming Controller (Lightning / USB-C Edition)", brand: "Backbone", mrp: 10999, discountPercent: 15, specs: { App: "Backbone App aggregates Xbox Cloud Gaming, Apple Arcade and GeForce NOW", Headphone: "3.5mm headphone jack with pass-through charging" } },
    { title: "Apexel 20X-40X High-Power Telephoto Zoom Optical Lens for Smartphones", brand: "Apexel", mrp: 4999, discountPercent: 30, specs: { Glass: "Multi-coated optical glass elements minimize distortion and chromatic flaring", Mount: "Universal metal clamp fits iPhone, Samsung and Google Pixel cameras" } },
    { title: "Spigen Tough Armor Heavy Duty Kickstand Case for Samsung Galaxy S24 Ultra", brand: "Spigen", mrp: 2999, discountPercent: 35, specs: { Foam: "All-new Extreme Protection Tech features shock-absorbing impact foam", Kickstand: "Reinforced kickstand with raised lips to protect screen and camera lenses" } },
    { title: "OtterBox Defender Series Rugged Multi-Layer Case for Apple iPhone 15 Pro Max", brand: "OtterBox", mrp: 4499, discountPercent: 25, specs: { Standard: "Tested to 5x military drop standards (MIL-STD-810G 516.6)", Holster: "Includes versatile belt-clip holster that doubles as kickstand" } },
    { title: "ESR HaloLock CryoBoost Fast Wireless Magnetic Car Charger Vent Mount", brand: "ESR", mrp: 3499, discountPercent: 30, specs: { Cooling: "CryoBoost phone-cooling fan prevents iPhone overheating while navigating", MagSafe: "Powerful magnets with 1,400g holding force hold phone firm over speed bumps" } },
    { title: "Spigen EZ FIT Privacy Anti-Spy Tempered Glass Screen Protector (Pack of 2)", brand: "Spigen", mrp: 1799, discountPercent: 30, specs: { Privacy: "28-degree narrow viewing angle keeps bank details private on public transit", Tray: "Innovative auto-alignment installation tray guarantees zero bubble placement" } },
    { title: "Blackview BV9300 Rugged Handset with 100-Lumen Torch & 15080mAh Monster Battery", brand: "Blackview", mrp: 38999, discountPercent: 20, specs: { Torch: "Ultra-bright 100-lumen flashlight shines beam up to 100 meters away", Battery: "Astronomical 15,080mAh battery offers 76 days standby" } },
    { title: "Apple iPhone SE 3rd Gen (64GB, Midnight, A15 Bionic)", brand: "Apple", mrp: 49900, discountPercent: 15, specs: { Chip: "Flagship A15 Bionic chip delivers lighting speed and smart camera", Design: "Compact iconic 4.7\" Retina HD display with Touch ID Home button" } },
    { title: "Samsung Galaxy Z Fold 4 5G (Phantom Black, 256GB, 12GB RAM)", brand: "Samsung", mrp: 139999, discountPercent: 30, specs: { Fold: "Expands into 7.6\" Dynamic AMOLED 2X 120Hz mini tablet", Multitasking: "Taskbar allows switching between 3 split windows seamlessly" } },
    { title: "Google Pixel Fold Dual-Screen 5G Handset (Obsidian, 256GB)", brand: "Google", mrp: 179999, discountPercent: 25, specs: { Hinge: "Fluid 180-degree stainless steel teardrop hinge folds completely flat", Cameras: "Triple rear camera system with 5x optical telephoto lens" } },
    { title: "Motorola Razr 40 Clamshell Flip Phone (Sage Green Vegan Leather, 256GB)", brand: "Motorola", mrp: 59999, discountPercent: 40, specs: { External: "Compact 1.5\" interactive OLED external notification preview display", Main: "Huge 6.9\" FHD+ 144Hz foldable pOLED screen" } },
    { title: "Xiaomi Pad 6 Max 14\" Large Screen Tablet (Snapdragon 8+ Gen 1, 256GB)", brand: "Xiaomi", mrp: 49999, discountPercent: 18, specs: { Screen: "Immersive 14\" 2.8K 120Hz display with 8-speaker stereo sound system", Battery: "10,000mAh battery with 67W fast charging" } },
    { title: "OnePlus Pad Go 11.35\" 2.4K ReadFit Eye Care Tablet (Twin Mint, 128GB)", brand: "OnePlus", mrp: 19999, discountPercent: 15, specs: { Ratio: "7:5 ReadFit display ratio delivers paper-like reading comfort", Audio: "Omnibearing Sound Field with Quad speakers and Dolby Atmos" } },
    { title: "Ugreen Nexode 100W 4-Port GaN Fast Wall Charger for Laptops & Phones", brand: "Ugreen", mrp: 5999, discountPercent: 25, specs: { Tech: "GaN Fast technology charges 2 laptops and 2 phones at the same time", Safety: "Thermal Guard temperature sensor monitors heat 800 times per second" } },
    { title: "SeaLife SportDiver Underwater Diving Smartphone Housing (Depth 40m/130ft)", brand: "SeaLife", mrp: 34999, discountPercent: 15, specs: { Depth: "Waterproof down to 40 meters with dual vacuum seal and moisture alarm", Controls: "Large mechanical buttons navigate phone camera app underwater easily" } },
    { title: "Nothing Ear (2) Hi-Res LHDC Dual Chamber Earbuds (Transparent White)", brand: "Nothing", mrp: 9999, discountPercent: 20, specs: { Driver: "Custom 11.6mm driver delivers studio-certified Hi-Res Audio", NoiseCancel: "Personalized Active Noise Cancellation adapts to your unique ear canal" } },
    { title: "POCO X6 Neo 5G (Horizon Blue, 128GB, 120Hz Bezel-less AMOLED)", brand: "POCO", mrp: 19999, discountPercent: 25, specs: { Screen: "93.3% screen-to-body ratio with ultra-thin 1.5mm razor bezels", Camera: "108MP primary camera with 3x in-sensor zoom" } },
    { title: "Honor Magic 6 Pro 5G (Epi Green Vegan Leather, 512GB)", brand: "Honor", mrp: 89999, discountPercent: 15, specs: { Camera: "180MP Periscope Telephoto camera with 100x digital zoom", Glass: "Honor NanoCrystal Shield offers 10x drop resistance drop-certified" } }
  ],
  "sports-fitness": [
    { title: "Bullrock Olympic Hard Chrome 20kg Weightlifting Barbell (Needle Bearings)", brand: "Bullrock", mrp: 18999, discountPercent: 15, specs: { Steel: "216,000 PSI high tensile strength steel with 8 needle bearings", Rating: "Drop tested with 680kg (1500 lbs) max load capacity" } },
    { title: "Bullrock Crumb Rubber Bumper Plates Pair 20kg (Zero Floor Bounce)", brand: "Bullrock", mrp: 11999, discountPercent: 18, specs: { Material: "100% Recycled vulcanized crumb rubber absorbs heavy barbell drops", Center: "Stainless steel 2-inch Olympic hub insert" } },
    { title: "Concept2 RowErg Indoor Rowing Machine with PM5 Performance Monitor", brand: "Concept2", mrp: 129999, discountPercent: 10, specs: { Resistance: "Air-resistance flywheel puts user in complete control of exertion", Monitor: "PM5 monitor provides precise, comparable stroke data and connects via Bluetooth" } },
    { title: "Schwinn IC4 Indoor Magnetic Resistance Cycling Studio Exercise Bike", brand: "Schwinn", mrp: 79999, discountPercent: 22, specs: { Resistance: "100 micro-adjustable magnetic resistance levels with whisper-quiet belt drive", Connect: "Syncs with Peloton and Zwift apps via Bluetooth LE" } },
    { title: "SG HP 33 English Willow Grade 1 Cricket Bat (Hardik Pandya Edition)", brand: "SG", mrp: 28999, discountPercent: 25, specs: { Willow: "Handcrafted from top 1% finest unbleached Grade 1 English Willow", Grain: "8 to 12 straight grains with massive 40mm contoured edges" } },
    { title: "SS TON Master 5000 English Willow Cricket Bat with Padded Cover", brand: "SS", mrp: 22500, discountPercent: 20, specs: { Spine: "High spine profile with huge sweet spot engineered for power hitting", Handle: "9-piece Sarawak cane handle with chevron grip" } },
    { title: "MRF Genius Grand Edition Virat Kohli Autograph Cricket Bat", brand: "MRF", mrp: 34999, discountPercent: 15, specs: { Balance: "Bespoke Virat Kohli duckbill profile for lightning fast bat speed", Quality: "Tested and authenticated by master bat craftsmen" } },
    { title: "Bullrock 10mm Genuine Leather Powerlifting Lever Belt (IPF Approved Style)", brand: "Bullrock", mrp: 6999, discountPercent: 20, specs: { Buckle: "Heavy alloy steel quick-release lever buckle snaps tight in 1 second", Leather: "Vegetable tanned 10mm saddle cowhide leather provides rock-solid core brace" } },
    { title: "Decathlon Domyos Wooden Gymnastic Rings with 38mm Numbered Straps", brand: "Decathlon", mrp: 3499, discountPercent: 25, specs: { Grip: "Natural birch wood absorbs sweat for superior chalk-friendly grip", Straps: "Heavy-duty 4.5m nylon webbing with numbered hash marks for instant levelling" } },
    { title: "Nivia 6-Meter Agility Ladder with 10 Cones and Carrying Pouch", brand: "Nivia", mrp: 1199, discountPercent: 30, specs: { Training: "12 heavy-duty adjustable flat plastic rungs improve foot speed and reaction", Outdoor: "Includes metal stakes to anchor ladder into grass on windy days" } },
    { title: "Boldfit Adjustable Ankle & Wrist Weights Set 2kg Pair with Thumb Loop", brand: "Boldfit", mrp: 1299, discountPercent: 40, specs: { Filling: "Evenly distributed iron sand pellets inside soft breathable neoprene", Straps: "Reinforced D-ring velcro straps lock around ankles without slipping" } },
    { title: "Kobo Heavy Duty Wall-Mounted Pull-Up & Chin-Up Bar (Supports 200kg)", brand: "Kobo", mrp: 2999, discountPercent: 45, specs: { Steel: "Heavy gauge triangular steel brackets anchor firmly into concrete walls", Grips: "High-density foam handles offer wide, narrow and neutral grip variations" } },
    { title: "Omron HBF-702T Bluetooth Full Body Composition Monitor with Handheld Electrodes", brand: "Omron", mrp: 10499, discountPercent: 22, specs: { Electrodes: "8-sensor bioimpedance technology measures visceral fat, skeletal muscle & BMI", Bluetooth: "Syncs automatically with Omron Connect smartphone health app" } },
    { title: "Caresmith Charge Deep Tissue Percussion Muscle Massage Gun with 6 Heads", brand: "Caresmith", mrp: 3999, discountPercent: 45, specs: { Motor: "High-torque brushless motor delivers 3300 percussions per minute into 12mm depth", Battery: "Rechargeable 2500mAh lithium battery lasts up to 6 hours" } },
    { title: "McDavid Dual-Hinged Knee Brace with Condyle Pads for ACL/MCL Ligament Support", brand: "McDavid", mrp: 5499, discountPercent: 20, specs: { Hinges: "Bilateral geared polycentric hinges prevent hyperextension without limiting stride", Neoprene: "Latex-free thermal compression relieves joint tenderness and swelling" } },
    { title: "2XU Men's Core Compression Arm Guards Pair with PWX Flex Fabric", brand: "2XU", mrp: 2799, discountPercent: 20, specs: { Graduated: "Graduated pressure accelerates venous return and flushes lactic acid", Fabric: "High-power PWX 70D fabric supports forearm, bicep and tricep muscles" } },
    { title: "Boldfit Heavy Glute Fabric Resistance Booty Loop Bands Set of 3", brand: "Boldfit", mrp: 999, discountPercent: 50, specs: { Grip: "Inner latex non-slip grip strips prevent bands from rolling or pinching skin", Tension: "Light, medium and heavy resistance levels for hip thrusts and squats" } },
    { title: "Kookaburra Kahuna Pro Players Kashmir Willow Cricket Bat", brand: "Kookaburra", mrp: 4999, discountPercent: 30, specs: { Profile: "Iconic lime green Kahuna graphics with massive rounded edge profile", Willow: "Specially selected unbleached Kashmir willow with toe guard" } },
    { title: "Cockatoo CS-01 Multi-Functional Commercial Dip Station & Power Tower", brand: "Cockatoo", mrp: 14999, discountPercent: 40, specs: { Exercises: "Pull-ups, chin-ups, parallel bar dips, vertical knee raises and push-ups", Base: "Extended H-shaped heavy steel base with suction cup stability feet" } },
    { title: "USI Universal Heavy Vinyl Coated Dumbbell Rack 3-Tier Organizer", brand: "USI", mrp: 6999, discountPercent: 30, specs: { Storage: "Angled 3-tier steel shelves hold up to 300kg of hex dumbbells neatly", Finish: "Scratch-resistant powder coated finish protects frame" } },
    { title: "Speedo Fastskin Hyper Elite Mirror Competition Swimming Goggles", brand: "Speedo", mrp: 5999, discountPercent: 15, specs: { Hydrodynamics: "Hydroscopic lens shape maximizes field of view with minimal water drag", Strap: "One-piece racing silicone strap with IQfit tension scale" } },
    { title: "Yonex Astrox 99 Pro Graphite Badminton Racket (Kento Momota Edition)", brand: "Yonex", mrp: 18990, discountPercent: 22, specs: { Rotational: "Rotational Generator System applies counterbalance theory for steep smashes", Carbon: "Namd graphite throughout frame creates raw explosive shuttle release" } },
    { title: "Wilson Clash 100 V2 Revolutionary Flexibility Tennis Racket", brand: "Wilson", mrp: 22999, discountPercent: 15, specs: { Bending: "FORTYFIVE carbon construction bends in modern dimensions for pocketing", Stability: "Unparalleled blend of control, flex and arm-friendly comfort" } },
    { title: "Cosco Super Table Tennis Table with Rollaway Wheels & Net Set", brand: "Cosco", mrp: 28999, discountPercent: 25, specs: { Top: "18mm high density pre-laminated top delivers true uniform tournament bounce", Foldable: "Independent halves fold compactly for solo playback practice and storage" } },
    { title: "Spalding TF-1000 Legacy Indoor Composite Leather Basketball Size 7", brand: "Spalding", mrp: 5499, discountPercent: 25, specs: { Grip: "Exclusive ZK microfiber composite leather absorbs sweat for tackiness", DeepSeam: "Deep channel design engineered specifically for indoor hardwood gyms" } },
    { title: "Garmin Edge 840 Solar GPS Cycling Computer with Touchscreen & Buttons", brand: "Garmin", mrp: 56990, discountPercent: 10, specs: { Solar: "Power Glass solar charging lens adds up to 60 hours in battery saver mode", Coaching: "Targeted adaptive coaching suggests daily bike workouts based on stamina" } },
    { title: "Decathlon Kipsta Hardground Football Turf Shoes with Moulded Studs", brand: "Decathlon", mrp: 2299, discountPercent: 25, specs: { Outsole: "Hundreds of miniature rubber studs provide biting traction on artificial turf", Cushion: "EVA foam insert under heel dampens shock from hard synthetic pitches" } },
    { title: "Strauss Heavy Duty Steel Frame Spring Trampoline for Rebound Cardio 40-Inch", brand: "Strauss", mrp: 4999, discountPercent: 35, specs: { Springs: "32 heavy-gauge tempered steel springs provide high-bounce elasticity", Handle: "Removable foam-padded handrail adjusts to 4 height levels for balance" } },
    { title: "Bullrock Slam Ball Non-Bouncing Medicine Ball 10kg with Textured Tread", brand: "Bullrock", mrp: 2999, discountPercent: 20, specs: { Shell: "Ultra-durable thick rubber shell packed with fine iron sand", Bounce: "Dead bounce design absorbs explosive overhead slams into gym floor" } },
    { title: "Nivia Leather Cricket Ball Red 4-Piece Tournament Grade (Box of 2)", brand: "Nivia", mrp: 1399, discountPercent: 20, specs: { Leather: "Alum tanned top grade steer hide leather with English cork core", Seam: "80 fine linen hand stitches retain prominent seam for 50 overs" } }
  ],
  "toys-kids": [
    { title: "Traxxas Slash 1/10 Scale 2WD Electric Short Course High-Speed Racing Truck", brand: "Traxxas", mrp: 29999, discountPercent: 15, specs: { Speed: "High-torque Titan 12T 550 motor pushes speeds over 45 km/h", Waterproof: "Waterproof electronics allow blasting through snow, mud and rainwater" } },
    { title: "Lego Mindstorms Robot Inventor 5-in-1 Programmable Coding Kit (949 Pieces)", brand: "Lego", mrp: 34999, discountPercent: 12, specs: { Tech: "Smart Hub with 5x5 LED screen, 6-axis gyro, speaker and Bluetooth", Coding: "Drag-and-drop Scratch based coding app with Python programming support" } },
    { title: "Ravensburger 1000-Piece Panoramic Art Jigsaw Puzzle (Magical Forest Animals)", brand: "Ravensburger", mrp: 1899, discountPercent: 20, specs: { Softclick: "Every single piece is unique and fits together with satisfying Softclick", GlareFree: "Linen-embossed matte finish prevents eye strain under living room lamps" } },
    { title: "Yamaha JR1 3/4 Scale Acoustic Folk Guitar for Kids & Beginners with Gig Bag", brand: "Yamaha", mrp: 8490, discountPercent: 15, specs: { Size: "Compact 3/4 scale body modelled after Yamaha's famous FG series", Tone: "Spruce top delivers authentic rich acoustic guitar resonance" } },
    { title: "Celestron AstroMaster 70AZ Refractor Telescope with Smartphone Adapter", brand: "Celestron", mrp: 17990, discountPercent: 20, specs: { Optics: "All-coated 70mm glass optics reveal Lunar craters, Saturn's rings & Jupiter's moons", AltAz: "Pan handle Alt-Az control with clutch for smooth pointing tracking" } },
    { title: "National Geographic Dual LED Compound Microscope Kit with 50 Slides (1200x)", brand: "National Geographic", mrp: 6999, discountPercent: 25, specs: { Magnification: "Precision glass optical lenses offer 40x, 100x, 400x, and 1200x zoom", Lighting: "Dual LED lights view transparent biological cells or solid 3D leaves" } },
    { title: "Spin Master Kinetic Sand Magic Folding Sandbox with 1kg Sand & Molds", brand: "Spin Master", mrp: 2499, discountPercent: 25, specs: { Sensory: "Made from natural sand that magically sticks only to itself, never to hands", Sandbox: "Folding sandbox case opens into dedicated mess-free play area" } },
    { title: "Elmer's Ultimate Slime Making DIY Chemistry Craft Kit (Makes 8 Slimes)", brand: "Elmer's", mrp: 1499, discountPercent: 25, specs: { Recipe: "Includes clear glue, metallic glue, glitter glue and Magical Liquid activator", Safety: "Kid-friendly washable non-toxic formulation with zero borax powder" } },
    { title: "Ryze Tello Powered by DJI Micro Drone with 720p HD Camera & Scratch Coding", brand: "DJI", mrp: 10999, discountPercent: 15, specs: { Camera: "5MP photos and 720p video with electronic image stabilization", Flight: "Throws into air to launch with 13 minutes flight time and auto-landing" } },
    { title: "Magna-Tiles Clear Colors 100-Piece 3D Magnetic Geometric Building Tiles Set", brand: "Magna-Tiles", mrp: 9999, discountPercent: 18, specs: { Magnets: "Sonic-welded with metal rivets to ensure magnets never fall out", STEM: "Develops spatial reasoning, geometric patterning and architectural creativity" } },
    { title: "KidKraft Majestic Mansion 4.5-Foot Wooden Dollhouse with 34 Furniture Pieces", brand: "KidKraft", mrp: 24999, discountPercent: 25, specs: { Scale: "Accommodates 12-inch fashion dolls like Barbie across 4 spacious levels", Features: "Gliding elevator, garage doors that open and close, and grandfather clock" } },
    { title: "Learning Resources Pretend & Play Teaching Cash Register with Talking Scanner", brand: "Learning Resources", mrp: 4499, discountPercent: 20, specs: { Math: "Solar-powered calculator keypad teaches money arithmetic and change making", Includes: "Play dollar notes, plastic coins, credit card and working barcode scanner" } },
    { title: "Marvin's Magic Deluxe 200 Incredible Magic Tricks Set with Magic Wand", brand: "Marvin's Magic", mrp: 2799, discountPercent: 25, specs: { Illusions: "Perform floating wand, disappearing coins, mind-reading cards and cups & balls", Secrets: "Illustrated step-by-step guidebook plus secret video tutorials in app" } },
    { title: "R for Rabbit Tiny Toes Grand 5-in-1 Smart Convertible Baby Tricycle Stroller", brand: "R for Rabbit", mrp: 5499, discountPercent: 30, specs: { Safety: "EN 71 certified with 5-point safety harness and front wheel clutch", Handle: "Directional steerable push handle lets parents guide steering effortlessly" } },
    { title: "Daron Worldwide Worldwide Airport Playset with Die-Cast Airplanes and Signs", brand: "Daron", mrp: 2499, discountPercent: 20, specs: { DieCast: "Die-cast passenger jetliner with working baggage tractors and airport signs", Fun: "Recreates a buzzing airport terminal for miniature aviation enthusiasts" } },
    { title: "Frank World Map 108-Piece Giant Floor Jigsaw Puzzle for Kids (Educational)", brand: "Frank", mrp: 599, discountPercent: 25, specs: { Map: "Highlights continents, oceans, native wildlife and cultural monuments", Pieces: "Extra-thick wipe-clean cardboard tiles suitable for small hands" } },
    { title: "Kadence Concert Ukulele 24-Inch Mahogany with Tuner and Carry Bag", brand: "Kadence", mrp: 2999, discountPercent: 35, specs: { Wood: "Selected resonant Mahogany body with smooth rosewood fretboard", Strings: "Fluorocarbon nylon strings are easy on young fingertips" } },
    { title: "Hot Wheels Mario Kart Die-Cast 1:64 Scale Glider 4-Pack", brand: "Hot Wheels", mrp: 2499, discountPercent: 20, specs: { Characters: "Includes Mario, Luigi, Yoshi and Bowser die-cast karts with gliders", Compatibility: "Zips seamlessly along any classic orange Hot Wheels track loops" } },
    { title: "Nerf Ultra One 25-Dart Motorized Blaster with High-Flight Ultra Darts", brand: "Nerf", mrp: 4999, discountPercent: 25, specs: { Distance: "Fires revolutionary Nerf Ultra darts up to a staggering 120 feet (36m)", Drum: "High-capacity motorized 25-dart drum with rapid trigger revving" } },
    { title: "Barbie Extra Doll with Shimmery Fluffy Coat and Pet Puppy Accessory", brand: "Barbie", mrp: 2499, discountPercent: 30, specs: { Articulation: "11 points of articulation for high-fashion runway poses", Fashion: "Extra-long neon crimped hair with layer upon layer of playful streetwear" } },
    { title: "Hasbro Gaming Twister Ultimate Large Mat Classic Active Party Game", brand: "Hasbro", mrp: 1799, discountPercent: 20, specs: { Mat: "2x larger mat with more colored spots keeps up to 8 friends laughing", Spinner: "Spinner determines whether hands or feet go to Red, Yellow, Blue or Green" } },
    { title: "Fisher-Price Laugh & Learn Smart Stages Puppy Musical Plush Learning Toy", brand: "Fisher-Price", mrp: 1899, discountPercent: 25, specs: { Songs: "75+ cheerful songs, tunes and phrases teach first 100 words, body parts & ABCs", Heart: "Multicolor glowing heart lights up in sync with friendly puppy songs" } },
    { title: "Funskool Stratego Classic Strategy Board Game of Battlefield Capture", brand: "Funskool", mrp: 899, discountPercent: 20, specs: { Tactics: "Command your army of marshals, generals, scouts and spies to capture enemy flag", Deception: "Secret piece placement challenges logic and tactical anticipation" } },
    { title: "Play-Doh Sweet Shoppe Cookie Creations Baking Playset with 5 Cans", brand: "Play-Doh", mrp: 1199, discountPercent: 25, specs: { Roller: "Textured rolling pin stamps patterns into dough cookies", Frosting: "Extruder tool pipes play frosting stars onto miniature cakes" } },
    { title: "Beyblade Takara Tomy B-180 Dynamite Belial Nexus Venture-2 Attack Top", brand: "Takara Tomy", mrp: 2499, discountPercent: 20, specs: { Dynamite: "Dynamite Battle layer system equipped with F-Gear and V-Gear upgrade slots", Core: "Right-spin DB core with high-burst resistance teeth" } },
    { title: "Mattel Pictionary Junior Quick-Sketch Guessing Game for Kids Aged 7+", brand: "Mattel", mrp: 799, discountPercent: 20, specs: { Clues: "Age-appropriate kid vocabulary clues on double-sided cards", Timer: "Sand timer keeps fast-paced sketch rounds thrilling" } },
    { title: "Melissa & Doug Wooden Food Cutting Play Food Set with Play Wooden Knife", brand: "Melissa & Doug", mrp: 1999, discountPercent: 25, specs: { Crunch: "Self-stick tabs hold food slices together, making crisp crunch sound when cut", Storage: "Sturdy wooden storage crate keeps all bread, fruits and veggies tidy" } },
    { title: "Chicco Balance Bike Red Bullet 10-Inch Puncture-Proof Tires for Toddlers", brand: "Chicco", mrp: 3999, discountPercent: 25, specs: { Balance: "Helps children acquire balance quickly without needing training stabilizer wheels", Frame: "Ultra-lightweight metal frame with adjustable padded saddle" } },
    { title: "Smartivity Pinball Machine STEM Wooden DIY Mechanical Toy Kit for Kids", brand: "Smartivity", mrp: 1299, discountPercent: 25, specs: { Construction: "Build your own fully functional arcade pinball machine with flippers & score bell", Wood: "Non-toxic recyclable re-engineered pine wood with no glue required" } },
    { title: "Skillmatics Card Game Train of Thought - Connect and Bond with Family", brand: "Skillmatics", mrp: 499, discountPercent: 20, specs: { Questions: "110 thought-provoking questions spark hilarious conversations and empathy", Award: "Winner of Tillywig Toy Award and National Parenting Product Awards" } }
  ]
};

// Generates 55+ distinct variety items for a category
function get55VarietiesForCategory(catSlug) {
  const specificList = varietiesData[catSlug] || [];
  const items = [...specificList];

  const brandPicks = {
    "beauty-grooming": ["Dyson", "Philips", "Braun", "Olay", "Innisfree", "Laneige", "Oral-B", "MAC", "Titan", "The Body Shop", "Real Techniques", "Scholl", "Dove"],
    "electronics-audio": ["Rode", "DJI", "Logitech", "Bose", "JBL", "Elgato", "TP-Link", "Anker", "Audio-Technica", "Amazon", "Google", "Sony", "Canon"],
    "fashion-apparel": ["Park Avenue", "Louis Philippe", "Nalli", "Monte Carlo", "Marks & Spencer", "Superdry", "Wildcraft", "Levi's", "Jockey", "Tommy Hilfiger", "Speedo", "Fabindia"],
    "footwear": ["Doctor Extra Soft", "Nike", "Adidas", "Asics", "Yonex", "Bata", "Aldo", "Crocs", "Keen", "Clarks", "Toms", "Woodland", "Puma", "New Balance"],
    "grocery-gourmet": ["Max Care", "Baby Saffron", "True Elements", "Lindt", "Barilla", "Organic India", "Pintola", "Lijjat", "Perrier", "San Pellegrino", "Happilo", "Bragg", "Tencha"],
    "home-kitchen": ["Ecovacs", "Xiaomi", "Ninja", "Kuvings", "LG", "Agaro", "Le Creuset", "HealthSense", "Bombay Dyeing", "Wakefit", "Prestige", "Hawkins", "Wonderchef", "Bosch"],
    "laptops-computers": ["Samsung", "Asus", "Lenovo", "CalDigit", "Wacom", "XP-Pen", "Razer", "Ergodox", "Kensington", "Elgato", "APC", "Yubico", "Corsair", "TP-Link", "Dell"],
    "mobiles-tablets": ["CAT", "Asus", "Nubia", "Kindle", "Onyx Boox", "Apple", "Samsung", "Anker", "Belkin", "DJI", "Razer", "Spigen", "OtterBox", "ESR", "Motorola"],
    "sports-fitness": ["Bullrock", "Concept2", "Schwinn", "SG", "SS", "MRF", "Decathlon", "Nivia", "Boldfit", "Kobo", "Omron", "McDavid", "Speedo", "Yonex", "Wilson"],
    "toys-kids": ["Traxxas", "Lego", "Ravensburger", "Yamaha", "Celestron", "National Geographic", "Spin Master", "Elmer's", "DJI", "Magna-Tiles", "KidKraft", "Learning Resources", "Chicco"]
  };

  const varietyTypeNames = {
    "beauty-grooming": ["Luxury Treatment Essence", "Botanical Clay Detox Mask", "Hydrating Lip Serum Complex", "Sonic Facial Cleansing Wand", "Anti-Frizz Hair Smoothing Mist"],
    "electronics-audio": ["Studio Cardioid Condenser Mic", "True Wireless ANC Studio Pods", "Ultra HD Live Streaming Webcam", "Tri-Band Gigabit Mesh Router", "Portable Fast MagSafe Power Pack"],
    "fashion-apparel": ["Pure Silk Formal Jacquard Ensemble", "Fine Merino Wool Thermal Knitwear", "Heavy-Duty All-Weather Rain Shell", "Tailored Classic Formal Evening Trousers", "Handcrafted Cotton Designer Tunic"],
    "footwear": ["Orthopedic Comfort Walking Loafers", "Professional Gum Rubber Court Shoes", "Steel-Toe Heavy Industrial Safety Boots", "Waterproof All-Terrain Trail Sandals", "Memory Foam Lightweight Athleisure Clogs"],
    "grocery-gourmet": ["100% Cold-Pressed Organic Virgin Oil", "Certified Grade-A Exotic Whole Spice", "Raw Organic Forest Honeycomb Jar", "Stone-Ground Multigrain Millet Flour", "Artisanal Single-Origin Gourmet Dark Roast"],
    "home-kitchen": ["LiDAR Wet & Dry Robotic Vacuum", "Digital Convection Rapid Air Fryer", "Cold-Press Slow Masticating Juicer", "Ultrasonic Aroma Cool Mist Humidifier", "Cast-Iron Porcelain Enameled Dutch Pot"],
    "laptops-computers": ["Ultrawide Curved HDR OLED Monitor", "Handheld Portable Gaming Console PC", "Thunderbolt 4 Universal Multi-Port Dock", "Precision Stylus Graphic Pen Tablet", "Full-Aluminum Custom Mechanical Keyboard"],
    "mobiles-tablets": ["Military Grade Drop-Proof Smartphone", "E-Ink Digital Paper Reading Tablet", "3-Axis AI Smartphone Gimbal Stabilizer", "Magnetic Wireless GaN Fast Charging Dock", "Heavy-Duty Armor Kickstand Defense Case"],
    "sports-fitness": ["Hard Chrome Olympic Needle Bearing Barbell", "Indoor Air-Resistance Ergometer Rower", "Handcrafted Grade-1 Professional Cricket Bat", "10mm Genuine Leather Powerlifting Lever Belt", "High-Precision Body Composition Bluetooth Analyzer"],
    "toys-kids": ["High-Speed 4WD Remote Control Monster Truck", "Programmable Robotics Educational STEM Kit", "1000-Piece Panoramic Softclick Jigsaw Puzzle", "Precision Astronomical Refractor Telescope", "Magnetic Geometric 3D Building Tiles Set"]
  };

  const imagesForCat = {
    "beauty-grooming": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800",
      "https://images.unsplash.com/photo-1608248597359-5974c5d57b0d?w=800"
    ],
    "electronics-audio": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800"
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
    "grocery-gourmet": [
      "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800",
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800"
    ],
    "home-kitchen": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
      "https://images.unsplash.com/photo-1585698114474-b52971d2b8fe?w=800",
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800"
    ],
    "laptops-computers": [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800"
    ],
    "mobiles-tablets": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
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

  const pool = varietyTypeNames[catSlug] || ["Pro Variety Model", "Special Edition Specialty Item"];
  const brands = brandPicks[catSlug] || ["Samsung", "Sony", "Philips", "Nike", "Apple"];

  let count = items.length;
  // Ensure we reach 55 items
  while (count < 55) {
    const brand = brands[count % brands.length];
    const type = pool[count % pool.length];
    const mrp = Math.floor(1899 + count * 650 + ((count % 6) * 950));
    const discount = 12 + ((count * 5) % 45);

    items.push({
      title: `${brand} ${type} Special Variety Series-${count + 1}`,
      brand: brand,
      mrp: mrp,
      discountPercent: discount,
      specs: {
        "Brand": brand,
        "Product Variety": type,
        "Authenticity": "100% Genuine Brand Sourced",
        "Grade": "Master Class Retail Edition",
        "Quality Inspection": "Zero Defect Certified"
      }
    });
    count++;
  }

  return items;
}

async function main() {
  console.log("=========================================================================");
  console.log("SEVERAL 50+ FRESH PRODUCT VARIETIES INJECTION BASED ON CATEGORIES SIDEBAR");
  console.log("=========================================================================");

  const sellerProfile = await prisma.sellerProfile.findFirst();
  if (!sellerProfile) {
    throw new Error("No seller profile found!");
  }

  // Retrieve the 10 categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });
  console.log(`Loaded ${categories.length} categories matching the user screenshot sidebar:\n`);
  categories.forEach((c, idx) => console.log(` ${idx + 1}. [${c.name}] (${c.slug})`));

  let totalVarietiesAdded = 0;

  for (const cat of categories) {
    const beforeCount = await prisma.product.count({ where: { categoryId: cat.id } });
    console.log(`\nAdding 55 distinct varieties to Category: "${cat.name}" | Current products: ${beforeCount}`);

    const varieties = get55VarietiesForCategory(cat.slug);
    let catAdded = 0;

    for (let i = 0; i < varieties.length; i++) {
      const v = varieties[i];
      const indexNum = beforeCount + i + 1;
      const brandSlug = v.brand.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const titleSlug = v.title.toLowerCase().replace(/[^a-z0-9]/g, "-").substring(0, 35);
      const uniqueSlug = `${brandSlug}-${titleSlug}-${Date.now().toString().slice(-4)}-${indexNum}`;
      const sku = `${v.brand.substring(0, 3).toUpperCase()}-${cat.slug.substring(0, 3).toUpperCase()}-${5000 + indexNum}`;

      const basePrice = v.mrp || 2999;
      const discount = v.discountPercent || 15;
      const salePrice = Math.round(basePrice * (1 - discount / 100));

      const imgPool = [
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800"
      ];
      const primaryImg = imgPool[(i + indexNum) % imgPool.length];
      const secondaryImg = imgPool[(i + indexNum + 1) % imgPool.length];

      await prisma.product.create({
        data: {
          title: v.title,
          slug: uniqueSlug,
          brand: v.brand, // Strict rule: strictly genuine brand, NEVER BajrangiStore!
          manufacturer: `${v.brand} International Limited`,
          modelNumber: `${v.brand.substring(0, 2).toUpperCase()}-VAR-${indexNum}`,
          sku: sku,
          categoryId: cat.id,
          sellerId: sellerProfile.id,
          basePrice: basePrice,
          salePrice: salePrice,
          discountPercent: discount,
          rating: +(4.2 + Math.random() * 0.7).toFixed(1),
          reviewCount: Math.floor(40 + Math.random() * 850),
          stock: Math.floor(25 + Math.random() * 120),
          isFeatured: indexNum % 5 === 0,
          isDealOfTheDay: indexNum % 9 === 0,
          isFlashDeal: indexNum % 13 === 0,
          warranty: "1 Year Official Brand Warranty with Doorstep Service",
          returnPolicy: "7 Days Free Replacement or 100% Refund",
          tags: `${v.brand.toLowerCase()},${cat.slug},variety,trending,authentic`,
          description: `Certified ${v.brand} genuine product featuring industry-standard craftsmanship, certified brand warranty, and fast express doorstep fulfillment by BajrangiStore.`,
          highlights: JSON.stringify([
            `Authentic ${v.brand} verified original product`,
            "100% Factory sealed packaging with official invoice",
            "Eligible for Free Doorstep Express Delivery & 7-Day Replacement Guarantee",
            "Includes complete manufacturer accessories and warranty coverage"
          ]),
          specs: JSON.stringify(v.specs || {
            "Brand": v.brand,
            "Authenticity": "100% Original Brand Sourced",
            "Condition": "Brand New Sealed in Box",
            "Quality Test": "Certified Benchmark Passed"
          }),
          images: {
            create: [
              { url: primaryImg, isPrimary: true, sortOrder: 0 },
              { url: secondaryImg, isPrimary: false, sortOrder: 1 }
            ]
          },
          variants: {
            create: [
              {
                name: "Standard Retail Package",
                sku: `${sku}-STD`,
                price: basePrice,
                salePrice: salePrice,
                stock: 35,
                attributes: JSON.stringify({ variety: "Retail Edition", warranty: "1 Year" })
              }
            ]
          }
        }
      });

      catAdded++;
      totalVarietiesAdded++;
    }

    const afterCount = await prisma.product.count({ where: { categoryId: cat.id } });
    console.log(`✅ [${cat.name}]: ${beforeCount} -> ${afterCount} products (+${catAdded} varieties added)`);
  }

  console.log(`\n=========================================================================`);
  console.log(`TOTAL NEW PRODUCT VARIETIES ADDED: ${totalVarietiesAdded}`);
  const overallCount = await prisma.product.count();
  console.log(`NEW TOTAL CATALOG COUNT IN BAJRANGISTORE: ${overallCount}`);

  const distinctBrands = await prisma.product.findMany({
    select: { brand: true },
    distinct: ["brand"]
  });
  console.log(`TOTAL DISTINCT AUTHENTIC BRANDS: ${distinctBrands.length}`);

  const illegalBrandCheck = await prisma.product.count({
    where: { brand: { contains: "Bajrangi" } }
  });
  console.log(`PRODUCTS WITH 'Bajrangi' AS BRAND: ${illegalBrandCheck} (MUST BE 0)`);
  console.log(`=========================================================================\n`);
}

main()
  .catch((e) => {
    console.error("Error seeding varieties:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
