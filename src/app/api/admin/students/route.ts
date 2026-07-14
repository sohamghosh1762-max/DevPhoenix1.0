import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const studentCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  studentCode: z.string().min(4, 'Student code must be specified'),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  skills: z.array(z.string()).optional().nullable(),
  batch: z.string().optional().nullable(),
  courseId: z.string().min(1, 'Course ID must be specified'),
  certificateStatus: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        user: true,
        enrollments: {
          include: {
            program: true
          }
        }
      },
      orderBy: {
        joiningDate: 'desc'
      }
    });

    // Fallback to local static students if database returns empty
    if (!students || students.length === 0) {
      try {
        const filePath = join(process.cwd(), 'src/data/students.json');
        const fileContent = readFileSync(filePath, 'utf8');
        const staticData = JSON.parse(fileContent);
        if (Array.isArray(staticData)) {
          return apiResponse.success(staticData);
        }
      } catch (err) {
        console.error('Failed to load students.json fallback:', err);
      }
    }

    const formattedStudents = students.map(s => {
      const enrollment = s.enrollments[0];
      return {
        id: s.id,
        userId: s.userId,
        studentCode: s.studentCode,
        name: s.name,
        email: s.user.email,
        phone: s.phone || '',
        whatsapp: s.whatsapp || '',
        address: s.address || '',
        bio: s.bio || '',
        skills: s.skills || [],
        batch: s.batch || '',
        points: s.points,
        badges: s.badges,
        level: s.level,
        joiningDate: s.joiningDate || '',
        certificateStatus: s.certificateStatus || '',
        courseId: enrollment?.programId || '',
        courseName: enrollment?.program?.title || 'No Active Enrollment',
      };
    });

    return apiResponse.success(formattedStudents);
  } catch (error: any) {
    console.error('GET students error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = studentCreateSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { name, email, password, studentCode, phone, whatsapp, address, bio, skills, batch, courseId, certificateStatus } = result.data;
    const trimmedCode = studentCode.trim().toUpperCase();

    // Check if database is configured
    const isDatabaseConfigured = 
      !!process.env.DATABASE_URL && 
      (process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://'));

    if (!isDatabaseConfigured) {
      const filePath = join(process.cwd(), 'src/data/students.json');
      let localStudents: any[] = [];
      try {
        const fileContent = readFileSync(filePath, 'utf8');
        localStudents = JSON.parse(fileContent);
      } catch (err) {
        console.error('Failed to read students.json:', err);
      }

      if (localStudents.some(s => s.email === email || s.studentCode === trimmedCode)) {
        return apiResponse.badRequest('A student with this email or student code already exists', 'USER_ALREADY_EXISTS');
      }

      const newStudent = {
        id: `student-${Date.now()}`,
        userId: `user-${Date.now()}`,
        studentCode: trimmedCode,
        password: password || 'password123',
        name,
        email,
        phone: phone || '',
        whatsapp: whatsapp || phone || '',
        address: address || 'DevPhoenix Workspace, Sector V, Salt Lake, Kolkata',
        bio: bio || 'Trainee at DevPhoenix Academy.',
        skills: skills || [],
        batch: batch || 'Batch 2026',
        points: 10,
        badges: 0,
        level: 1,
        joiningDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
        certificateStatus: certificateStatus || 'Locked (Incomplete Syllabus)',
        courseId: courseId,
        courseName: 'Course Program'
      };

      try {
        const progPath = join(process.cwd(), 'src/data/programs-static.json');
        const progContent = readFileSync(progPath, 'utf8');
        const progs = JSON.parse(progContent);
        const match = progs.find((p: any) => p.id === courseId);
        if (match) {
          newStudent.courseName = match.title;
        }
      } catch (err) {
        console.error('Failed to resolve program name:', err);
      }

      localStudents.push(newStudent);
      const fs = require('fs');
      fs.writeFileSync(filePath, JSON.stringify(localStudents, null, 2), 'utf8');
      return apiResponse.success(newStudent, 201);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { studentProfile: { studentCode: trimmedCode } }]
      }
    });

    if (existingUser) {
      return apiResponse.badRequest('A student with this email or student code already exists', 'USER_ALREADY_EXISTS');
    }

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: courseId },
      include: { courseModules: true }
    });

    if (!program) {
      return apiResponse.badRequest(`Program with ID "${courseId}" does not exist`, 'PROGRAM_NOT_FOUND');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProfile = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      const profile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          studentCode: trimmedCode,
          name,
          phone: phone || null,
          whatsapp: whatsapp || phone || null,
          address: address || 'DevPhoenix Workspace, Sector V, Salt Lake, Kolkata',
          bio: bio || `${program.title} Trainee at DevPhoenix Academy.`,
          skills: skills || [],
          avatar: null,
          batch: batch || 'Batch 2026',
          points: 10,
          badges: 0,
          level: 1,
          joiningDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
          certificateStatus: certificateStatus || 'Locked (Incomplete Syllabus)',
        },
      });

      // Create Enrollment
      await tx.enrollment.create({
        data: {
          studentProfileId: profile.id,
          programId: program.id,
          status: 'ACTIVE',
        },
      });

      // Create initial ModuleProgress records
      for (const mod of program.courseModules) {
        await tx.moduleProgress.create({
          data: {
            studentProfileId: profile.id,
            courseModuleId: mod.id,
            progress: 0,
            status: 'Not Started',
          },
        });
      }

      // Create Project entry
      await tx.project.create({
        data: {
          studentProfileId: profile.id,
          title: 'Capstone Project',
          description: `Industrial implementation project for ${program.title}.`,
          progress: 0,
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().split('T')[0], // 90 days
          submissionStatus: 'Not Submitted',
          milestones: [
            { title: 'Project Proposal & Design Schema', status: 'Pending' },
            { title: 'Database Configuration & API Development', status: 'Pending' },
            { title: 'Frontend Integration & UI Wireframes', status: 'Pending' },
            { title: 'Final Testing & Deployment Report', status: 'Pending' }
          ],
        },
      });

      // Create initial Welcome Notification
      await tx.notification.create({
        data: {
          studentProfileId: profile.id,
          title: 'Welcome to DevPhoenix Academy! 🎉',
          message: `Hello ${name}, welcome to the ${program.title}. Your trainee dashboard is now active.`,
          type: 'class',
        },
      });

      return profile;
    });

    return apiResponse.success(newProfile, 201);
  } catch (error: any) {
    console.error('POST student error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
