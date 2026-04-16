'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from './ui/Button';
import styles from './ui/button.module.css';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const nextLocale = locale === 'uk' ? 'en' : 'uk';
  const flagAlt = nextLocale === 'en' ? 'English' : 'Українська';

  return (
    <div>
      <Button onClick={() => switchLanguage(nextLocale)} className={styles.transparent}>
        <Image src={`/images/${nextLocale}.png`} alt={flagAlt} width={24} height={16} />
      </Button>
    </div>
  );
}