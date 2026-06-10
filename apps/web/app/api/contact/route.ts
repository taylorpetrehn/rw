import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";

export const runtime = "nodejs";

/** A legit human takes at least this long to fill the form; faster = bot. */
const MIN_FILL_MS = 2500;
/** Stale/replayed render (form left open for hours) — treat as suspicious. */
const MAX_FILL_MS = 2 * 60 * 60 * 1000;

/** Best-effort per-IP rate limit (per warm instance). For hard guarantees across
 *  instances, front this with Upstash/@upstash/ratelimit — see apps/web/CLAUDE.md. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function isProd(): boolean {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "production"
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getClientIp(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return request.headers.get("x-real-ip");
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients omit Origin; Turnstile/rate-limit still apply
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewildingspeech.com";
  const allowed = new Set([
    site,
    "https://rewildingspeech.com",
    "https://www.rewildingspeech.com",
    "http://localhost:3000",
  ]);
  return allowed.has(origin);
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // Cheap friction: reject clearly cross-origin browser POSTs.
  if (!originAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  // Best-effort rate limit before any expensive work.
  const ip = getClientIp(request);
  if (ip && rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, phone, message, website, elapsedMs, turnstileToken } =
    parsed.data;

  // 1) Honeypot — silently accept so bots don't learn they were caught.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  // 2) Time-trap — FAIL CLOSED: a real submission always carries a plausible
  //    elapsedMs from the client. Missing / too-fast / stale = bot. Drop silently.
  if (
    typeof elapsedMs !== "number" ||
    !Number.isFinite(elapsedMs) ||
    elapsedMs < MIN_FILL_MS ||
    elapsedMs > MAX_FILL_MS
  ) {
    return NextResponse.json({ ok: true });
  }

  // 3) Cloudflare Turnstile — required in production (fail closed). Skipped only
  //    in local dev when no secret is configured.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const isHuman = await verifyTurnstile(turnstileToken, ip, turnstileSecret);
    if (!isHuman) {
      return NextResponse.json(
        { ok: false, error: "Verification failed. Please try again." },
        { status: 400 },
      );
    }
  } else if (isProd()) {
    console.warn("Turnstile is not configured in production — rejecting submission.");
    return NextResponse.json(
      { ok: false, error: "Contact form is not fully configured." },
      { status: 503 },
    );
  }

  // 4) Deliver via Resend.
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "Contact form email is not configured (missing RESEND_API_KEY or CONTACT_TO_EMAIL).",
    );
    return NextResponse.json(
      { ok: false, error: "Email not configured" },
      { status: 503 },
    );
  }

  const fullName = `${firstName} ${lastName}`;
  const subject = `New contact from ${fullName}`;

  const textBody = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone ?? "(not provided)"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlBody = `
    <div>
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${phone ? escapeHtml(phone) : "(not provided)"}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail ?? "onboarding@resend.dev",
      to: toEmail,
      replyTo: email,
      subject,
      html: htmlBody,
      text: textBody,
    });

    if (error) {
      console.error("Resend failed to send contact email.");
      return NextResponse.json(
        { ok: false, error: "Failed to send message" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Unexpected error sending contact email.");
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
