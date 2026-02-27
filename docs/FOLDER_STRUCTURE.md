# LoyaltySphere - Recommended Next.js Folder Structure

```text
.
├── app/
│   ├── auth/
│   │   └── page.tsx
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
│   ├── auth/
│   │   ├── AuthPanel.tsx
│   │   └── SignOutButton.tsx
│   ├── dashboard/
│   │   ├── CreateBusinessForm.tsx
│   │   ├── ProductManager.tsx
│   │   ├── QrScannerPanel.tsx
│   │   └── Sidebar.tsx
│   └── landing/
│       ├── BentoGrid.tsx
│       ├── CustomerLoyaltyCard3D.tsx
│       └── Hero.tsx
├── docs/
│   └── FOLDER_STRUCTURE.md
├── lib/
│   ├── auth/
│   │   └── require-business.ts
│   ├── supabase/
│   │   ├── browser.ts
│   │   ├── client.ts
│   │   ├── env.ts
│   │   ├── middleware.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── utils/
│       └── slugify.ts
├── public/
│   └── (images, logos, static assets)
├── supabase/
│   └── schema.sql
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── proxy.ts
├── postcss.config.mjs
└── tsconfig.json
```

This structure keeps `app/` focused on routes/layouts, while `components/` contains reusable UI blocks.
