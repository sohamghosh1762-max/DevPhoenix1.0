import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { isAdminAuthenticated } from '@/lib/admin-auth-helper';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET verification by verificationId or UUID (Publicly accessible)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id).trim();

    // 1. Search by unique verificationId (e.g. DPA-TTP-AIPE-2026-001)
    let record = await prisma.verification.findUnique({
      where: { verificationId: decodedId }
    });

    // 2. Fallback: Search by database primary key ID (if it looks like a UUID)
    if (!record && decodedId.length === 36) {
      record = await prisma.verification.findUnique({
        where: { id: decodedId }
      });
    }

    if (!record) {
      return apiResponse.notFound(`Document with verification ID "${decodedId}" does not exist.`);
    }

    return apiResponse.success(record);
  } catch (error: any) {
    console.error('GET public verification error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

// DELETE verification by primary key id (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Authenticate Admin
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return apiResponse.error('Not authenticated as Administrator', 'UNAUTHORIZED', null, 401);
    }

    // 2. Find record
    const record = await prisma.verification.findUnique({
      where: { id }
    });

    if (!record) {
      return apiResponse.notFound(`Document verification record with ID "${id}" not found`);
    }

    // 3. Delete record
    await prisma.verification.delete({
      where: { id }
    });

    // Log student activity if it was for a student
    try {
      await prisma.studentActivityLog.create({
        data: {
          studentProfileId: record.studentProfileId,
          action: 'DOCUMENT_DELETED',
          details: `Admin deleted document record for ${record.documentType} (${record.verificationId})`
        }
      });
    } catch (logErr) {
      console.error('Failed to log document deletion activity:', logErr);
    }

    return apiResponse.success({ success: true, message: 'Document verification record deleted successfully.' });
  } catch (error: any) {
    console.error('DELETE verification error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
