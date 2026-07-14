export const runtime = 'nodejs';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { verifyToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

const profileUpdateSchema = z.object({
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

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

    const profile = await prisma.studentProfile.findUnique({
      where: { studentCode: payload.studentCode },
      include: { user: { select: { email: true, role: true } } }
    });

    if (!profile) {
      return apiResponse.notFound('Profile not found');
    }

    return apiResponse.success(profile);
  } catch (error: any) {
    console.error('Profile GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

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
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: { studentCode: payload.studentCode },
      data: result.data
    });

    // Log Activity
    await prisma.studentActivityLog.create({
      data: {
        studentProfileId: updatedProfile.id,
        action: 'PROFILE_UPDATE',
        details: 'Updated profile metadata fields.'
      }
    });

    return apiResponse.success(updatedProfile);
  } catch (error: any) {
    console.error('Profile POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
