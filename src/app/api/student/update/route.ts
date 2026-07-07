import { NextRequest } from 'next/server';
import { studentsService } from '@/services/mongodb/db.service';
import { hasMongoConfig } from '@/services/mongodb/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';
const cache = getLocalCacheHelper<any>('students.json');

export async function POST(req: NextRequest) {
  try {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      return apiResponse.error('Not authenticated', 'UNAUTHORIZED', null, 401);
    }

    const studentCode = authCookie.value;
    const body = await req.json();
    const { action, payload } = body;

    if (!action) {
      return apiResponse.badRequest('Action is required', 'MISSING_ACTION');
    }

    // 1. Fetch current student record
    let student = null;
    if (hasMongoConfig) {
      try {
        student = await studentsService.getByCode(studentCode);
      } catch (err) {
        console.error('MongoDB error in student update:', err);
      }
    }

    const students = cache.read();
    if (!student) {
      student = students.find((s: any) => s.studentCode.toUpperCase() === studentCode.toUpperCase());
    }

    if (!student) {
      return apiResponse.notFound('Student not found');
    }

    // 2. Perform modification based on action
    let updated = false;

    if (action === 'mark_notification_read') {
      const { notificationId } = payload;
      student.notifications = student.notifications.map((n: any) => {
        if (n.id === notificationId) {
          updated = true;
          return { ...n, isRead: true };
        }
        return n;
      });
    } 
    
    else if (action === 'mark_all_notifications_read') {
      student.notifications = student.notifications.map((n: any) => {
        if (!n.isRead) updated = true;
        return { ...n, isRead: true };
      });
    } 
    
    else if (action === 'submit_assignment') {
      const { assignmentId, fileName } = payload;
      student.assignments = student.assignments.map((a: any) => {
        if (a.id === assignmentId) {
          updated = true;
          return {
            ...a,
            status: 'Submitted',
            submissionDate: new Date().toISOString().split('T')[0],
            marks: 'Pending Review',
            feedback: `File submitted: ${fileName}. Wait for mentor evaluation.`
          };
        }
        return a;
      });
      
      // Update statistics
      student.assignmentsSubmittedCount = student.assignments.filter((a: any) => a.status === 'Submitted').length;
    } 
    
    else if (action === 'submit_project_report') {
      const { fileName } = payload;
      student.project = {
        ...student.project,
        submissionStatus: 'Under Review',
        finalReportUrl: `/uploads/projects/${fileName}`,
        mentorRemarks: 'Final report submitted successfully. Review in progress.'
      };
      updated = true;
    } 
    
    else if (action === 'change_password') {
      const { currentPassword, newPassword } = payload;
      if (student.password !== currentPassword) {
        return apiResponse.error('Current password does not match', 'INVALID_CURRENT_PASSWORD', null, 400);
      }
      student.password = newPassword;
      updated = true;
    }

    if (!updated && action !== 'change_password' && action !== 'submit_project_report' && action !== 'submit_assignment') {
      const { password, ...profile } = student;
      return apiResponse.success(profile);
    }

    // 3. Save student record back
    if (hasMongoConfig) {
      try {
        await studentsService.update(student.studentCode, student);
      } catch (err) {
        console.error('Failed to update student in MongoDB, relying on cache sync:', err);
      }
    }

    // Sync in cache
    const idx = students.findIndex((s: any) => s.studentCode.toUpperCase() === studentCode.toUpperCase());
    if (idx !== -1) {
      students[idx] = student;
      cache.write(students);
    }

    // Return the updated student details without password
    const { password, ...profile } = student;
    return apiResponse.success(profile);
  } catch (error: any) {
    console.error('Student update POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
