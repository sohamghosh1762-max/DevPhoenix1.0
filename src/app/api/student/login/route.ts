import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { signToken, verifyToken } from '@/lib/jwt';
import { getStudentDashboardData } from '@/lib/student-db';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';

// GET currently logged-in student session
export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      return apiResponse.error('Not authenticated', 'UNAUTHORIZED', null, 401);
    }

    const payload = verifyToken(authCookie.value);
    if (!payload || payload.role !== 'STUDENT') {
      const res = apiResponse.error('Invalid session token', 'UNAUTHORIZED', null, 401);
      res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: -1 });
      return res;
    }

    // Fetch dynamic student portal data from PostgreSQL
    const data = await getStudentDashboardData(payload.studentCode);
    if (!data) {
      const res = apiResponse.notFound('Trainee profile not found');
      res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: -1 });
      return res;
    }

    return apiResponse.success(data);
  } catch (error: any) {
    console.error('Student session GET error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

// POST login request
export async function POST(req: NextRequest) {
  try {
    const { studentCode, password } = await req.json();

    if (!studentCode || !password) {
      return apiResponse.badRequest('Student Code and Password are required', 'MISSING_REQUIRED_FIELDS');
    }

    const trimmedCode = studentCode.trim().toUpperCase();

    // Query trainee profile from PostgreSQL
    const profile = await prisma.studentProfile.findUnique({
      where: { studentCode: trimmedCode },
      include: { user: true }
    });

    if (!profile) {
      return apiResponse.error('Invalid Student Code or Password', 'UNAUTHORIZED', null, 401);
    }

    // Verify hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, profile.user.password);
    if (!passwordMatch) {
      return apiResponse.error('Invalid Student Code or Password', 'UNAUTHORIZED', null, 401);
    }

    // Fetch aggregated dashboard data
    const dashboardData = await getStudentDashboardData(trimmedCode);
    if (!dashboardData) {
      return apiResponse.error('Profile aggregation failed', 'SERVER_ERROR', null, 500);
    }

    // Generate secure JWT token
    const token = signToken({
      studentCode: profile.studentCode,
      id: profile.id,
      role: 'STUDENT'
    });

    const res = apiResponse.success(dashboardData);
    
    // Set secure HttpOnly cookie
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res;
  } catch (error: any) {
    console.error('Student login POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

// DELETE logout request
export async function DELETE() {
  try {
    const res = apiResponse.success({ success: true });
    res.cookies.set(COOKIE_NAME, '', {
      path: '/',
      maxAge: -1,
    });
    return res;
  } catch (error: any) {
    console.error('Student logout DELETE error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
