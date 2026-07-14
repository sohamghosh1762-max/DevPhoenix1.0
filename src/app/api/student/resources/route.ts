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

    // Query resources matching student's enrolled program modules
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentProfile: { studentCode: payload.studentCode } },
      include: {
        program: {
          include: {
            courseModules: {
              include: {
                resources: true
              }
            }
          }
        }
      }
    });

    if (!enrollment || !enrollment.program) {
      return apiResponse.notFound('No enrolled program found');
    }

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    let resources = enrollment.program.courseModules.flatMap(cm => 
      cm.resources.map(res => ({
        id: res.id,
        moduleTitle: cm.title,
        moduleNumber: cm.moduleNumber,
        title: res.title,
        type: res.type,
        size: res.size,
        downloadUrl: res.downloadUrl
      }))
    );

    if (query) {
      resources = resources.filter(res => 
        res.title.toLowerCase().includes(query) || 
        res.moduleTitle.toLowerCase().includes(query)
      );
    }

    return apiResponse.success(resources);
  } catch (error: any) {
    console.error('Resources GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
