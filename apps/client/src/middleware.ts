import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico, sitemap.xml, robots.txt (static files)
  // - any files with an extension (e.g. .svg, .png, .jpg)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
