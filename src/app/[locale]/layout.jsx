import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Providers from "../providers";
import { AppProviders } from "@/context/AppContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { generateMetadata, viewport } from "../metadata";

const inter = Inter({ subsets: ["cyrillic"] });

const locales = ['uk', 'en'];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export { generateMetadata, viewport };

export default async function LocaleLayout({ children, params }) {
  
  const { locale } = await params;
  
  if (!locales.includes(locale)) notFound();
  
  const messages = await getMessages({ locale });
  const t = await getTranslations({ locale, namespace: 'site' });
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const phone = process.env.NEXT_PUBLIC_PHONE || "+380XXXXXXXXX";
  const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t('name'),
    url: siteUrl,
    logo: `${siteUrl}/images/banner-bg.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: phone,
      contactType: "customer service",
    },
    sameAs: [facebook, instagram].filter(Boolean),
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <AppProviders>
              {children}
            </AppProviders>
          </Providers>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}