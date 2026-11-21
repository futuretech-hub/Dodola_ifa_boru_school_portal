# Dodola Ifa Boru School Portal Foundation Plan

## Product goal
Prepare a clean, deployable Next.js/React foundation for the Dodola Ifa Boru Special Boarding School portal. The repository should be ready for the landing page to be designed next without mixing deployment secrets, future Supabase integration, or placeholder template branding into the public experience.

## Approved implementation approach

- Use the Next.js App Router with React, TypeScript, Tailwind CSS, and ESLint.
- Keep the repository compatible with Node.js 20.9 or newer and pin npm through `packageManager`.
- Keep the application deployable with Vercel's native Next.js zero-configuration support. Do not add a custom server, static export, or unnecessary rewrite rules.
- Keep browser-safe Supabase values in an `.env.example` template only. Real values belong in local `.env.local` or Vercel Project Settings and must never be committed.
- Provide a small foundation screen and school metadata now; build the full landing page separately after this setup is confirmed.
- Document the GitHub-to-Vercel connection, Production/Preview/Development environment scopes, and the redeploy requirement after changing `NEXT_PUBLIC_` variables.

## Project structure

- `app/`: App Router entry point, root layout, global styles, and future public/portal routes.
- `components/`: Shared UI components to be added with the landing page and portal shells.
- `lib/`: Supabase client and future data-access helpers; keep server-only and browser-safe boundaries explicit.
- `public/`: School logo, photography, icons, and other static assets.
- `docs/VERCEL_SETUP.md`: Deployment and environment-variable instructions.
- `.env.example`: Names and safe placeholders for local and Vercel configuration.
- `next.config.ts`: Minimal framework configuration so Vercel can retain native Next.js behavior.

## Design direction

### Style options considered

- **Institutional campus portal** — 0.55 probability: restrained school branding with a practical public site and utility dashboards.
- **Civic records desk** — 0.25 probability: high-clarity administration with status-led workflows.
- **Warm boarding-house handbook** — 0.20 probability: welcoming editorial storytelling with limited lifestyle imagery.

Chosen: **Institutional campus portal**.

### Design movement
Editorial school identity meeting a modern administrative portal: calm, structured, legible, and trustworthy.

### Core principles
1. Clarity before decoration: hierarchy and spacing should make the next action obvious.
2. One brand, two modes: public pages can carry school warmth; portal screens must prioritize utility.
3. Real content over template filler: avoid generic starter copy and placeholder marketing claims.
4. Mobile is first-class for students, families, wardens, and gate staff.

### Color philosophy
Deep emerald communicates stewardship and growth. Slate provides administrative calm. Amber is reserved for school distinction and attention states. Color should encode meaning rather than become decoration.

### Layout paradigm
Use full-width editorial bands for public pages and a persistent rail/top-header structure for authenticated portal screens. Avoid a generic centered template as the long-term page model.

### Signature elements
- A small amber school-mark accent beside section labels.
- Emerald status chips for approved or healthy states.
- Thin borders and rounded-xl surfaces instead of heavy shadows.

### Interaction philosophy
Keep actions direct and reversible. Every future async action should expose loading, success, empty, and error states. Destructive operations must be visually distinct and confirmed.

### Animation
Use short opacity or slide transitions only. Avoid looping motion, parallax, and attention-grabbing effects.

### Typography system
Use a clean sans-serif for utility and portal screens. Use a restrained serif display face for public school headlines only after the landing-page direction is approved.

### Brand essence
A dependable school operating layer for Dodola scholars and the staff who care for them. Personality: disciplined, caring, prepared.

### Brand voice
Headlines should be clear and encouraging. CTAs should describe the task.

- Example headline: “A prepared school day starts here.”
- Example CTA: “Open the school portal.”

### Wordmark and logo
Reuse the school emblem when supplied. Pair it with a compact two-line wordmark rather than rendering the name as an unstyled default heading.

### Signature brand color
Deep emerald (`#064e3b`) is the anchor. Amber (`#f59e0b`) is used sparingly for school distinction.

## Service boundaries

The initial setup does not enable Supabase or create database tables. Later authentication and live records will use browser-safe `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` values, while any server-only secrets remain unprefixed and server-side. Vercel handles the Next.js build and preview deployments from GitHub.
