import Link from "next/link";
import { Button } from "~/components/ui/button";
import { AudioWaveform, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service - Vox AI Studio",
  description: "Terms of Service for Vox AI Studio",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold text-slate-800">
          Terms of Service
        </h1>
        <p className="mb-8 text-slate-600">Last Updated: January 29, 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Agreement to Terms
            </h2>
            <p>
              Welcome to Vox AI Studio. By accessing or using our Text-to-Speech
              platform at https://publish-vox-studio-app.vercel.app
              (&quot;Service&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). If you do not agree to these Terms,
              please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Eligibility
            </h2>
            <p>
              You must be at least 18 years old to use Vox AI Studio. By
              creating an account, you represent and warrant that:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will provide accurate and complete information</li>
              <li>You will not use the Service for any illegal purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Account Registration and Security
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Creating an Account
            </h3>
            <p>
              To use certain features, you must create an account by providing:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>A valid email address</li>
              <li>A secure password</li>
              <li>Your name or display name</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Account Responsibility
            </h3>
            <p>You are responsible for:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your account information is accurate and current</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Account Termination
            </h3>
            <p>We reserve the right to suspend or terminate your account if:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>You violate these Terms of Service</li>
              <li>You engage in fraudulent or illegal activity</li>
              <li>Your account remains inactive for an extended period</li>
              <li>We discontinue the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Service Description and Credits
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Text-to-Speech Service
            </h3>
            <p>
              Vox AI Studio provides an AI-powered Text-to-Speech platform that
              converts written text into natural-sounding audio using advanced
              voice synthesis technology.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Credit System
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Free accounts receive 25 credits upon registration</li>
              <li>
                Credits are consumed based on character count when generating
                audio
              </li>
              <li>
                Pricing: Each generation costs credits based on text length
              </li>
              <li>Credits do not expire while your account is active</li>
              <li>Additional credits can be purchased through paid plans</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Service Limitations
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Maximum 500 characters per generation (free tier)</li>
              <li>
                Voice generation is subject to availability and processing
                capacity
              </li>
              <li>We reserve the right to modify credit costs and limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Acceptable Use Policy
            </h2>
            <p>
              You agree to use Vox AI Studio only for lawful purposes. You MAY
              NOT:
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Prohibited Content
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Generate speech containing illegal, harmful, or offensive
                content
              </li>
              <li>Create content that violates intellectual property rights</li>
              <li>Produce hateful, discriminatory, or harassing audio</li>
              <li>Generate adult, sexual, or violent content</li>
              <li>
                Create misleading deepfakes or impersonations without consent
              </li>
              <li>Produce spam, malware, or phishing content</li>
              <li>Generate content for fraudulent purposes</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Prohibited Activities
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Attempt to circumvent credit system or usage limits</li>
              <li>Reverse engineer, decompile, or hack our technology</li>
              <li>Use automated systems (bots) to abuse the service</li>
              <li>Share your account credentials with others</li>
              <li>Resell or redistribute our service without permission</li>
              <li>Scrape or extract data from our platform</li>
              <li>
                Interfere with or disrupt the Service&apos;s functionality
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Voice Cloning Ethics
            </h3>
            <p>When using voice cloning features:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>You must have legal rights to the voice sample</li>
              <li>You must not impersonate others without explicit consent</li>
              <li>
                You are responsible for ensuring ethical use of cloned voices
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Intellectual Property Rights
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Your Content
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>You retain ownership of the text you input</li>
              <li>You retain ownership of voice samples you upload</li>
              <li>
                You are responsible for ensuring you have rights to use all
                input content
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Generated Audio
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>You own the audio files generated from your text input</li>
              <li>
                You may use generated audio for personal or commercial purposes
              </li>
              <li>
                You may not claim that audio was created by a human voice artist
              </li>
              <li>
                Attribution to Vox AI Studio is appreciated but not required
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Our Intellectual Property
            </h3>
            <p>All aspects of the Service, including but not limited to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Software, code, and algorithms</li>
              <li>Pre-built voice models and AI technology</li>
              <li>Design, graphics, and user interface</li>
              <li>Trademarks and branding</li>
            </ul>
            <p className="mt-2">
              ...are owned by Vox AI Studio and protected by intellectual
              property laws. You may not copy, modify, or distribute our
              technology without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Payment and Refunds
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Paid Plans
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Paid plans provide additional credits and features</li>
              <li>
                Pricing is displayed on our website and may change with notice
              </li>
              <li>
                Payments are processed securely through third-party providers
              </li>
              <li>All fees are non-refundable unless required by law</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Billing
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                You authorize us to charge your payment method for all fees
              </li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>
                You can cancel subscriptions at any time from your account
                settings
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Refund Policy
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Credits are generally non-refundable</li>
              <li>
                Technical issues preventing service use may qualify for refunds
              </li>
              <li>Refund requests must be submitted within 14 days</li>
              <li>Contact support@voxaistudio.com for refund inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Data and Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. By
              using Vox AI Studio, you consent to our collection and use of your
              data as described in the Privacy Policy.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Data Protection
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>We implement security measures to protect your data</li>
              <li>We do not sell your personal information to third parties</li>
              <li>
                Your generated audio and voice clones are private to your
                account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Service Availability and Modifications
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Service Availability
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                We strive for 99.9% uptime but do not guarantee uninterrupted
                access
              </li>
              <li>Scheduled maintenance may temporarily limit availability</li>
              <li>
                We are not liable for service interruptions beyond our control
              </li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Modifications to Service
            </h3>
            <p>We reserve the right to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Modify, suspend, or discontinue any feature of the Service
              </li>
              <li>Change credit pricing and usage limits</li>
              <li>Update these Terms of Service</li>
              <li>Introduce new features or remove existing ones</li>
            </ul>
            <p className="mt-2">
              Significant changes will be communicated via email or website
              notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Disclaimer of Warranties
            </h2>
            <p className="font-semibold uppercase">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Accuracy or quality of generated audio</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
            </ul>
            <p className="mt-2 font-semibold">
              You use the Service at your own risk.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Limitation of Liability
            </h2>
            <p className="font-semibold uppercase">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, VOX AI STUDIO SHALL NOT BE
              LIABLE FOR:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>
                Damages resulting from use or inability to use the Service
              </li>
              <li>User-generated content or misuse of generated audio</li>
            </ul>
            <p className="mt-4">
              Our total liability shall not exceed the amount you paid us in the
              12 months preceding the claim, or $100, whichever is greater.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless Vox AI Studio from any
              claims, damages, losses, or expenses (including legal fees)
              arising from:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Content you generate using our Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Copyright and DMCA
            </h2>
            <p>
              We respect intellectual property rights. If you believe content on
              our platform infringes your copyright, contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:copyright@voxaistudio.com"
                className="text-indigo-600 hover:underline"
              >
                copyright@voxaistudio.com
              </a>
            </p>
            <p className="mt-2">Include:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Your contact information</li>
              <li>Description of the copyrighted work</li>
              <li>Location of the infringing material</li>
              <li>A statement of good faith belief</li>
              <li>Your signature (electronic or physical)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Governing Law and Disputes
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Governing Law
            </h3>
            <p>
              These Terms are governed by the laws of Turkey, without regard to
              conflict of law provisions.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Dispute Resolution
            </h3>
            <p>
              Any disputes arising from these Terms or your use of the Service
              shall be resolved through:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Good faith negotiation between the parties</li>
              <li>
                If negotiation fails, through the courts of Ankara, Turkey
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Severability
            </h2>
            <p>
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision shall be limited or eliminated to the
              minimum extent necessary so that these Terms shall otherwise
              remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Entire Agreement
            </h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and Vox AI Studio regarding the use
              of the Service and supersede all prior agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes
              will be posted on this page with an updated &quot;Last
              Updated&quot; date. Continued use of the Service after changes
              constitutes acceptance of the modified Terms.
            </p>
            <p className="mt-2">
              Significant changes will be notified via email or prominent notice
              on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Contact Us
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us:
            </p>
            <div className="mt-4 space-y-2 rounded-lg bg-slate-100 p-6">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@voxaistudio.com"
                  className="text-indigo-600 hover:underline"
                >
                  support@voxaistudio.com
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href="https://publish-vox-studio-app.vercel.app"
                  className="text-indigo-600 hover:underline"
                >
                  https://publish-vox-studio-app.vercel.app
                </a>
              </p>
              <p className="mt-4">
                <strong>Address:</strong>
                <br />
                Vox AI Studio
                <br />
                Keçiören, Ankara
                <br />
                Turkey
              </p>
            </div>
          </section>

          <div className="mt-12 rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 text-center">
            <p className="mb-4 font-semibold text-slate-700">
              By using Vox AI Studio, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service.
            </p>
            <Link href="/dashboard">
              <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600">
                <AudioWaveform className="h-4 w-4" />
                Start Using Vox AI Studio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
