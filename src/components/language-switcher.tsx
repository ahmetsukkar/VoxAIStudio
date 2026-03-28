"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";
import { localeConfig, locales, type Locale } from "~/i18n/config";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (locale: Locale) => {
    // Save locale preference in cookie (1 year expiry)
    document.cookie = `locale=${locale};path=/;max-age=31536000;SameSite=Lax`;

    startTransition(() => {
      router.refresh();
    });
  };

  const current = localeConfig[currentLocale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex cursor-pointer items-center gap-1.5 text-slate-600 hover:text-indigo-600"
          disabled={isPending}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{current.flag} {current.label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {locales.map((locale) => {
          const config = localeConfig[locale];
          const isActive = locale === currentLocale;
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`flex cursor-pointer items-center gap-2 ${
                isActive ? "bg-indigo-50 font-semibold text-indigo-600" : ""
              }`}
            >
              <span>{config.flag}</span>
              <span>{config.label}</span>
              {isActive && <span className="ms-auto text-xs text-indigo-400">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}