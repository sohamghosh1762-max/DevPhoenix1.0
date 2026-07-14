import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records in dependency order
  console.log('Cleaning existing database records...');
  await prisma.studentActivityLog.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.paymentSubmission.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.assignmentSubmission.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.moduleProgress.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.courseModule.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.liveClass.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.adminUser.deleteMany({});
  await prisma.mentor.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Read students.json
  const studentsJsonPath = path.resolve(process.cwd(), 'src/data/students.json');
  if (!fs.existsSync(studentsJsonPath)) {
    throw new Error(`Trainees mock data file not found at: ${studentsJsonPath}`);
  }
  const studentsData = JSON.parse(fs.readFileSync(studentsJsonPath, 'utf8'));

  // 3. Create default Administrator
  console.log('Seeding default administrator...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@devphoenix.com',
      password: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  await prisma.adminUser.create({
    data: {
      email: adminUser.email,
      role: 'super_admin',
      userId: adminUser.id,
    },
  });

  // 3.5. Seed all standard Programs
  console.log('Seeding standard programs...');
  const programsJsonPath = path.resolve(process.cwd(), 'src/data/programs-static.json');
  if (fs.existsSync(programsJsonPath)) {
    const programsData = JSON.parse(fs.readFileSync(programsJsonPath, 'utf8'));
    for (const prog of programsData) {
      await prisma.program.create({
        data: {
          id: prog.id,
          slug: prog.slug,
          title: prog.title,
          description: prog.description,
          category: prog.category,
          level: prog.level,
          duration: prog.duration,
          type: prog.type,
          price: prog.price,
          practicalHours: prog.practicalHours,
          tags: prog.tags || [],
          image: prog.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80',
          outcomes: prog.outcomes || [],
          projectsCount: prog.projects || 0
        }
      });
    }
  }

  // 4. Seed from students.json
  for (const s of studentsData) {
    console.log(`Seeding trainee: ${s.name} (${s.studentCode})...`);

    // Create User record for trainee
    const traineePasswordHash = await bcrypt.hash(s.password, 10);
    const user = await prisma.user.create({
      data: {
        email: s.email,
        password: traineePasswordHash,
        role: 'STUDENT',
      },
    });

    // Extract skills array
    const skillsList = s.skillsProgress ? s.skillsProgress.map((sp: any) => sp.skill) : [];

    // Create StudentProfile
    const profile = await prisma.studentProfile.create({
      data: {
        id: s.id, // Keep the same ID to prevent reference breaking
        userId: user.id,
        studentCode: s.studentCode,
        name: s.name,
        phone: s.phone,
        whatsapp: s.phone, // fallback WhatsApp to phone
        address: 'DevPhoenix Workspace, Sector V, Salt Lake, Kolkata',
        bio: `${s.courseName} Trainee at DevPhoenix Academy. Dedicated to building industrial-grade projects.`,
        skills: skillsList,
        avatar: s.avatar || null,
        batch: s.batch,
        points: s.points,
        badges: s.badges,
        level: s.level,
        joiningDate: s.joiningDate,
        certificateStatus: s.certificateStatus,
      },
    });

    // Create Mentor if doesn't exist
    let mentor = await prisma.mentor.findFirst({
      where: { name: s.mentorName },
    });
    if (!mentor) {
      console.log(`Creating mentor: ${s.mentorName}...`);
      const mentorPasswordHash = await bcrypt.hash('password123', 10);
      const mentorUser = await prisma.user.create({
        data: {
          email: s.mentorEmail || `${s.mentorName.toLowerCase().replace(/\s+/g, '')}@devphoenix.com`,
          password: mentorPasswordHash,
          role: 'MENTOR',
        },
      });
      mentor = await prisma.mentor.create({
        data: {
          name: s.mentorName,
          role: s.mentorRole || 'Industry Mentor',
          email: mentorUser.email,
          avatar: s.mentorAvatar || null,
          status: 'online',
          tags: ['System Architecture', 'Clean Code'],
          isVerified: true,
          followers: 120,
          userId: mentorUser.id,
        },
      });
    }

    // Create Program if doesn't exist
    let program = await prisma.program.findUnique({
      where: { id: s.courseId },
    });
    if (!program) {
      console.log(`Creating program: ${s.courseName}...`);
      program = await prisma.program.create({
        data: {
          id: s.courseId,
          slug: s.courseId,
          title: s.courseName,
          description: `DevPhoenix Premium ${s.courseName} Program. Built for high-growth industrial training.`,
          category: s.courseId.includes('ai') ? 'AI / ML' : 'Full Stack',
          level: 'Intermediate to Advanced',
          duration: '6 Months',
          type: 'Industrial Training',
          price: '₹24,999',
          practicalHours: '120+ Hours',
          image: s.mentorAvatar || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80',
          tags: [s.courseId.includes('ai') ? 'AI' : 'Web', 'DevPhoenix', 'Elite'],
          outcomes: ['Build production applications', 'Receive industrial certification'],
          projectsCount: s.courseId.includes('ai') ? 4 : 3,
        },
      });
    }

    // Create Enrollment
    await prisma.enrollment.create({
      data: {
        studentProfileId: profile.id,
        programId: program.id,
        status: 'ACTIVE',
      },
    });

    // Create Modules, Progress, and Resources
    if (s.modules) {
      for (const m of s.modules) {
        // Find or create module
        let courseModule = await prisma.courseModule.findFirst({
          where: { programId: program.id, moduleNumber: m.moduleNumber },
        });
        if (!courseModule) {
          courseModule = await prisma.courseModule.create({
            data: {
              programId: program.id,
              moduleNumber: m.moduleNumber,
              title: m.title,
              topics: m.topics || [],
              resourcesCount: m.resourcesCount || 0,
            },
          });
        }

        // Create ModuleProgress for student
        await prisma.moduleProgress.create({
          data: {
            studentProfileId: profile.id,
            courseModuleId: courseModule.id,
            progress: m.progress,
            status: m.status,
          },
        });

        // Seed resources matching this module from student's notes
        if (s.notes) {
          const notesForModule = s.notes.filter((n: any) => n.module === m.title);
          for (const note of notesForModule) {
            const existingResource = await prisma.resource.findFirst({
              where: { courseModuleId: courseModule.id, title: note.title },
            });
            if (!existingResource) {
              await prisma.resource.create({
                data: {
                  courseModuleId: courseModule.id,
                  title: note.title,
                  type: note.type || 'pdf',
                  size: note.size || '1.0 MB',
                  downloadUrl: note.downloadUrl || '#',
                },
              });
            }
          }
        }
      }
    }

    // Create Assignments and AssignmentSubmissions
    if (s.assignments) {
      for (const assign of s.assignments) {
        // Map assignments to the second module by default as dummy linkage
        const moduleList = await prisma.courseModule.findMany({
          where: { programId: program.id },
          orderBy: { moduleNumber: 'asc' },
        });
        const targetModule = moduleList[1] || moduleList[0];

        if (targetModule) {
          // Find or create assignment
          let assignment = await prisma.assignment.findFirst({
            where: { courseModuleId: targetModule.id, title: assign.title },
          });
          if (!assignment) {
            assignment = await prisma.assignment.create({
              data: {
                id: assign.id,
                courseModuleId: targetModule.id,
                title: assign.title,
                description: assign.description || 'DevPhoenix standard assessment assignment.',
                deadline: assign.deadline,
              },
            });
          }

          // Create assignment submission
          await prisma.assignmentSubmission.create({
            data: {
              assignmentId: assignment.id,
              studentProfileId: profile.id,
              status: assign.status,
              submissionDate: assign.submissionDate || new Date().toISOString().split('T')[0],
              submittedFile: assign.status === 'Submitted' ? '/uploads/dummy_assignment.pdf' : null,
              marks: assign.marks,
              feedback: assign.feedback,
            },
          });
        }
      }
    }

    // Create Projects
    if (s.project) {
      await prisma.project.create({
        data: {
          studentProfileId: profile.id,
          title: s.project.title,
          description: s.project.description,
          teamMembers: s.project.teamMembers || [],
          mentorRemarks: s.project.mentorRemarks,
          progress: s.project.progress,
          deadline: s.project.deadline,
          submissionStatus: s.project.submissionStatus,
          finalReportUrl: s.project.finalReportUrl,
          milestones: s.project.milestones || [],
        },
      });
    }

    // Create Live Classes
    if (s.liveClasses) {
      for (const lc of s.liveClasses) {
        const existingClass = await prisma.liveClass.findFirst({
          where: { programId: program.id, title: lc.title },
        });
        if (!existingClass) {
          await prisma.liveClass.create({
            data: {
              id: lc.id,
              programId: program.id,
              title: lc.title,
              mentorName: lc.mentor,
              date: lc.date,
              time: lc.time,
              duration: lc.duration,
              meetLink: lc.meetLink,
              status: lc.status,
              recordingAvailable: lc.recordingAvailable || false,
              recordingUrl: lc.recordingUrl || null,
            },
          });
        }
      }
    }

    // Create Announcements
    if (s.announcements) {
      for (const ann of s.announcements) {
        const existingAnn = await prisma.announcement.findFirst({
          where: { programId: program.id, title: ann.title },
        });
        if (!existingAnn) {
          await prisma.announcement.create({
            data: {
              id: ann.id,
              programId: program.id,
              title: ann.title,
              message: ann.message,
              author: ann.author,
              createdAt: new Date(),
            },
          });
        }
      }
    }

    // Create Notifications
    if (s.notifications) {
      for (const notif of s.notifications) {
        await prisma.notification.create({
          data: {
            id: notif.id,
            studentProfileId: profile.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            isRead: notif.isRead,
          },
        });
      }
    }

    // Create Attendance
    if (s.attendance && s.attendance.history) {
      for (const att of s.attendance.history) {
        await prisma.attendance.create({
          data: {
            studentProfileId: profile.id,
            date: att.date,
            subject: att.subject,
            mentorName: att.mentor,
            status: att.status,
          },
        });
      }
    }

    // Log Activity
    await prisma.studentActivityLog.create({
      data: {
        studentProfileId: profile.id,
        action: 'SEEDING_INITIALIZATION',
        details: `Trainee profile successfully synchronized and seeded in PostgreSQL.`,
      },
    });
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
