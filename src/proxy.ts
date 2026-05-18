import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devphoenix2025';
const COOKIE_NAME = 'dp-admin-auth';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all /admin/* routes except /admin-login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || authCookie.value !== ADMIN_PASSWORD) {
      const loginUrl = new URL('/admin-login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
