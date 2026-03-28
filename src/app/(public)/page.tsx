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
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.meta");
  return {
    title: t("title"),
    description: t("description"),
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
    alternates: { canonical: "https://www.voxaistudio.com" },
    openGraph: {
      title: t("title"),
      description: t("description"),
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
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const isRTL = locale === "ar";

  const features = [
    {
      icon: <Scissors className="h-8 w-8" />,
      title: t("features.items.cloning.title"),
      description: t("features.items.cloning.description"),
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      icon: <Expand className="h-8 w-8" />,
      title: t("features.items.tts.title"),
      description: t("features.items.tts.description"),
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: t("features.items.languages.title"),
      description: t("features.items.languages.description"),
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t("features.items.speed.title"),
      description: t("features.items.speed.description"),
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  const testimonials = [
    {
      name: t("testimonials.items.t1.name"),
      role: t("testimonials.items.t1.role"),
      content: t("testimonials.items.t1.content"),
      rating: 5,
    },
    {
      name: t("testimonials.items.t2.name"),
      role: t("testimonials.items.t2.role"),
      content: t("testimonials.items.t2.content"),
      rating: 5,
    },
    {
      name: t("testimonials.items.t3.name"),
      role: t("testimonials.items.t3.role"),
      content: t("testimonials.items.t3.content"),
      rating: 5,
    },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: t("howItWorks.steps.step1.title"),
      description: t("howItWorks.steps.step1.description"),
    },
    {
      step: "02",
      title: t("howItWorks.steps.step2.title"),
      description: t("howItWorks.steps.step2.description"),
    },
    {
      step: "03",
      title: t("howItWorks.steps.step3.title"),
      description: t("howItWorks.steps.step3.description"),
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
              { "@type": "Offer", name: "Free Trial", price: "0", priceCurrency: "USD" },
              { "@type": "Offer", name: "Starter", price: "4.99", priceCurrency: "USD" },
              { "@type": "Offer", name: "Creator", price: "9.99", priceCurrency: "USD" },
              { "@type": "Offer", name: "Pro", price: "49.99", priceCurrency: "USD" },
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
                {t("hero.badge")}
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-6xl">
              {t("hero.title")}{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 sm:text-xl">
              {t("hero.description")}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <AuthCTA
                label={t("hero.tryFree")}
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
                  {t("hero.listenDemo")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="mb-8 text-sm text-slate-500">{t("hero.trustedBy")}</p>
            <div className="grid grid-cols-2 items-center justify-center gap-6 opacity-80 sm:grid-cols-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">50K+</div>
                <div className="text-xs text-slate-500">{t("stats.voicesGenerated")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">5K+</div>
                <div className="text-xs text-slate-500">{t("stats.activeUsers")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-700">99.9%</div>
                <div className="text-xs text-slate-500">{t("stats.uptime")}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">4.8★</div>
                <div className="text-xs text-slate-500">{t("stats.userRating")}</div>
              </div>
              <div className="col-span-2 text-center sm:col-span-1">
                <div className="text-2xl font-bold text-slate-700">24/7</div>
                <div className="text-xs text-slate-500">{t("stats.voiceSynthesis")}</div>
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
              {t("features.title")}{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                {t("features.titleHighlight")}{" "}
              </span>
              {t("features.titleEnd")}
            </h2>
            <p className="mt-4 text-lg text-slate-600">{t("features.subtitle")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className={`${feature.bgColor} mb-4 inline-flex items-center justify-center rounded-lg p-3 ${feature.color}`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 flex justify-center text-lg font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className={`text-sm text-slate-600 ${isRTL ? "text-right" : "text-center"}`}>
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
              {t("howItWorks.title")}
            </h2>
            <p className="mt-4 text-lg text-slate-600">{t("howItWorks.subtitle")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorksSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="mb-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-cyan-600 text-lg font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="ml-4 hidden h-0.5 w-full bg-slate-300 md:block" />
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-800">{item.title}</h3>
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
              {t("testimonials.title")}{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                {t("testimonials.titleHighlight")}
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">{t("testimonials.subtitle")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative border-slate-200 bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-slate-600 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-slate-800">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="bg-gradient-to-br from-slate-50 to-indigo-50/50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              {t("pricing.title")}{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                {t("pricing.titleHighlight")}
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">{t("pricing.subtitle")}</p>
          </div>

          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* FREE TRIAL */}
            <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{t("pricing.freeTrial.name")}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">{t("pricing.freeTrial.price")}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t("pricing.freeTrial.period")}</p>
                  <ul className="mt-6 space-y-3">
                    {(t.raw("pricing.freeTrial.features") as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <AuthCTA label={t("pricing.freeTrial.cta")} variant="outline" size="lg" className="w-full font-semibold" />
                </div>
              </CardContent>
            </Card>

            {/* START */}
            <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{t("pricing.start.name")}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">{t("pricing.start.price")}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t("pricing.start.period")}</p>
                  <ul className="mt-6 space-y-3">
                    {(t.raw("pricing.start.features") as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <PricingButton slug="starter" label={t("pricing.start.cta")} className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700" />
                </div>
              </CardContent>
            </Card>

            {/* CREATOR */}
            <Card className="relative flex flex-col overflow-hidden border-2 border-indigo-400 bg-white/70 shadow-lg backdrop-blur-sm">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                {t("pricing.mostPopular")}
              </div>
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{t("pricing.creator.name")}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">{t("pricing.creator.price")}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t("pricing.creator.period")}</p>
                  <ul className="mt-6 space-y-3">
                    {(t.raw("pricing.creator.features") as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <PricingButton slug="creator" label={t("pricing.creator.cta")} className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700" />
                </div>
              </CardContent>
            </Card>

            {/* PRO */}
            <Card className="relative flex flex-col overflow-hidden border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-1 flex-col p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{t("pricing.pro.name")}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800">{t("pricing.pro.price")}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t("pricing.pro.period")}</p>
                  <ul className="mt-6 space-y-3">
                    {(t.raw("pricing.pro.features") as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto pt-8">
                  <PricingButton slug="pro" label={t("pricing.pro.cta")} className="w-full bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-600 hover:to-cyan-700" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-r from-indigo-100/70 to-cyan-100/70 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg text-slate-600">{t("cta.subtitle")}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <AuthCTA
                label={t("cta.startFree")}
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
                  {t("cta.playSamples")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}