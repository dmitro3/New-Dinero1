import { NextResponse } from 'next/server';
import i18nConfig from '../i18nConfig';
import { i18nRouter } from 'next-i18n-router';

const SUPPORTED_LANGUAGES = ['en', 'fr'];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const currentLanguage = pathname.split('/')[1];

  if (SUPPORTED_LANGUAGES.includes(currentLanguage)) {
    return NextResponse.next();
  }
  const defaultLanguage = 'en';

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLanguage}${pathname}`;
  // return NextResponse.redirect(url);

  return i18nRouter(request, i18nConfig);
}
// applies this middleware only to files in the app directory
export const config = {
  matcher: ['/layout1/:path*', '/((?!api|static|.*\\..*|_next).*)'],
};