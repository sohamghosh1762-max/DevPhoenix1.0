import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { isAdminAuthenticated } from '@/lib/admin-auth-helper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate Admin
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return apiResponse.error('Not authenticated as Administrator', 'UNAUTHORIZED', null, 401);
    }

    // 2. Fetch all verification records, ordered by creation date
    const records = await prisma.verification.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return apiResponse.success(records);
  } catch (error: any) {
    console.error('Fetch all verifications error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
