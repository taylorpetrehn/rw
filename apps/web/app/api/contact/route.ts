import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { firstName, lastName, email, phone, message, website } = parsed.data;

  // Honeypot tripped — silently drop without sending or erroring.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "Contact form email is not configured (missing RESEND_API_KEY or CONTACT_TO_EMAIL)."
    );
    return NextResponse.json(
      { ok: false, error: "Email not configured" },
      { status: 503 }
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
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    console.error("Unexpected error sending contact email.");
    return NextResponse.json(
      { ok: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
