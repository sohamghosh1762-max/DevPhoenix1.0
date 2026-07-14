import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { signToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { email, password } = result.data;

    // Fetch user and profile associations
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        mentorProfile: true,
        adminProfile: true,
      }
    });

    if (!user) {
      return apiResponse.error('Invalid email or password', 'UNAUTHORIZED', null, 401);
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return apiResponse.error('Invalid email or password', 'UNAUTHORIZED', null, 401);
    }

    // Determine target code / profile info
    let profileId = '';
    let targetCode = '';
    
    if (user.role === 'STUDENT' && user.studentProfile) {
      profileId = user.studentProfile.id;
      targetCode = user.studentProfile.studentCode;
    } else if (user.role === 'MENTOR' && user.mentorProfile) {
      profileId = user.mentorProfile.id;
      targetCode = user.mentorProfile.name;
    } else if (user.role === 'ADMIN' && user.adminProfile) {
      profileId = user.adminProfile.id;
      targetCode = 'ADMIN';
    }

    // Sign session token
    const token = signToken({
      studentCode: targetCode,
      id: profileId,
      role: user.role
    });

    return apiResponse.success({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId,
        code: targetCode,
      }
    });
  } catch (error: any) {
    console.error('Unified login POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
