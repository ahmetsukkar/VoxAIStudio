import Link from "next/link";
import { Button } from "~/components/ui/button";
import { AudioWaveform, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - Vox AI Studio",
  description: "Privacy Policy for Vox AI Studio",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold text-slate-800">
          Privacy Policy
        </h1>
        <p className="mb-8 text-slate-600">Last Updated: February 20, 2026</p>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Introduction
            </h2>
            <p>
              Vox AI Studio (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;)
              respects your privacy and is committed to protecting your personal
              data. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you use our Text-to-Speech
              platform.
            </p>
            <p>
              Please read this Privacy Policy carefully. By using Vox AI Studio,
              you agree to the collection and use of information in accordance
              with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Information We Collect
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Personal Information
            </h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Email address (for account creation and communication)</li>
              <li>Name (display name for your account)</li>
              <li>Password (encrypted and securely stored)</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Usage Data
            </h3>
            <p>
              We automatically collect certain information when you use our
              service:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Generated audio content (text input and resulting audio files)
              </li>
              <li>Browser type and version</li>
              <li>Device information (type, operating system)</li>
              <li>IP address and location data</li>
              <li>
                Usage statistics (features used, generation history, credit
                usage)
              </li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Voice Cloning Data
            </h3>
            <p>If you use our voice cloning feature:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Voice samples you upload (WAV/MP3 files)</li>
              <li>Custom voice profiles created from your samples</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              How We Use Your Information
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Service Delivery
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>To provide and maintain our Text-to-Speech service</li>
              <li>To process your text-to-speech generation requests</li>
              <li>To create and manage your user account</li>
              <li>To process voice cloning requests</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Communication
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>To send service-related notifications</li>
              <li>To respond to your inquiries and support requests</li>
              <li>To send promotional emails (you can opt-out anytime)</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Improvement and Analytics
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>To analyze usage patterns and improve our service</li>
              <li>To develop new features and functionality</li>
              <li>To troubleshoot technical issues</li>
              <li>To monitor and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Data Storage and Security
            </h2>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Security Measures
            </h3>
            <p>
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                Encryption: All data transmitted is encrypted using SSL/TLS
              </li>
              <li>Secure storage: Passwords are hashed and encrypted</li>
              <li>Access controls: Limited access to personal data</li>
              <li>Regular security audits and updates</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Data Retention
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Account data: Stored while your account is active</li>
              <li>Generated audio: Stored according to your plan</li>
              <li>
                Voice clones: Stored until you delete them or close your account
              </li>
              <li>Usage logs: Retained for up to 12 months</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Third-Party Services
            </h2>
            <p>
              We may use third-party services that collect, monitor, and analyze
              data:
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Google Analytics
            </h3>
            <p>
              We use Google Analytics to understand how users interact with our
              service. Google Analytics collects anonymous usage data.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Google AdSense (Advertising)
            </h3>
            <p>
              We use Google AdSense to display advertisements on our website.
              Google AdSense uses cookies and web beacons to serve ads based on
              your prior visits to our website or other websites on the
              Internet.
            </p>

            <p className="mt-2">
              <strong>What data does Google AdSense collect?</strong>
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Cookie IDs and similar identifiers</li>
              <li>IP address and device information</li>
              <li>Pages visited and ads viewed or clicked</li>
              <li>Browser type and language settings</li>
              <li>Date and time of visits</li>
            </ul>

            <p className="mt-2">
              <strong>How is this data used?</strong>
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                To display personalized advertisements relevant to your
                interests
              </li>
              <li>To measure ad performance and effectiveness</li>
              <li>To prevent fraud and improve ad quality</li>
            </ul>

            <p className="mt-2">
              <strong>Your choices regarding personalized ads:</strong>
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                You can opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Google Ads Settings
                </a>
              </li>
              <li>
                You can also opt out via the{" "}
                <a
                  href="https://optout.aboutads.info/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Digital Advertising Alliance opt-out page
                </a>
              </li>
              <li>
                EU users can visit{" "}
                <a
                  href="https://www.youronlinechoices.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Your Online Choices
                </a>
              </li>
            </ul>

            <p className="mt-2">
              For more information about how Google uses data when you use our
              site, please visit{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Google&apos;s Privacy &amp; Terms
              </a>
              .
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Payment Processors
            </h3>
            <p>
              We use Polar (https://polar.sh) to process payments. Polar handles
              all payment transactions securely. We do not store your credit
              card or payment information on our servers.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Data Storage
            </h3>
            <p>
              Generated audio files are stored securely on Amazon Web Services
              (AWS) Simple Storage Service (S3). Files are retained for 30 days
              after last access and are accessible only to the account owner.
            </p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Authentication Services
            </h3>
            <p>
              We offer Google Sign-In for account creation. When you use this
              option, we receive limited information from Google.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-semibold text-slate-800">
              Cookies and Tracking
            </h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Remember your login session</li>
              <li>Store your preferences</li>
              <li>Analyze site traffic and usage</li>
              <li>Serve personalized advertisements (via Google AdSense)</li>
              <li>Improve user experience</li>
            </ul>
            <p className="mt-2">
              You can control cookies through your browser settings or our
              cookie consent banner. Note that disabling cookies may affect
              functionality and you may see less relevant advertisements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Your Rights and Choices
            </h2>
            <p>You have the following rights regarding your personal data:</p>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Access and Portability
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Request a copy of your personal data</li>
              <li>Download your generated audio files</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Correction
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Update or correct your account information at any time</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Deletion
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Request deletion of your account and associated data</li>
              <li>Delete individual audio files and voice clones</li>
            </ul>

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              Opt-Out
            </h3>
            <ul className="list-disc space-y-1 pl-6">
              <li>Unsubscribe from marketing emails</li>
              <li>Disable certain cookies through browser settings</li>
              <li>
                Opt out of personalized advertising (see Google AdSense section
                above)
              </li>
            </ul>

            <p className="mt-4">
              To exercise these rights, contact us at:{" "}
              <a
                href="mailto:support@voxaistudio.com"
                className="text-indigo-600 hover:underline"
              >
                support@voxaistudio.com
              </a>
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Children&apos;s Privacy
            </h2>
            <p>
              Our service is not intended for users under 18 years of age. We do
              not knowingly collect personal information from children. If you
              believe we have collected data from a minor, please contact us
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              International Users
            </h2>
            <p>
              If you are accessing our service from outside Turkey, please note
              that your information may be transferred to, stored, and processed
              in Turkey and other countries. By using our service, you consent
              to this transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              GDPR Compliance (For EU Users)
            </h2>
            <p>
              If you are in the European Economic Area (EEA), you have
              additional rights under GDPR:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Right to access your personal data</li>
              <li>Right to rectification</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>

            <p className="mt-4">
              Our legal basis for processing your data includes:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Contract performance: To provide our services</li>
              <li>Consent: When you agree to specific processing</li>
              <li>Legitimate interests: To improve and secure our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated Last Updated date. We
              encourage you to review this policy periodically.
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
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
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
                  href="https://www.voxaistudio.com"
                  className="text-indigo-600 hover:underline"
                >
                  https://www.voxaistudio.com
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
            <p className="text-slate-700 italic">
              By using Vox AI Studio, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
