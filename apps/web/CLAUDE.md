# CLAUDE.md — apps/web

Next.js 15 (App Router) marketing site. Server Components by default; content from Sanity
with typed fallbacks (`@rw/sanity`).

## Routes

```
app/page.tsx              Home (hero, approach flip cards, philosophy, team, FAQ)
app/aat/page.tsx          Animal-Assisted Therapy
app/contact/              Contact page + contact-form.tsx (client) + the form UX
app/privacy, app/terms    Legal pages (content from Sanity legalPage docs)
app/api/contact/route.ts  POST endpoint → validates → anti-bot → sends via Resend
app/studio/[[...tool]]    Embedded Sanity Studio (config: apps/web/sanity.config.ts)
app/sitemap.ts, robots.ts, manifest.ts   SEO infra
app/layout.tsx            Root layout: fonts, Typekit <link>, SiteNav + SiteFooter, metadata
```

## Content flow

Pages are async Server Components that call loaders from `@rw/sanity`
(`getHome`, `getAat`, `getLegal`, `getSiteSettings`). Each returns Sanity data when configured,
else typed fallback content. Pages map fields → JSX; **page structure/classes** live here,
**copy** lives in `@rw/sanity`. ISR: pages export `revalidate = 60`.

## Components (`components/`)

- `ui/sanity-image.tsx` — `next/image` wrapper. Resolves Sanity CDN url or local `/images/*`
  fallback. **GOTCHA:** when using `fill`, the immediate parent MUST be `position: relative`
  AND have a resolvable width/height. A `fill` image contributes no intrinsic size, so a
  content-sized flex/inline parent collapses to 0×0 (this silently broke the hero arched
  portrait — fixed by adding `w-full` so the container gets a width). Prefer giving the
  container a real width (grid cell or `w-full`) and always pass `sizes`.
- `ui/reveal.tsx` (client) — scroll-reveal (IntersectionObserver). The hidden state lives in
  CSS via `[data-reveal]` (globals.css) — pass only layout/visual classes in `className`,
  never `opacity-0`/`translate-*`. Choreography: `delay={ms}` staggers siblings; override the
  entry direction with `--reveal-from` (e.g. `md:[--reveal-from:translateX(-2rem)]`). After
  revealing, the element drops its transition ("done" state) so utility transitions (hover
  lifts) work normally. No-JS: a `<noscript>` rule in `layout.tsx` forces content visible.
- `ui/flip-card.tsx` (client) — approach cards (hover desktop / tap mobile / Enter+Space
  keyboard, with `aria-pressed`).
- `ui/portable-text.tsx` — `<RichTextRenderer value bulletAccent>` renders Portable Text;
  bullets use `<CheckIcon>` markers (Tailwind preflight strips default list markers).
- `site/site-nav.tsx` (client), `site/site-footer.tsx` — shared chrome (in the layout).
- `ui/turnstile.tsx` (client) — Cloudflare Turnstile widget (renders only if site key set).
- `seo/json-ld.tsx` — MedicalBusiness JSON-LD (uses `dangerouslySetInnerHTML` with JSON.stringify).

## Theme & fonts (`app/globals.css`, `app/fonts.ts`)

- Tailwind v4 `@theme` — colors/fonts ported from the Rails app, contrast-audited and pruned.
  Primary `#2E4B3C` (forest), secondary `#F0531C` (orange), `warm-gray` `#F7EDDA` (cream bg).
  **Orange rules:** `secondary` for fills/large display accents only (3.5:1 with white — large-text
  territory); `secondary-dark` for hover/pressed fills (5.2:1); `secondary-ink` for small orange
  text on light surfaces (5.8:1 on white). The neutral ramp is warm end-to-end (400/500 are warm
  stone grays, not Tailwind's cool defaults). Don't add palette tokens that aren't used.
- **Fluid type scale** — headings use semantic tokens (`text-display-xl/lg/md/sm/xs`, `text-brand`,
  `text-lead`, `text-lead-lg`); each clamp()s between a 390px and 1280px viewport. Don't re-derive
  per-breakpoint stacks — use (or extend) the scale. The small uppercase label voice is the
  `eyebrow` utility (pair with `font-light`/`font-medium`).
- Birdie ships a **single weight (400)** — weight is pinned in display tokens; don't add weight
  classes to Birdie text.
- Base layer: `text-wrap: balance` on h1–h4, `text-wrap: pretty` on body copy. Interaction states
  in one `@layer base` block: global `:focus-visible` forest ring, brand `::selection`,
  `accent-color`, tap-highlight reset. Don't add `focus:outline-none` without replacing the affordance.
- `Birdie` = self-hosted display/serif/body via `next/font/local` (`app/fonts/`).
- `degular-variable` = sans, via Adobe Typekit kit `otn8yfj` (`<link>` in `layout.tsx`). The
  kit is domain-allowlisted (works on rewildingspeech.com; may fall back on random domains).
- NOTE: the old Rails build never generated `text-pure-white` (it rendered black). Here the
  theme is correct so `text-pure-white` = white — buttons use it intentionally. The "Our Goal"
  card uses `text-neutral-900` (it was white-on-white in the ERB).
- **Motion** — one easing voice (`--ease-out-soft`) + reveal tempo (`--duration-reveal`) live
  in `@theme`; the reveal state machine (`[data-reveal]` hidden→visible→done) and smooth-scroll
  / `scroll-padding-top` (fixed-nav anchor offset) are in `globals.css`. All motion respects
  `prefers-reduced-motion`; hover lifts use `motion-safe:`.

## Contact form (better than the old Rails one)

`lib/contact.ts` (zod) + `contact-form.tsx` (client) + `app/api/contact/route.ts` (server).
Layered bot defense (the old site got heavy spam; defenses are **fail-closed** so a direct
JSON POST that omits the anti-bot fields is dropped, not let through):
1. **Origin check** — cross-origin browser POSTs → 403 (non-browser clients with no Origin pass
   to the next gates).
2. **Rate limit** — per-IP, 5 req / 10 min (in-memory, best-effort per warm instance) → 429.
   For hard cross-instance guarantees add Upstash `@upstash/ratelimit` (gray-cloud DNS means
   Cloudflare WAF rate-limiting won't see this traffic).
3. **Honeypot** `website` — filled → silently accepted (bot doesn't learn it failed).
4. **Time-trap** — `elapsedMs` MUST be present and 2500ms–2h; missing/too-fast/stale →
   silently dropped (fail closed).
5. **Cloudflare Turnstile** — verified server-side. **Required in production** (fail closed):
   if `TURNSTILE_SECRET_KEY` is unset in prod the route returns 503; in local dev it's skipped.
   Widget renders only if `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
6. Input max-lengths; email body is **HTML-escaped** (XSS-safe); `replyTo` = submitter.
So in production the form needs **both** `RESEND_API_KEY`+`CONTACT_TO_EMAIL` **and** Turnstile
keys to actually deliver; otherwise it returns 503 (no crash). See `docs/SECURITY.md`.

## Security headers

Set in `next.config.ts` (`headers()`): nosniff, Referrer-Policy, X-Frame-Options SAMEORIGIN,
Permissions-Policy, HSTS. No CSP yet (tricky with Studio + Typekit + Turnstile + Sanity CDN).

## Env

See `.env.example`. `NEXT_PUBLIC_SANITY_*` + `NEXT_PUBLIC_SITE_URL` (public), `RESEND_API_KEY`,
`CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `TURNSTILE_SECRET_KEY` (server, secret).
`next.config.ts` allows `cdn.sanity.io` for `next/image`.
