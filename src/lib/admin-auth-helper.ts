import { NextRequest } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devphoenix2025';
const COOKIE_NAME = 'dp-admin-auth';
const SALT = process.env.JWT_SECRET || 'devphoenix-salt-2025';

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  try {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      return false;
    }
    const expectedHash = await sha256(ADMIN_PASSWORD + SALT);
    return authCookie.value === expectedHash;
  } catch (error) {
    console.error('isAdminAuthenticated check failed:', error);
    return false;
  }
}
