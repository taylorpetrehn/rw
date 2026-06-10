"use client";

import { useRef, useState } from "react";
import { contactSchema, type ContactInput } from "@/lib/contact";
import { Turnstile } from "@/components/ui/turnstile";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const INPUT_CLASS =
  "w-full px-4 py-3 border border-neutral-300 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300";
const LABEL_CLASS = "block text-sm font-medium text-neutral-700";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  // Time-trap: when the form was rendered (bots typically submit instantly).
  const mountedAt = useRef(Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const result = contactSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      message,
      website,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ContactInput;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setPending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          elapsedMs: Date.now() - mountedAt.current,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setSuccess(true);
        return;
      }

      setSubmitError(
        data?.error ??
          "Something went wrong sending your message. Please try again."
      );
    } catch {
      setSubmitError(
        "Something went wrong sending your message. Please try again."
      );
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/10 shadow-soft">
            <svg
              className="h-8 w-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-8 text-4xl md:text-5xl font-display font-light tracking-tight text-primary">
            Thank You
          </h2>
        </div>

        <div className="bg-white shadow-soft rounded-2xl border border-neutral-200 py-10 px-8">
          <p className="text-lg text-neutral-600 font-light leading-relaxed text-center">
            Thank you! We&apos;ll review your message and get back to you within
            1-2 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg w-full">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-primary/10 shadow-soft">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="mt-8 text-4xl md:text-5xl font-display font-light tracking-tight text-primary">
          Get in Touch
        </h2>
        <p className="mt-4 text-lg text-neutral-600 font-light leading-relaxed">
          Interested in our services? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-soft rounded-2xl border border-neutral-200 py-10 px-8">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Submit Error */}
          {submitError && (
            <div className="rounded-lg bg-red-50 p-6 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className={LABEL_CLASS}>
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={INPUT_CLASS}
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className={LABEL_CLASS}>
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={INPUT_CLASS}
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={INPUT_CLASS}
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label htmlFor="phone" className={LABEL_CLASS}>
              Phone Number (optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={INPUT_CLASS}
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className={LABEL_CLASS}>
              Tell us about your needs
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className={`${INPUT_CLASS} resize-none`}
              placeholder="Tell us about your communication goals or what brings you to Rewilding Speech Therapy..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && (
              <p className="text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {/* Cloudflare Turnstile (renders only when configured) */}
          {TURNSTILE_SITE_KEY ? (
            <Turnstile siteKey={TURNSTILE_SITE_KEY} onVerify={setTurnstileToken} />
          ) : null}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={pending || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
              className="w-full py-3 px-8 text-sm bg-secondary text-white hover:bg-secondary-light rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-neutral-500 leading-relaxed">
          We&apos;ll review your message and get back to you within 1-2 business
          days.
        </p>
      </div>
    </div>
  );
}
