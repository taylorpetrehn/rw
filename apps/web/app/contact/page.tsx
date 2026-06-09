import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rewilding Speech Therapy. Interested in our services? We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-gray/10 py-16 px-8">
      <ContactForm />
    </div>
  );
}
