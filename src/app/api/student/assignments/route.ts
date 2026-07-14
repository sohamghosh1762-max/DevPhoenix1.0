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

    // Find enrolled program to query program assignments
    const enrollment = await prisma.enrollment.findFirst({
      where: { studentProfile: { studentCode: payload.studentCode } },
      include: {
        program: {
          include: {
            courseModules: {
              include: {
                assignments: {
                  include: {
                    submissions: {
                      where: { studentProfile: { studentCode: payload.studentCode } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!enrollment || !enrollment.program) {
      return apiResponse.notFound('No enrolled program found');
    }

    const assignments = enrollment.program.courseModules.flatMap(cm => 
      cm.assignments.map(ass => {
        const sub = ass.submissions[0];
        return {
          id: ass.id,
          moduleNumber: cm.moduleNumber,
          moduleTitle: cm.title,
          title: ass.title,
          description: ass.description,
          deadline: ass.deadline,
          status: sub ? sub.status : 'Pending',
          submissionDate: sub ? sub.submissionDate : null,
          submittedFile: sub ? sub.submittedFile : null,
          marks: sub ? sub.marks : 'N/A',
          feedback: sub ? sub.feedback : null
        };
      })
    );

    return apiResponse.success(assignments);
  } catch (error: any) {
    console.error('Assignments GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
