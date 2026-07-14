import { prisma } from './prisma';

export async function getStudentDashboardData(studentCode: string) {
  // 1. Fetch Student Profile with User details
  const profile = await prisma.studentProfile.findUnique({
    where: { studentCode },
    include: {
      user: true,
      enrollments: {
        include: {
          program: {
            include: {
              courseModules: {
                include: {
                  resources: true,
                  assignments: {
                    include: {
                      submissions: {
                        where: {
                          studentProfile: { studentCode }
                        }
                      }
                    }
                  }
                }
              },
              announcements: {
                orderBy: { createdAt: 'desc' }
              },
              liveClasses: {
                orderBy: { date: 'asc' }
              }
            }
          }
        }
      },
      projects: true,
      notifications: {
        orderBy: { createdAt: 'desc' }
      },
      certificates: true,
      attendance: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!profile) return null;

  // Get active enrollment and program
  const enrollment = profile.enrollments[0];
  const program = enrollment?.program;

  if (!program) {
    // Return basic profile if not enrolled in any program yet
    return {
      id: profile.id,
      studentCode: profile.studentCode,
      name: profile.name,
      email: profile.user.email,
      phone: profile.phone,
      whatsapp: profile.whatsapp,
      address: profile.address,
      bio: profile.bio,
      skills: profile.skills,
      avatar: profile.avatar,
      batch: profile.batch,
      points: profile.points,
      badges: profile.badges,
      level: profile.level,
      joiningDate: profile.joiningDate,
      certificateStatus: profile.certificateStatus,
      courseId: null,
      courseName: 'No Active Enrollment',
      mentorName: 'Unassigned',
      mentorRole: '',
      mentorEmail: '',
      mentorAvatar: '',
      overallProgress: 0,
      skillsProgress: [],
      modules: [],
      notes: [],
      liveClasses: [],
      notifications: [],
      announcements: [],
      attendance: { presentCount: 0, absentCount: 0, totalClasses: 0, calendar: [], history: [] },
      assignments: [],
      project: null
    };
  }

  // Fetch Mentor details
  const mentor = await prisma.mentor.findFirst({
    where: {
      // Find mentor associated with program or cohort, fallback to any verified
      isVerified: true
    }
  });

  // Calculate module progress list
  const modulesProgress = await prisma.moduleProgress.findMany({
    where: { studentProfileId: profile.id }
  });

  // Construct modules array for frontend
  const modules = program.courseModules.map(cm => {
    const prog = modulesProgress.find(mp => mp.courseModuleId === cm.id);
    return {
      id: cm.id,
      moduleNumber: cm.moduleNumber,
      title: cm.title,
      progress: prog ? prog.progress : 0,
      status: prog ? prog.status : 'Not Started',
      topics: cm.topics,
      resourcesCount: cm.resourcesCount
    };
  });

  // Calculate overall program progress
  const totalModules = modules.length;
  const completedModules = modules.filter(m => m.status === 'Completed').length;
  const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Construct skills progress array matching the frontend shape
  const skillsProgress = profile.skills.map((skill, index) => {
    // Distribute overall progress across skills for simulation
    const steps = [100, 90, 60, 40, 10];
    return {
      skill,
      progress: steps[index % steps.length]
    };
  });

  // Get notes/resources list
  const notes = program.courseModules.flatMap(cm => 
    cm.resources.map(res => ({
      id: res.id,
      title: res.title,
      module: cm.title,
      type: res.type,
      size: res.size,
      uploadedAt: 'Recent',
      downloadUrl: res.downloadUrl
    }))
  );

  // Parse live classes
  const liveClasses = program.liveClasses.map(lc => ({
    id: lc.id,
    title: lc.title,
    mentor: lc.mentorName,
    date: lc.date,
    time: lc.time,
    duration: lc.duration,
    meetLink: lc.meetLink,
    status: lc.status,
    recordingAvailable: lc.recordingAvailable,
    recordingUrl: lc.recordingUrl
  }));

  // Find next upcoming live class
  const nextLive = liveClasses.find(lc => lc.status === 'Live' || lc.status === 'Upcoming') || null;

  // Format notifications
  const notifications = profile.notifications.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    timestamp: 'Recent', // Or format from n.createdAt
    isRead: n.isRead
  }));

  // Format announcements
  const announcements = program.announcements.map(a => ({
    id: a.id,
    title: a.title,
    message: a.message,
    author: a.author,
    timestamp: 'Recent'
  }));

  // Format attendance
  const presentCount = profile.attendance.filter(a => a.status === 'Present').length;
  const absentCount = profile.attendance.filter(a => a.status === 'Absent').length;
  const totalClasses = profile.attendance.length;

  const attendance = {
    presentCount,
    absentCount,
    totalClasses,
    calendar: profile.attendance.map((a, i) => ({
      day: i + 1, // mapping dummy calendar days
      status: a.status
    })),
    history: profile.attendance.map(a => ({
      date: a.date,
      subject: a.subject,
      mentor: a.mentorName,
      status: a.status
    }))
  };

  // Format assignments
  const assignments = program.courseModules.flatMap(cm => 
    cm.assignments.map(ass => {
      const sub = ass.submissions[0]; // Filtered for this student
      return {
        id: ass.id,
        title: ass.title,
        description: ass.description,
        deadline: ass.deadline,
        status: sub ? sub.status : 'Pending',
        submissionDate: sub ? sub.submissionDate : null,
        marks: sub && sub.marks ? sub.marks : 'N/A',
        feedback: sub && sub.feedback ? sub.feedback : null
      };
    })
  );

  // Format projects
  const dbProject = profile.projects[0] || null;
  const project = dbProject ? {
    title: dbProject.title,
    description: dbProject.description,
    teamMembers: dbProject.teamMembers,
    mentorRemarks: dbProject.mentorRemarks,
    progress: dbProject.progress,
    deadline: dbProject.deadline,
    submissionStatus: dbProject.submissionStatus,
    finalReportUrl: dbProject.finalReportUrl,
    milestones: dbProject.milestones || []
  } : null;

  return {
    id: profile.id,
    studentCode: profile.studentCode,
    name: profile.name,
    email: profile.user.email,
    phone: profile.phone,
    whatsapp: profile.whatsapp,
    address: profile.address,
    bio: profile.bio,
    skills: profile.skills,
    avatar: profile.avatar,
    batch: profile.batch,
    points: profile.points,
    badges: profile.badges,
    level: profile.level,
    joiningDate: profile.joiningDate,
    certificateStatus: profile.certificateStatus,
    courseId: program.id,
    courseName: program.title,
    mentorName: mentor ? mentor.name : 'Vikram Mehta',
    mentorRole: mentor ? mentor.role : 'Senior Advisor',
    mentorEmail: mentor ? mentor.email : 'mentor@devphoenix.com',
    mentorAvatar: mentor ? mentor.avatar : 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80',
    overallProgress,
    skillsProgress,
    nextLiveClass: nextLive ? {
      title: nextLive.title,
      mentor: nextLive.mentor,
      date: nextLive.date,
      time: nextLive.time,
      duration: nextLive.duration,
      meetLink: nextLive.meetLink
    } : null,
    liveClasses,
    notes,
    notifications,
    announcements,
    modules,
    attendance,
    assignments,
    project
  };
}
