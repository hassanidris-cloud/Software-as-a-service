# LoyaltyHub MVP Foundation

LoyaltyHub is a SaaS MVP where businesses can showcase products and run a QR-based digital loyalty program.

## Stack

- Next.js (App Router)
- Tailwind CSS
- Lucide React icons
- Supabase (Auth + Postgres)
- html5-qrcode (scanner)

## 1) Standard Next.js Folder Structure

See the full structure in [`docs/FOLDER_STRUCTURE.md`](./docs/FOLDER_STRUCTURE.md).

## 2) Database Schema (SQL)

The complete SQL schema is in [`supabase/schema.sql`](./supabase/schema.sql) and includes:

- `profiles` (with `admin` / `customer` roles)
- `businesses`
- `products`
- `loyalty_cards`
- timestamps, indexes, RLS policies, and update triggers
- auto profile creation trigger on `auth.users`
- `increment_loyalty_points` RPC for atomic scanner updates
- Supabase Storage bucket/policies for `product-images`

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

## 5) Auth, Roles, and Protected Routes

- Auth page: [`app/auth/page.tsx`](./app/auth/page.tsx)
- Auth UI: [`components/auth/AuthPanel.tsx`](./components/auth/AuthPanel.tsx)
- Middleware protection: [`middleware.ts`](./middleware.ts)
- Server-side admin guard: [`lib/auth/require-admin.ts`](./lib/auth/require-admin.ts)

Rules implemented:

- `/dashboard/*` requires an authenticated user
- dashboard layout additionally enforces `profile.role = 'admin'`
- role (`admin`/`customer`) is saved at sign-up via Supabase user metadata

## 6) Product Form + Image Upload

- Product page: [`app/dashboard/products/page.tsx`](./app/dashboard/products/page.tsx)
- Form component: [`components/dashboard/AddProductForm.tsx`](./components/dashboard/AddProductForm.tsx)

Flow:

1. Upload image to Supabase Storage bucket `product-images` under `<business_id>/...`
2. Insert product row with `image_url` in `products`

## 7) QR Scanner + Loyalty Points

- Scanner page: [`app/dashboard/scan/page.tsx`](./app/dashboard/scan/page.tsx)
- Scanner component: [`components/dashboard/QrScannerPanel.tsx`](./components/dashboard/QrScannerPanel.tsx)

The scanner reads a UUID token and calls the RPC:

- `increment_loyalty_points(p_business_id, p_qr_token, p_points_to_add)`

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Apply schema in Supabase SQL editor:

   - Run [`supabase/schema.sql`](./supabase/schema.sql)

4. Run development server:

   ```bash
   npm run dev
   ```

5. Open:

- Landing: <http://localhost:3000>
- Auth: <http://localhost:3000/auth>
- Dashboard: <http://localhost:3000/dashboard>