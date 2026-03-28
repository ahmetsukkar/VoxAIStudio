import Link from "next/link";
import { AudioWaveform } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("common.footer");

  return (
    <footer className="border-t border-slate-200 bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-600 shadow-lg">
                  <AudioWaveform className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
                  Vox AI Studio
                </span>
              </div>
              <p className="max-w-md text-slate-600">{t("tagline")}</p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-slate-800">{t("product")}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="/#features" className="transition-colors hover:text-indigo-600">
                    {t("features")}
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="transition-colors hover:text-indigo-600">
                    {t("pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="/#testimonials" className="transition-colors hover:text-indigo-600">
                    {t("reviews")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 font-bold">{t("resources")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                    {t("blog")}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-gray-900">
                    {t("helpFaq")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                    {t("contactUs")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-slate-800">{t("legal")}</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link href="/legal/about" className="transition-colors hover:text-indigo-600">
                    {t("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="transition-colors hover:text-indigo-600">
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="transition-colors hover:text-indigo-600">
                    {t("termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy#cookies" className="transition-colors hover:text-indigo-600">
                    {t("cookiePolicy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}