import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { isAdminAuthenticated } from '@/lib/admin-auth-helper';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return apiResponse.error('Not authenticated as Administrator', 'UNAUTHORIZED', null, 401);
    }

    // 2. Parse and Validate Payload
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return apiResponse.badRequest('Missing required parameters: id, status', 'MISSING_REQUIRED_FIELDS');
    }

    if (!['Valid', 'Revoked', 'Expired'].includes(status)) {
      return apiResponse.badRequest('Invalid status value. Must be: Valid, Revoked, or Expired', 'INVALID_STATUS');
    }

    // 3. Find and update the Verification record
    const record = await prisma.verification.findUnique({
      where: { id }
    });

    if (!record) {
      return apiResponse.notFound(`Document verification record with ID "${id}" not found`);
    }

    const updatedRecord = await prisma.verification.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    });

    // Create Notification in student portal
    await prisma.notification.create({
      data: {
        studentProfileId: record.studentProfileId,
        title: `Document Status Updated ⚠️`,
        message: `Your ${record.documentType} (${record.verificationId}) status has been updated to ${status}.`,
        type: 'class'
      }
    });

    // Log student activity
    await prisma.studentActivityLog.create({
      data: {
        studentProfileId: record.studentProfileId,
        action: 'DOCUMENT_STATUS_CHANGED',
        details: `Document status for ${record.verificationId} updated to ${status}`
      }
    });

    return apiResponse.success(updatedRecord);
  } catch (error: any) {
    console.error('Revoke/Update verification status error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
