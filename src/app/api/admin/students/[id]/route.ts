import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const studentUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().optional().nullable(),
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = studentUpdateSchema.safeParse(body);

    if (!result.success) {
      return apiResponse.badRequest(result.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { name, email, password, studentCode, phone, whatsapp, address, bio, skills, batch, courseId, certificateStatus } = result.data;
    const trimmedCode = studentCode.trim().toUpperCase();

    // Check if student exists
    const profile = await prisma.studentProfile.findUnique({
      where: { id },
      include: { user: true, enrollments: true }
    });

    if (!profile) {
      return apiResponse.notFound('Student profile not found');
    }

    // Check if email or student code is taken by another user
    const conflictUser = await prisma.user.findFirst({
      where: {
        id: { not: profile.userId },
        OR: [
          { email },
          { studentProfile: { studentCode: trimmedCode } }
        ]
      }
    });

    if (conflictUser) {
      return apiResponse.badRequest('Another student with this email or student code already exists', 'CONFLICT');
    }

    // Update inside transaction
    const updatedProfile = await prisma.$transaction(async (tx) => {
      // 1. Update User
      const userUpdateData: any = { email };
      if (password && password.trim() !== '') {
        userUpdateData.password = await bcrypt.hash(password, 10);
      }
      await tx.user.update({
        where: { id: profile.userId },
        data: userUpdateData
      });

      // 2. Update Student Profile
      const student = await tx.studentProfile.update({
        where: { id },
        data: {
          studentCode: trimmedCode,
          name,
          phone: phone || null,
          whatsapp: whatsapp || phone || null,
          address: address || null,
          bio: bio || null,
          skills: skills || [],
          batch: batch || null,
          certificateStatus: certificateStatus || null,
        }
      });

      // 3. Update Enrollment if changed
      const oldEnrollment = profile.enrollments[0];
      if (oldEnrollment && oldEnrollment.programId !== courseId) {
        // Delete old enrollment
        await tx.enrollment.delete({
          where: { id: oldEnrollment.id }
        });

        // Delete old progress records
        await tx.moduleProgress.deleteMany({
          where: { studentProfileId: id }
        });

        // Create new enrollment
        await tx.enrollment.create({
          data: {
            studentProfileId: id,
            programId: courseId,
            status: 'ACTIVE'
          }
        });

        // Fetch program modules to seed progress
        const program = await tx.program.findUnique({
          where: { id: courseId },
          include: { courseModules: true }
        });

        if (program) {
          for (const mod of program.courseModules) {
            await tx.moduleProgress.create({
              data: {
                studentProfileId: id,
                courseModuleId: mod.id,
                progress: 0,
                status: 'Not Started'
              }
            });
          }
        }
      } else if (!oldEnrollment) {
        // Create enrollment if missing
        await tx.enrollment.create({
          data: {
            studentProfileId: id,
            programId: courseId,
            status: 'ACTIVE'
          }
        });
      }

      return student;
    });

    return apiResponse.success(updatedProfile);
  } catch (error: any) {
    console.error('PUT student error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const profile = await prisma.studentProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      return apiResponse.notFound('Student profile not found');
    }

    // Delete the parent User record, which will cascade delete the profile and all related models
    await prisma.user.delete({
      where: { id: profile.userId }
    });

    return apiResponse.success({ success: true });
  } catch (error: any) {
    console.error('DELETE student error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
