export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

const projectUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  teamMembers: z.array(z.string()).optional(),
  progress: z.number().min(0).max(100).optional(),
  submissionStatus: z.string().optional(),
  finalReportUrl: z.string().url().optional(),
  milestones: z.array(z.any()).optional(),
});

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

    const project = await prisma.project.findFirst({
      where: { studentProfile: { studentCode: payload.studentCode } }
    });

    if (!project) {
      return apiResponse.notFound('Project details not found');
    }

    return apiResponse.success(project);
  } catch (error: any) {
    console.error('Projects GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

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

    const student = await prisma.studentProfile.findUnique({
      where: { studentCode: payload.studentCode }
    });

    if (!student) {
      return apiResponse.notFound('Student profile not found');
    }

    const body = await req.json();
    const result = projectUpdateSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const existingProject = await prisma.project.findFirst({
      where: { studentProfileId: student.id }
    });

    let updatedProject;
    if (existingProject) {
      updatedProject = await prisma.project.update({
        where: { id: existingProject.id },
        data: result.data
      });
    } else {
      updatedProject = await prisma.project.create({
        data: {
          studentProfileId: student.id,
          title: result.data.title || 'Capstone Project',
          description: result.data.description || '',
          teamMembers: result.data.teamMembers || [],
          progress: result.data.progress || 0,
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().split('T')[0],
          submissionStatus: result.data.submissionStatus || 'Not Submitted',
          milestones: result.data.milestones || []
        }
      });
    }

    // Log Activity
    await prisma.studentActivityLog.create({
      data: {
        studentProfileId: student.id,
        action: 'PROJECT_METADATA_UPDATE',
        details: `Updated project metadata for student.`
      }
    });

    return apiResponse.success(updatedProject);
  } catch (error: any) {
    console.error('Projects POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
