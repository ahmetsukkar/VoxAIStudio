import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { CookieBanner } from "~/components/cookie-banner";


export const metadata: Metadata = {
  title: "Vox AI Studio",
  description: "Transform Text into Natural Speech with AI",
  icons: [
    {
      rel: "icon",
      url: "/vox_studio_icon.svg",
    },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        {children}
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
