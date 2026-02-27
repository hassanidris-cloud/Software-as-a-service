# LoyaltyHub - Recommended Next.js Folder Structure

```text
.
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   └── page.tsx
│   │   └── scan/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   └── Sidebar.tsx
│   └── landing/
│       └── Hero.tsx
├── docs/
│   └── FOLDER_STRUCTURE.md
├── lib/
│   └── supabase/
│       └── client.ts
├── public/
│   └── (images, logos, static assets)
├── supabase/
│   └── schema.sql
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

This structure keeps `app/` focused on routes/layouts, while `components/` contains reusable UI blocks.
