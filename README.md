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

The project is already provisioned: **project `pg56vxh6`**, dataset **`production`**, and it's
**seeded** with the current content + photos.

- For local dev against it, put `NEXT_PUBLIC_SANITY_PROJECT_ID=pg56vxh6` and
  `NEXT_PUBLIC_SANITY_DATASET=production` in `.env.local` (see `.env.example`). Reads are
  public — no token needed to render.
- Edit content at http://localhost:3000/studio (or `https://rewildingspeech.com/studio` in prod).
- Re-seed only if you reset the dataset: add an Editor `SANITY_API_TOKEN` to `.env.local`, then
  `pnpm --filter @rw/sanity seed`.

## Deploy

See [docs/DEPLOY.md](docs/DEPLOY.md) for the full Vercel + DNS cutover runbook.
