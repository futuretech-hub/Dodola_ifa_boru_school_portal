# Dodola Ifa Boru School Portal

The Next.js foundation for the Dodola Ifa Boru Special Boarding School portal. The public landing page and authenticated school workflows will be built on top of this base.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- npm
- Vercel for deployment

## Local development

Use Node.js 22 (the repository includes `.nvmrc`), or any supported Node.js version 20.9 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Before adding Supabase-backed features, copy `.env.example` to `.env.local` and fill in the values from Supabase. Never commit `.env.local`, service-role keys, or other private credentials.

Useful checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Vercel setup

Vercel has native Next.js support, so this project intentionally does not use a custom server or static export.

1. Open the Vercel dashboard and choose **Add New → Project**.
2. Import `futuretech-hub/Dodola_ifa_boru_school_portal` from GitHub.
3. Keep the detected framework as **Next.js**.
4. Leave the Root Directory as `./` and keep the default build command, which runs `npm run build`.
5. Set `main` as the Production Branch.
6. Add environment variables in **Project Settings → Environment Variables**. Select the environments where each variable should apply.
7. Deploy. Pushes to `main` become Production Deployments; other branches and pull requests receive Preview Deployments.

Environment variable changes apply only to new deployments. Redeploy after changing a value.

See [`docs/VERCEL_SETUP.md`](docs/VERCEL_SETUP.md) for the complete checklist and Supabase variable guidance.

## Repository

[futuretech-hub/Dodola_ifa_boru_school_portal](https://github.com/futuretech-hub/Dodola_ifa_boru_school_portal)
