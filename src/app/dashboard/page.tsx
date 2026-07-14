"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Calendar, Download, Trophy, Bell, ArrowRight, Zap,
  CheckCircle2, Circle, Clock, Terminal, LogOut, Menu, X, Search,
  MessageSquare, User, Settings, Briefcase, Award, Users, ChevronDown,
  ChevronRight, CalendarDays, UploadCloud, AlertCircle, Sparkles, Send,
  FileText, ShieldCheck, Eye
} from 'lucide-react';
import { showToast } from '@/components/ui/PremiumToast';

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Search filter for Notes & Resources
  const [searchQuery, setSearchQuery] = useState('');
  
  // Accordion state for Modules
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  // Assignment upload mock state
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Project upload mock state
  const [projectReportFile, setProjectReportFile] = useState('');
  const [projectSubmitLoading, setProjectSubmitLoading] = useState(false);

  // Priority Support Message state
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Settings change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // Notification search filter state
  const [searchQueryAll, setSearchQueryAll] = useState('');

  // Countdown timer state
  const [countdown, setCountdown] = useState({ hrs: 1, mins: 45, secs: 30 });

  // 1. Check Session & Fetch Data on Mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/student/login?t=' + Date.now(), { cache: 'no-store' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setStudent(json.data);
          
          // Seed initial mentor chat messages
          setMessages([
            { id: 1, sender: 'mentor', text: `Hi ${json.data.name.split(' ')[0]}! Welcome to your priority support channel. How can I help you with the ${json.data.courseName} topics today?`, time: '10:00 AM' }
          ]);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Session verify failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [router]);

  // 2. Countdown Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: prev.mins - 1, secs: 59 };
        } else if (prev.hrs > 0) {
          return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        } else {
          return { hrs: 1, mins: 45, secs: 30 }; // Reset for demo looping
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch student verifications/documents
  const [studentDocuments, setStudentDocuments] = useState<any[]>([]);
  useEffect(() => {
    if (activeSection === 'documents' && student?.id) {
      fetch(`/api/verification/student/${student.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setStudentDocuments(json.data);
          }
        })
        .catch((err) => console.error('Fetch student documents failed:', err));
    }
  }, [activeSection, student?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <FlameSpinnerGlow />
        </div>
        <p className="text-slate-500 font-bold text-sm mt-4 tracking-wider animate-pulse">PROVISIONING WORKSPACE...</p>
      </div>
    );
  }

  if (!student) return null;

  // Helpers for mutation actions
  const handleUpdate = async (action: string, payload: any) => {
    try {
      const res = await fetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStudent(json.data);
        return true;
      } else {
        showToast(json.error?.message || 'Action failed', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Network connection failed', 'error');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/student/login', { method: 'DELETE' });
      localStorage.removeItem('dp-student-code');
      showToast('Logged out successfully', 'success');
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Sub-action handlers
  const markNotificationRead = async (id: string) => {
    await handleUpdate('mark_notification_read', { notificationId: id });
  };

  const markAllNotificationsRead = async () => {
    const success = await handleUpdate('mark_all_notifications_read', {});
    if (success) {
      showToast('All notifications marked as read', 'success');
    }
  };

  const handleAssignmentSubmit = async (assignmentId: string) => {
    if (!uploadedFileName.trim()) {
      showToast('Please enter a file name or upload details', 'error');
      return;
    }
    setUploadingAssignmentId(assignmentId);
    
    // Simulate API request delay
    setTimeout(async () => {
      const success = await handleUpdate('submit_assignment', { assignmentId, fileName: uploadedFileName });
      setUploadingAssignmentId(null);
      setUploadedFileName('');
      if (success) {
        showToast('Assignment submitted successfully!', 'success');
      }
    }, 1000);
  };

  const handleProjectReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectReportFile.trim()) {
      showToast('Please select a report file name', 'error');
      return;
    }
    setProjectSubmitLoading(true);
    setTimeout(async () => {
      const success = await handleUpdate('submit_project_report', { fileName: projectReportFile });
      setProjectSubmitLoading(false);
      setProjectReportFile('');
      if (success) {
        showToast('Final project report submitted successfully!', 'success');
      }
    }, 1200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'student',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage('');

    // Simulate mentor automated response for demo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'mentor',
          text: `Got it! I will review your query regarding that and get back to you shortly. Feel free to prepare for our class tonight.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setPasswordChangeLoading(true);
    const success = await handleUpdate('change_password', { currentPassword, newPassword });
    setPasswordChangeLoading(false);

    if (success) {
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // Filter notes based on search query
  const filteredNotes = student.notes.filter((n: any) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group notifications counts
  const unreadNotifications = student.notifications.filter((n: any) => !n.isRead);

  // Formatting helper for calendar days
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex font-sans antialiased selection:bg-orange-100 selection:text-orange-900">
      
      {/* ==================== LEFT SIDEBAR ==================== */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Logo */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <LinkToHome className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F] flex items-center justify-center shadow-md shadow-orange-500/20">
              <FlameIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">DEVPHOENIX</span>
              <p className="text-[9px] font-black tracking-widest text-[#FF5A1F] uppercase -mt-0.5">ACADEMY</p>
            </div>
          </LinkToHome>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container for Sidebar Elements */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 flex flex-col justify-between">
          <div>
            {/* Sidebar Navigation */}
            <nav className="py-4 px-3 space-y-1">
              <SidebarTab active={activeSection === 'dashboard'} label="Dashboard" icon={Zap} onClick={() => { setActiveSection('dashboard'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'modules'} label="My Course" icon={BookOpen} onClick={() => { setActiveSection('modules'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'live-classes'} label="Live Classes" icon={Calendar} onClick={() => { setActiveSection('live-classes'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'notes-resources'} label="Notes & Resources" icon={FileText} onClick={() => { setActiveSection('notes-resources'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'assignments'} label="Assignments" icon={Briefcase} onClick={() => { setActiveSection('assignments'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'attendance'} label="Attendance" icon={CalendarDays} onClick={() => { setActiveSection('attendance'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'projects'} label="Projects" icon={Award} onClick={() => { setActiveSection('projects'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'documents'} label="Documents" icon={ShieldCheck} onClick={() => { setActiveSection('documents'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'notifications'} label="Notifications" icon={Bell} badge={unreadNotifications.length} onClick={() => { setActiveSection('notifications'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'messages'} label="Messages" icon={MessageSquare} badge={1} onClick={() => { setActiveSection('messages'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'my-profile'} label="My Profile" icon={User} onClick={() => { setActiveSection('my-profile'); setSidebarOpen(false); }} />
              <SidebarTab active={activeSection === 'settings'} label="Settings" icon={Settings} onClick={() => { setActiveSection('settings'); setSidebarOpen(false); }} />
            </nav>

            {/* Sidebar Upgrade Block */}
            <div className="p-4 border-t border-slate-800">
              <div className="bg-gradient-to-br from-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 text-center relative overflow-hidden shadow-md shadow-black/10">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <h4 className="text-xs font-extrabold text-white">Upgrade Your Skills</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Unlock advanced modules, exclusive workshops & more.</p>
                <button
                  onClick={() => showToast('Advanced modules are coming soon!', 'success')}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white text-[10px] font-black rounded-lg uppercase tracking-wider transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Logout */}
          <div className="p-4 border-t border-slate-800 mt-auto flex items-center justify-between text-slate-400 text-xs shrink-0">
            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-white font-bold transition-colors cursor-pointer">
              <LogOut className="w-4 h-4 text-orange-500" /> Logout Workspace
            </button>
            <span className="text-[9px] font-bold text-slate-600 uppercase">v1.2.6</span>
          </div>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT WRAPPER ==================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* ==================== TOP NAVIGATION BAR ==================== */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Header Greeting */}
            <div>
              <h1 className="text-lg font-black text-slate-900 flex items-center gap-1.5 leading-none">
                Welcome back, {student.name.split(' ')[0]} 👋
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wide">{student.courseName}</p>
            </div>
          </div>

          {/* Search bar & notification tools */}
          <div className="flex items-center gap-4">
            {/* Header Search Box */}
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search for notes, classes, assignments..."
                value={searchQueryAll}
                onChange={(e) => setSearchQueryAll(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchQueryAll.trim()) {
                      setSearchQuery(searchQueryAll);
                      setActiveSection('notes-resources');
                      showToast(`Filtered resources for: "${searchQueryAll}"`, 'success');
                    }
                  }
                }}
                className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50/50 outline-none transition-all"
              />
              <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded text-[9px] font-bold text-slate-500 select-none shadow-sm">&#8984; K</kbd>
            </div>

            {/* Quick Access Utility Icons */}
            <div className="flex items-center gap-1">
              {/* Calendar Days shortcut */}
              <HeaderIcon icon={CalendarDays} onClick={() => setActiveSection('attendance')} tooltip="Attendance Tracker" />
              
              {/* Messages notification shortcut */}
              <HeaderIcon icon={MessageSquare} count={1} onClick={() => setActiveSection('messages')} tooltip="Direct Messages" />

              {/* Notification bell shortcut */}
              <HeaderIcon icon={Bell} count={unreadNotifications.length} onClick={() => setActiveSection('notifications')} tooltip="Notification Hub" />
            </div>

            {/* User Dropdown Profile Info */}
            <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
              <img
                src={student.profilePic || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"}
                alt={student.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-50"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-slate-800 leading-none">{student.name}</p>
                <span className="text-[10px] text-slate-400 font-bold leading-none">Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* ==================== MAIN DASHBOARD LAYOUTS ==================== */}
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-32 space-y-8">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* -------------------- 1. DASHBOARD VIEW -------------------- */}
              {activeSection === 'dashboard' && (
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left content row: next class, announcements, modules, progress */}
                  <div className="lg:col-span-8 space-y-8">
                    
                    {/* Upper row: Next live class & announcements */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Next Live Class Card */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 fill-current" /> Live
                            </span>
                            <span className="text-xs text-slate-400 font-bold">Upcoming Cohort Class</span>
                          </div>
                          
                          <h3 className="text-lg font-black text-slate-900 leading-tight">
                            {student.nextLiveClass.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-semibold mt-1">Mentor: {student.nextLiveClass.mentor}</p>
                          
                          <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="font-medium">{student.nextLiveClass.date}, {student.nextLiveClass.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Terminal className="w-4 h-4 text-slate-400" />
                              <span className="font-mono text-slate-500 text-[11px] underline select-all break-all">{student.nextLiveClass.meetLink}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-50 pt-4">
                          <div className="flex -space-x-2">
                            <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="std1" />
                            <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="std2" />
                            <img className="w-6 h-6 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="std3" />
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500">+28</div>
                          </div>
                          <a
                            href={student.nextLiveClass.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-orange-500/10 cursor-pointer"
                          >
                            Join Class <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Announcements Card */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
                          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Announcements</h3>
                          <button onClick={() => showToast('Showing announcements logs', 'success')} className="text-xs text-orange-500 hover:text-orange-600 font-bold">View All</button>
                        </div>
                        
                        <div className="space-y-4">
                          {student.announcements.slice(0, 3).map((ann: any) => (
                            <div key={ann.id} className="flex items-start gap-3 group">
                              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100/50">
                                <Sparkles className="w-4 h-4 text-orange-500" />
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{ann.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">By {ann.author} &bull; {ann.timestamp}</p>
                              </div>
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Horizontal Modules List */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                      <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Training Modules Progress</h3>
                        <button onClick={() => setActiveSection('modules')} className="text-xs text-orange-500 hover:text-orange-600 font-bold">View All Modules</button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {student.modules.map((mod: any) => (
                          <div
                            key={mod.id}
                            onClick={() => {
                              setExpandedModule(mod.id);
                              setActiveSection('modules');
                            }}
                            className="bg-[#FAFAFA] hover:bg-orange-50/20 border border-slate-100 hover:border-orange-100/40 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col justify-between"
                          >
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{mod.moduleNumber}</span>
                            <div className="my-3">
                              <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug">{mod.title}</h4>
                            </div>
                            <div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1.5">
                                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${mod.progress}%` }} />
                              </div>
                              <span className={`text-[9px] font-bold ${mod.status === 'Completed' ? 'text-green-600' : mod.status === 'In Progress' ? 'text-orange-500' : 'text-slate-400'}`}>
                                {mod.progress}% {mod.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress details & Quick Links */}
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Overall Progress ring chart */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between gap-6">
                        <div className="space-y-4">
                          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">My Progress</h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                              <span className="text-slate-600 font-medium">Completed: <b>{student.completedModulesCount || 26} Modules</b></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                              <span className="text-slate-600 font-medium">In Progress: <b>{student.inProgressModulesCount || 12} Modules</b></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
                              <span className="text-slate-600 font-medium">Pending: <b>{student.pendingModulesCount || 8} Modules</b></span>
                            </div>
                          </div>
                          <button onClick={() => setActiveSection('modules')} className="text-xs px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer">
                            View Full Progress
                          </button>
                        </div>

                        {/* Circular ring chart */}
                        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="56" cy="56" r="46" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
                            <circle cx="56" cy="56" r="46" className="stroke-orange-500" strokeWidth="8" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 46}
                                    strokeDashoffset={2 * Math.PI * 46 * (1 - student.overallProgress / 100)}
                                    strokeLinecap="round" />
                          </svg>
                          <div className="absolute text-center">
                            <p className="text-lg font-black text-slate-900 leading-none">{student.overallProgress}%</p>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Finished</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Access panel grid */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Quick Access</h3>
                        <div className="grid grid-cols-4 gap-3">
                          <QuickLink icon={Calendar} label="Classes" onClick={() => setActiveSection('live-classes')} />
                          <QuickLink icon={FileText} label="Notes" onClick={() => setActiveSection('notes-resources')} />
                          <QuickLink icon={Briefcase} label="Tasks" onClick={() => setActiveSection('assignments')} />
                          <QuickLink icon={Award} label="Projects" onClick={() => setActiveSection('projects')} />
                          <QuickLink icon={User} label="Support" onClick={() => setActiveSection('messages')} />
                          <QuickLink icon={CalendarDays} label="Attendance" onClick={() => setActiveSection('attendance')} />
                          <QuickLink icon={Bell} label="Notifs" onClick={() => setActiveSection('notifications')} />
                          <QuickLink icon={MessageSquare} label="Chats" onClick={() => setActiveSection('messages')} />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Trainee profile widget, Notification lists, and Countdown timers */}
                  <div className="lg:col-span-4 space-y-8">
                    
                    {/* User profile card (orange level card mockup) */}
                    <div className="bg-gradient-to-br from-orange-400 to-[#FF5A1F] rounded-3xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                      
                      <div className="flex items-center gap-4 mb-5">
                        <img
                          src={student.profilePic || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"}
                          alt={student.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20"
                        />
                        <div className="text-left">
                          <h4 className="text-base font-black tracking-tight">{student.name}</h4>
                          <span className="text-[10px] font-extrabold bg-white/20 border border-white/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                            Level {student.level}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center bg-black/10 backdrop-blur-sm rounded-2xl p-3 mb-4">
                        <div>
                          <p className="text-base font-black leading-none">{student.points}</p>
                          <span className="text-[9px] font-bold text-orange-200 uppercase mt-1 inline-block">Points</span>
                        </div>
                        <div className="border-x border-white/10">
                          <p className="text-base font-black leading-none">{student.badges}</p>
                          <span className="text-[9px] font-bold text-orange-200 uppercase mt-1 inline-block">Badges</span>
                        </div>
                        <div>
                          <p className="text-base font-black leading-none">{student.certificatesCount}</p>
                          <span className="text-[9px] font-bold text-orange-200 uppercase mt-1 inline-block">Certs</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-orange-100 mb-1.5">
                          <span>Keep Learning! 🔥</span>
                          <span>Next Level: {student.nextLevelPoints} Points</span>
                        </div>
                        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                          <div className="bg-white h-full rounded-full" style={{ width: `${(student.points / student.nextLevelPoints) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Notifications card preview */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          Recent Alerts
                        </h3>
                        <button onClick={() => setActiveSection('notifications')} className="text-xs text-orange-500 hover:text-orange-600 font-bold">View All</button>
                      </div>

                      <div className="space-y-4 text-xs">
                        {student.notifications.slice(0, 4).map((notif: any) => (
                          <div key={notif.id} className="flex gap-3 text-left relative group">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${notif.isRead ? 'bg-slate-200' : 'bg-orange-500'}`} />
                            <div className="flex-1">
                              <p className={`font-semibold ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>{notif.title}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{notif.message}</p>
                            </div>
                            <span className="text-[9px] text-slate-400 shrink-0 font-medium">{notif.timestamp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live countdown timer card */}
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Next Session Starts In</h3>
                        <button onClick={() => setActiveSection('live-classes')} className="text-xs text-orange-500 hover:text-orange-600 font-bold">View Schedule</button>
                      </div>

                      <div className="bg-slate-550/10 p-5 rounded-2xl border border-slate-100 text-center">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 leading-none">Machine Learning Fundamentals</p>
                        
                        {/* Digit panels */}
                        <div className="flex justify-center items-center gap-3">
                          <CountdownSegment value={countdown.hrs} label="HRS" />
                          <span className="text-xl font-bold text-orange-500">:</span>
                          <CountdownSegment value={countdown.mins} label="MINS" />
                          <span className="text-xl font-bold text-orange-500">:</span>
                          <CountdownSegment value={countdown.secs} label="SECS" />
                        </div>
                      </div>

                      <a
                        href={student.nextLiveClass.meetLink}
                        target="_blank"
                        className="w-full py-3 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white rounded-xl text-xs font-black text-center block uppercase tracking-wider cursor-pointer"
                      >
                        Join Class Workspace
                      </a>
                    </div>

                  </div>

                  {/* Help Desk Footer Banner */}
                  <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div>
                      <h4 className="font-extrabold text-base">Need mentor assistance?</h4>
                      <p className="text-xs text-slate-400 mt-1">Connect with your coordinator directly for any workspace provisioning delays.</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button onClick={() => setActiveSection('messages')} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Contact Mentor
                      </button>
                      <button onClick={() => setActiveSection('modules')} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                        Explore Syllabus
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* -------------------- 2. MODULES VIEW -------------------- */}
              {activeSection === 'modules' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">My Curriculum Workspace</h2>
                      <p className="text-slate-500 text-sm mt-1">Track your progress and access unit-wise syllabus content details.</p>
                    </div>
                    <div className="px-4 py-2 bg-green-50 border border-green-100 rounded-2xl text-green-700 font-bold text-xs">
                      {student.overallProgress}% Completed
                    </div>
                  </div>

                  {/* Main Progress Indicator */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between text-xs font-extrabold text-slate-600 mb-2">
                      <span>Course Progress Tracker</span>
                      <span>{student.overallProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-[#FF5A1F] h-full rounded-full" style={{ width: `${student.overallProgress}%` }} />
                    </div>
                  </div>

                  {/* Modules Accordion */}
                  <div className="space-y-4">
                    {student.modules.map((mod: any) => {
                      const isExpanded = expandedModule === mod.id;
                      return (
                        <div key={mod.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                          <button
                            onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                          >
                            <div className="flex items-center gap-4">
                              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${mod.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : mod.status === 'In Progress' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                {mod.moduleNumber}
                              </span>
                              <div>
                                <h3 className="font-extrabold text-base text-slate-900 leading-tight">{mod.title}</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">{mod.topics.length} core topics covered &bull; {mod.resourcesCount} resources</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${mod.status === 'Completed' ? 'bg-green-50 text-green-700' : mod.status === 'In Progress' ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-500'}`}>
                                {mod.progress}% {mod.status}
                              </span>
                              {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-6 pt-2 border-t border-slate-50 space-y-4 text-left">
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">Syllabus Covered</h4>
                                <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                                  {mod.topics.map((t: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${mod.status === 'Completed' ? 'text-green-500' : mod.status === 'In Progress' ? 'text-orange-500' : 'text-slate-300'}`} />
                                      <span className="font-medium">{t}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500">{mod.resourcesCount} resources uploaded</span>
                                <button
                                  onClick={() => {
                                    setSearchQuery(mod.title);
                                    setActiveSection('notes-resources');
                                    showToast(`Showing files for ${mod.title}`, 'success');
                                  }}
                                  className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 cursor-pointer"
                                >
                                  View Notes & Resources &rarr;
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* -------------------- 3. LIVE CLASSES VIEW -------------------- */}
              {activeSection === 'live-classes' && (
                <div className="space-y-8">
                  <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Live Classes Hub</h2>
                    <p className="text-slate-500 text-sm mt-1">Access scheduled cohort meetings and review uploaded previous recordings.</p>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Upcoming schedule */}
                    <div className="lg:col-span-7 space-y-6">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider text-left">Class Schedule</h3>
                      
                      <div className="space-y-4">
                        {student.liveClasses.filter((c: any) => c.status !== 'Completed').map((cls: any) => (
                          <div key={cls.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                            <div className="text-left">
                              <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-2.5 ${cls.status === 'Live' ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-orange-50 text-orange-600'}`}>
                                {cls.status}
                              </span>
                              <h4 className="text-base font-black text-slate-900 leading-tight">{cls.title}</h4>
                              <p className="text-xs text-slate-400 mt-1 font-bold">Mentor: {cls.mentor} &bull; Duration: {cls.duration}</p>
                              
                              <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 font-semibold">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  <span>{cls.date} ({cls.time})</span>
                                </div>
                              </div>
                            </div>

                            <a
                              href={cls.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-5 py-3 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/10 cursor-pointer shrink-0 w-full sm:w-auto"
                            >
                              Join Google Meet <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Previous recordings */}
                    <div className="lg:col-span-5 space-y-6">
                      <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider text-left">Previous Session Recordings</h3>
                      
                      <div className="grid gap-4">
                        {student.liveClasses.filter((c: any) => c.status === 'Completed').map((rec: any) => (
                          <div key={rec.id} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm text-left flex items-center justify-between gap-4">
                            <div className="min-w-0">
                              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2">Recording Available</span>
                              <h4 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">{rec.title}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">Conducted on {rec.date} &bull; Mentor: {rec.mentor}</p>
                            </div>

                            {rec.recordingAvailable && rec.recordingUrl ? (
                              <a
                                href={rec.recordingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-slate-100 hover:bg-orange-50 border border-slate-100 hover:border-orange-100 text-slate-600 hover:text-orange-600 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all"
                              >
                                Watch <ArrowRight className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Processing</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* -------------------- 4. NOTES & RESOURCES VIEW -------------------- */}
              {activeSection === 'notes-resources' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">Notes & Resources</h2>
                      <p className="text-slate-500 text-sm mt-1">Download slide decks, datasets, notes, and starters uploaded by mentors.</p>
                    </div>

                    {/* Category Search box */}
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search notes or modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-200 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Recently Uploaded Quick Panel */}
                  {searchQuery === '' && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider text-left">Recently Uploaded Resources</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        {student.notes.slice(0, 3).map((res: any) => (
                          <div key={res.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-left flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                              <span className="inline-block px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[9px] font-bold uppercase tracking-wider mb-2">{res.type}</span>
                              <h4 className="text-xs font-extrabold text-slate-900 leading-tight line-clamp-2">{res.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1 line-clamp-1">{res.module}</p>
                            </div>
                            <div className="flex justify-between items-center mt-4 border-t border-slate-50 pt-3">
                              <span className="text-[10px] text-slate-400 font-bold">{res.size} &bull; {res.uploadedAt}</span>
                              <button
                                onClick={() => showToast(`Initiating download: ${res.title}`, 'success')}
                                className="p-1.5 rounded bg-slate-50 border border-slate-100 hover:bg-orange-50 text-slate-500 hover:text-orange-500 transition-colors cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* General resources table */}
                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 text-left">
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">All Training Materials</h3>
                    </div>

                    {filteredNotes.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                              <th className="p-4 pl-6 uppercase">Resource Title</th>
                              <th className="p-4 uppercase">Module</th>
                              <th className="p-4 uppercase">Format</th>
                              <th className="p-4 uppercase">File Size</th>
                              <th className="p-4 pr-6 text-right uppercase">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {filteredNotes.map((note: any) => (
                              <tr key={note.id} className="hover:bg-slate-50/50">
                                <td className="p-4 pl-6 font-extrabold text-slate-900">{note.title}</td>
                                <td className="p-4 font-semibold text-slate-500">{note.module}</td>
                                <td className="p-4">
                                  <span className="px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200/50 text-[10px] font-bold uppercase text-slate-600">
                                    {note.type}
                                  </span>
                                </td>
                                <td className="p-4 font-medium text-slate-400">{note.size}</td>
                                <td className="p-4 pr-6 text-right">
                                  <button
                                    onClick={() => showToast(`Downloading resource: ${note.title}...`, 'success')}
                                    className="px-3.5 py-2 bg-slate-100 hover:bg-orange-50 border border-slate-100 hover:border-orange-100 text-slate-600 hover:text-orange-600 font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    <Download className="w-3.5 h-3.5" /> Download
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-12 text-center text-slate-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold">No resource files matched your query.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* -------------------- 5. ASSIGNMENTS VIEW -------------------- */}
              {activeSection === 'assignments' && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Assignment Portfolio</h2>
                    <p className="text-slate-500 text-sm mt-1">Submit your deliverables, view mentor grades, and read detailed feedback logs.</p>
                  </div>

                  {/* Summary statistics cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatBox count={student.assignments.length} label="Total Assigned" color="blue" />
                    <StatBox count={student.assignments.filter((a: any) => a.status === 'Submitted').length} label="Submitted" color="green" />
                    <StatBox count={student.assignments.filter((a: any) => a.status === 'Pending').length} label="Pending Tasks" color="orange" />
                    <StatBox count={student.assignmentsSubmittedCount} label="Evaluation Count" color="purple" />
                  </div>

                  {/* Assignments List */}
                  <div className="space-y-6">
                    {student.assignments.map((assign: any) => (
                      <div key={assign.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start text-left">
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${assign.status === 'Submitted' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700 animate-pulse'}`}>
                              {assign.status}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">Due: {assign.deadline}</span>
                          </div>
                          
                          <h3 className="font-extrabold text-base text-slate-900 leading-tight">{assign.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">{assign.description}</p>
                          
                          {/* Marks & Feedback */}
                          {assign.status === 'Submitted' && (
                            <div className="p-4 bg-[#FAFAFA] rounded-2xl border border-slate-100 flex gap-3 items-start">
                              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <p className="font-bold text-slate-800">Grade Score: <span className="text-orange-500 font-extrabold bg-orange-50 px-2 py-0.5 rounded">{assign.marks}</span></p>
                                {assign.feedback && <p className="text-slate-500 mt-1 leading-relaxed">{assign.feedback}</p>}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Submission Portal Upload */}
                        {assign.status === 'Pending' && (
                          <div className="w-full md:w-80 shrink-0 bg-[#F9FAFC] border border-dashed border-slate-200 hover:border-orange-200 rounded-2xl p-4 transition-all">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1"><UploadCloud className="w-4 h-4 text-orange-500" /> Submit Assignment</h4>
                            
                            <input
                              type="text"
                              placeholder="Type upload-file.zip name..."
                              value={uploadingAssignmentId === assign.id ? uploadedFileName : (uploadingAssignmentId ? '' : uploadedFileName)}
                              onChange={(e) => {
                                if (!uploadingAssignmentId) {
                                  setUploadedFileName(e.target.value);
                                }
                              }}
                              disabled={uploadingAssignmentId === assign.id}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-300 placeholder-slate-400 transition-all mb-2.5"
                            />
                            
                            <button
                              onClick={() => handleAssignmentSubmit(assign.id)}
                              disabled={uploadingAssignmentId === assign.id}
                              className="w-full py-2 bg-slate-900 hover:bg-orange-500 hover:text-white text-white text-[10px] uppercase font-black tracking-widest rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                            >
                              {uploadingAssignmentId === assign.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                'Upload ZIP Deliverable'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------- 6. ATTENDANCE VIEW -------------------- */}
              {activeSection === 'attendance' && (
                <div className="space-y-8 max-w-4xl mx-auto">
                  <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Attendance Logs</h2>
                    <p className="text-slate-500 text-sm mt-1">Attendance percentage is updated by your mentor immediately after every Google Meet class session.</p>
                  </div>

                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Monthly Calendar */}
                    <div className="md:col-span-8 space-y-6">
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-6">
                          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Attendance Calendar (July 2026)</h3>
                          <div className="flex items-center gap-3 text-[10px] font-bold">
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Present</span>
                            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Absent</span>
                          </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2.5 text-center text-xs">
                          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
                            <div key={d} className="font-bold text-slate-400 py-1.5">{d}</div>
                          ))}
                          
                          {/* Blank days representing calendar offset */}
                          <div className="py-2.5 text-slate-300">29</div>
                          <div className="py-2.5 text-slate-300">30</div>

                          {calendarDays.map((d) => {
                            const marker = student.attendance.calendar.find((x: any) => x.day === d);
                            return (
                              <div
                                key={d}
                                className={`py-2 rounded-xl border flex flex-col items-center justify-between font-bold h-12 ${
                                  marker?.status === 'Present' ? 'bg-green-50/50 border-green-200 text-green-700' :
                                  marker?.status === 'Absent' ? 'bg-red-50/50 border-red-200 text-red-700' :
                                  'bg-slate-50/20 border-slate-100 text-slate-400'
                                }`}
                              >
                                <span>{d}</span>
                                {marker && <span className={`w-1.5 h-1.5 rounded-full ${marker.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Statistics & Attendance logs table */}
                    <div className="md:col-span-4 space-y-6">
                      
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4 leading-none">Attendance Ratio</h3>
                        <p className="text-4xl font-black text-orange-500 leading-none">{student.attendancePercentage}%</p>
                        
                        <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                          <div className="bg-green-50/50 border border-green-100 rounded-2xl p-3">
                            <p className="text-lg font-black text-green-700 leading-none">{student.attendance.presentCount}</p>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 inline-block">Sessions Present</span>
                          </div>
                          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-3">
                            <p className="text-lg font-black text-red-700 leading-none">{student.attendance.absentCount}</p>
                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 inline-block">Sessions Absent</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* History table */}
                    <div className="md:col-span-12">
                      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-50 text-left">
                          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Attendance Session Log</h3>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                <th className="p-4 pl-6 uppercase">Session Date</th>
                                <th className="p-4 uppercase">Subject / Lecture</th>
                                <th className="p-4 uppercase">Mentor Instructor</th>
                                <th className="p-4 pr-6 text-right uppercase">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {student.attendance.history.map((record: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-4 pl-6 font-semibold text-slate-500">{record.date}</td>
                                  <td className="p-4 font-extrabold text-slate-900">{record.subject}</td>
                                  <td className="p-4 font-semibold text-slate-500">{record.mentor}</td>
                                  <td className="p-4 pr-6 text-right">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${record.status === 'Present' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                      {record.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* -------------------- 7. PROJECTS VIEW -------------------- */}
              {activeSection === 'projects' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Project Workspace</h2>
                    <p className="text-slate-500 text-sm mt-1">Submit team report credentials and track stages milestones from initiation to deployment.</p>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Project detail */}
                    <div className="lg:col-span-7 space-y-6">
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{student.project.title}</h3>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                            student.project.submissionStatus === 'Approved' ? 'bg-green-50 text-green-700' :
                            student.project.submissionStatus === 'Under Review' ? 'bg-blue-50 text-blue-700 animate-pulse' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {student.project.submissionStatus}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">{student.project.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-600">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned Team Members</p>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>{student.project.teamMembers.join(', ')}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Final Submission Deadline</p>
                            <span>{student.project.deadline}</span>
                          </div>
                        </div>

                        {student.project.mentorRemarks && (
                          <div className="p-4 bg-orange-50/30 border border-orange-100/50 rounded-2xl text-xs text-left">
                            <p className="font-bold text-orange-700">Mentor Remarks:</p>
                            <p className="text-slate-600 mt-1 italic font-medium">"{student.project.mentorRemarks}"</p>
                          </div>
                        )}
                      </div>

                      {/* Project report file submission */}
                      {student.project.submissionStatus !== 'Approved' && (
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
                          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4">Submit Industrial Project Report</h3>
                          
                          <form onSubmit={handleProjectReportSubmit} className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Report File Name</label>
                              <div className="relative">
                                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                                <input
                                  type="text"
                                  placeholder="e.g. devphoenix_ai_agent_report.pdf"
                                  value={projectReportFile}
                                  onChange={(e) => setProjectReportFile(e.target.value)}
                                  disabled={projectSubmitLoading}
                                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-400 rounded-xl text-xs outline-none placeholder-slate-400 focus:ring-4 focus:ring-orange-50 transition-all"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={projectSubmitLoading}
                              className="w-full py-3 bg-slate-900 hover:bg-orange-500 hover:text-white text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
                            >
                              {projectSubmitLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                'Submit Final Report'
                              )}
                            </button>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Right: Milestone Timeline */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-6">
                          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Milestones Tracker</h3>
                          <span className="text-xs font-extrabold text-orange-500">{student.project.progress}% Complete</span>
                        </div>

                        {/* Timeline */}
                        <div className="relative border-l border-slate-100 pl-6 ml-3 space-y-6 py-2 text-xs">
                          {student.project.milestones.map((m: any) => (
                            <div key={m.id} className="relative">
                              {/* Circle icon */}
                              <div className="absolute -left-[33px] top-0.5">
                                {m.status === 'completed' && (
                                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {m.status === 'active' && (
                                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center animate-pulse shadow-md">
                                    <Clock className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                {m.status === 'upcoming' && (
                                  <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                                    <Circle className="w-3 h-3 fill-current text-slate-200" />
                                  </div>
                                )}
                              </div>

                              <div>
                                <h4 className={`font-black ${m.status === 'active' ? 'text-orange-600' : m.status === 'completed' ? 'text-slate-800' : 'text-slate-400'}`}>
                                  {m.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-relaxed">{m.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* -------------------- 8. NOTIFICATIONS VIEW -------------------- */}
              {activeSection === 'notifications' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-left">
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">Notification Center</h2>
                      <p className="text-slate-500 text-sm mt-1">Review alerts, class schedule reminders, and mentor responses.</p>
                    </div>

                    <button
                      onClick={markAllNotificationsRead}
                      className="px-4 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF5A1F] text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      Mark All as Read
                    </button>
                  </div>

                  {/* Notifications Feed */}
                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm divide-y divide-slate-100">
                    {student.notifications.map((notif: any) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead) markNotificationRead(notif.id);
                        }}
                        className={`p-6 text-left flex gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors ${notif.isRead ? 'opacity-70' : 'bg-orange-50/5'}`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-2.5 ${notif.isRead ? 'bg-slate-200' : 'bg-orange-500 animate-pulse'}`} />
                        
                        <div className="flex-1 space-y-1">
                          <h4 className={`text-sm font-extrabold ${notif.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notif.title}</h4>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{notif.timestamp}</p>
                        </div>

                        {!notif.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markNotificationRead(notif.id);
                            }}
                            className="text-[10px] font-bold text-orange-500 hover:text-orange-600 px-3 py-1.5 rounded-lg border border-orange-100 hover:border-orange-200/50 bg-white shadow-sm shrink-0"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------- 9. MESSAGES VIEW -------------------- */}
              {activeSection === 'messages' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Priority Support Chat</h2>
                    <p className="text-slate-500 text-sm mt-1">Direct message channel to your assigned mentor coordinator.</p>
                  </div>

                  {/* Chat Box layout */}
                  <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm h-[500px] flex flex-col">
                    
                    {/* Header info */}
                    <div className="p-4 border-b border-slate-100 bg-[#FAFAFA] flex items-center gap-3 text-left">
                      <img
                        src={student.mentorAvatar}
                        alt={student.mentorName}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="text-xs font-black text-slate-800 leading-none">{student.mentorName}</h3>
                        <p className="text-[10px] text-[#FF5A1F] font-bold mt-1 uppercase tracking-wider">{student.mentorRole} &bull; Mentor</p>
                      </div>
                    </div>

                    {/* Messages logs */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 flex flex-col justify-end">
                      {messages.map((msg: any) => {
                        const isStudent = msg.sender === 'student';
                        return (
                          <div key={msg.id} className={`flex ${isStudent ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-md rounded-2xl px-4 py-3 text-xs text-left relative ${isStudent ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'}`}>
                              <p className="font-semibold leading-relaxed">{msg.text}</p>
                              <span className={`text-[8px] font-bold block text-right mt-1.5 ${isStudent ? 'text-slate-400' : 'text-slate-400'}`}>{msg.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Ask your mentor a doubt..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-orange-300 placeholder-slate-400 transition-all"
                      />
                      <button
                        type="submit"
                        className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white flex items-center justify-center shadow-md shadow-orange-500/15 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>

                  </div>
                </div>
              )}

              {/* -------------------- 10. MY PROFILE VIEW -------------------- */}
              {activeSection === 'my-profile' && (
                <div className="max-w-4xl mx-auto space-y-8">
                  <div className="text-left">
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">My Profile</h2>
                    <p className="text-slate-500 text-sm mt-1">Review your registration details, assigned batch, and certificates.</p>
                  </div>

                  <div className="grid md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: profile properties */}
                    <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
                      <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-6 border-b border-slate-50 pb-3">Trainee Properties</h3>
                      
                      <div className="grid sm:grid-cols-2 gap-6 text-xs text-slate-700">
                        <PropRow label="Full Name" value={student.name} />
                        <PropRow label="Student Code" value={student.studentCode} />
                        <PropRow label="Email Address" value={student.email} />
                        <PropRow label="Phone Number" value={student.phone} />
                        <PropRow label="Enrolled Course" value={student.courseName} />
                        <PropRow label="Cohort Batch" value={student.batch} />
                        <PropRow label="Assigned Coordinator" value={student.mentorName} />
                        <PropRow label="Registration Date" value={student.joiningDate} />
                      </div>
                    </div>

                    {/* Right: skill progress */}
                    <div className="md:col-span-4 space-y-6">
                      
                      {/* Skill set progress card */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-5">Skill Progression</h3>
                        
                        <div className="space-y-4">
                          {student.skillsProgress.map((sk: any, idx: number) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                                <span>{sk.skill}</span>
                                <span>{sk.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${sk.progress}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Certification generation */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-4">
                        <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">Industrial Certification</h3>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Status: <span className="text-orange-500 font-bold">{student.certificateStatus}</span></p>
                        
                        {student.overallProgress === 100 ? (
                          <button
                            onClick={() => showToast('Downloading certificate...', 'success')}
                            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-[#FF5A1F] hover:from-orange-600 hover:to-[#E04D15] text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md shadow-orange-500/10 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Trophy className="w-4 h-4" /> Download Certificate
                          </button>
                        ) : (
                          <div className="text-center p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                            <span className="text-[10px] text-slate-400 font-bold italic">Unlocks at 100% syllabus progress</span>
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* -------------------- 10B. DOCUMENTS VIEW -------------------- */}
              {activeSection === 'documents' && (
                <StudentDocumentsSection 
                  student={student} 
                  documents={studentDocuments} 
                />
              )}

              {/* -------------------- 11. SETTINGS VIEW -------------------- */}
              {activeSection === 'settings' && (
                <div className="max-w-2xl mx-auto space-y-8 text-left">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Settings</h2>
                    <p className="text-slate-500 text-sm mt-1">Configure your personal preferences and secure password variables.</p>
                  </div>

                  {/* Change password widget */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-5">Security Credentials</h3>
                    
                    <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Current Password</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={passwordChangeLoading}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-400 rounded-xl text-xs outline-none focus:ring-4 focus:ring-orange-50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={passwordChangeLoading}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-400 rounded-xl text-xs outline-none focus:ring-4 focus:ring-orange-50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={passwordChangeLoading}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-orange-400 rounded-xl text-xs outline-none focus:ring-4 focus:ring-orange-50 transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={passwordChangeLoading}
                        className="w-full py-3 bg-slate-900 hover:bg-orange-500 hover:text-white text-white rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center justify-center gap-2"
                      >
                        {passwordChangeLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          'Save Password'
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Notification preference check boxes */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-2">Notification Settings</h3>
                    
                    <CheckboxPreference label="Email alert on new uploads notes" defaultChecked />
                    <CheckboxPreference label="SMS alert on next live class schedules" defaultChecked />
                    <CheckboxPreference label="Priority Whatsapp doubt response confirmations" />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </div>
  );
}

// ==================== SUB-COMPONENTS ====================

function SidebarTab({ active, label, icon: Icon, badge, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group ${
        active
          ? 'bg-[#FF5A1F] text-white shadow-md shadow-orange-500/10'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-[#FF5A1F]'}`} />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black leading-none ${active ? 'bg-white text-orange-600' : 'bg-orange-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function HeaderIcon({ icon: Icon, count, onClick, tooltip }: any) {
  return (
    <div className="relative group/tooltip">
      <button
        onClick={onClick}
        className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-100 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all cursor-pointer"
      >
        <Icon className="w-4 h-4" />
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-orange-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-white leading-none">
            {count}
          </span>
        )}
      </button>
      <span className="absolute top-11 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[9px] font-bold rounded opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all whitespace-nowrap z-55 shadow-md">
        {tooltip}
      </span>
    </div>
  );
}

function QuickLink({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-[#FAFAFA] hover:bg-orange-50 border border-slate-100 hover:border-orange-100 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-slate-400 hover:text-orange-500 cursor-pointer group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
      <span className="text-[9px] font-bold text-slate-500 group-hover:text-orange-600 transition-colors">{label}</span>
    </button>
  );
}

function StatBox({ count, label, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50/50 border-blue-100 text-blue-700',
    green: 'bg-green-50/50 border-green-100 text-green-700',
    orange: 'bg-orange-50/50 border-orange-100 text-orange-700',
    purple: 'bg-purple-50/50 border-purple-100 text-purple-700'
  };

  return (
    <div className={`border rounded-2xl p-4 text-center ${colorMap[color] || 'bg-slate-50 border-slate-100 text-slate-700'}`}>
      <p className="text-xl font-black leading-none">{count}</p>
      <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 inline-block">{label}</span>
    </div>
  );
}

function CountdownSegment({ value, label }: any) {
  const formattedVal = String(value).padStart(2, '0');
  return (
    <div className="text-center">
      <div className="w-12 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-lg font-black text-orange-500 leading-none shadow-sm shadow-slate-100">
        {formattedVal}
      </div>
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 inline-block leading-none">{label}</span>
    </div>
  );
}

function PropRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="font-extrabold text-slate-800 text-sm leading-snug">{value}</p>
    </div>
  );
}

function CheckboxPreference({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 p-3 bg-[#FAFAFA] border border-slate-100 rounded-2xl hover:bg-slate-50/80 transition-all cursor-pointer text-xs font-semibold text-slate-700">
      <input type="checkbox" defaultChecked={defaultChecked} className="w-4 h-4 rounded accent-orange-500 border-slate-300" />
      <span>{label}</span>
    </label>
  );
}

function LinkToHome({ children, className }: any) {
  const router = useRouter();
  return (
    <div onClick={() => router.push('/')} className={className}>
      {children}
    </div>
  );
}

function FlameIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function FlameSpinnerGlow() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/30">
        <FlameIcon className="w-4 h-4 text-orange-500" />
      </div>
    </div>
  );
}

// ─── Student Documents Component ─────────────────────────────────────────────

interface StudentDocumentsSectionProps {
  student: any;
  documents: any[];
}

function StudentDocumentsSection({ student, documents }: StudentDocumentsSectionProps) {
  const documentTypes = [
    { key: 'offer-letter', label: 'Offer Letter', desc: 'Official Industrial Training Offer Letter issued by DevPhoenix.', possibleNames: ['Industrial Training Offer Letter', 'Internship Offer Letter'] },
    { key: 'training-cert', label: 'Training Certificate', desc: 'Certificate verifying completion of industrial cohort syllabus.', possibleNames: ['Training Certificate'] },
    { key: 'internship-cert', label: 'Internship Certificate', desc: 'Certificate for work contributions on active development codebases.', possibleNames: ['Internship Certificate'] },
    { key: 'experience-letter', label: 'Experience Letter', desc: 'Professional experience letter documenting tenure & modules completed.', possibleNames: ['Experience Letter'] },
    { key: 'completion-cert', label: 'Completion Certificate', desc: 'Verification of absolute program milestones & final capstone.', possibleNames: ['Completion Certificate'] },
  ];

  const [selectedQRRecord, setSelectedQRRecord] = useState<any | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-black text-slate-900 leading-tight">My Documents</h2>
        <p className="text-slate-500 text-sm mt-1">
          Access, verify, and download your official industrial training credentials.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Documents list */}
        <div className="md:col-span-8 space-y-4">
          {documentTypes.map((docType) => {
            const matchedRecord = documents.find(d => 
              docType.possibleNames.includes(d.documentType)
            );

            return (
              <div 
                key={docType.key}
                className={`bg-white border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md ${
                  matchedRecord ? 'border-slate-100' : 'border-slate-200/60 opacity-65 bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    matchedRecord 
                      ? 'bg-orange-50 border-orange-100 text-orange-500' 
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {matchedRecord ? <ShieldCheck className="w-6 h-6" /> : <X className="w-5 h-5" />}
                  </div>
                  
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-snug">{docType.label}</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1 leading-relaxed max-w-sm">{docType.desc}</p>
                    
                    {matchedRecord ? (
                      <div className="mt-3 flex flex-wrap gap-2.5 items-center text-[10px] font-bold text-slate-500">
                        <span className="font-mono bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5 text-[9px] uppercase">
                          ID: {matchedRecord.verificationId}
                        </span>
                        <span>&bull;</span>
                        <span>Issued: {new Date(matchedRecord.issueDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold italic mt-3 inline-block">Not Issued</span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-50 pt-4 sm:pt-0">
                  {matchedRecord ? (
                    <>
                      <a
                        href={`/api/verification/pdf/${matchedRecord.verificationId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:w-36 py-2 px-3 bg-slate-900 hover:bg-[#FF5A1F] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Online
                      </a>
                      
                      <div className="flex gap-2">
                        <a
                          href={`/api/verification/pdf/${matchedRecord.verificationId}`}
                          download
                          className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </a>
                        <button
                          onClick={() => setSelectedQRRecord(matchedRecord)}
                          className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          QR
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      disabled
                      className="w-full sm:w-36 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-not-allowed text-center"
                    >
                      Locked 🔒
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Side panel */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-md shadow-black/10 relative overflow-hidden text-center">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <h4 className="text-xs font-extrabold">Instant Public Audit</h4>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Every document contains a dynamic QR code redirecting to our public registry, validating signatures and credentials instantly for employers or recruiters.
            </p>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left">
            <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider mb-2">Need Corrections?</h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              If your name, program parameters, or internship duration has typos, please contact your cohort coordinator via the support chat in the Messages panel.
            </p>
          </div>
        </div>

      </div>

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {selectedQRRecord && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedQRRecord(null)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 z-55 text-center flex flex-col items-center"
            >
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider text-left">Document Verification QR</h3>
                <button onClick={() => setSelectedQRRecord(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    window.location.origin + '/verify?id=' + selectedQRRecord.verificationId
                  )}`}
                  alt="Verification QR Code"
                  className="w-36 h-36 mx-auto object-contain border border-slate-200 bg-white p-2 rounded-xl"
                />
              </div>

              <div className="text-xs space-y-1.5 text-slate-500 font-semibold">
                <p className="font-bold text-slate-800">{selectedQRRecord.documentType}</p>
                <p className="font-mono text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                  {selectedQRRecord.verificationId}
                </p>
                <p className="text-[10px] leading-relaxed pt-2">
                  Scan this QR code with a mobile device to instantly verify this document on the public portal.
                </p>
              </div>

              <button
                onClick={() => setSelectedQRRecord(null)}
                className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

