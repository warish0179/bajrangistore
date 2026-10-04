# NexMart — The Modern Hyper-Store

A production-grade, full-stack E-commerce platform inspired by the speed and scale of Amazon and Flipkart, engineered with an original modern UI/UX, brand identity, and high-performance architecture.

---

## 🌟 Key Highlights & Features

### 🛍️ 1. Customer Storefront
- **Dynamic Homepage**: High-impact promotional hero banners, interactive category strip, live ticking **Flash Deals countdown**, blockbuster **Deal of the Day**, trending bestsellers, and customer value pillars.
- **Faceted Product Catalog (`/products`)**:
  - Full-text search with instant autocomplete and category filtering.
  - Multi-faceted filters: Category radio selector, Brand checkboxes, Dynamic Price Range Slider, Minimum Customer Star Rating (4★, 3★), In-Stock Only, and Limited Flash Deals.
  - Multi-sorting: Price (Low to High, High to Low), Customer Rating, Biggest Discounts, and Newest Arrivals.
- **Rich Product Detail Pages (`/products/[slug]`)**:
  - Image gallery with zoom preview and thumbnail navigation.
  - Dynamic variant selector (Color, Storage, Size) that updates price and stock in real time.
  - Real-time pincode delivery checker and estimated express delivery calculator.
  - Technical specifications table and key highlights bullet points.
  - Verified merchant seller card with rating and store link.
  - Customer review breakdown (rating distribution bars) and verified purchase reviews.
  - Interactive "Write a Review" modal with star rating and validation.
  - Related items in category and automatic **Recently Viewed** tracking.
- **Smart Shopping Cart (`/cart`)**:
  - Item quantity controls, removal, and "Move to Wishlist".
  - **Free Express Shipping Progress Bar** (e.g. *"Add ₹101 more to unlock FREE Delivery"*).
  - Promo code applicator with preloaded active coupons (`NEX50`, `SUPER1000`, `FREESHIP`).
  - Transparent price summary with subtotal, tax breakdown (GST 5%), and real-time discounts.
- **Streamlined Checkout (`/checkout`)**:
  - Saved delivery address book with **"+ Add New Address"** modal.
  - Multiple payment options: **UPI / QR Instant Pay**, **Credit/Debit Card** (with live card number, expiry, and CVV validation), **Net Banking**, and **Cash on Delivery (COD)**.
  - Automated transaction ID generation, item total calculation, and order placement.
- **Order Success & Tracking (`/order-success/[orderNumber]`)**:
  - Celebratory confirmation screen with order summary and expected delivery date.
- **5-Stage Live Order Tracking (`/account/orders/[orderNumber]`)**:
  - Real-time visual progress stepper: **Confirmed ➔ Packed ➔ Shipped ➔ Out for Delivery ➔ Delivered**.
  - Detailed activity log with timestamps, locations, courier partner, and tracking number.
  - **Cancel Order** modal with reason selection and automatic refund processing.
  - **Return / Replacement** modal under 7-day guarantee with doorstep pickup scheduling.
  - **Printable Tax Invoice & Cash Receipt** with GST breakdown.
- **Interactive 24x7 Customer Support AI Assistant**:
  - Floating chat launcher with live status badge.
  - Smart order query resolution: Type any order number (e.g., `NEX-2026-8942` or `NEX-2026-8575`) to instantly fetch live shipment status, courier, and tracking details.
  - Quick action chips for returns policy, payment questions, active offers, and agent handover simulation.
- **User Account & Notifications (`/account`)**:
  - Profile editor, password update, saved address book, order history tabs, wishlist, and unread notification center.
- **Mobile-First Experience**:
  - Fixed mobile bottom navigation bar (Home, Categories, Wishlist, Cart, Account).
  - Responsive drawer menu and collapsible filter panels.

---

### 🛡️ 2. Enterprise Admin Dashboard (`/admin`)
- **Executive Analytics**: Gross revenue counter, total orders, active customer count, low-stock threshold alerts, and weekly revenue inflow chart.
- **Product Catalog Management**: View all listed products, prices, stock, and add new products with image URLs and specs.
- **Order Fulfillment Console**: View all customer orders across India, track payment statuses, and update shipment lifecycle stages.
- **Category Taxonomies**: View and manage hierarchical product categories.
- **User & Role Administration**: Inspect registered customers and sellers with order metrics.
- **Coupons & Promotions Engine**: Create percentage or fixed discount promo codes, set minimum order amounts and usage limits.
- **Hero Banners Manager**: Manage homepage slider campaigns and promotional badges.

---

### 🏪 3. Seller Central Portal (`/seller`)
- **Store Analytics**: Store revenue, total items sold, order count, and low-stock warning banners.
- **Product Listing**: Publish new inventory directly to the marketplace with custom pricing and images.
- **Fulfillment & Dispatching**: Inspect pending orders containing seller products, assign courier partners (BlueDart, Delhivery, DTDC), generate tracking IDs, and confirm dispatch.
- **Store Profile Settings**: Update store name, bio, and GSTIN registration.
- **Public Seller Storefront (`/sellers/[slug]`)**: Dedicated merchant storefront with ratings, sales count, and store product catalog.

---

## 🔑 Demo Access & 1-Click Role Switcher

For instant testing and evaluation, NexMart includes a **1-Click Demo Role Switcher** right in the header bar and login page:

| Role | Demo Email | Demo Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@nexmart.com` | `customer123` | Browsing, ordering, tracking, reviews, wishlist |
| **Seller** | `seller@nexmart.com` | `seller123` | Managing Apex Tech Hub, listing products, dispatching orders |
| **Admin** | `admin@nexmart.com` | `admin123` | Full enterprise control, analytics, orders, coupons, banners |

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with responsive design, glassmorphism, and custom scrollbars
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (`dev.db`) — zero external dependencies, easily switchable to PostgreSQL by updating `provider = "postgresql"` in `prisma/schema.prisma`
- **Authentication**: JWT-based session management stored in secure HTTP-only cookies + Bearer token support
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Seed Initial Catalog
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 3. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Run in Production Mode
```bash
npm run build
npm start
```

---

## 📡 REST API Architecture

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/me` | `GET` | Get current authenticated user session |
| `/api/auth/login` | `POST` | Authenticate user with email and password |
| `/api/auth/register` | `POST` | Register customer or merchant seller |
| `/api/auth/logout` | `POST` | Clear authentication session |
| `/api/auth/switch-demo` | `POST` | Instantly switch between Demo Customer, Seller, and Admin |
| `/api/products` | `GET`, `POST` | Filter, sort, paginate catalog; create new product |
| `/api/products/[slug]` | `GET`, `PUT`, `DELETE` | Single product details, update product, delete product |
| `/api/categories` | `GET`, `POST` | Hierarchical categories with product count |
| `/api/cart` | `GET`, `POST`, `DELETE` | Fetch user cart, add/update quantity, clear cart |
| `/api/cart/[id]` | `PATCH`, `DELETE` | Update cart item quantity or remove item |
| `/api/wishlist` | `GET`, `POST` | User wishlist items, toggle add/remove |
| `/api/wishlist/[productId]`| `DELETE` | Remove item from wishlist |
| `/api/coupons/validate` | `POST` | Validate promo code and calculate discount |
| `/api/orders` | `GET`, `POST` | List orders for user/seller/admin; place new order |
| `/api/orders/[orderNumber]`| `GET`, `PATCH` | Order details & tracking timeline; cancel; return |
| `/api/reviews` | `POST` | Submit customer review with rating recalibration |
| `/api/support/chat` | `GET`, `POST` | 24x7 automated customer care AI & order lookup |
| `/api/notifications` | `GET`, `PATCH` | User notifications with unread counter |
| `/api/admin/stats` | `GET` | Executive dashboard analytics & metrics |
| `/api/admin/users` | `GET`, `PATCH` | User administration & role management |
| `/api/admin/coupons` | `GET`, `POST`, `DELETE`| Promo codes management |
| `/api/admin/banners` | `GET`, `POST`, `DELETE`| Hero slider management |
| `/api/seller/stats` | `GET` | Seller revenue, inventory alerts, and assigned orders |
