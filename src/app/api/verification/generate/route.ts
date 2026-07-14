import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { isAdminAuthenticated } from '@/lib/admin-auth-helper';
import { readStudentsJson } from '@/lib/student-json-db';
import { readVerificationsJson, writeVerificationsJson } from '@/lib/verification-json-db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return apiResponse.error('Not authenticated as Administrator', 'UNAUTHORIZED', null, 401);
    }

    // 2. Parse and Validate Payload
    const body = await req.json();
    const {
      studentId,
      studentName,
      email,
      phone,
      course,
      courseCode,
      documentType,
      startDate,
      endDate,
      duration,
      trainingType,
      pdfUrl
    } = body;

    if (!studentId || !studentName || !email || !course || !courseCode || !documentType || !duration) {
      return apiResponse.badRequest(
        'Missing required parameters: studentId, studentName, email, course, courseCode, documentType, duration',
        'MISSING_REQUIRED_FIELDS'
      );
    }

    // Check if database is configured
    const isDatabaseConfigured = 
      !!process.env.DATABASE_URL && 
      (process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://'));

    let studentCode = '';
    if (!isDatabaseConfigured) {
      const localStudents = readStudentsJson();
      const match = localStudents.find((s: any) => s.id === studentId);
      if (!match) {
        return apiResponse.notFound(`Student profile with ID "${studentId}" not found`);
      }
      studentCode = match.studentCode;
    } else {
      const student = await prisma.studentProfile.findUnique({
        where: { id: studentId }
      });
      if (!student) {
        return apiResponse.notFound(`Student profile with ID "${studentId}" not found`);
      }
      studentCode = student.studentCode;
    }

    // 3. Set Verification ID equal to the Student Code
    const verificationId = studentCode;
    const cCode = courseCode.toUpperCase().trim();

    // 4. Record Data structure
    const recordData = {
      studentProfileId: studentId,
      studentName: studentName.trim(),
      verificationId,
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      course: course.trim(),
      courseCode: cCode,
      documentType: documentType.trim(),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      duration: duration.trim(),
      status: 'Valid',
      generatedBy: 'Admin',
      pdfUrl: pdfUrl || `/api/verification/pdf/${verificationId}`,
      qrCodeUrl: `/verify?id=${verificationId}`
    };

    if (!isDatabaseConfigured) {
      const localVerifications = readVerificationsJson();
      const newRec = {
        id: `verify-${Date.now()}`,
        ...recordData,
        issueDate: new Date().toISOString()
      };
      
      const idx = localVerifications.findIndex(v => v.verificationId === verificationId);
      if (idx !== -1) {
        localVerifications[idx] = { ...localVerifications[idx], ...newRec };
      } else {
        localVerifications.push(newRec);
      }
      writeVerificationsJson(localVerifications);
      return apiResponse.success(newRec, 201);
    }

    const verifyRecord = await prisma.verification.upsert({
      where: { verificationId },
      update: { ...recordData, issueDate: new Date() },
      create: { ...recordData, issueDate: new Date() }
    });

    // Create Notification in student portal
    try {
      await prisma.notification.create({
        data: {
          studentProfileId: studentId,
          title: `New Official Document Issued 📄`,
          message: `Your ${documentType} has been generated and verified. Verification ID: ${verificationId}.`,
          type: 'class'
        }
      });

      // Log Activity
      await prisma.studentActivityLog.create({
        data: {
          studentProfileId: studentId,
          action: 'DOCUMENT_GENERATED',
          details: `Generated ${documentType} (Verification ID: ${verificationId})`
        }
      });
    } catch (dbErr) {
      console.warn('Non-blocking log/notification write error:', dbErr);
    }

    return apiResponse.success(verifyRecord, 201);
  } catch (error: any) {
    console.error('Generate verification document error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
