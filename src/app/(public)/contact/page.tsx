import type { Metadata } from "next";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Vox AI Studio",
  description:
    "Get in touch with the Vox AI Studio team. We're here to help with questions about our AI voice generation platform.",
  alternates: { canonical: "https://www.voxaistudio.com/contact" },
  robots: { index: false },
};

export default function ContactPage() {
  return <ContactForm />;
}
