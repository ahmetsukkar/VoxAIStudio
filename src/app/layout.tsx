import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { CookieBanner } from "~/components/cookie-banner";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { env } from "~/env";
import { getLocale, getMessages } from "next-intl/server";
import { localeConfig, type Locale } from "~/i18n/config";
import IntlProvider from "~/components/intl-provider";

export const metadata: Metadata = {
  metadataBase: new URL(env.BETTER_AUTH_WWWURL),
  title: {
    default: "Vox AI Studio — Free AI Text to Speech & Voice Generator Online",
    template: "%s | Vox AI Studio",
  },
  description:
    "Convert text to speech free with 30+ AI voices. Create multi-speaker dialogues, podcasts, and voiceovers online. AI voice generator powered by Google Gemini. Try free today.",
  keywords: [
    "text to speech",
    "text to speech free",
    "text to speech online",
    "convert text to speech",
    "AI voice generator",
    "AI text to speech",
    "TTS online",
    "multi speaker text to speech",
    "AI voice studio",
    "voice cloning",
    "AI audio generator",
    "natural speech synthesis",
    "text to audio",
    "gemini text to speech",
    "ai dialogue generator",
  ],
  authors: [{ name: "Vox AI Studio", url: env.BETTER_AUTH_WWWURL }],
  creator: "Vox AI Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.BETTER_AUTH_WWWURL,
    siteName: "Vox AI Studio",
    title: "Vox AI Studio — AI Text to Speech & Voice Cloning",
    description: "Transform any text into natural, human-like speech with AI.",
    images: [
      {
        url: "/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Vox AI Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vox AI Studio — AI Text to Speech & Voice Cloning",
    description: "Transform any text into natural, human-like speech with AI.",
    images: ["/images/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: [{ rel: "icon", url: "/vox_studio_icon.svg" }],
  other: {
    "google-site-verification": "xOfGmkzisjeSsDHEOZhyACxSQYESDZZD1hkpYgOhJFk",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = localeConfig[locale as Locale]?.dir ?? "ltr";
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={geist.variable}>
      <head>
        <Script id="google-consent-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>
      </head>
      <body>
        <IntlProvider locale={locale} messages={messages}>
          {children}
          <CookieBanner />
        </IntlProvider>
        <Toaster />
      </body>
      <GoogleAnalytics gaId={env.GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
