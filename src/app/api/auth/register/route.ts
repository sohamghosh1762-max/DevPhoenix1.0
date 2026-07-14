import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { sendRegistrationConfirmation, sendAdminRegistrationAlert } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  studentCode: z.string().min(4, 'Student code must be specified'),
  phone: z.string().optional(),
  batch: z.string().optional(),
  courseId: z.string().min(1, 'Course ID must be specified'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR', result.error.format());
    }

    const { name, email, password, studentCode, phone, batch, courseId } = result.data;
    const trimmedCode = studentCode.trim().toUpperCase();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { studentProfile: { studentCode: trimmedCode } }]
      }
    });

    if (existingUser) {
      return apiResponse.badRequest('A user with this email or student code already exists', 'USER_ALREADY_EXISTS');
    }

    // Verify program exists
    const program = await prisma.program.findUnique({
      where: { id: courseId },
      include: { courseModules: true }
    });

    if (!program) {
      return apiResponse.badRequest(`Program with ID "${courseId}" does not exist`, 'PROGRAM_NOT_FOUND');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User, Profile, Enrollment, and initial ModuleProgress inside a transaction
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
          phone,
          whatsapp: phone,
          avatar: null,
          batch: batch || 'Batch 2026',
          points: 10, // initial points
          badges: 0,
          level: 1,
          joiningDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
          certificateStatus: 'Locked (Incomplete Syllabus)',
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
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().split('T')[0], // 90 days from now
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

    // Send dispatch emails asynchronously
    sendRegistrationConfirmation(email, name, trimmedCode).catch(err => console.error('Register email fail:', err));
    sendAdminRegistrationAlert(name, trimmedCode, email).catch(err => console.error('Admin register alert fail:', err));

    return apiResponse.success(newProfile, 201);
  } catch (error: any) {
    console.error('Registration POST error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
