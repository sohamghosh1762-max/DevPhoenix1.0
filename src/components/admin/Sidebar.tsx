"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, GraduationCap, Star, Users,
  Briefcase, PenSquare, MessageSquare, Inbox, Settings,
  Globe, Link2, ChevronLeft, ChevronRight, LogOut, Home,
  Image as ImageIcon, BarChart3, Menu
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/leads', icon: Inbox, label: 'Leads' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/homepage', icon: Home, label: 'Homepage' },
      { href: '/admin/programs', icon: GraduationCap, label: 'Programs' },
      { href: '/admin/learning-paths', icon: BookOpen, label: 'Learning Paths' },
      { href: '/admin/blog', icon: PenSquare, label: 'Blog' },
      { href: '/admin/showcase', icon: Briefcase, label: 'Showcase' },
      { href: '/admin/testimonials', icon: Star, label: 'Testimonials' },
      { href: '/admin/mentors', icon: Users, label: 'Mentors' },
      { href: '/admin/community', icon: MessageSquare, label: 'Community' },
    ],
  },
  {
    label: 'Config',
    items: [
      { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
      { href: '/admin/footer', icon: Globe, label: 'Footer & Socials' },
      { href: '/admin/navbar', icon: Link2, label: 'Navigation' },
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    router.push('/admin-login');
  };

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <div className="relative w-32 h-9">
            <Image src="/logo/devphoenix-logo.png" alt="DevPhoeniX" fill className="object-contain object-left brightness-0 invert" />
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">D</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {navGroups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                        active
                          ? 'bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]'
                          : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                      } ${collapsed ? 'justify-center' : ''}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-slate-700/50 p-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-700/60 hover:text-white transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-[#0f1117] border-r border-slate-700/50 relative shrink-0 h-screen sticky top-0"
      >
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f1117] border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
        <div className="relative w-28 h-8">
          <Image src="/logo/devphoenix-logo.png" alt="DevPhoeniX" fill className="object-contain object-left brightness-0 invert" />
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-slate-400 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 bg-[#0f1117] border-r border-slate-700/50 z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
