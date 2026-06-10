import { z } from "zod";

/** Strip every non-digit character from a phone string. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z
    .string()
    .max(40)
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        return normalizePhone(value).length === 10;
      },
      { message: "Enter a valid 10-digit phone number" },
    )
    .transform((value) =>
      value && value.trim() !== "" ? normalizePhone(value) : undefined,
    ),
  message: z.string().trim().min(1, "Message is required").max(5000),
  // --- anti-bot fields (not real form data) ---
  // Honeypot: real users never fill this in.
  website: z.string().optional(),
  // Time-trap: ms elapsed between form render and submit (bots submit instantly).
  elapsedMs: z.number().int().nonnegative().optional(),
  // Cloudflare Turnstile token (verified server-side when configured).
  turnstileToken: z.string().max(2048).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
