import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    keywords: t('keywords').split(','),
    authors: [{ name: 'mister.slaus@gmail.com' }],
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: siteUrl,
      siteName: t('siteName'),
      images: [
        {
          url: '/images/banner-bg.webp',
          width: 1200,
          height: 630,
        },
      ],
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ['/images/banner-bg.webp'],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
    },
  };
}

// viewport остаётся статичным
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};