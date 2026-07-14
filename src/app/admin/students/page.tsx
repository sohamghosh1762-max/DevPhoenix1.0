"use client";
import { useEffect, useState } from 'react';
import { Search, Plus, Mail, Phone, MapPin, Download, Trash2, Edit2, ShieldAlert, Award, BookOpen, Layers, CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { showToast } from '@/components/ui/PremiumToast';

interface Student {
  id: string;
  userId: string;
  studentCode: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  bio: string;
  skills: string[];
  batch: string;
  points: number;
  badges: number;
  level: number;
  joiningDate: string;
  certificateStatus: string;
  courseId: string;
  courseName: string;
}

interface Program {
  id: string;
  title: string;
}

export default function StudentsAdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formStudentCode, setFormStudentCode] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formBatch, setFormBatch] = useState('');
  const [formCourseId, setFormCourseId] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formCertificateStatus, setFormCertificateStatus] = useState('Locked (Incomplete Syllabus)');
  
  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch all students & programs
  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, programsRes] = await Promise.all([
        fetch('/api/admin/students', { cache: 'no-store' }),
        fetch('/api/admin/programs', { cache: 'no-store' })
      ]);

      const studentsJson = await studentsRes.json();
      const programsJson = await programsRes.json();

      if (studentsJson.success) {
        setStudents(studentsJson.data);
      } else {
        showToast(studentsJson.error?.message || 'Failed to load students', 'error');
      }

      if (programsJson.success) {
        setPrograms(programsJson.data);
      } else {
        showToast(programsJson.error?.message || 'Failed to load programs', 'error');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Network error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter students
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.courseName.toLowerCase().includes(search.toLowerCase())
  );

  // Open modal for add
  const handleOpenAdd = () => {
    setSelectedStudent(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormStudentCode('');
    setFormPhone('');
    setFormWhatsapp('');
    setFormBatch('Batch 2026');
    setFormCourseId(programs[0]?.id || '');
    setFormBio('');
    setFormAddress('');
    setFormSkills('');
    setFormCertificateStatus('Locked (Incomplete Syllabus)');
    setFormError('');
    setIsAddEditOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormName(student.name);
    setFormEmail(student.email);
    setFormPassword(''); // clear password for edit (optional)
    setFormStudentCode(student.studentCode);
    setFormPhone(student.phone);
    setFormWhatsapp(student.whatsapp);
    setFormBatch(student.batch);
    setFormCourseId(student.courseId);
    setFormBio(student.bio);
    setFormAddress(student.address);
    setFormSkills(student.skills.join(', '));
    setFormCertificateStatus(student.certificateStatus);
    setFormError('');
    setIsAddEditOpen(true);
  };

  // Open delete dialog
  const handleOpenDelete = (student: Student) => {
    setSelectedStudent(student);
    setIsDeleteOpen(true);
  };

  // Handle Add/Edit form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formName.trim() || !formEmail.trim() || !formStudentCode.trim() || !formCourseId) {
      setFormError('Name, Email, Student Code, and Course/Program are required.');
      setIsSubmitting(false);
      return;
    }

    if (!selectedStudent && !formPassword) {
      setFormError('Password is required for new students.');
      setIsSubmitting(false);
      return;
    }

    const skillsArray = formSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '');

    const payload = {
      name: formName.trim(),
      email: formEmail.trim(),
      password: formPassword || undefined,
      studentCode: formStudentCode.trim(),
      phone: formPhone.trim() || null,
      whatsapp: formWhatsapp.trim() || null,
      batch: formBatch.trim() || null,
      courseId: formCourseId,
      bio: formBio.trim() || null,
      address: formAddress.trim() || null,
      skills: skillsArray,
      certificateStatus: formCertificateStatus.trim() || null,
    };

    try {
      const url = selectedStudent 
        ? `/api/admin/students/${selectedStudent.id}`
        : '/api/admin/students';
      const method = selectedStudent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setFormError(json.error?.message || 'Operation failed');
        showToast(json.error?.message || 'Operation failed', 'error');
      } else {
        showToast(
          selectedStudent ? 'Student details updated successfully' : 'New student registered successfully', 
          'success'
        );
        setIsAddEditOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setFormError('A network error occurred. Please try again.');
      showToast('Network error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle student delete
  const handleDelete = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/students/${selectedStudent.id}`, {
        method: 'DELETE'
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        showToast(json.error?.message || 'Deletion failed', 'error');
      } else {
        showToast('Student deleted successfully', 'success');
        setIsDeleteOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast('Network error occurred during deletion', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render certificate badge styling
  const getCertBadgeColor = (status: string) => {
    if (!status) return 'bg-slate-100 text-slate-600 border-slate-200';
    const s = status.toLowerCase();
    if (s.includes('claimed') || s.includes('unlocked') || s.includes('complete')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('progress') || s.includes('review')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#6366F1]" /> Student Portal Management
          </h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Create, update, and manage student details for trainees accessing the DevPhoenix Portal.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
            Add Trainee
          </Button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by student name, code, email, or program..."
          className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium"
        />
      </div>

      {/* Trainees Directory Table */}
      {loading ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Querying PostgreSQL Trainees Database...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-800">No Students Found</h3>
          <p className="text-slate-500 text-sm font-semibold max-w-sm mx-auto mt-1">
            There are no student profiles matching your search or seeded in the system. Use the "Add Trainee" button above to register one.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="border-b border-slate-100 bg-slate-50/50">
                <tr>
                  {['Trainee & Code', 'Enrolled Program', 'Contact Info', 'Batch & Level', 'Certificate Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Trainee Code */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-sm uppercase">
                          {student.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-800 leading-snug">{student.name}</p>
                          <p className="text-[10px] font-black uppercase text-[#6366F1] mt-0.5 tracking-wider">
                            {student.studentCode}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Course Program */}
                    <td className="px-6 py-4">
                      <div className="max-w-[250px]">
                        <p className="font-bold text-slate-700 leading-snug truncate">{student.courseName}</p>
                        <p className="text-slate-400 text-xs mt-0.5 font-semibold">PostgreSQL Registered</p>
                      </div>
                    </td>
                    {/* Contacts Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-slate-600 text-xs flex items-center gap-1.5 font-semibold">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {student.email}
                        </p>
                        {student.phone && (
                          <p className="text-slate-600 text-xs flex items-center gap-1.5 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {student.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    {/* Batch and stats */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-700 text-xs">{student.batch}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">
                            LVL {student.level}
                          </span>
                          <span className="text-[10px] text-amber-600 font-extrabold flex items-center gap-0.5">
                            ★ {student.points} pts
                          </span>
                        </div>
                      </div>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${getCertBadgeColor(student.certificateStatus)}`}>
                        {student.certificateStatus || 'Locked'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleOpenEdit(student)}
                          className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#6366F1] transition-colors" 
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(student)}
                          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" 
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── ADD/EDIT TRAINEE MODAL ────────────────────────────────────────── */}
      {isAddEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {selectedStudent ? 'Modify Trainee Profile' : 'Register New Trainee'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudent ? 'Edit student settings and credentials' : 'Register credentials & setup custom database progress'}
                </p>
              </div>
              <button 
                onClick={() => setIsAddEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-100 p-1.5 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-bold flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Student Code *</label>
                  <input
                    type="text"
                    value={formStudentCode}
                    onChange={e => setFormStudentCode(e.target.value)}
                    placeholder="e.g. DP-AIML-4096"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium uppercase"
                    required
                    disabled={!!selectedStudent} // block code modification to prevent login mismatches
                  />
                </div>
              </div>

              {/* Credentials Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="e.g. rahul@devphoenix.com"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
                    Password {selectedStudent ? '(Leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder={selectedStudent ? '••••••••' : 'Min 6 characters'}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                    required={!selectedStudent}
                  />
                </div>
              </div>

              {/* Course & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Enrolled Course / Program *</label>
                  <select
                    value={formCourseId}
                    onChange={e => setFormCourseId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-semibold"
                    required
                  >
                    <option value="" disabled>Select Course Program</option>
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Batch Name</label>
                  <input
                    type="text"
                    value={formBatch}
                    onChange={e => setFormBatch(e.target.value)}
                    placeholder="e.g. AI & ML Cohort 4"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    value={formWhatsapp}
                    onChange={e => setFormWhatsapp(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={e => setFormSkills(e.target.value)}
                  placeholder="e.g. Python, Machine Learning, Deep Learning, PyTorch"
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium"
                />
              </div>

              {/* Certificate Status */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Certificate Status</label>
                <select
                  value={formCertificateStatus}
                  onChange={e => setFormCertificateStatus(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-semibold"
                >
                  <option value="Locked (Incomplete Syllabus)">Locked (Incomplete Syllabus)</option>
                  <option value="In Progress (Modules Pending)">In Progress (Modules Pending)</option>
                  <option value="Unlocked (Awaiting Review)">Unlocked (Awaiting Review)</option>
                  <option value="Claimed & Verified">Claimed & Verified</option>
                </select>
              </div>

              {/* Bio Details */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Trainee Bio Description</label>
                <textarea
                  value={formBio}
                  onChange={e => setFormBio(e.target.value)}
                  placeholder="Tell us about the student's background..."
                  className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium resize-none"
                />
              </div>

              {/* Address Details */}
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Mailing Address</label>
                <textarea
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  placeholder="Student complete mailing address..."
                  className="w-full h-20 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 font-medium resize-none"
                />
              </div>

              {/* Submit panel */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsAddEditOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  loading={isSubmitting}
                >
                  Save Trainee Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE STUDENT CONFIRMATION DIALOG ──────────────────────────────── */}
      {isDeleteOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-hidden">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-500" /> Confirm Deletion
            </h3>
            <p className="text-sm text-slate-500 font-semibold mt-2.5 leading-relaxed">
              Are you sure you want to delete trainee <strong className="text-slate-800">{selectedStudent.name} ({selectedStudent.studentCode})</strong>? 
              This action is permanent and will delete their login credentials, progress modules, capstone projects, and all custom data records in PostgreSQL.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setIsDeleteOpen(false)}
                disabled={isSubmitting}
              >
                No, Keep Profile
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleDelete}
                loading={isSubmitting}
              >
                Yes, Delete Permanent
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
