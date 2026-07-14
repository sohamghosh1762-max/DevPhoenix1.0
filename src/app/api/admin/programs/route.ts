import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    });
    return apiResponse.success(programs);
  } catch (error: any) {
    console.error('GET admin programs error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
