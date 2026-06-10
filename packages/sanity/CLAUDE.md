# CLAUDE.md — packages/sanity (@rw/sanity)

Framework-agnostic content layer: schemas, GROQ queries, typed fallback content, image
helpers, and the seed script. Imported by `apps/web` and reusable by the future Expo app —
keep it free of Next.js / React-DOM specifics.

## Files (`src/`)

- `types.ts` — **the content contract.** Every shape (SiteSettings, HomeContent, AatContent,
  LegalPage, etc.). Changing content = start here.
- `env.ts` — reads `NEXT_PUBLIC_SANITY_*` from env. `isSanityConfigured` is false with no
  projectId. `token` (`SANITY_API_TOKEN`) is for the seed script only — never shipped to clients.
- `client.ts` — read-only `@sanity/client`; **null** when not configured.
- `image.ts` — `resolveImageSrc(ref)` returns the Sanity CDN url (when configured) or the local
  `/images/*` fallback. `urlForImage` for builder access.
- `queries.ts` — GROQ. Params are bound (`$slug`) — keep it that way (no string interpolation).
- `content.ts` — **typed fallback content** = the source of truth before/without the CMS. The
  whole site renders from this with zero credentials. Migrated 1:1 from the Rails ERB.
- `load.ts` — `getSiteSettings/getHome/getAat/getLegal`. `fetchOrFallback` returns Sanity data
  when present, else the fallback, and swallows fetch errors → fallback (never throws).
- `schemas/` — Sanity v3 schema (`schemaTypes`) mirroring `types.ts`. Used by the embedded
  Studio in `apps/web`.
- `scripts/seed.ts` — idempotent `createOrReplace` seed; uploads the 5 images as assets and
  writes the docs. Run from repo root with env (`pnpm --filter @rw/sanity seed`).

## Project

Sanity project **`pg56vxh6`**, dataset **`production`** (PUBLIC read — intended; the marketing
content is public). Edit at `/studio`. Reads need no token; only the seed needs a write token.

## ⚠️ Gotcha: document `_id`s must NOT contain dots

Sanity treats `<prefix>.<id>` as a **content-release version** (like `drafts.` for drafts), so a
doc with `_id: "legal.privacy"` is excluded from the **published** perspective and is INVISIBLE
to public queries (it exists, but `*[_type=="legalPage"]` returns nothing). Use dot-free ids —
the seed uses `legalPrivacy` / `legalTerms`. Symptom if you regress this: legal pages silently
fall back to local content / 404 in the CMS.

## Adding or changing content

1. Update `types.ts` (the shape).
2. Update `schemas/` (so it's editable in Studio).
3. Update `content.ts` (fallback / seed source).
4. Update `queries.ts` (project the new fields) + `load.ts` if a new loader.
5. `pnpm --filter @rw/sanity typecheck`, then re-seed if needed.

Keep `content.ts`, the schema, and the query in sync — a query that doesn't project a field
will drop it even though the fallback has it.
