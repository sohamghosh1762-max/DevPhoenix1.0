import { NextRequest, NextResponse } from 'next/server';
import { studentsService } from '@/services/mongodb/db.service';
import { hasMongoConfig } from '@/services/mongodb/client';
import { apiResponse, getLocalCacheHelper } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'dp-student-auth';
const cache = getLocalCacheHelper<any>('students.json');

// GET currently logged-in student session
export async function GET(req: NextRequest) {
  try {
    const authCookie = req.cookies.get(COOKIE_NAME);
    if (!authCookie || !authCookie.value) {
      return apiResponse.error('Not authenticated', 'UNAUTHORIZED', null, 401);
    }

    const studentCode = authCookie.value;
    let student = null;

    if (hasMongoConfig) {
      try {
        student = await studentsService.getByCode(studentCode);
      } catch (err) {
        console.error('MongoDB student query error, falling back:', err);
      }
    }

    if (!student) {
      const students = cache.read();
      student = students.find((s: any) => s.studentCode.toUpperCase() === studentCode.toUpperCase());
    }

    if (!student) {
      return apiResponse.notFound('Student not found');
    }

    // Return profile without sensitive password field
    const { password, ...profile } = student;
    return apiResponse.success(profile);
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

    let student = null;

    if (hasMongoConfig) {
      try {
        student = await studentsService.getByCode(studentCode);
      } catch (err) {
        console.error('MongoDB student query error, falling back:', err);
      }
    }

    if (!student) {
      const students = cache.read();
      student = students.find(
        (s: any) =>
          s.studentCode.toUpperCase() === studentCode.trim().toUpperCase()
      );
    }

    if (!student || student.password !== password) {
      return apiResponse.error('Invalid Student Code or Password', 'UNAUTHORIZED', null, 401);
    }

    // Set cookie on response
    const { password: _, ...profile } = student;
    const res = apiResponse.success(profile);
    
    res.cookies.set(COOKIE_NAME, student.studentCode, {
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
