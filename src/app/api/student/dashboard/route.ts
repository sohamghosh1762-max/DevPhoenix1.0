import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';
import { getStudentDashboardData } from '@/lib/student-db';

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

    const dashboardData = await getStudentDashboardData(payload.studentCode);
    if (!dashboardData) {
      return apiResponse.notFound('Trainee profile not found');
    }

    return apiResponse.success(dashboardData);
  } catch (error: any) {
    console.error('Student dashboard GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
