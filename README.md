# LoyaltySphere

LoyaltySphere is a premium B2B SaaS platform for business product directories and 3D digital loyalty cards.

## Stack

- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- canvas-confetti
- Supabase (Auth + PostgreSQL + Storage + RLS)
- Lucide React icons
- html5-qrcode (merchant scanner)

## Core Features

1. **SQL Schema + RLS** in [`supabase/schema.sql`](./supabase/schema.sql)
   - `profiles` (`business` / `customer`)
   - `businesses` (includes `theme_config` for 3D visual presets)
   - `products`
   - `loyalty_cards` (`stamps_earned`)
   - strict owner isolation for business data
   - customer-only loyalty card reads, owner-only stamp updates

2. **Landing Experience**
   - Dark mesh-gradient SaaS hero
   - Glassmorphism cards
   - Feature bento: Product Showcase, 3D Loyalty Cards, Merchant Scanner
   - Framer Motion 3D tilt customer card with confetti + haptic events

3. **Business Dashboard**
   - Private route layout with sidebar
   - Product Manager CRUD (`/dashboard/products`)
   - Stamp Scanner camera flow (`/dashboard/scan`)

## Local Setup

```bash
npm install
cp .env.example .env.local
```

Run [`supabase/schema.sql`](./supabase/schema.sql) in Supabase SQL editor, then:

```bash
npm run dev
```