# Rewilding Speech Therapy

Monorepo for the Rewilding Speech Therapy marketing site (and, later, a Supabase
backend + Expo mobile app).

```
apps/
  web/          Next.js 15 (App Router) marketing site + embedded Sanity Studio at /studio
packages/
  sanity/       Content layer — schemas, GROQ queries, typed content, seed script (@rw/sanity)
```

Future: `apps/mobile` (Expo) and `supabase/` drop in alongside; shared content/types
already live in `packages/sanity`.

## Stack

- **Next.js 15** + React 19, App Router, TypeScript (strict)
- **Tailwind CSS v4** — theme ported 1:1 from the original Rails app (`apps/web/app/globals.css`)
- **Sanity** — headless CMS; Studio embedded at `/studio`. The site renders from typed
  fallback content in `packages/sanity/src/content.ts` when Sanity isn't configured, so it
  builds and runs with **zero credentials**.
- **Resend** — contact-form email delivery (serverless route at `/api/contact`)
- **Turborepo** + **pnpm** workspaces

## Develop

```bash
pnpm install
cp .env.example .env.local   # optional — fill in for live content + contact email
pnpm dev                     # http://localhost:3000
```

Without `.env.local`, the site uses the bundled fallback content and local images, and the
contact form returns a "not configured" response instead of sending email.

## Content (Sanity)

1. Create a free project at https://sanity.io, copy the **project ID**, create a **dataset**
   named `production`, and an **Editor API token**.
2. Put those in `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
   `SANITY_API_TOKEN`).
3. Seed the current content + upload images:
   ```bash
   pnpm --filter @rw/sanity seed
   ```
4. Edit content at http://localhost:3000/studio (or `https://rewildingspeech.com/studio` in prod).

## Deploy

See [docs/DEPLOY.md](docs/DEPLOY.md) for the full Vercel + DNS cutover runbook.
