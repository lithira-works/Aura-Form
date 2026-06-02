# CosmoPOS — Cloud-Based POS & Inventory System

> A premium, enterprise-grade Point of Sale and Inventory Management system built specifically for high-end cosmetic retail.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=flat-square&logo=framer)

---

## Overview

**CosmoPOS** is a full-stack cloud POS system designed for the **Aura & Form** cosmetic boutique. It combines a beautiful, minimalist UI with enterprise-grade features: real-time inventory tracking, role-based access control, barcode scanning, loyalty programs, and analytics.

### Design Language

| Token | Value |
|---|---|
| Background | `#FAFAFC` |
| Surface | `#FFFFFF` |
| Brand Pink | `#F2A7B9` |
| Text | `#1D1D1F` |
| Border radius | `rounded-2xl` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Web / Admin Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion |
| Mobile / Tablet | Flutter (cloud-synced cashier app) |
| Backend | Node.js, MongoDB |
| Real-time | Firebase (notifications & sync) |
| Icons | Lucide React |

---

## Modules

### ✅ Module 1 — POS Interface (Complete)
The main cashier screen, fully functional and interactive.

**Features:**
- Quick-tap product grid with animated card interactions
- Real-time category filter tabs (All, Face, Eyes, Lips, Skin Care, Fragrance, Nails, Tools)
- Live search across product name, brand, shade, and barcode
- Smart shopping cart sidebar with quantity controls
- Percentage discount input with live GST (18%) calculation
- Payment method selector: Cash, Card, UPI/QR
- Animated checkout flow with order confirmation flash
- USB/Bluetooth barcode scanner listener (auto-detects rapid keystroke + Enter)
- Manual barcode entry modal with animated scan viewport
- Per-product stock badges: In Stock / Low Stock / Out of Stock
- Live clock and online/offline sync indicator in header
- Role-based cashier profile display (Admin, Senior Cashier, Cashier)

### 🔜 Module 2 — Inventory Management
CRUD for stock, barcode generation & mapping, supplier tracking.

### 🔜 Module 3 — Expiry & Stock Alerts
Visual expiry date tags, low-stock threshold warnings, alert notifications.

### 🔜 Module 4 — Customer Hub
Customer profiles, purchase history, points-based loyalty tier system.

### 🔜 Module 5 — Analytics Dashboard
Daily/monthly profit reports, top-selling items, cloud-sync status.

---

## Project Structure

```
├── app/
│   ├── globals.css          # CSS variables, custom scrollbar, theme tokens
│   ├── layout.tsx           # Root layout + metadata
│   ├── page.tsx             # Redirects / → /pos
│   └── pos/
│       └── page.tsx         # Main POS orchestrator (all state)
├── components/pos/
│   ├── POSHeader.tsx        # Brand, live clock, search bar, cashier, sync status
│   ├── CategoryFilter.tsx   # Animated pill-tab category selector
│   ├── ProductGrid.tsx      # Quick-tap product cards with stock badges
│   ├── CartSidebar.tsx      # Cart, discount, tax, payment, checkout
│   └── BarcodeScannerModal.tsx  # Dark scanner viewport + manual barcode input
├── hooks/
│   └── useBarcode.ts        # USB/BT barcode scanner listener hook
├── lib/
│   └── mock-data.ts         # 23 products, 7 categories, 3 cashiers, TAX_RATE
└── public/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects straight to the POS screen.

> **Note:** The `npm run dev` script uses `node node_modules/next/dist/bin/next dev` directly to work around a Windows path issue with `&` in the folder name.

### Test the Barcode Scanner

1. Click the **Scan** button in the top bar
2. Type `8901234560001` and press **Enter**
3. "Silk Foundation" by Dior Beauty will be added to the cart

---

## Mock Data

23 cosmetic products across 7 categories are seeded in `lib/mock-data.ts`. Each product has:
- Barcode, brand, name, shade, price, stock level, low-stock threshold, emoji, expiry date
- 3 demo cashier accounts (Admin, Senior Cashier, Cashier) with role-based display

---

## License

Private — Aura & Form Cosmetics. All rights reserved.
