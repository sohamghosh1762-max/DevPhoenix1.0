export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';
import { sendPaymentSubmissionConfirmation, sendAdminPaymentAlert } from '@/lib/email';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

const paymentSchema = z.object({
  amountPaid: z.string().min(1, 'Amount paid is required'),
  transactionId: z.string().min(1, 'Transaction ID is required'),
  screenshotUrl: z.string().min(1, 'Screenshot path is required'),
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
    const result = paymentSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { amountPaid, transactionId, screenshotUrl } = result.data;

    // Find student
    const student = await prisma.studentProfile.findUnique({
      where: { studentCode: payload.studentCode },
      include: { user: true }
    });

    if (!student) {
      return apiResponse.notFound('Student profile not found');
    }

    // Create payment submission
    const submission = await prisma.paymentSubmission.create({
      data: {
        studentProfileId: student.id,
        amountPaid,
        transactionId,
        screenshotUrl,
        status: 'Pending Verification'
      }
    });

    // Create Notification in trainee portal
    await prisma.notification.create({
      data: {
        studentProfileId: student.id,
        title: 'Payment Verification Pending 💳',
        message: `Your payment of ${amountPaid} (Transaction ID: ${transactionId}) has been logged and is under review.`,
        type: 'payment'
      }
    });

    // Log Activity
    await prisma.studentActivityLog.create({
      data: {
        studentProfileId: student.id,
        action: 'PAYMENT_SUBMISSION',
        details: `Submitted payment request of ${amountPaid}. Transaction ID: ${transactionId}. Screenshot: ${screenshotUrl}`
      }
    });

    // Dispatch Resend alert emails asynchronously
    sendPaymentSubmissionConfirmation(student.user.email, student.name, transactionId)
      .catch(err => console.error('Trainee payment email fail:', err));
    sendAdminPaymentAlert(student.name, student.studentCode, transactionId, amountPaid)
      .catch(err => console.error('Admin payment alert email fail:', err));

    return apiResponse.success(submission, 201);
  } catch (error: any) {
    console.error('Payment POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
