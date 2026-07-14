import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devphoenix2025';
const ADMIN_COOKIE_NAME = 'dp-admin-auth';
const STUDENT_COOKIE_NAME = 'dp-student-auth';
const SALT = process.env.JWT_SECRET || 'devphoenix-salt-2025';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle explicit /admin/login attempts and redirect to the correct page
  if (pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin-login', req.url));
  }

  // Protect all /admin/* routes except /admin-login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login')) {
    const authCookie = req.cookies.get(ADMIN_COOKIE_NAME);
    const expectedHash = await sha256(ADMIN_PASSWORD + SALT);
    if (!authCookie || authCookie.value !== expectedHash) {
      const loginUrl = new URL('/admin-login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect all student dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const authCookie = req.cookies.get(STUDENT_COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in student away from login page
  if (pathname === '/login') {
    const authCookie = req.cookies.get(STUDENT_COOKIE_NAME);
    if (authCookie && authCookie.value) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/admin-login',
    '/admin/login',
    '/dashboard',
    '/dashboard/:path*',
    '/login',
  ],
};
