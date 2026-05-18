import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'devphoenix2025';
const COOKIE_NAME = 'dp-admin-auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, ADMIN_PASSWORD, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return res;
  }
  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('dp-admin-auth');
  return res;
}
