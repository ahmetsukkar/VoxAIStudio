import { Card, CardContent } from "~/components/ui/card";
import {
  Zap,
  Star,
  Scissors,
  Expand,
  Target,
  CheckCircle2,
  Play,
  AudioWaveform,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import DemoSection from "~/components/demo-section";
import PricingButton from "~/components/pricing-button";
import AuthCTA from "~/components/auth-cta";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vox AI Studio — AI Text to Speech & Voice Cloning",
  description:
    "Convert text into natural, human-like speech instantly. Clone voices, choose from 50+ AI voices, support multiple languages. Try free — no credit card needed.",
  keywords: [
    "text to speech",
    "AI voice generator",
    "voice cloning",
    "TTS online",
    "AI audio generator",
    "natural speech synthesis",
    "AI voiceover tool",
    "text to audio",
  ],
  alternates: {
    canonical: "https://www.voxaistudio.com",
  },
  openGraph: {
    title: "Vox AI Studio — AI Text to Speech & Voice Cloning",
    description:
      "Convert text into natural-sounding speech with AI. Clone voices, pick from 50+ voices, multiple languages. Start free.",
    url: "https://www.voxaistudio.com",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vox AI Studio — AI Text to Speech",
      },
    ],
  },
};

export default function HomePage() {
  const features = [
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "AI Voice Cloning",
      description:
        "Build a unique voice by cloning your own, or choose from a library of ready-to-use professional voices.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <Expand className="h-8 w-8" />,
      title: "Realistic Text‑to‑Speech",
      description:
        "Turn written text into speech with natural rhythm, expressive tone, and human-like delivery.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Languages, Accents & Voices",
      description:
        "Choose from a wide range of voices across many languages, including regional accents and different speaking styles.",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Ultra‑Fast Generation",
      description:
        "Create high-quality speech in moments. Our streamlined AI engine produces results with minimal wait time.",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const testimonials = [
    {
      name: "Aylin Demir",
      role: "E‑Learning Producer",
      content:
        "Vox AI Studio cut our course narration time dramatically. We can update lessons and regenerate audio the same day without re-recording.",
      rating: 5,
    },
    {
      name: "Noah Patel",
      role: "Marketing Manager",
      content:
        "The voices sound polished and consistent across campaigns. We launch ads faster and keep the brand tone the same everywhere.",
      rating: 5,
    },
    {
      name: "Lina Haddad",
      role: "YouTube Creator",
      content:
        "Being able to switch languages and styles is a game changer. My videos feel more local for different audiences without extra production work.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Vox AI Studio",
            url: "https://www.voxaistudio.com",
            description:
              "AI-powered text-to-speech and voice cloning platform. Convert text into natural human-like speech in seconds.",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            offers: [
              {
                "@type": "Offer",
                name: "Free Trial",
                price: "0",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                name: "Starter",
                price: "4.99",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                name: "Creator",
                price: "9.99",
                priceCurrency: "USD",
              },
              {
                "@type": "Offer",
                name: "Pro",
                price: "49.99",
                priceCurrency: "USD",
              },
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "5000",
            },
          }),
        }}
      />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-100/30 px-4 py-2 text-sm">
              <AudioWaveform className="h-4 w-4 text-indigo-600" />
              <span className="font-medium text-indigo-700">
                Powered by Advanced AI
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-6xl">
              Transform Text into{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Natural Speech
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
              AI-powered voice synthesis for professional results. Convert text
              into lifelike speech with natural tone, multiple languages, and
              realistic intonation—ready in seconds.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <AuthCTA
                label="Try It Free Now"
                icon="AudioLines"
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-cyan-600 px-8 py-6 text-base text-white"
              />
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer gap-2 px-8 py-6 text-base"
                >
                  <Play className="h-5 w-5" />
                  Listen to Demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="mb-8 text-sm text-slate-500">
              Trusted by thousands of creators worldwide
            </p>
            <div className="grid grid-cols-2 items-center justify-center gap-6 opacity-80 sm:grid-cols-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">50K+</div>
                <div className="text-xs text-slate-500">Voices Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">5K+</div>
                <div className="text-xs text-slate-500">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">99.9%</div>
                <div className="text-xs text-slate-500">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">4.8★</div>
                <div className="text-xs text-slate-500">User Rating</div>
              </div>
              <div className="col-span-2 text-center sm:col-span-1">
                <div className="text-2xl font-bold text-slate-700">24/7</div>
                <div className="text-xs text-slate-500">Voice Synthesis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DemoSection />

      {/* ── FEATURES ── */}
      <section id="features" className="bg-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              High‑Performance AI Voices,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Ready{" "}
              </span>
              When You Are.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Create realistic, human‑like speech with everything you
              need—powered by artificial intelligence.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div
                      className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-lg p-3 ${feature.color}`}
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 flex justify-center text-lg font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-slate-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Smooth. Quick. Pro‑Grade.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get polished results in just three easy steps.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Add Your Script",
                description:
                  "Write or paste your content. The editor supports multiple languages and works well even with advanced formatting.",
              },
              {
                step: "02",
                title: "Pick a Voice Style",
                description:
                  "Browse a large catalog of AI voices—clone your own, use polished presets, or fine-tune the voice settings to match your needs.",
              },
              {
                step: "03",
                title: "Create & Save Audio",
                description:
                  "Generate natural-sounding speech in seconds, then download a high-quality file ready for any project.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="mb-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 text-lg font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="ml-4 hidden h-0.5 w-full bg-slate-300 md:block" />
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="bg-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Creators
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Discover what people are saying about Vox AI Studio.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative border-slate-200 bg-white/70 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-slate-600 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        className="bg-gradient-to-br from-slate-50 to-indigo-50/50 py-20 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Simple, Transparent{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Start free. Scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* ── FREE TRIAL ── */}
            <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Free Trial
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      $0
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    7-day trial · No card needed
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "10,000 credits included",
                      "Flash voice only",
                      "Single-speaker (no multi-speaker)",
                      "Max 500 chars / request",
                      "Expires after 7 days",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <AuthCTA
                    label="Try for Free"
                    variant="outline"
                    size="lg"
                    className="w-full font-semibold"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── START ── */}
            <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Start</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      $4.99
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Light users · Credits never expire
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "40,000 credits",
                      "All voices (Flash + Pro)",
                      "Multi-speaker enabled",
                      "No character limit per request",
                      "Credits never expire",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <PricingButton
                    slug="starter"
                    label="Get Started"
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── CREATOR (Most Popular) ── */}
            <Card className="relative flex flex-col overflow-hidden border-2 border-indigo-400 bg-white/70 shadow-lg backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Creator</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      $9.99
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Regular creators · Credits never expire
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "125,000 credits",
                      "All voices (Flash + Pro)",
                      "Multi-speaker enabled",
                      "All features included",
                      "Credits never expire",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <PricingButton
                    slug="creator"
                    label="Get Creator"
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ── PRO ── */}
            <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Pro</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">
                      $49.99
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Agencies &amp; heavy users · Credits never expire
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      "400,000 credits",
                      "All voices (Flash + Pro)",
                      "Multi-speaker enabled",
                      "All features included",
                      "Priority queue",
                      "Credits never expire",
                    ].map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <PricingButton
                    slug="pro"
                    label="Get Pro"
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-r from-indigo-100/70 to-cyan-100/70 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Turn Your Words Into Voice—Ready?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Join thousands of creators using AI to make content sound natural
              and alive.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <AuthCTA
                label="Start Free"
                icon="AudioWaveform"
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-cyan-600 px-8 py-6 text-base text-white"
              />
              <Link href="#demo">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer gap-2 border-slate-300 px-8 py-6 text-base text-slate-700 hover:bg-slate-100"
                >
                  <Play className="h-5 w-5" />
                  Play samples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
