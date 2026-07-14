import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      return apiResponse.error('Not authenticated', 'UNAUTHORIZED', null, 401);
    }

    const payload = verifyToken(authCookie.value);
    if (!payload || payload.role !== 'STUDENT') {
      return apiResponse.error('Invalid session token', 'UNAUTHORIZED', null, 401);
    }

    const certificates = await prisma.certificate.findMany({
      where: { studentProfile: { studentCode: payload.studentCode } },
      include: { program: true },
      orderBy: { issuedAt: 'desc' }
    });

    return apiResponse.success(certificates);
  } catch (error: any) {
    console.error('Certificates GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
