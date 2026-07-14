export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

const progressUpdateSchema = z.object({
  courseModuleId: z.string().min(1, 'Course module ID is required'),
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100'),
  status: z.enum(['Completed', 'In Progress', 'Not Started']),
});

export async function POST(req: NextRequest) {
  try {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      return apiResponse.error('Not authenticated', 'UNAUTHORIZED', null, 401);
    }

    const payload = verifyToken(authCookie.value);
    if (!payload || payload.role !== 'STUDENT') {
      return apiResponse.error('Invalid session token', 'UNAUTHORIZED', null, 401);
    }

    const body = await req.json();
    const result = progressUpdateSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { courseModuleId, progress, status } = result.data;

    // Find student profile
    const student = await prisma.studentProfile.findUnique({
      where: { studentCode: payload.studentCode }
    });

    if (!student) {
      return apiResponse.notFound('Student profile not found');
    }

    // Upsert module progress
    const existingProgress = await prisma.moduleProgress.findFirst({
      where: { studentProfileId: student.id, courseModuleId }
    });

    let updatedProgress;
    if (existingProgress) {
      updatedProgress = await prisma.moduleProgress.update({
        where: { id: existingProgress.id },
        data: { progress, status }
      });
    } else {
      updatedProgress = await prisma.moduleProgress.create({
        data: {
          studentProfileId: student.id,
          courseModuleId,
          progress,
          status
        }
      });
    }

    // Log Activity
    await prisma.studentActivityLog.create({
      data: {
        studentProfileId: student.id,
        action: 'MODULE_PROGRESS_UPDATE',
        details: `Updated courseModule ${courseModuleId} to ${progress}% (${status}).`
      }
    });

    return apiResponse.success(updatedProgress);
  } catch (error: any) {
    console.error('Progress POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
