export const locales = ['en', 'ar', 'tr'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeConfig = {
  en: {
    label: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
  },
  ar: {
    label: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
  },
  tr: {
    label: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
  },
} as const;