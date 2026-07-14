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

    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentProfile: { studentCode: payload.studentCode } },
      orderBy: { date: 'desc' }
    });

    const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
    const absentCount = attendanceRecords.filter(a => a.status === 'Absent').length;
    const leaveCount = attendanceRecords.filter(a => a.status === 'Leave').length;
    const total = attendanceRecords.length;

    return apiResponse.success({
      history: attendanceRecords,
      stats: {
        presentCount,
        absentCount,
        leaveCount,
        total,
        percentage: total > 0 ? Math.round((presentCount / total) * 100) : 0
      }
    });
  } catch (error: any) {
    console.error('Attendance GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
