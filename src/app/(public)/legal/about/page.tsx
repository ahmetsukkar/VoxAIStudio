import Link from "next/link";
import { Button } from "~/components/ui/button";
import { AudioWaveform, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "About Us - Vox AI Studio",
  description: "Learn about Vox AI Studio - AI-powered Text-to-Speech platform",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-slate-800">
          About Vox AI Studio
        </h1>

        <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800">
              Transform Text into Natural Speech with AI
            </h2>
            <p>
              Vox AI Studio is a cutting-edge Text-to-Speech (TTS) platform powered by advanced artificial intelligence. We help content creators, educators, podcasters, marketers, and businesses transform written text into natural-sounding, professional-grade speech in seconds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Our Mission</h2>
            <p>
              Our mission is to make high-quality voice synthesis accessible to everyone. Whether you're creating audiobooks, e-learning content, YouTube videos, podcasts, or marketing materials, Vox AI Studio provides the tools you need to bring your content to life with realistic, human-like voices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">What We Offer</h2>
            
            <h3 className="text-xl font-semibold text-slate-800">AI-Powered Voice Generation</h3>
            <p>
              Our advanced AI technology produces natural-sounding speech with realistic intonation, emotion, and pacing. Choose from multiple voice styles, accents, and languages to match your content perfectly.
            </p>

            <h3 className="text-xl font-semibold text-slate-800">Voice Cloning Technology</h3>
            <p>
              Upload your own voice sample and create a custom AI voice clone. This allows you to maintain consistency across all your audio content while saving hours of recording time.
            </p>

            <h3 className="text-xl font-semibold text-slate-800">Multilingual Support</h3>
            <p>
              Generate speech in 23+ languages including English, Turkish, Spanish, French, German, Arabic, Japanese, and many more. Each language features multiple native speakers and regional accents.
            </p>

            <h3 className="text-xl font-semibold text-slate-800">Lightning-Fast Processing</h3>
            <p>
              Our streamlined AI engine generates high-quality audio in seconds, not hours. Create professional voiceovers without the wait.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Who We Serve</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Content Creators:</strong> YouTube creators, podcasters, and video producers</li>
              <li><strong>Educators:</strong> E-learning professionals and online course creators</li>
              <li><strong>Businesses:</strong> Marketing teams, customer support, and corporate training</li>
              <li><strong>Authors:</strong> Audiobook creators and storytellers</li>
              <li><strong>Developers:</strong> API access for integrating TTS into applications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Our Technology</h2>
            <p>
              Vox AI Studio is built with React and Next.js 16, ensuring a fast, reliable, and modern user experience. Our platform leverages state-of-the-art machine learning models to deliver professional results with minimal effort.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Why Choose Vox AI Studio?</h2>
            <ul className="list-none space-y-2">
              <li>✓ <strong>Natural-Sounding Voices:</strong> Human-like speech with realistic emotions</li>
              <li>✓ <strong>Easy to Use:</strong> No technical skills required - just paste text and generate</li>
              <li>✓ <strong>Flexible Pricing:</strong> Start free with 25 credits, upgrade as you grow</li>
              <li>✓ <strong>Fast & Reliable:</strong> 99.9% uptime with quick processing times</li>
              <li>✓ <strong>Secure:</strong> Your data and generated audio are protected with industry-standard security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Our Commitment</h2>
            <p>
              We're committed to providing ethical AI solutions that respect user privacy and creative rights. All voices in our library are ethically sourced, and we maintain strict data protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800">Contact Us</h2>
            <p>
              Have questions or need support? We're here to help.
            </p>
            <p>
              📧 Email: <a href="mailto:support@voxaistudio.com" className="text-indigo-600 hover:underline">support@voxaistudio.com</a><br />
              🌐 Website: <a href="https://publish-vox-studio-app.vercel.app" className="text-indigo-600 hover:underline">https://publish-vox-studio-app.vercel.app</a>
            </p>
          </section>

          <div className="mt-12 rounded-lg bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 text-center">
            <p className="text-slate-700 italic">
              Join thousands of creators worldwide who trust Vox AI Studio for their Text-to-Speech needs.
            </p>
            <Link href="/dashboard">
              <Button className="mt-4 gap-2 bg-gradient-to-r from-indigo-500 to-cyan-600">
                <AudioWaveform className="h-4 w-4" />
                Try Vox AI Studio Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
