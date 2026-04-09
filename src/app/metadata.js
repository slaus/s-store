export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Перепелиний клуб',
  },
  description: 'Ми даємо вам найкраще, що створила природа. Перепелина продукція. Замовляйте зі смаком!',
  keywords: ['фермерські продукти', 'доставка їжі', 'натуральне харчування', 'м\'ясо перепелине', 'здорове харчування', 'яйця перепелині', 'делікатеси з перепелки', 'перепелина продукція'],
  authors: [{ name: 'mister.slaus@gmail.com' }],
  openGraph: {
    title: 'Перепелиний клуб',
    description: 'Ми даємо вам найкраще, що створила природа',
    url: 'https://perepel-club.com',
    siteName: 'Перепелиний клуб',
    images: [
      {
        url: '/images/banner-bg.webp',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Перепелиний клуб',
    description: 'Ми даємо вам найкраще, що створила природа',
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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};