# CLAUDE.md — rw (Rewilding Speech Therapy)

Monorepo for the Rewilding Speech Therapy **marketing site** (live at
https://rewildingspeech.com). Future: a Supabase backend + an Expo mobile app live here too.

## Layout

```
apps/web/         Next.js 15 (App Router) marketing site + embedded Sanity Studio (/studio)
packages/sanity/  Framework-agnostic content layer (@rw/sanity): schemas, queries, typed
                  fallback content, image helpers, seed script. Reusable by the future app.
docs/DEPLOY.md    Vercel + DNS runbook (mostly done; what's left is documented there)
```

Each app/package has its own `CLAUDE.md` with specifics — read those before working in them.

## Stack

Next.js 15 + React 19 (App Router, Server Components by default) · TypeScript (strict) ·
Tailwind CSS v4 (theme in `apps/web/app/globals.css`) · Sanity (headless CMS) ·
Resend (contact email) · Cloudflare Turnstile (bot defense) · Turborepo + pnpm workspaces.

## Commands (run from repo root)

```bash
pnpm install
pnpm dev          # turbo dev → http://localhost:3000
pnpm build        # turbo build
pnpm typecheck
pnpm --filter @rw/sanity seed   # seed/refresh Sanity content (needs SANITY_API_TOKEN)
```

The site renders fully from **typed fallback content** when Sanity env vars are absent, so
`dev`/`build`/CI work with **zero credentials**. See `apps/web/.env.example`.

## Conventions

- Server Components by default; add `"use client"` only when needed (interactivity/hooks).
  Current client components: `ui/reveal`, `ui/flip-card`, `ui/turnstile`, `site/site-nav`,
  `contact/contact-form`.
- All content flows through the types in `packages/sanity/src/types.ts` (the contract).
- Secrets come from **env only** — never commit them. Public values are fine to commit
  (Sanity `projectId`/`dataset`, `NEXT_PUBLIC_*`). Only `.env.example` is tracked.
- Match the existing code style; the Tailwind theme/classes are ported 1:1 from the original
  Rails app — don't redesign, preserve the aesthetic.

## Deploy (Vercel) — important gotcha

- Project: **`rewilding-speech`** (Taylor's personal Vercel). **Root Directory = `apps/web`**
  (set in the dashboard — required for the pnpm monorepo).
- A **CLI deploy must run from the REPO ROOT** (`vercel deploy [--prod]` from `~/Projects/RW`),
  NOT from `apps/web` — the upload must include the root `pnpm-lock.yaml`/workspace, and Root
  Directory then points Vercel at the app. Deploying from `apps/web` fails (`npm install` /
  "Root Directory apps/web does not exist"). Best: connect Git so pushes to `main` auto-deploy.
- Apex `rewildingspeech.com` is canonical; `NEXT_PUBLIC_SITE_URL` = the apex.
- Full runbook + remaining optional steps: `docs/DEPLOY.md`.
