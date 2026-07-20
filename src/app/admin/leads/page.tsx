"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, Filter, ChevronDown, X, MessageSquare,
  Phone, Mail, User, Clock, CheckCircle2, AlertCircle,
  ChevronRight, ArrowUpDown, Inbox, Settings, Database, RefreshCw,
  Check, AlertTriangle, History, UserPlus, Edit2, Archive, FolderOpen
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";
import { showToast } from "@/components/ui/PremiumToast";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { Input } from "@/components/ui/FormElements";
import { PremiumEmptyState } from "@/components/ui/PremiumEmptyState";
import { designSystem } from "@/lib/design-system";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<LeadStatus, { color: string; bg: string; dot: string }> = {
  'New':                    { color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',    dot: 'bg-blue-500' },
  'Contacted':              { color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  'Qualified':              { color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
  'Consultation Scheduled': { color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  'Converted':              { color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   dot: 'bg-green-500' },
  'Closed':                 { color: 'text-slate-700',  bg: 'bg-slate-100 border-slate-200',  dot: 'bg-slate-500' },
  'Lost':                   { color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       dot: 'bg-red-400' },
};

const ALL_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Consultation Scheduled', 'Converted', 'Closed', 'Lost'];

const STATUS_MAP: Record<LeadStatus, BadgeVariant> = {
  'New': 'info',
  'Contacted': 'orange',
  'Qualified': 'purple',
  'Consultation Scheduled': 'warning',
  'Converted': 'success',
  'Closed': 'default',
  'Lost': 'danger',
};

function StatusBadge({ status }: { status: LeadStatus }) {
  const badgeVar = STATUS_MAP[status] || 'default';
  return <Badge variant={badgeVar}>{status}</Badge>;
}

// ─── Modals ──────────────────────────────────────────────────────────────────

function AddLeadModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    program: "",
    status: "New" as LeadStatus,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      showToast("Please fill in Name, Email, and Phone.", "info");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lead_source: 'Manual' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create manual lead.");
      showToast("Manual lead added successfully!", "success");
      onAdd();
      onClose();
      setFormData({ name: "", email: "", phone: "", college: "", program: "", status: "New" });
    } catch (err: any) {
      showToast(err.message || "Failed to create lead.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-orange-500" /> Add Manual Lead
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name *</label>
            <input
              required
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Soham Ghosh"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. soham@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
            <input
              required
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="e.g. +919876543210"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College Name</label>
            <input
              value={formData.college}
              onChange={e => setFormData(prev => ({ ...prev, college: e.target.value }))}
              placeholder="e.g. Brainware University"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Program of Interest</label>
            <input
              value={formData.program}
              onChange={e => setFormData(prev => ({ ...prev, program: e.target.value }))}
              placeholder="e.g. Cloud & DevOps Engineering"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditLeadModal({ isOpen, onClose, lead, onUpdate }: { isOpen: boolean; onClose: () => void; lead: Lead; onUpdate: () => void }) {
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    whatsapp: lead.whatsapp || "",
    college: lead.college || "",
    program: lead.program || "",
    city: lead.city || "",
    state: lead.state || "",
    referral_source: lead.referral_source || "",
    status: lead.status,
    assigned_admin: lead.assigned_admin || "",
    is_archived: lead.is_archived || false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, ...formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update lead.");
      showToast("Lead updated successfully!", "success");
      onUpdate();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Failed to update lead.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Edit2 className="w-5 h-5 text-orange-500" /> Edit Lead Details
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input
                required
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">WhatsApp Number</label>
              <input
                value={formData.whatsapp}
                onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="WhatsApp number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">College Name</label>
              <input
                value={formData.college}
                onChange={e => setFormData(prev => ({ ...prev, college: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Course Interested In</label>
              <input
                value={formData.program}
                onChange={e => setFormData(prev => ({ ...prev, program: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
              <input
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State</label>
              <input
                value={formData.state}
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder="State"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Referral Source</label>
              <input
                value={formData.referral_source}
                onChange={e => setFormData(prev => ({ ...prev, referral_source: e.target.value }))}
                placeholder="Referral source (e.g. Friends, Web)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pipeline Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as LeadStatus }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-700"
              >
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Counselor</label>
              <select
                value={formData.assigned_admin}
                onChange={e => setFormData(prev => ({ ...prev, assigned_admin: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-700"
              >
                <option value="">Unassigned</option>
                <option value="Rajesh Kumar">Rajesh Kumar</option>
                <option value="Sunita Patel">Sunita Patel</option>
                <option value="Anoop Sharma">Anoop Sharma</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="edit_is_archived"
                checked={formData.is_archived}
                onChange={e => setFormData(prev => ({ ...prev, is_archived: e.target.checked }))}
                className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-400"
              />
              <label htmlFor="edit_is_archived" className="text-sm font-bold text-slate-700 cursor-pointer">Archive Lead</label>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── LeadDetail Slide-over ────────────────────────────────────────────────────

function LeadDetailPanel({ lead, onClose, onUpdate, onTriggerEdit }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (updatedLead?: Lead) => void;
  onTriggerEdit: (lead: Lead) => void;
}) {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setStatus(newStatus);
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update lead status.');
      showToast(`Status updated to "${newStatus}"`, 'success');
      onUpdate(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead status.', 'error');
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, action: 'add_note', note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add note.');
      setNote('');
      showToast('Note added successfully!', 'success');
      onUpdate(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to add note.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, is_archived: !lead.is_archived }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update lead.');
      showToast(lead.is_archived ? "Lead unarchived successfully!" : "Lead archived successfully!", 'success');
      onUpdate(data);
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to update lead.', 'error');
    }
  };

  const waMessage = encodeURIComponent(
    `Hi ${lead.name},\n\nThank you for your interest in the ${lead.program || 'DevPhoeniX'} program!\n\nI'm reaching out to share more details and answer any questions you have.\n\nTeam DevPhoeniX 🔥`
  );
  const waPhone = (lead.whatsapp || lead.phone)?.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              <Badge variant={lead.lead_source === 'Google Form' ? 'purple' : 'default'}>
                {lead.lead_source || 'Manual'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{lead.email}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Phone</p>
              <p className="font-semibold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" /> {lead.phone}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Program</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.program || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Goal / Status</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.current_status || lead.currentStatus || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Source Page</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.source_page || 'Direct'}</p>
            </div>
            {lead.college && (
              <div className="bg-slate-50 rounded-xl p-4 col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">College / Organization</p>
                <p className="font-semibold text-slate-900 text-sm">{lead.college}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-xl p-4 col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Assigned Counsellor</p>
              <p className="font-semibold text-slate-900 text-sm">{lead.assigned_admin || 'Unassigned'}</p>
            </div>
            
            {lead.city && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">City</p>
                <p className="font-semibold text-slate-900 text-sm">{lead.city}</p>
              </div>
            )}
            {lead.state && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">State</p>
                <p className="font-semibold text-slate-900 text-sm">{lead.state}</p>
              </div>
            )}
            {lead.referral_source && (
              <div className="bg-slate-50 rounded-xl p-4 col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Referral Source</p>
                <p className="font-semibold text-slate-900 text-sm">{lead.referral_source}</p>
              </div>
            )}
            
            {/* Custom Google Sheets Fields */}
            {lead.custom_fields && Object.keys(lead.custom_fields).length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 col-span-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-600" /> Google Form Response Columns
                </p>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {Object.entries(lead.custom_fields).map(([key, val]) => {
                    // Skip standard fields that are already displayed cleanly to avoid clutter
                    if (['Full Name', 'Email address', 'Mobile Number', 'College / University Name', 'Which training program are you interested in?'].includes(key)) return null;
                    if (val === null || val === undefined || val === '') return null;
                    return (
                      <div key={key} className="text-xs border-b border-slate-100/60 pb-1.5 last:border-0 last:pb-0">
                        <p className="text-slate-400 font-bold">{key}</p>
                        <p className="font-semibold text-slate-800 break-words mt-0.5">{String(val)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Info Box (if converted) */}
          {status === 'Converted' && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wider">🎓 Enrollment Information</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 uppercase tracking-wide mb-0.5">Program Name</p>
                  <p className="font-bold text-slate-800">{lead.program || '—'}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide mb-0.5">Enrollment Date</p>
                  <p className="font-bold text-slate-800">
                    {lead.enrollment_date ? new Date(lead.enrollment_date).toLocaleDateString('en-IN') : new Date(lead.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide mb-0.5">Payment Status</p>
                  <p className="font-bold text-green-700">{lead.payment_status || 'Paid'}</p>
                </div>
                <div>
                  <p className="text-slate-400 uppercase tracking-wide mb-0.5">Payment Amount</p>
                  <p className="font-bold text-slate-800">₹{lead.payment_amount?.toLocaleString('en-IN') || '1,249'}</p>
                </div>
              </div>
            </div>
          )}

          {lead.message && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Message</p>
              <p className="text-slate-700 text-sm leading-relaxed">"{lead.message}"</p>
            </div>
          )}

          {/* Status Management */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Pipeline Status</p>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    status === s
                      ? `${STATUS_CONFIG[s].bg} ${STATUS_CONFIG[s].color} shadow-sm scale-105`
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Contacts */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Quick Contact</p>
            <div className="flex gap-3">
              <a
                href={`mailto:${lead.email}?subject=Re: ${lead.program} - DevPhoeniX&body=Hi ${lead.name},%0A%0A`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-orange-500 transition-colors"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
              <a
                href={`https://wa.me/${waPhone}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href={`tel:${lead.phone}`}
                className="px-4 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>

          {/* Core Actions */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Lead Actions</p>
            <div className="flex gap-3">
              <button
                onClick={() => onTriggerEdit(lead)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <Edit2 className="w-4 h-4" /> Edit Details
              </button>
              <button
                onClick={handleArchiveToggle}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors border border-slate-200"
              >
                {lead.is_archived ? <FolderOpen className="w-4 h-4 text-orange-500" /> : <Archive className="w-4 h-4 text-slate-500" />}
                {lead.is_archived ? "Activate Lead" : "Archive Lead"}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Notes & Timeline</p>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {(lead.notes || []).length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-xl">No notes yet</p>
              ) : (
                [...(lead.notes || [])].reverse().map(n => (
                  <div key={n.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-sm text-slate-700">{n.content}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.author} · {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={e => setNote(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a note..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors text-slate-900"
              />
              <button
                onClick={handleAddNote}
                disabled={saving || !note.trim()}
                className="px-4 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {saving ? '...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
            <p>Created: {new Date(lead.created_at).toLocaleString('en-IN')}</p>
            {lead.updated_at && <p>Updated: {new Date(lead.updated_at).toLocaleString('en-IN')}</p>}
            {lead.last_contacted_at && <p>Last Contacted: {new Date(lead.last_contacted_at).toLocaleString('en-IN')}</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main CRM Page ────────────────────────────────────────────────────────────

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | LeadStatus>('All');
  const [leadSourceFilter, setLeadSourceFilter] = useState<'All' | 'Manual' | 'Google Form'>('All');
  const [assignmentFilter, setAssignmentFilter] = useState<'All' | 'Assigned' | 'Unassigned'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [kpiCounts, setKpiCounts] = useState<Record<string, number>>({});
  const [conversionRate, setConversionRate] = useState(0);
  
  // Google Sheets configurations
  const [sheetsConfig, setSheetsConfig] = useState<any>({ url: '', enabled: false });
  const [sheetsLogs, setSheetsLogs] = useState<any[]>([]);
  const [showSheetsConfig, setShowSheetsConfig] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // New Lead / Edit Lead modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  
  // Show Archived leads toggle
  const [showArchived, setShowArchived] = useState(false);

  const PER_PAGE = 10;

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads?page=${page}&limit=${PER_PAGE}&search=${encodeURIComponent(search)}&status=${statusFilter}&sortBy=${sortBy}&leadSource=${leadSourceFilter}&assignment=${assignmentFilter}&archived=${showArchived}`);
      const json = await res.json();
      if (json.success && json.data) {
        setLeads(json.data.leads || []);
        setTotalCount(json.data.totalCount || 0);
        setKpiCounts(json.data.counts || {});
        setConversionRate(json.data.conversionRate || 0);
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSheetsConfig = async () => {
    try {
      const res = await fetch('/api/leads/google-sheets');
      const json = await res.json();
      if (json.success && json.data) {
        setSheetsConfig(json.data.config || { url: '', enabled: false });
        setSheetsLogs(json.data.logs || []);
      }
    } catch (err) {
      console.error("Error loading Google Sheets config:", err);
    }
  };

  useEffect(() => {
    load();
  }, [page, search, statusFilter, sortBy, leadSourceFilter, assignmentFilter, showArchived]);

  useEffect(() => {
    loadSheetsConfig();
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    showToast("Starting synchronization...", "info");
    try {
      const res = await fetch('/api/leads/google-sheets', {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.data.log.details || "Sync completed successfully!", "success");
        load();
        loadSheetsConfig();
      } else {
        throw new Error(json.error || "Sync failed.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to trigger sync.", "error");
      loadSheetsConfig();
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveConfig = async (url: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/leads/google-sheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, enabled })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Google Sheets configuration saved!", "success");
        loadSheetsConfig();
      } else {
        throw new Error(json.error || "Failed to save configuration.");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to save configuration.", "error");
    }
  };

  const handleDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const original = [...leads];
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast('Lead deleted successfully', 'success');

    try {
      const res = await fetch('/api/leads', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setLeads(original);
      showToast('Error deleting lead, restored.', 'error');
    }
  };

  const exportCSV = async () => {
    try {
      showToast("Preparing export files...", "info");
      const res = await fetch(`/api/leads?search=${encodeURIComponent(search)}&status=${statusFilter}&sortBy=${sortBy}&leadSource=${leadSourceFilter}&assignment=${assignmentFilter}&archived=${showArchived}&downloadAll=true`);
      const json = await res.json();
      if (!json.success || !json.data || !json.data.leads) {
        showToast("Failed to fetch export data.", "error");
        return;
      }
      const exportLeads = json.data.leads;
      if (exportLeads.length === 0) {
        showToast("No leads match filters to export.", "info");
        return;
      }

      // 1. CSV Export
      const csvHeaders = ['Name', 'Email', 'Phone', 'College', 'Program', 'Goal', 'Lead Source', 'Status', 'Date', 'Enrollment Status'];
      const csvRows = exportLeads.map((l: Lead) => [
        l.name, 
        l.email, 
        l.phone, 
        l.college || '', 
        l.program || '', 
        l.current_status || l.currentStatus || '', 
        l.lead_source || 'Manual', 
        l.status, 
        new Date(l.created_at).toLocaleString(),
        l.payment_status || 'Unconverted'
      ]);
      const csv = [csvHeaders, ...csvRows].map((r: any[]) => r.map((c: any) => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const csvBlob = new Blob([csv], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const csvLink = document.createElement('a');
      csvLink.href = csvUrl;
      csvLink.download = `devphoenix-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      csvLink.click();

      // 2. XLSX Export
      const xlsxData = exportLeads.map((l: Lead) => ({
        'Name': l.name,
        'Email': l.email,
        'Phone': l.phone,
        'College': l.college || '',
        'Program': l.program || '',
        'Goal': l.current_status || l.currentStatus || '',
        'Lead Source': l.lead_source || 'Manual',
        'Status': l.status,
        'Date': new Date(l.created_at).toLocaleString(),
        'Enrollment Status': l.payment_status || 'Unconverted'
      }));

      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(xlsxData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `devphoenix-leads-${new Date().toISOString().slice(0, 10)}.xlsx`);

      showToast("Export completed successfully!", "success");
    } catch (err) {
      console.error("Export error:", err);
      showToast("Export failed.", "error");
    }
  };

  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const paginated = leads;
  const counts = kpiCounts;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">Lead CRM</h1>
          <p className="text-sm text-slate-500 font-medium">{totalCount} total leads &bull; {conversionRate}% conversion rate</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            onClick={() => setShowSheetsConfig(!showSheetsConfig)}
            variant={showSheetsConfig ? "primary" : "outline"}
            size="sm"
            icon={<Settings className="w-4 h-4" />}
          >
            Form Sync Config
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            size="sm"
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add Lead
          </Button>
          <Button
            onClick={() => {
              setShowArchived(!showArchived);
              setPage(1);
            }}
            variant={showArchived ? "primary" : "outline"}
            size="sm"
            icon={showArchived ? <FolderOpen className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
          >
            {showArchived ? "Active Leads" : "Archived Leads"}
          </Button>
          <Button onClick={exportCSV} variant="outline" size="sm" icon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Google Sheets Integration Card */}
      {showSheetsConfig && (
        <Card className="p-6 border border-slate-100 bg-slate-50/40 rounded-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-500" /> Google Sheets Sync
              </h3>
              <p className="text-xs text-slate-500 mt-1">Connect your Google Sheets document linked to a Google Form</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Auto Sync:</span>
              <button
                onClick={() => {
                  const newEnabled = !sheetsConfig.enabled;
                  setSheetsConfig((prev: any) => ({ ...prev, enabled: newEnabled }));
                  handleSaveConfig(sheetsConfig.url, newEnabled);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sheetsConfig.enabled ? 'bg-orange-500' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    sheetsConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Google Sheet URL</label>
                <div className="flex gap-2">
                  <input
                    value={sheetsConfig.url}
                    onChange={e => setSheetsConfig((prev: any) => ({ ...prev, url: e.target.value }))}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-slate-900"
                  />
                  <Button
                    onClick={() => handleSaveConfig(sheetsConfig.url, sheetsConfig.enabled)}
                    variant="primary"
                  >
                    Save URL
                  </Button>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                  <p className="text-slate-400 font-bold uppercase mb-1">Status</p>
                  <Badge variant={sheetsConfig.lastSyncStatus === 'success' ? 'success' : sheetsConfig.lastSyncStatus === 'failed' ? 'danger' : 'default'}>
                    {sheetsConfig.lastSyncStatus?.toUpperCase() || 'IDLE'}
                  </Badge>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                  <p className="text-slate-400 font-bold uppercase mb-1">Last Sync</p>
                  <p className="font-bold text-slate-700">
                    {sheetsConfig.lastSyncTime ? new Date(sheetsConfig.lastSyncTime).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: 'numeric', month: 'short' }) : 'Never'}
                  </p>
                </div>
                <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm col-span-2 sm:col-span-1">
                  <p className="text-slate-400 font-bold uppercase mb-1">Total Imported</p>
                  <p className="font-extrabold text-slate-700 text-base">{sheetsConfig.totalImportedCount || 0} leads</p>
                </div>
              </div>

              {sheetsConfig.lastSyncError && (
                <div className="flex gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-xs text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <div>
                    <p className="font-bold">Sync warning / error:</p>
                    <p className="mt-0.5 leading-relaxed">{sheetsConfig.lastSyncError}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-500 uppercase">Sync Action</label>
              </div>
              <button
                disabled={syncing || !sheetsConfig.url}
                onClick={handleSyncNow}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-orange-500 disabled:opacity-50 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>

              {/* Logs display */}
              <div className="pt-2">
                <div className="border border-slate-100 rounded-xl bg-white p-3.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
                    <span className="flex items-center gap-1"><History className="w-3.5 h-3.5" /> Recent Runs</span>
                  </div>
                  <div className="space-y-2 max-h-24 overflow-y-auto pr-1">
                    {sheetsLogs.length === 0 ? (
                      <p className="text-[10px] text-slate-400 text-center py-2">No sync activities logged</p>
                    ) : (
                      sheetsLogs.slice(0, 5).map((log: any) => (
                        <div key={log.id} className="text-[10px] flex justify-between items-start border-b border-slate-50 pb-1.5 last:border-0 last:pb-0">
                          <div className="truncate max-w-[70%]">
                            <p className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                            <p className="font-semibold text-slate-600 truncate">{log.details}</p>
                          </div>
                          <span className={`font-bold ${log.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                            {log.status === 'success' ? `+${log.importedCount}` : 'ERR'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['New', 'Contacted', 'Qualified', 'Converted'] as LeadStatus[]).map(s => {
          const badgeVar = STATUS_MAP[s] || 'default';
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 shadow-sm ${
                statusFilter === s
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/10 scale-[1.03]'
                  : 'bg-white border-slate-100 hover:border-orange-200 text-slate-900'
              }`}
            >
              <p className={`text-3xl font-extrabold mb-1.5 ${statusFilter === s ? 'text-white' : 'text-slate-900'}`}>{counts[s] || 0}</p>
              <Badge variant={statusFilter === s ? 'default' : badgeVar}>{s}</Badge>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone, program..."
            className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all text-slate-900"
          />
        </div>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value as any); setPage(1); }}
          className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending Leads</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        {/* Lead Source Filter */}
        <select
          value={leadSourceFilter}
          onChange={e => { setLeadSourceFilter(e.target.value as any); setPage(1); }}
          className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Sources</option>
          <option value="Manual">Manual Leads</option>
          <option value="Google Form">Google Form Leads</option>
        </select>
        
        {/* Assignment Filter */}
        <select
          value={assignmentFilter}
          onChange={e => { setAssignmentFilter(e.target.value as any); setPage(1); }}
          className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="All">All Assignments</option>
          <option value="Assigned">Assigned Leads</option>
          <option value="Unassigned">Unassigned Leads</option>
        </select>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="bg-white border border-slate-200 text-slate-700 rounded-xl px-4 h-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center text-slate-400 font-semibold animate-pulse">Loading leads...</div>
        ) : paginated.length === 0 ? (
          <PremiumEmptyState
            title="No CRM Leads Found"
            description="Try modifying your search query or selecting a different filter."
            icon={Inbox}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="border-b border-slate-100 bg-slate-50/50">
                <tr>
                  {['Lead', 'Program', 'Status', 'Source', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map(lead => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{lead.name}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{lead.email}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{lead.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="orange">{lead.program || '—'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status || 'New'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-slate-500 text-xs font-bold">{lead.source_page || 'Direct'}</span>
                        <Badge variant={lead.lead_source === 'Google Form' ? 'purple' : 'default'}>
                          {lead.lead_source || 'Manual'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Open details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-slate-500 font-semibold">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, totalCount)} of {totalCount}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold disabled:opacity-40 transition-colors">← Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold disabled:opacity-40 transition-colors">Next →</button>
          </div>
        </div>
      )}

      {/* Lead Detail Slide-over */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailPanel
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onUpdate={(updated) => {
              load();
              if (updated) setSelectedLead(updated);
            }}
            onTriggerEdit={(l) => {
              setEditLead(l);
              setShowEditModal(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Lead Modal */}
      <ConfirmDeleteModal
        isOpen={confirmDeleteId !== null}
        title="Delete Lead"
        message="Are you sure you want to permanently delete this lead? All contact information and communication history will be lost."
        onConfirm={executeDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {/* Add Lead Modal */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={load}
      />

      {/* Edit Lead Modal */}
      {showEditModal && editLead && (
        <EditLeadModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditLead(null);
          }}
          lead={editLead}
          onUpdate={load}
        />
      )}
    </div>
  );
}
