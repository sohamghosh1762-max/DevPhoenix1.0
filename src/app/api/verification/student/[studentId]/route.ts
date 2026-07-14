import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';
import { isAdminAuthenticated } from '@/lib/admin-auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params;

    // 1. Authorize Request
    let authorized = false;

    // A. Check if it is an Admin
    const isAdmin = await isAdminAuthenticated(req);
    if (isAdmin) {
      authorized = true;
    } else {
      // B. Check if it is the correct Student Profile
      const studentCookie = req.cookies.get('dp-student-auth');
      if (studentCookie && studentCookie.value) {
        const payload = verifyToken(studentCookie.value);
        if (payload && payload.role === 'STUDENT' && payload.id === studentId) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return apiResponse.error('Not authorized to access these documents', 'UNAUTHORIZED', null, 403);
    }

    // 2. Fetch student verifications
    const verifications = await prisma.verification.findMany({
      where: { studentProfileId: studentId },
      orderBy: { createdAt: 'desc' }
    });

    return apiResponse.success(verifications);
  } catch (error: any) {
    console.error('Fetch student verifications error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
