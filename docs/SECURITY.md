# Security notes

A multi-dimension security review was run on this repo (public repo + contact-form attack
surface). Summary of findings and their status.

## Fixed

- **Contact form bot bypass (HIGH).** Honeypot + time-trap were optional fields, so a direct
  JSON POST that omitted them passed. Now **fail-closed**: `elapsedMs` must be present and
  2.5s–2h or the request is silently dropped; honeypot filled → dropped.
- **Turnstile failed open (HIGH).** It was skipped when unconfigured. Now **required in
  production** (`/api/contact` returns 503 if `TURNSTILE_SECRET_KEY` is unset in prod);
  skipped only in local dev. Verified server-side when present.
- **No rate limiting (HIGH).** Added a per-IP limiter (5 req / 10 min) → 429. It's in-memory
  (best-effort per warm instance) — see "Deferred" for production-grade.
- **Origin check (LOW).** Cross-origin browser POSTs → 403.
- **JSON-LD injection (LOW).** `components/seo/json-ld.tsx` now escapes `<` `>` `&` before
  `dangerouslySetInnerHTML`, so a Sanity value containing `</script>` can't break out.
- **HSTS** now includes `includeSubDomains`.
- **Unused secret-named export** removed from `packages/sanity/src/env.ts` (latent footgun).

## Confirmed clean

- No secrets committed (only `.env.example` tracked; `pg56vxh6` is the public project ID).
- `next/image` `remotePatterns` is locked to `cdn.sanity.io` (no SSRF surface).
- GROQ uses bound params; Portable Text rendering is safe; email body is HTML-escaped.
- Sanity public dataset uses the `published` perspective with no token → no draft/PII leak.
- `/studio` is public by design; writes require Sanity login. Next 15.5.19 is patched for the
  2025 CVEs (incl. middleware bypass CVE-2025-29927).

## Deferred (recommended, not blocking)

- **Production-grade rate limiting.** The in-memory limiter resets per instance. For hard
  guarantees add `@upstash/ratelimit` + Upstash Redis (free tier) keyed on the client IP, plus
  a global daily send cap. NOTE: DNS is "DNS only" (gray cloud) so Cloudflare WAF rate-limit
  rules won't see this traffic — limiting must be app-level (or re-proxy through Cloudflare).
- **Content-Security-Policy.** None yet. Add via `next.config.ts headers()` with a strict
  policy for marketing routes and a relaxed one for `/studio` (Studio needs
  `'unsafe-inline'`/`'unsafe-eval'`, `worker-src 'self' blob:`, `blob:` images). Allowlist
  `https://challenges.cloudflare.com` (Turnstile) and `https://use.typekit.net` (fonts) and
  `https://cdn.sanity.io` / `https://*.sanity.io`. Ship as `Content-Security-Policy-Report-Only`
  first to catch breakage. The concrete JSON-LD XSS vector is already closed above.
- **Dependency audit hygiene.** `pnpm audit` shows 1 high (glob CLI) + 3 moderate
  (prismjs/postcss/uuid) — all transitive, build-time/Studio-only, NOT runtime-exploitable on
  the static site. Clear with `pnpm up sanity @sanity/vision next-sanity` or pnpm `overrides`.
- **Studio `noindex`** header (defense-in-depth beyond the robots.txt disallow).
