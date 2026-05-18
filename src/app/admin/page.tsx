"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Inbox, Star, Users, TrendingUp, BookOpen,
  ArrowRight, Activity, Zap, Target, BarChart3, MessageSquare,
  CheckCircle2, Clock, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// ─── Mini Spark Bar ───────────────────────────────────────────────────────────
function SparkBar({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {values.map((v, i) => (
        <div
          key={i}
          style={{ height: `${(v / max) * 100}%` }}
          className={`flex-1 rounded-sm transition-all ${i === values.length - 1 ? 'bg-orange-500' : 'bg-slate-700'}`}
        />
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function MetricCard({
  label, value, sub, icon: Icon, trend, href, color = 'orange'
}: {
  label: string; value: string | number; sub?: string;
  icon: any; trend?: string; href?: string; color?: string;
}) {
  const colorMap: Record<string, string> = {
    orange: 'text-orange-500 bg-orange-500/10',
    blue:   'text-blue-400 bg-blue-500/10',
    green:  'text-green-400 bg-green-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    red:    'text-red-400 bg-red-500/10',
  };
  const card = (
    <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && <span className="text-xs font-semibold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-sm font-semibold text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/leads').then(r => r.json()).catch(() => []),
      fetch('/api/programs').then(r => r.json()).catch(() => []),
      fetch('/api/testimonials').then(r => r.json()).catch(() => []),
      fetch('/api/mentors').then(r => r.json()).catch(() => []),
    ]).then(([l, p, t, m]) => {
      setLeads(Array.isArray(l) ? l : []);
      setPrograms(Array.isArray(p) ? p : []);
      setTestimonials(Array.isArray(t) ? t : []);
      setMentors(Array.isArray(m) ? m : []);
      setLoading(false);
    });
  }, []);

  // Derived metrics
  const newLeads = leads.filter(l => l.status === 'New' || !l.status).length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

  // Lead growth — last 7 days buckets
  const now = Date.now();
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const from = now - (7 - i) * 86400000;
    const to = from + 86400000;
    return leads.filter(l => { const t = new Date(l.created_at).getTime(); return t >= from && t < to; }).length;
  });

  // Leads by program
  const byProgram: Record<string, number> = {};
  leads.forEach(l => { if (l.program) byProgram[l.program] = (byProgram[l.program] || 0) + 1; });
  const topPrograms = Object.entries(byProgram).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const quickLinks = [
    { href: '/admin/programs', label: 'Manage Programs', icon: GraduationCap, color: 'orange' },
    { href: '/admin/leads',    label: 'View CRM',         icon: Inbox,          color: 'blue' },
    { href: '/admin/blog',     label: 'Write Blog',        icon: BookOpen,       color: 'purple' },
    { href: '/admin/mentors',  label: 'Add Mentor',        icon: Users,          color: 'green' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Control Centre</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">Welcome back. Here's what's happening on DevPhoeniX.</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <MetricCard label="Total Leads" value={leads.length} icon={Inbox} trend={`+${newLeads} new`} color="blue" href="/admin/leads" />
        <MetricCard label="Conversion Rate" value={`${conversionRate}%`} icon={Target} sub={`${convertedLeads} converted`} color="green" href="/admin/leads" />
        <MetricCard label="Programs" value={programs.length || 8} icon={GraduationCap} color="orange" href="/admin/programs" />
        <MetricCard label="Mentors" value={mentors.length || 3} icon={Users} color="purple" href="/admin/mentors" />
      </motion.div>

      {/* Analytics Row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        {/* Lead Growth Sparkline */}
        <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-slate-400">Lead Growth</p>
              <p className="text-xs text-slate-600">Last 7 days</p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-600" />
          </div>
          <SparkBar values={buckets} />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">7d ago</span>
            <span className="text-xs text-slate-600">Today</span>
          </div>
        </div>

        {/* Top Programs by Interest */}
        <div className="bg-[#151821] border border-slate-800 rounded-2xl p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-400">Top Programs by Interest</p>
            <Link href="/admin/leads" className="text-xs text-orange-500 hover:text-orange-400 font-semibold">View CRM →</Link>
          </div>
          {topPrograms.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-4">No lead data yet</p>
          ) : (
            <div className="space-y-3">
              {topPrograms.map(([prog, count]) => (
                <div key={prog} className="flex items-center gap-3">
                  <p className="text-sm text-slate-300 font-medium flex-1 truncate">{prog}</p>
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div
                      style={{ width: `${Math.round((count / leads.length) * 100)}%` }}
                      className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Pipeline Status Strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-[#151821] border border-slate-800 rounded-2xl p-5"
      >
        <p className="text-sm font-bold text-slate-400 mb-4">Lead Pipeline Overview</p>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
          {(['New', 'Contacted', 'Qualified', 'Consultation Scheduled', 'Converted', 'Closed', 'Lost'] as const).map(s => {
            const count = leads.filter(l => l.status === s || (!l.status && s === 'New')).length;
            const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
            const colors: Record<string, string> = {
              'New': 'bg-blue-500', 'Contacted': 'bg-orange-500', 'Qualified': 'bg-purple-500',
              'Consultation Scheduled': 'bg-yellow-500', 'Converted': 'bg-green-500', 'Closed': 'bg-slate-500', 'Lost': 'bg-red-400'
            };
            if (pct === 0) return null;
            return <div key={s} style={{ width: `${pct}%` }} className={`${colors[s]} transition-all`} title={`${s}: ${count}`} />;
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          {(['New', 'Contacted', 'Qualified', 'Consultation Scheduled', 'Converted', 'Lost'] as const).map(s => {
            const count = leads.filter(l => l.status === s || (!l.status && s === 'New')).length;
            const dotColors: Record<string, string> = {
              'New': 'bg-blue-500', 'Contacted': 'bg-orange-500', 'Qualified': 'bg-purple-500',
              'Consultation Scheduled': 'bg-yellow-500', 'Converted': 'bg-green-500', 'Lost': 'bg-red-400'
            };
            return (
              <div key={s} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dotColors[s]}`} />
                <span className="text-xs text-slate-500">{s}: <span className="text-slate-300 font-semibold">{count}</span></span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-base font-extrabold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, color }) => {
            const colorMap: Record<string, string> = {
              orange: 'text-orange-500 bg-orange-500/10 group-hover:bg-orange-500',
              blue: 'text-blue-400 bg-blue-500/10 group-hover:bg-blue-500',
              purple: 'text-purple-400 bg-purple-500/10 group-hover:bg-purple-500',
              green: 'text-green-400 bg-green-500/10 group-hover:bg-green-500',
            };
            return (
              <Link key={href} href={href}>
                <div className="group bg-[#151821] border border-slate-800 hover:border-slate-600 rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:text-white ${colorMap[color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-300 text-center group-hover:text-white transition-colors">{label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Leads */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold text-white">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-orange-500 hover:text-orange-400 flex items-center gap-1">
            View all CRM <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {leads.length === 0 ? (
          <div className="bg-[#151821] border border-slate-800 rounded-2xl p-10 text-center">
            <Activity className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No leads yet.</p>
            <p className="text-slate-600 text-sm mt-1">When students fill the inquiry form, they'll appear here.</p>
          </div>
        ) : (
          <div className="bg-[#151821] border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800">
                <tr>
                  {['Name', 'Program', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {leads.slice(0, 8).map(lead => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{lead.name}</p>
                      <p className="text-slate-500 text-xs">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-full font-semibold">
                        {lead.program || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        lead.status === 'Converted' ? 'bg-green-500/10 text-green-400' :
                        lead.status === 'Contacted' ? 'bg-orange-500/10 text-orange-400' :
                        lead.status === 'Lost' ? 'bg-red-500/10 text-red-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>{lead.status || 'New'}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
