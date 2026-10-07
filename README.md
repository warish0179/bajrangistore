# 🛒 BajrangiStore — Enterprise Multi-Role E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.1.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.2.0-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=flat&logo=sqlite)](https://sqlite.org/)

A full-stack, enterprise-grade e-commerce ecosystem inspired by the scale and speed of modern marketplaces like Amazon and Flipkart, featuring an original Indian visual identity (saffron/amber accents with midnight slate contrast), 4 completely separate role-based portals, an authentic 1,620-product catalog across 10 categories, an end-to-end UTR payment verification center, and a tamper-proof doorstep delivery OTP handshake.

---

## 🌟 Key Highlights & Feature Matrix

### 👤 1. Customer Storefront & Account Hub (`/` & `/account`)
- **Homepage Showcase**: High-impact promotional hero banners, interactive category bar, live ticking **Flash Deals countdown**, blockbuster **Deals of the Day**, trending authentic products, and customer value guarantees.
- **1,620 Authentic Branded Products**: Pre-seeded with 162+ diverse product varieties in each of the 10 major categories across 312 authentic brands (Apple, Samsung, Sony, Nike, Adidas, Philips, Dyson, Dell, HP, Lego, etc.). Strict brand compliance ensures "BajrangiStore" is never assigned as a product brand.
- **Faceted Product Search & Filters (`/products`)**:
  - Full-text search with live category filtering.
  - Multi-faceted sidebar filters: Category radio selector, Brand checkboxes, dynamic Price Range slider, Minimum Customer Star Rating (4★, 3★, 2★), In-Stock Only, and Limited Flash Deals.
- **Dynamic Category Pages (`/category/[slug]`)**:
  - Full support for canonical slugs and intelligent aliases (e.g. `mobiles-tablets`, `electronics-audio`, `laptops-computers`, `fashion-apparel`, `footwear`, `home-kitchen`, `beauty-grooming`, `grocery-gourmet`, `sports-fitness`, `toys-kids`).
- **Product Details Page (`/products/[slug]`)**:
  - Multi-image zoom gallery, authentic technical specifications table, bullet highlights, verified seller card, customer reviews, and dynamic variant selector.
- **Amazon/Flipkart-Style Authentication (`/auth/login` & `/auth/register`)**:
  - Login via Mobile Number + Password OR Mobile + Live OTP verification.
  - Dedicated registration with live 6-digit OTP verification and automatic ₹500 welcome wallet bonus.
- **Dedicated Customer Account Hub (`/account`)**:
  - Clean side navigation for Profile, Saved Addresses (full CRUD with HOME/WORK/OTHER tags and landmarks), My Orders with **Secret Doorstep Delivery OTP**, Wishlist, Instant Wallet, Coupons, Returns & Refunds, and 24x7 Help Center.
- **Multi-Step Checkout (`/checkout`)**:
  - Saved address selector, coupon applicator, and multiple payment methods (PhonePe UPI QR scanner, Bank Transfer, Instant Wallet, Cash on Delivery).

---

### 🛡️ 2. Admin Controller — Central Control System (`/admin`)
- **Executive Analytics**: Gross revenue counter, active customers, order volumes, inventory alerts, and revenue trends.
- **Payment Receiving Center**:
  - Review manual UPI and Jio Payments Bank transfers with customer-submitted 12-digit UTR references.
  - One-click **"Approve & Mark Paid"** or **"Reject"** with audit trails and instant order status updates.
- **Payment Settings Manager**: Configure UPI ID (`9835400188-k322-3@ibl`), Bank Account (`000521713102565`), IFSC (`JIOP0000001`), and toggle payment methods.
- **Delivery Fleet Management**: Assign confirmed orders to active delivery workers in real time.
- **Seller KYC Moderation**: Approve or suspend registered sellers.
- **Catalog & Promotions**: Add/edit products, manage categories, issue discount coupons, and upload promotional banners.

---

### 🏬 3. Seller Center (`/seller`)
- **Dedicated Business Onboarding (`/seller/login` & `/seller/register`)**: Merchant registration with GSTIN, PAN, bank accounts, and warehouse pickup address.
- **Inventory & Catalog Management**: Add products, configure variants, adjust pricing, and track low-stock warnings.
- **Order Fulfillment**: Track pending orders, pack packages, and prepare shipments for courier dispatch.
- **Revenue Dashboard**: Sales performance, settlement history, and platform commission breakdown.

---

### 🚚 4. Delivery Partner App (`/delivery`)
- **Dedicated Rider Onboarding (`/delivery/login` & `/delivery/register`)**: Driver registration with Driving License, vehicle details, Aadhaar, PAN, and emergency contacts.
- **Mobile-First Rider Hub**: View assigned shipments, customer address, navigation shortcuts, and direct phone calling.
- **Doorstep Handshake OTP Verification**:
  - Every order generates a secret 4-digit code (e.g. `8942`) visible exclusively on the customer's order tracking screen.
  - Rider must enter the customer's 4-digit OTP to complete delivery, eliminating false delivery claims.
  - COD cash collection validation and automatic incentive crediting (₹65/order).

---

## 💳 Payment System Details

The platform supports a verified payment receiving workflow:
- **Configured UPI ID**: `9835400188-k322-3@ibl`
- **Dynamic & Static QR**: High-resolution PhonePe / Jio Payments QR code rendered at `/payments/bajrangi_upi_qr.jpg`.
- **Bank Transfer Credentials**:
  - **Account Holder**: `Warish Raj`
  - **Bank Name**: `Jio Payments Bank`
  - **Account Number**: `000521713102565`
  - **IFSC Code**: `JIOP0000001`
- **12-Digit UTR Verification**: Customers submit their bank UTR reference at checkout; the transaction enters the Admin Payment Receiving Center for instant verification.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js 18.x or 20.x / 22.x
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/warish0179/bajrangistore.git
cd bajrangistore
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="bajrangistore-production-jwt-secret-key-2026"
NEXTAUTH_SECRET="bajrangistore-nextauth-secret-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seeding
```bash
# Push schema to SQLite
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# (Optional) Seed the full 1,620-product catalog & demo users
node prisma/seed_catalog.js
node prisma/seed_50_variety_products.js
```

### 5. Run the Application
```bash
# Development mode
npm run dev

# Production build and run
npm run build
npm start
```

Visit **`http://localhost:3000`** in your browser.

---

## 🔑 Pre-Seeded Demo Credentials

A **1-Click Quick Role Switcher** is pinned to the header on every page. Alternatively, log in manually:

| Persona | Portal URL | Email / Mobile | Password |
| :--- | :--- | :--- | :--- |
| **Customer** | [`/auth/login`](http://localhost:3000/auth/login) | `customer@bajrangistore.com` / `9876543210` | `customer123` |
| **Seller** | [`/seller/login`](http://localhost:3000/seller/login) | `seller@bajrangistore.com` / `9876543211` | `seller123` |
| **Delivery Partner** | [`/delivery/login`](http://localhost:3000/delivery/login) | `delivery@bajrangistore.com` / `9876543212` | `delivery123` |
| **Master Admin** | [`/admin/login`](http://localhost:3000/admin/login) | `admin@bajrangistore.com` / `9876543213` | `admin123` |

---

## 📂 Project Structure

```text
├── prisma/
│   ├── schema.prisma                       # Database models & relationships
│   ├── dev.db                              # SQLite database (pre-seeded with 1,620 items)
│   ├── seed_catalog.js                     # Core catalog seeder
│   └── seed_50_variety_products.js         # Diverse varieties seeder
├── public/
│   └── payments/
│       └── bajrangi_upi_qr.jpg             # High-res UPI QR code image
├── src/
│   ├── app/
│   │   ├── (storefront)/page.tsx           # Marketplace Home Page
│   │   ├── account/                        # Customer Account Hub & Orders
│   │   ├── admin/                          # Admin Controller & Payment Receiving Center
│   │   ├── auth/                           # Login & Registration with OTP
│   │   ├── cart/                           # Shopping Cart
│   │   ├── category/[slug]/                # Category catalog with slug aliasing
│   │   ├── checkout/                       # Multi-step checkout & UTR submission
│   │   ├── delivery/                       # Delivery Rider mobile application
│   │   ├── order-success/                  # Order confirmation & Doorstep OTP display
│   │   ├── products/                       # Faceted Search & Catalog
│   │   ├── seller/                         # Seller Center Dashboard
│   │   └── api/                            # Next.js API Routes (auth, orders, payments, etc.)
│   ├── components/                         # Reusable UI components & layouts
│   ├── context/                            # React Contexts (Auth, Cart, Wishlist, Toast)
│   └── lib/                                # Prisma client, formatters, utilities
├── .env.example
├── package.json
└── README.md
```

---

## 👨‍💻 Author & Maintainer

**Warish Raj**
- GitHub: [@warish0179](https://github.com/warish0179)
- Email: [warish542006@gmail.com](mailto:warish542006@gmail.com)

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
