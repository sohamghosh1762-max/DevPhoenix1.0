export const runtime = 'nodejs';
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

    // Find student enrollment and program
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentProfile: { studentCode: payload.studentCode } },
      include: {
        program: {
          include: {
            courseModules: {
              include: {
                progress: {
                  where: { studentProfile: { studentCode: payload.studentCode } }
                }
              }
            }
          }
        }
      }
    });

    if (!enrollment || !enrollment.program) {
      return apiResponse.notFound('No active enrollment or course program found');
    }

    // Get mentor
    const mentor = await prisma.mentor.findFirst({
      where: { isVerified: true }
    });

    return apiResponse.success({
      program: enrollment.program,
      mentor: mentor || {
        name: 'Vikram Mehta',
        role: 'Senior Advisor',
        email: 'vikram@devphoenix.com',
        avatar: null
      }
    });
  } catch (error: any) {
    console.error('Course GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
