# Meshoo Online Store

A full-featured e-commerce platform built with **React.js**, **Vite**, **Tailwind CSS**, and **Google Firebase**.

## Project Architecture & Overview

* **Firebase Project ID:** `web-application-ad62e`
* **Dual-Interface System:**
  * **Customer Storefront:** Catalog browsing, search/filtering, cart management, checkout with frozen purchase prices, order tracking, wishlist syncing, and product reviews.
  * **Admin Console:** Protected role-based management for products, categories, orders, customers, and store settings.

---

## Technical Specifications Implemented

### 1. Firebase Configuration & Environment (Sections 32 & 46)
* Config file: `src/firebase/config.js`
* Environment variables: `.env` and `.env.example`
  * `VITE_FIREBASE_API_KEY`
  * `VITE_FIREBASE_AUTH_DOMAIN=web-application-ad62e.firebaseapp.com`
  * `VITE_FIREBASE_PROJECT_ID=web-application-ad62e`
  * `VITE_FIREBASE_STORAGE_BUCKET=web-application-ad62e.firebasestorage.app`
  * `VITE_FIREBASE_MESSAGING_SENDER_ID=28562787874`
  * `VITE_FIREBASE_APP_ID=1:28562787874:web:56dfd4de79a27ac865847b`
  * `VITE_FIREBASE_MEASUREMENT_ID=G-PMMJ4W9N21`

### 2. Firestore Collections & Schemas (Sections 34–41)
* `users/{userId}`: Profile details, role (`customer` | `admin`), address, contact info.
* `products/{productId}`: Name, price, discountPrice, category, SKU, stock, images, rating.
* `categories/{categoryId}`: Name, description, image, status (`active` | `inactive`).
* `orders/{orderId}`: Customer info, order & payment statuses, shipping address, and **historical price-frozen items** (`productId`, `name`, `image`, `price`, `quantity`, `subtotal`).
* `reviews/{reviewId}`: Product ratings and comments with moderation status (`pending`, `approved`, `rejected`).
* `wishlists/{userId}`: Customer-specific wishlist IDs synchronized in real-time.
* `settings/store`: Store configuration, currency (`PKR`), delivery fee (`200`), maintenance mode.

### 3. Firebase Storage (Section 42)
* `products/{productId}/`
* `categories/{categoryId}/`
* `users/{userId}/`
* `store/`

### 4. Security Rules (Sections 44 & 45)
* `firestore.rules`:
  * Public/Customer read on active products & categories.
  * Strict customer isolation on profiles, orders, and wishlists.
  * Protection against client-side role elevation (`role` cannot be escalated by customers).
  * Immutability of order lines and purchase prices after creation.
  * Full administrative privileges for users with `role == 'admin'`.
* `storage.rules`:
  * Enforces proper bucket paths and user/admin ownership.

### 5. Admin Authorization (Section 43)
Admin routes are protected via `<ProtectedRoute requireAdmin={true}>`:
* `/admin/dashboard`
* `/admin/products`
* `/admin/products/add`
* `/admin/products/edit/:id`
* `/admin/categories`
* `/admin/orders`
* `/admin/customers`
* `/admin/settings`

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and provide your Firebase Web API Key:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

### 5. Deploy Firebase Rules
If using Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage:rules
```

---

## Initial Demo Data
On the home page, if the Firestore database is currently empty, click the **"Seed Demo Products to Firestore"** button to automatically populate initial categories, products, and store settings.
