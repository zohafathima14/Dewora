# Dewora — Everyday Care. Naturally You.

A high-finish, accessible Indian skincare & beauty direct-to-consumer (D2C) e-commerce storefront demonstration built purely with semantic HTML5, modern CSS3, and vanilla JavaScript (ES6+).

---

## 1. Project Overview

**Dewora** is a fictional modern Indian skincare brand designed for everyday wellness and gentle barrier care. The storefront simulates a full-featured e-commerce customer journey—from homepage product discovery, faceted catalogue browsing, and detailed product analysis to cart management, wishlist curation, and a secure mock checkout flow.

- **Brand Name**: Dewora
- **Tagline**: Everyday care. Naturally you.
- **Brand Personality**: Fresh, minimal, youthful, approachable, and transparent.
- **Architecture**: 100% Client-Side Static Architecture (Zero Frameworks, Zero Backend, Zero External Runtime Dependencies).

---

## 2. Key Features

- **Storefront Discovery (Homepage)**:
  - Editorial hero with dynamic product highlights and quick benefit badges.
  - Multi-category navigation tiles (Sunscreen, Cleansers, Moisturizers, Serums, Body Care).
  - Dynamic Bestseller showcase with instant Add-to-Bag and Wishlist toggling.
  - Shop by Skin Concern cards (Dryness, Dullness, Sun Care, Barrier Care).
  - Brand value pillars and honest customer routine reviews.
- **Product Catalogue & Discovery (`shop.html`)**:
  - Full-text instant search across product names, categories, ingredients, and skin concerns.
  - Multi-attribute faceted filtering: Category, Skin Type (Dry, Oily, Combination, Sensitive, Normal), Skin Concern, and Price Ranges (Under ₹300, ₹300–₹500, ₹500–₹700, ₹700–₹1,000, Above ₹1,000).
  - URL query parameter synchronization (`?q=`, `?category=`, `?skinType=`, `?concern=`, `?priceRange=`, `?sort=`) supporting deep links and browser history navigation.
  - Responsive mobile filter drawer with touch gestures and live count badges.
  - Interactive active filter chips with individual removal and one-click "Clear All".
- **Product Detail Page (`product.html?id={PRODUCT_ID}`)**:
  - Interactive multi-angle image gallery with thumbnail preview.
  - Dynamic pricing and size information in Indian Rupees (₹).
  - Accessible quantity stepper with dynamic subtotal calculations.
  - Complete expandable ingredient breakdown, usage ritual, and safety notes.
  - Curated related products carousel linking to complementary routine steps.
  - Graceful 404 / missing product error handling.
- **Shopping Bag (`cart.html`)**:
  - Live order calculation in whole Indian Rupees (₹).
  - Free Delivery Progress Bar against the ₹499 order threshold:
    - Cart subtotal $\ge$ ₹499: Unlocks **FREE Standard Delivery**.
    - Cart subtotal $<$ ₹499: Dynamically informs remaining amount needed (no unapproved delivery fee invented).
  - Line-item quantity controls with automatic recalculation and item deletion.
  - Responsive empty cart state with direct category quick-links.
- **Curated Wishlist (`wishlist.html`)**:
  - Persistent saved item collection across page refreshes.
  - One-click "Add to Cart" with automated duplicate line-item consolidation.
  - "Move all to Bag" action bar and "Clear Wishlist" shortcut.
- **Simulated Checkout Flow (`checkout.html`)**:
  - Accessible step-by-step checkout progress tracker.
  - Thorough customer & delivery validation (Full Name, RFC 5322 Email, 10-digit Indian Mobile `[6-9]\d{9}`, Building, Street, 36 Indian States/UTs, 6-digit PIN code).
  - Double-click and rapid re-submission prevention.
  - Simulated payment processing notice clearly explaining the demo environment.
  - XSS-hardened order confirmation screen with unique simulated tracking ID (`DEW-XXXXXX`) and formatted delivery address.
  - Automatic shopping bag clearance upon order completion.
  - **Zero Customer Data Persistence**: Name, email, phone, and address are processed strictly in transient memory and never written to localStorage or cookies.
- **Brand Information & FAQs (`about.html`, `faq.html`)**:
  - Transparent disclosure of the demo nature of the storefront.
  - Brand philosophy focused on simple, barrier-first daily rituals.
  - Accessible interactive accordion FAQs with full keyboard navigation (Enter/Space support).

---

## 3. Technology Stack & Constraints

- **Markup**: Semantic HTML5 with ARIA landmark roles and accessibility attributes.
- **Styling**: Pure CSS3 utilizing design tokens (`:root` CSS custom properties), CSS Grid, and Flexbox. Zero CSS preprocessors or frameworks (no Tailwind, Bootstrap, or Sass).
- **Scripting**: Vanilla JavaScript (ES6+ modular IIFE patterns). Zero frontend frameworks (no React, Vue, Angular, Svelte) and zero build-step requirements.
- **Storage**: Browser `localStorage` strictly scoped to two state keys:
  - `dewora_cart_v1`: Array of `{ productId: string, quantity: number }`.
  - `dewora_wishlist_v1`: Array of `productId` strings.
- **Dependencies**: 0 external runtime dependencies, 0 third-party CDNs, 0 analytics trackers. All SVG icons and illustration assets are served locally.

---

## 4. Project Folder Structure

```text
dewora/
├── .gitignore                     # Git ignore rules for OS, node, and temp files
├── README.md                      # Complete project documentation
├── PRD.md                         # Product Requirements Document
├── TRD.md                         # Technical Requirements Document
├── DESIGN.md                      # Design System & Token Specifications
├── ANTIGRAVITY_BUILD_PROMPT.md    # Build specifications
│
├── index.html                     # 1. Homepage
├── shop.html                      # 2. Product Catalogue
├── product.html                   # 3. Product Detail Page (PDP)
├── cart.html                      # 4. Shopping Bag
├── checkout.html                  # 5. Simulated Checkout & Confirmation
├── wishlist.html                  # 6. Saved Items / Wishlist
├── about.html                     # 7. Brand Story & Values
├── faq.html                       # 8. Frequently Asked Questions
│
├── css/
│   ├── base/                      # Reset, typography, and design tokens
│   │   ├── reset.css
│   │   ├── tokens.css
│   │   └── typography.css
│   ├── components/                # Modular UI component styles
│   │   ├── header.css
│   │   ├── footer.css
│   │   ├── product-card.css
│   │   ├── toast.css
│   │   └── modal.css
│   └── pages/                     # Page-specific stylesheets
│       ├── home.css
│       ├── shop.css
│       ├── product.css
│       ├── cart.css
│       ├── checkout.css
│       ├── wishlist.css
│       ├── about.css
│       └── faq.css
│
├── js/
│   ├── app.js                     # Global application lifecycle orchestrator
│   ├── components/                # Shared UI components
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── product-card.js
│   │   └── toast.js
│   ├── data/                      # Client-side product dataset
│   │   └── products.js            # 12 fictional skincare formulations
│   ├── pages/                     # Page-specific controllers
│   │   ├── home.js
│   │   ├── shop.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── wishlist.js
│   │   ├── about.js
│   │   └── faq.js
│   └── utils/                     # Storage, DOM, and currency utilities
│       ├── storage.js
│       ├── dom.js
│       └── currency.js
│
└── assets/                        # Local vector assets & illustrations
    └── images/
        ├── brand/                 # Brand logos and wordmarks
        ├── categories/            # Category icon cards
        ├── editorial/             # Editorial ritual and concern graphics
        ├── hero/                  # Homepage hero illustration
        └── products/              # Product packshot SVG illustrations
```

---

## 5. How to Run Locally

Because Dewora uses standard relative imports and vanilla web technologies, you can run it using any static HTTP web server or by directly opening the files.

### Option 1: Using Python (Recommended)
```bash
# In the project directory:
python3 -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 2: Using Node.js (npx serve)
```bash
npx serve .
```
Then open the local URL displayed in the terminal.

### Option 3: Direct File Access
You can double-click `index.html` or open it directly in modern browsers (Chrome, Safari, Firefox, Edge). A local web server is recommended for uniform URL query parameter testing.

---

## 6. Page Inventory

| Page | URL Path | Key Functionality |
| :--- | :--- | :--- |
| **Homepage** | `index.html` | Hero, bestseller showcase, shop-by-category, shop-by-concern, brand value pillars, routine testimonials, newsletter signup. |
| **Catalogue** | `shop.html` | Full catalogue grid, real-time search, multi-group filters (Category, Skin Type, Concern, Price), sort dropdown, active chips, responsive mobile drawer. |
| **Product Detail** | `product.html?id={id}` | Image gallery, quantity selector, add-to-bag, save-to-wishlist, ingredient details, usage guide, related products carousel. |
| **Shopping Bag** | `cart.html` | Line items table, quantity increment/decrement steppers, item removal, ₹499 free-delivery progress indicator, subtotal calculation. |
| **Wishlist** | `wishlist.html` | Saved products grid, individual add-to-bag, move-all-to-bag with deduplication, clear wishlist. |
| **Checkout** | `checkout.html` | Customer and Indian address form validation, summary recap, simulated order generation, instant cart clearance. |
| **About** | `about.html` | Brand purpose, demo storefront transparency notice, daily care philosophy, 4 core formulation pillars. |
| **FAQ** | `faq.html` | 12 interactive questions and answers covering routine orders, delivery threshold, ingredients, and demo scope. |

---

## 7. Functional Limitations & Demonstration Notice

> [!IMPORTANT]
> **Dewora is a frontend-only demonstration project.**
> - **No Real Transactions**: No payment gateways (Stripe, Razorpay, UPI) are integrated. No monetary charges are processed.
> - **No Backend Services**: There is no server, database, or backend API. All data lives client-side in `products.js` and local browser storage.
> - **No User Accounts**: There is no user authentication, login, or server session.
> - **No Real Order Fulfillment**: Submitting the checkout form generates a simulated client-side confirmation and tracking code for demonstration purposes only.
> - **Privacy First**: No real customer personal data, phone numbers, or addresses are stored, tracked, or sent across the network.
> - **Demo Products**: All 12 skincare products, prices, and reviews are fictional demo creations.

---

## 8. Deployment & Repository Information

- **GitHub Repository**: [https://github.com/zohafathima14/Dewora](https://github.com/zohafathima14/Dewora)
- **Live Vercel Deployment**: *(Pending Vercel deployment authorization)*
- **Hosting Type**: Pure Static Website (Framework Preset: Other / Static HTML)
