import { z } from "zod";

/** Strip every non-digit character from a phone string. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value || value.trim() === "") return true;
        return normalizePhone(value).length === 10;
      },
      { message: "Enter a valid 10-digit phone number" }
    )
    .transform((value) =>
      value && value.trim() !== "" ? normalizePhone(value) : undefined
    ),
  message: z.string().min(1, "Message is required"),
  // Honeypot: real users never fill this in. Kept as a plain optional field so a
  // tripped honeypot passes validation and is dropped *silently* by the API route
  // (a bot should not learn it was detected).
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
