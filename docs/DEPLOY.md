# Deploy runbook — rewildingspeech.com (Vercel free tier)

Most of this is **already done**. Your remaining steps are §1 (required) and §5 (go-live).

## ✅ Already provisioned (no action needed)

- **Sanity** — org + project **`pg56vxh6`**, dataset **`production`** (public), **seeded**
  with all site content and the 5 photos (served from Sanity's CDN). Content is editable
  at `/studio` once the site is deployed.
- **Sanity CORS** — `https://rewildingspeech.com`, `https://www.rewildingspeech.com`,
  `http://localhost:3000` are allowed (so `/studio` works in the browser).
- **Vercel** — project **`rewilding-speech`** (your account) created, with **Production**
  env vars set: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
  `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SITE_URL`.
- **Code** — on GitHub `main` (`taylorpetrehn/rw`); production build verified green.

The site renders fully from Sanity already (verified locally). It does **not** depend on
the Rails app.

## 1. Required — point Vercel at the monorepo app  ⚠️ build won't succeed until this is set

Vercel → **rewilding-speech** → **Settings → Build & Deployment**:
- **Root Directory** → `apps/web` → **Save**.
  (Framework auto-detects as **Next.js**; pnpm is auto-detected from the root lockfile, and
  Vercel automatically installs from the workspace root.)

Then **Settings → Git** → **Connect Git Repository** → `taylorpetrehn/rw`
(install the Vercel GitHub app if prompted). This enables auto-deploys on every push to `main`.

That's the whole reason a CLI deploy couldn't finish: Root Directory is a project setting
that can only be changed in the dashboard or via the Vercel API.

## 2. Optional — contact-form email (Resend)

Until configured, the contact form returns a graceful "Email not configured" message (no
crash). To enable:
1. resend.com → add + verify `rewildingspeech.com` → create an API key.
2. Vercel → Settings → Environment Variables (**Production**), add:
   - `RESEND_API_KEY` = your key
   - `CONTACT_TO_EMAIL` = where submissions go, e.g. `hello@rewildingspeech.com`
   - `CONTACT_FROM_EMAIL` = `Rewilding Speech <noreply@rewildingspeech.com>`

## 3. Optional — Preview env

Env vars are set for **Production** only. If you want Preview deploys to also pull from
Sanity, copy the four `NEXT_PUBLIC_*` vars to the **Preview** environment. (Otherwise
previews use the built-in fallback content — which renders identically.)

## 4. Deploy + verify

Push to `main` (or Vercel → Deployments → Redeploy). On the `*.vercel.app` URL, check:
`/`, `/aat`, `/contact`, `/privacy`, `/terms`, `/studio`. Submit the contact form (works
once §2 is done).

## 5. Go live — domain + DNS cutover (your call)

1. Vercel → Settings → **Domains** → add `rewildingspeech.com` **and** `www.rewildingspeech.com`
   (set one as the redirect; apex recommended as canonical).
2. At your DNS host (where rewildingspeech.com currently points at the Rails/Kamal server),
   replace the records with the values Vercel shows — typically:
   - **A** `@` → `76.76.21.21`
   - **CNAME** `www` → `cname.vercel-dns.com`
   - **Remove** the old A/AAAA records pointing at the Rails host.
3. Wait for propagation; Vercel auto-issues SSL. Verify `https://rewildingspeech.com` and `/studio`.

## 6. Decommission Rails

Once verified live, shut down the `rewilding-speech-therapy` Rails app (Kamal/host teardown,
DB export if desired).

---

### Reference
- **Edit content:** `https://rewildingspeech.com/studio` (or `http://localhost:3000/studio`).
- **Re-seed** (only if you ever reset the dataset): `pnpm --filter @rw/sanity seed` with
  `NEXT_PUBLIC_SANITY_PROJECT_ID=pg56vxh6` + a `SANITY_API_TOKEN` (Editor).
- Content edits in Studio appear on the site within ~60s (ISR `revalidate = 60`).
- Contact API: `POST /api/contact` (serverless). robots.txt blocks `/studio` + `/api`;
  `sitemap.xml` auto-generated.
