import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { metadata } from "./metadata";
import JsonLd from "@/components/JsonLd";
import { AppProviders } from "@/context/AppContext";

const inter = Inter({ subsets: ["cyrillic"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://perepel-club.com';
const phone = process.env.NEXT_PUBLIC_PHONE;
const facebook = process.env.NEXT_PUBLIC_FACEBOOK_URL;
const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <head>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Перепелиний клуб",
            url: siteUrl,
            logo: `${siteUrl}/images/banner-bg.webp`,
            contactPoint: {
              "@type": "ContactPoint",
              telephone: phone,
              contactType: "customer service",
            },
            sameAs: [{facebook}, {instagram}],
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AppProviders>{children}</AppProviders>
        </Providers>
      </body>
    </html>
  );
}
