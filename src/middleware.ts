import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locales = ['uk', 'en'];
  const defaultLocale = 'uk';

  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale && !pathname.startsWith('/api') && !pathname.startsWith('/admin') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  const handleI18n = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
  });

  return handleI18n(request);
}

export const config = {
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
};