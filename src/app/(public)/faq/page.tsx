import Link from "next/link";
import { Button } from "~/components/ui/button";
import { AudioWaveform, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "FAQ - Vox AI Studio",
  description: "Frequently Asked Questions about Vox AI Studio",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">

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
              Yes! New users get 25 free credits to try our service. No credit
              card required.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              Can I use the generated audio commercially?
            </h3>
            <p className="text-slate-600">
              Yes, you own the audio files generated from your text and can use
              them for personal or commercial purposes.
            </p>
          </div>

          {/* More questions */}
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
