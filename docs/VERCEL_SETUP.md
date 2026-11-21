# Vercel setup for Dodola Ifa Boru School Portal

## Import the repository

1. Sign in to Vercel with the GitHub account or team that owns `futuretech-hub/Dodola_ifa_boru_school_portal`.
2. Choose **Add New → Project → Import Git Repository**.
3. Select `futuretech-hub/Dodola_ifa_boru_school_portal`.
4. Confirm these settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Install Command:** `npm ci`
   - **Output Directory:** leave the Next.js default; do not set a static `out` directory
   - **Production Branch:** `main`
5. Click **Deploy**.

Next.js deployment on Vercel is zero-configuration for the normal App Router setup. This repository deliberately avoids a custom server and static export so future authentication, server actions, route handlers, and dynamic data can use the normal Next.js runtime.

The repository declares Node.js 20.9 or newer in `package.json` and pins Node 22 in `.nvmrc`. If the Vercel project exposes a Node.js version selector, choose Node 22 to match local development.

## Environment variables

In **Project Settings → Environment Variables**, add the values from the Supabase project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=https://YOUR_PRODUCTION_DOMAIN
```

Apply the variables to:

- **Production** for deployments from `main`.
- **Preview** for pull requests and non-production branches. Use a separate Supabase project if preview data must be isolated from production.
- **Development** if using `vercel env pull` or `vercel dev` locally.

The `NEXT_PUBLIC_` prefix is required for values that the browser must read. These values are embedded into the client bundle during the build, so changing them requires a new deployment. Do not add a Supabase service-role key to this frontend or expose any server-only secret with `NEXT_PUBLIC_`.

For local work:

```bash
cp .env.example .env.local
# edit .env.local with the real values
npm run dev
```

`.env.local` is ignored by Git. Do not paste its contents into commits or issue comments.

## Git deployment flow

- A push to `main` creates or updates the Production Deployment.
- A pull request or push to another branch creates a Preview Deployment.
- Use Preview Deployments to review the landing page before merging it into `main`.
- Vercel can comment Preview URLs on pull requests after the GitHub integration is connected.

If Vercel cannot see the repository, reconnect GitHub in Vercel and verify that the GitHub account is an owner or has the required organization/repository access. For a personal repository, Vercel's GitHub integration requires owner access to import or connect it.

## Custom domain

After the first successful deployment, open **Project Settings → Domains**, add the school's domain, and follow Vercel's DNS instructions. Set the resulting production URL as `NEXT_PUBLIC_SITE_URL`, then redeploy so metadata and future callbacks use the canonical domain.

## Official references

- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables)
