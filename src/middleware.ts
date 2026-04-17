import { locales, defaultLocale } from '@/config/locales';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isSingleLocale = locales.length === 1; 

  if (isSingleLocale) {
    const localePrefixPattern = new RegExp(`^/(${locales.join('|')})(/|$)`);
    if (localePrefixPattern.test(pathname)) {
      const newPathname = pathname.replace(localePrefixPattern, '/');
      const url = request.nextUrl.clone();
      url.pathname = newPathname;
      return NextResponse.redirect(url);
    }
  }

  const handleI18n = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: isSingleLocale ? 'as-needed' : 'always',
  });

  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
};