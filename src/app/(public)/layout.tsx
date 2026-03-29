import Navigation from "~/components/navigation";
import Footer from "~/components/footer";
import IntlProvider from "~/components/intl-provider";
import { getLocale, getMessages } from "next-intl/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Navigation />
      {children}
      <Footer />
    </IntlProvider>
  );
}