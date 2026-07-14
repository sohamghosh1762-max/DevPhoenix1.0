import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { isAdminAuthenticated } from '@/lib/admin-auth-helper';

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

    // Check if the student profile actually exists
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      return apiResponse.notFound(`Student profile with ID "${studentId}" not found`);
    }

    // 3. Set Verification ID equal to the Student Code
    const verificationId = student.studentCode;
    const cCode = courseCode.toUpperCase().trim();

    // 4. Save to Database (using upsert to overwrite if the student code verification already exists)
    const recordData = {
      studentProfileId: studentId,
      studentName: studentName.trim(),
      verificationId,
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      course: course.trim(),
      courseCode: cCode,
      documentType: documentType.trim(),
      issueDate: new Date(),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      duration: duration.trim(),
      status: 'Valid',
      generatedBy: 'Admin',
      pdfUrl: pdfUrl || `/api/verification/pdf/${verificationId}`,
      qrCodeUrl: `/verify?id=${verificationId}`
    };

    const verifyRecord = await prisma.verification.upsert({
      where: { verificationId },
      update: recordData,
      create: recordData
    });

    // Create Notification in student portal
    await prisma.notification.create({
      data: {
        studentProfileId: studentId,
        title: `New Official Document Issued 📄`,
        message: `Your ${documentType} has been generated and verified. Verification ID: ${verificationId}.`,
        type: 'class' // default type
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

    return apiResponse.success(verifyRecord, 201);
  } catch (error: any) {
    console.error('Generate verification document error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
