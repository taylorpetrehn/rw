# Deploy runbook — rewildingspeech.com (Vercel free tier)

This is the "you deploy + flip DNS" handoff. The code is pushed to
`github.com/taylorpetrehn/rw` (branch `main`). Do these once.

## 1. Sanity (content + CMS) — ~5 min

1. Go to https://sanity.io → create a free project (e.g. "Rewilding Speech").
2. Note the **Project ID**. Create/confirm a dataset named **`production`** (public read).
3. Project → API → **Add CORS origin**: `https://rewildingspeech.com` and
   `http://localhost:3000` (allow credentials off is fine).
4. Project → API → **Tokens** → create an **Editor** token. Copy it (shown once).
5. Locally, seed the existing content + upload the photos:
   ```bash
   cd rw
   cp .env.example .env.local
   # fill NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET=production, SANITY_API_TOKEN
   pnpm install
   pnpm --filter @rw/sanity seed
   ```
   This creates the `siteSettings`, `home`, `aat`, `legal.privacy`, `legal.terms`
   documents and uploads the 5 photos to Sanity. (The site still renders without this —
   it just won't be editable until seeded.)

## 2. Resend (contact form email) — ~5 min

1. https://resend.com → sign up (free: 3,000 emails/mo).
2. **Domains** → add `rewildingspeech.com` → add the DNS records Resend shows (SPF/DKIM).
   (Until verified, you can use Resend's `onboarding@resend.dev` sender for testing.)
3. **API Keys** → create one. Copy it.
4. Decide the destination inbox (where contact submissions go), e.g. `hello@rewildingspeech.com`.

## 3. Vercel — import + env — ~5 min

1. https://vercel.com → **Add New → Project** → import `taylorpetrehn/rw`.
2. **Root Directory**: set to `apps/web`. Framework preset auto-detects **Next.js**.
   (Leave build/install commands default — Vercel detects the pnpm workspace at the repo root.)
3. **Environment Variables** (Production + Preview):
   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://rewildingspeech.com` |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | (from step 1) |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
   | `SANITY_API_TOKEN` | (Editor token from step 1) |
   | `RESEND_API_KEY` | (from step 2) |
   | `CONTACT_TO_EMAIL` | `hello@rewildingspeech.com` |
   | `CONTACT_FROM_EMAIL` | `Rewilding Speech <noreply@rewildingspeech.com>` |
4. **Deploy**. Confirm the `*.vercel.app` URL looks right (home, /aat, /contact, /studio).

## 4. Domain + DNS cutover — the live switch

1. In Vercel → Project → **Settings → Domains** → add `rewildingspeech.com` **and**
   `www.rewildingspeech.com` (set one to redirect to the other — recommend apex as canonical).
2. Vercel shows the exact DNS records. At your DNS host (where rewildingspeech.com is
   currently pointed at the Rails server), replace the records:
   - **A** `@` → `76.76.21.21` (Vercel's apex IP — use whatever Vercel shows)
   - **CNAME** `www` → `cname.vercel-dns.com`
   - **Remove** the old A/AAAA records pointing at the Rails/Kamal host.
3. Wait for propagation (minutes–hours). Vercel auto-issues the SSL cert.
4. Verify `https://rewildingspeech.com` serves the new site and `/studio` loads.

## 5. Fonts (Adobe Typekit) — confirm

The sans font (`degular-variable`) loads from Adobe Fonts kit `otn8yfj`. The current
Rails site already uses it on `rewildingspeech.com`, so prod is covered. If button/body
sans text falls back on `*.vercel.app` previews, add the preview domain in
Adobe Fonts → Web Projects → kit `otn8yfj` → domains. (Birdie, the display/headline font,
is self-hosted and always works.)

## 6. Decommission Rails

Once the new site is verified live, the `rewilding-speech-therapy` Rails app can be shut
down (Kamal/host teardown, DB export if desired). The marketing site no longer depends on it.

---

### Notes
- The contact form posts to `/api/contact` (serverless). If `RESEND_API_KEY` /
  `CONTACT_TO_EMAIL` are unset it returns HTTP 503 ("Email not configured") rather than
  failing the build — so set them before launch.
- `robots.txt` disallows `/studio` and `/api`; `sitemap.xml` is auto-generated.
- Redeploys: pushing to `main` auto-deploys. Content edits in Studio are live within ~60s
  (ISR `revalidate = 60`).
