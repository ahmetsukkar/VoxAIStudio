"use client";

import Link from "next/link";
import { AudioWaveform } from "lucide-react";
import { Button } from "./ui/button";
import { authClient } from "~/lib/auth-client";
import AuthCTA from "~/components/auth-cta";
import LanguageSwitcher from "~/components/language-switcher";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { Locale } from "~/i18n/config";

export default function Navigation() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = !!session?.user;
  const t = useTranslations("common.navigation");
  const locale = useLocale() as Locale;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-lg">
              <AudioWaveform className="h-5 w-5 text-white" />
            </div>
            <Link href="/">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
                Vox AI Studio
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/#features"
              className="text-slate-600 transition-colors hover:text-indigo-600"
            >
              {t("features")}
            </Link>
            <Link
              href="/#pricing"
              className="text-slate-600 transition-colors hover:text-indigo-600"
            >
              {t("pricing")}
            </Link>
            <Link
              href="/#testimonials"
              className="text-slate-600 transition-colors hover:text-indigo-600"
            >
              {t("reviews")}
            </Link>
            <Link
              href="/blog"
              className="text-slate-600 transition-colors hover:text-indigo-600"
            >
              {t("blog")}
            </Link>
            <Link
              href="/legal/about"
              className="text-slate-600 transition-colors hover:text-indigo-600"
            >
              {t("about")}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            {!isPending && !isLoggedIn && (
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  {t("signIn")}
                </Button>
              </Link>
            )}
            <AuthCTA
              label={isLoggedIn ? t("myDashboard") : t("tryItFree")}
              icon={isLoggedIn ? "LayoutDashboard" : "ArrowRight"}
              iconPosition="left"
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-cyan-600 text-white"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
