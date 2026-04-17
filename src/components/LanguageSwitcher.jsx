'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/config/locales';
import styles from './ui/button.module.css';
import Button from './ui/Button';
import Image from 'next/image';

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  if (locales.length < 2) return null;

  const switchLanguage = (newLocale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && locales.includes(segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  return (
    <div>
      {locales.map((locale) => {
        if (locale === currentLocale) return null;
        return (
          <Button
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={styles.transparent}
          >
            <Image
              src={`/images/${locale}.png`}
              alt={locale.toUpperCase()}
              width={24}
              height={16}
            />
          </Button>
        );
      })}
    </div>
  );
}