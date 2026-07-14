export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';
import { getStudentDashboardData } from '@/lib/student-db';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

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
    const { action, payload: actionPayload } = body;

    if (!action) {
      return apiResponse.badRequest('Action is required', 'MISSING_ACTION');
    }

    // 1. Fetch current student record
    const student = await prisma.studentProfile.findUnique({
      where: { studentCode: payload.studentCode },
      include: { user: true }
    });

    if (!student) {
      return apiResponse.notFound('Trainee not found');
    }

    // 2. Perform modification based on action
    if (action === 'mark_notification_read') {
      const { notificationId } = actionPayload;
      await prisma.notification.updateMany({
        where: { id: notificationId, studentProfileId: student.id },
        data: { isRead: true }
      });
    } 
    
    else if (action === 'mark_all_notifications_read') {
      await prisma.notification.updateMany({
        where: { studentProfileId: student.id, isRead: false },
        data: { isRead: true }
      });
    } 
    
    else if (action === 'submit_assignment') {
      const { assignmentId, fileName } = actionPayload;
      
      const existingSubmission = await prisma.assignmentSubmission.findFirst({
        where: { assignmentId, studentProfileId: student.id }
      });

      if (existingSubmission) {
        await prisma.assignmentSubmission.update({
          where: { id: existingSubmission.id },
          data: {
            status: 'Submitted',
            submissionDate: new Date().toISOString().split('T')[0],
            submittedFile: fileName,
            marks: 'Pending Review',
            feedback: `File submitted: ${fileName}. Wait for mentor evaluation.`
          }
        });
      } else {
        await prisma.assignmentSubmission.create({
          data: {
            assignmentId,
            studentProfileId: student.id,
            status: 'Submitted',
            submissionDate: new Date().toISOString().split('T')[0],
            submittedFile: fileName,
            marks: 'Pending Review',
            feedback: `File submitted: ${fileName}. Wait for mentor evaluation.`
          }
        });
      }
      
      // Log Activity
      await prisma.studentActivityLog.create({
        data: {
          studentProfileId: student.id,
          action: 'ASSIGNMENT_SUBMISSION',
          details: `Submitted assignment ID ${assignmentId}. File path: ${fileName}`
        }
      });
    } 
    
    else if (action === 'submit_project_report') {
      const { fileName } = actionPayload;
      
      const project = await prisma.project.findFirst({
        where: { studentProfileId: student.id }
      });

      if (project) {
        await prisma.project.update({
          where: { id: project.id },
          data: {
            submissionStatus: 'Under Review',
            finalReportUrl: fileName,
            mentorRemarks: 'Final report submitted successfully. Review in progress.'
          }
        });

        // Log Activity
        await prisma.studentActivityLog.create({
          data: {
            studentProfileId: student.id,
            action: 'PROJECT_SUBMISSION',
            details: `Submitted final project report. File path: ${fileName}`
          }
        });
      } else {
        return apiResponse.notFound('Project record not found');
      }
    } 
    
    else if (action === 'change_password') {
      const { currentPassword, newPassword } = actionPayload;
      
      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, student.user.password);
      if (!passwordMatch) {
        return apiResponse.error('Current password does not match', 'INVALID_CURRENT_PASSWORD', null, 400);
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: student.userId },
        data: { password: hashedNewPassword }
      });

      // Log Activity
      await prisma.studentActivityLog.create({
        data: {
          studentProfileId: student.id,
          action: 'PASSWORD_CHANGE',
          details: 'Updated account access password.'
        }
      });
    }

    // Return the updated student details
    const updatedData = await getStudentDashboardData(payload.studentCode);
    return apiResponse.success(updatedData);
  } catch (error: any) {
    console.error('Student update POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
