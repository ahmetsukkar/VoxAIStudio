import Link from "next/link";
import { Button } from "~/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Common Questions About Vox AI Studio",
  description:
    "Find answers to common questions about Vox AI Studio — credits, pricing, voice cloning, supported languages, and how AI text-to-speech works.",
  alternates: { canonical: "https://www.voxaistudio.com/faq" },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Vox AI Studio?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Vox AI Studio is an AI-powered Text-to-Speech platform that converts written text into natural-sounding, professional-quality speech in seconds.",
                },
              },
              {
                "@type": "Question",
                name: "How do credits work?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Credits are consumed based on the number of characters converted to speech. Credits never expire on paid plans and can be topped up anytime.",
                },
              },
              {
                "@type": "Question",
                name: "What languages are supported?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Vox AI Studio supports multiple languages and regional accents through Google Gemini TTS, including English, Arabic, Spanish, French, German, and many more.",
                },
              },
              {
                "@type": "Question",
                name: "Can I clone my own voice?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Vox AI Studio supports voice cloning, allowing you to create a unique voice based on your own recordings or choose from a library of pre-built professional voices.",
                },
              },
              {
                "@type": "Question",
                name: "Is there a free trial?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Vox AI Studio offers a 7-day free trial with 10,000 credits included. No credit card is required to start.",
                },
              },
            ],
          }),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold text-slate-800">
          Frequently Asked Questions
        </h1>
        <p className="mb-12 text-lg text-slate-600">
          Find answers to common questions about Vox AI Studio
        </p>

        <div className="space-y-6">
          {/* FAQ 1 */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              What is Vox AI Studio?
            </h3>
            <p className="text-slate-600">
              Vox AI Studio is an AI-powered Text-to-Speech platform that
              converts written text into natural-sounding, professional-quality
              speech in seconds.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              How many languages do you support?
            </h3>
            <p className="text-slate-600">
              We support 23+ languages including English, Turkish, Spanish,
              French, German, Arabic, Japanese, and many more with multiple
              accents.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              Is there a free plan?
            </h3>
            <p className="text-slate-600">
              Yes! New users get a 7-day Free Trial with 10,000 credits — no
              credit card required. The trial includes Flash voice only, with a
              maximum of 500 characters per request, and is limited to
              single-speaker generation.
            </p>
          </div>

          {/* FAQ 4 — Credits */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              How do credits work?
            </h3>
            <p className="text-slate-600">
              Credits are consumed per character of text you generate. The base
              rate is <strong>1 credit = 1 character</strong> for Flash
              single-speaker. Multipliers apply for higher-quality modes:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>
                • Flash single-speaker — <strong>1×</strong> (base)
              </li>
              <li>
                • Pro single-speaker — <strong>2×</strong>
              </li>
              <li>
                • Flash multi-speaker — <strong>2×</strong>
              </li>
              <li>
                • Pro multi-speaker — <strong>3×</strong>
              </li>
            </ul>
            <p className="mt-3 text-slate-600">
              Credits on paid plans <strong>never expire</strong> — they stay in
              your account until you use them.
            </p>
          </div>

          {/* FAQ 5 — Multi-Speaker */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              What is Multi-Speaker?
            </h3>
            <p className="text-slate-600">
              Multi-Speaker lets you create a full conversation between two or
              more voices. You assign each speaker a name and a voice, then add
              lines one by one — just like writing a script. When you generate,
              Vox AI Studio combines all the lines into a single, seamless audio
              file where each speaker sounds distinctly different.
            </p>
          </div>

          {/* FAQ 6 */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              Can I use the generated audio commercially?
            </h3>
            <p className="text-slate-600">
              Yes, you own the audio files generated from your text and can use
              them for personal or commercial purposes.
            </p>
          </div>

          {/* Contact */}
          <div className="mt-12 rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-8 text-center">
            <h3 className="mb-2 text-xl font-semibold text-slate-800">
              Still have questions?
            </h3>
            <p className="mb-4 text-slate-600">
              Our support team is here to help you.
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-indigo-500 to-cyan-600">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
