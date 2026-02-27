# LoyaltyHub MVP Foundation

LoyaltyHub is a SaaS MVP where businesses can showcase products and run a QR-based digital loyalty program.

## Stack

- Next.js (App Router)
- Tailwind CSS
- Lucide React icons
- Supabase (Auth + Postgres)

## 1) Standard Next.js Folder Structure

See the full structure in [`docs/FOLDER_STRUCTURE.md`](./docs/FOLDER_STRUCTURE.md).

## 2) Database Schema (SQL)

The complete SQL schema is in [`supabase/schema.sql`](./supabase/schema.sql) and includes:

- `profiles` (with `admin` / `customer` roles)
- `businesses`
- `products`
- `loyalty_cards`
- timestamps, indexes, RLS policies, and update triggers

## 3) Landing Page Hero Section

Implemented in:

- [`components/landing/Hero.tsx`](./components/landing/Hero.tsx)
- [`app/page.tsx`](./app/page.tsx)

Design goals:

- Clear value proposition for business owners
- Indigo + Slate color palette
- Clean and mobile-responsive layout

## 4) Business Dashboard Layout

Implemented in:

- [`app/dashboard/layout.tsx`](./app/dashboard/layout.tsx)
- [`components/dashboard/Sidebar.tsx`](./components/dashboard/Sidebar.tsx)
- [`app/dashboard/page.tsx`](./app/dashboard/page.tsx)
- [`app/dashboard/products/page.tsx`](./app/dashboard/products/page.tsx)
- [`app/dashboard/scan/page.tsx`](./app/dashboard/scan/page.tsx)

Sidebar items:

- Overview
- My Products
- Scan QR Code

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Run development server:

   ```bash
   npm run dev
   ```

4. Open <http://localhost:3000>.