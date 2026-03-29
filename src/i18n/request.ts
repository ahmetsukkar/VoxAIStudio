import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, type Locale, locales } from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;

  const locale: Locale =
    cookieLocale && locales.includes(cookieLocale as Locale)
      ? (cookieLocale as Locale)
      : defaultLocale;

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});

async function loadMessages(locale: Locale) {
  const messageFiles = [
    'common',
    'home',
    'auth',
    'dashboard',
    'faq',
    'contact',
    'legal',
    'studio',
    'projects',
    'settings',
  ];

  const messages: Record<string, unknown> = {};

  for (const file of messageFiles) {
    try {
      const mod = await import(`./messages/${locale}/${file}.json`);
      messages[file] = mod.default;
    } catch {
      // fallback to English if translation missing
      try {
        const fallback = await import(`./messages/en/${file}.json`);
        messages[file] = fallback.default;
      } catch {
        messages[file] = {};
      }
    }
  }

  return messages;
}