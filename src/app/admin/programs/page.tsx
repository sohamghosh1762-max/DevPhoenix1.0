"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, GraduationCap, ChevronDown, ChevronUp, BookOpen, HelpCircle, DollarSign, ExternalLink } from 'lucide-react';
import FormModal, { Field, Input, Textarea, Select } from '@/components/admin/FormModal';
import ImagePicker from '@/components/admin/ImagePicker';
import VisualBlockManager from '@/components/admin/VisualBlockManager';
import Link from 'next/link';

const EMPTY_MODULE = { week: '', title: '', topics: '' };
const EMPTY_FAQ = { question: '', answer: '' };

const EMPTY = {
  id: '', title: '', description: '', overview: '', category: 'Development', level: 'Beginner',
  duration: '4-6 Months', type: 'Premium', price: '', practicalHours: '100+ Hours',
  tags: '', image: '', outcomes: '', projects: 10,
  // rich fields
  curriculum: [] as any[], faqs: [] as any[],
  originalPrice: '', discountedPrice: '', emi: '', includes: '',
};

type TabKey = 'basic' | 'curriculum' | 'faqs' | 'pricing';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('basic');

  // ── curriculum editing state ──
  const [newModule, setNewModule] = useState(EMPTY_MODULE);
  const [newFaq, setNewFaq] = useState(EMPTY_FAQ);

  const load = () => fetch('/api/programs').then(r => r.json()).then(d => setPrograms(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...EMPTY, curriculum: [], faqs: [] });
    setEditing(null);
    setActiveTab('basic');
    setModalOpen(true);
  };
  const openEdit = (p: any) => {
    setForm({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      outcomes: Array.isArray(p.outcomes) ? p.outcomes.join('\n') : p.outcomes || '',
      curriculum: p.curriculum || [],
      faqs: p.faqs || [],
      originalPrice: p.pricingDetails?.originalPrice || '',
      discountedPrice: p.pricingDetails?.discountedPrice || p.price || '',
      emi: p.pricingDetails?.emi || '',
      includes: Array.isArray(p.pricingDetails?.includes) ? p.pricingDetails.includes.join('\n') : '',
    });
    setEditing(p);
    setActiveTab('basic');
    setModalOpen(true);
  };

  const handleSave = async () => {
    setLoading(true);
    const slug = form.slug || form.id || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = {
      ...form,
      slug,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : form.tags,
      outcomes: typeof form.outcomes === 'string' ? form.outcomes.split('\n').filter(Boolean) : form.outcomes,
      projects: Number(form.projects),
      curriculum: form.curriculum || [],
      faqs: form.faqs || [],
      pricingDetails: {
        originalPrice: form.originalPrice,
        discountedPrice: form.discountedPrice || form.price,
        emi: form.emi || null,
        includes: typeof form.includes === 'string' ? form.includes.split('\n').filter(Boolean) : (form.includes || []),
      },
    };
    const method = editing ? 'PUT' : 'POST';
    await fetch('/api/programs', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setModalOpen(false);
    setLoading(false);
    setNewModule(EMPTY_MODULE);
    setNewFaq(EMPTY_FAQ);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    await fetch('/api/programs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  // ── Curriculum helpers ──
  const addModule = () => {
    if (!newModule.title) return;
    const mod = {
      week: newModule.week,
      title: newModule.title,
      topics: newModule.topics.split('\n').filter(Boolean),
    };
    setForm((p: any) => ({ ...p, curriculum: [...(p.curriculum || []), mod] }));
    setNewModule(EMPTY_MODULE);
  };
  const removeModule = (i: number) => setForm((p: any) => ({ ...p, curriculum: p.curriculum.filter((_: any, idx: number) => idx !== i) }));

  // ── FAQ helpers ──
  const addFaq = () => {
    if (!newFaq.question) return;
    setForm((p: any) => ({ ...p, faqs: [...(p.faqs || []), { ...newFaq }] }));
    setNewFaq(EMPTY_FAQ);
  };
  const removeFaq = (i: number) => setForm((p: any) => ({ ...p, faqs: p.faqs.filter((_: any, idx: number) => idx !== i) }));

  const filtered = programs.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.type === filter;
    return matchSearch && matchFilter;
  });

  const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const TABS: { key: TabKey; label: string; icon: any }[] = [
    { key: 'basic', label: 'Basic Info', icon: GraduationCap },
    { key: 'curriculum', label: `Curriculum (${form.curriculum?.length || 0})`, icon: BookOpen },
    { key: 'faqs', label: `FAQs (${form.faqs?.length || 0})`, icon: HelpCircle },
    { key: 'pricing', label: 'Pricing', icon: DollarSign },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Programs</h1>
          <p className="text-slate-500 mt-1">{programs.length} programs • {programs.filter(p => p.type === 'Premium').length} Premium</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search programs..." className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        {['All', 'Premium', 'Industrial'].map(fl => (
          <button key={fl} onClick={() => setFilter(fl)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === fl ? 'bg-orange-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{fl}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map(p => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group"
            >
              <div className="relative h-36 bg-slate-100">
                {p.image && <img src={p.image} alt={p.title} className="w-full h-full object-cover" />}
                <div className="absolute top-2 right-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.type === 'Premium' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-white'}`}>{p.type}</span>
                </div>
                {/* Curriculum badge */}
                {p.curriculum?.length > 0 && (
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">{p.curriculum.length} modules</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-extrabold text-slate-900 mb-1">{p.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-orange-600">{p.pricingDetails?.discountedPrice || p.price}</span>
                    {p.pricingDetails?.originalPrice && <span className="text-xs text-slate-400 line-through ml-2">{p.pricingDetails.originalPrice}</span>}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/programs/${p.slug || p.id}`} target="_blank" className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 flex items-center justify-center transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                    </Link>
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-orange-50 flex items-center justify-center transition-colors">
                      <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-3 py-16 text-center text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No programs found.</p>
          </div>
        )}
      </div>

      {/* Modal with tabs */}
      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit: ${editing.title}` : 'Add New Program'} onSubmit={handleSave} loading={loading}>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 -mt-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.key ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── BASIC TAB ── */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="Full Stack Development" /></Field>
            <Field label="Short Description" required><Textarea value={form.description} onChange={f('description')} rows={2} placeholder="One-liner shown on program cards..." /></Field>
            <Field label="Overview (shown on detail page)"><Textarea value={form.overview || ''} onChange={f('overview')} rows={3} placeholder="Full program overview for the detail page..." /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type"><Select value={form.type} onChange={f('type')}><option>Premium</option><option>Industrial</option></Select></Field>
              <Field label="Category"><Select value={form.category} onChange={f('category')}><option>Development</option><option>Cloud & DevOps</option><option>Data & AI</option><option>AI & Automation</option><option>Marketing & Growth</option><option>Computer Science</option><option>Productivity & Tools</option><option>Business & Strategy</option></Select></Field>
              <Field label="Level"><Select value={form.level} onChange={f('level')}><option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Beginner to Advanced</option><option>All Levels</option></Select></Field>
              <Field label="Duration"><Input value={form.duration} onChange={f('duration')} placeholder="4-6 Months" /></Field>
              <Field label="Practical Hours"><Input value={form.practicalHours} onChange={f('practicalHours')} placeholder="100+ Hours" /></Field>
              <Field label="Projects Count"><Input type="number" value={form.projects} onChange={f('projects')} /></Field>
            </div>
            <Field label="Tags (comma-separated)"><Input value={form.tags} onChange={f('tags')} placeholder="React, Node.js, AWS" /></Field>
            <Field label="Outcomes (one per line)"><Textarea value={form.outcomes} onChange={f('outcomes')} rows={3} placeholder={"Build full-stack apps\nMaster cloud deployment"} /></Field>
            <ImagePicker value={form.image} onChange={url => setForm((p: any) => ({ ...p, image: url }))} label="Program Cover Image" />
          </div>
        )}

        {/* ── CURRICULUM TAB ── */}
        {activeTab === 'curriculum' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">Add week-by-week modules. Each module contains topics (one per line).</p>

            {/* Existing modules */}
            {(form.curriculum || []).map((mod: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-orange-500 font-bold">{mod.week || `Module ${i + 1}`}</p>
                    <p className="font-bold text-slate-800">{mod.title}</p>
                  </div>
                  <button type="button" onClick={() => removeModule(i)} className="p-1 rounded hover:bg-red-50 text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="space-y-1">
                  {(mod.topics || mod.lessons || []).map((t: string, j: number) => (
                    <li key={j} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Add new module */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add Module</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">Week Label</label>
                  <input value={newModule.week} onChange={e => setNewModule(p => ({ ...p, week: e.target.value }))} placeholder="Week 1-2" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold mb-1 block">Module Title *</label>
                  <input value={newModule.title} onChange={e => setNewModule(p => ({ ...p, title: e.target.value }))} placeholder="React Fundamentals" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Topics (one per line)</label>
                <textarea value={newModule.topics} onChange={e => setNewModule(p => ({ ...p, topics: e.target.value }))} placeholder={"Components & Props\nHooks deep dive\nState management"} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <button type="button" onClick={addModule} disabled={!newModule.title} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Module
              </button>
            </div>
          </div>
        )}

        {/* ── FAQs TAB ── */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {(form.faqs || []).map((faq: any, i: number) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex justify-between mb-1">
                  <p className="font-bold text-slate-800 text-sm">{faq.question}</p>
                  <button type="button" onClick={() => removeFaq(i)} className="p-1 rounded hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Add FAQ</p>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Question *</label>
                <input value={newFaq.question} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="Do I need prior experience?" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Answer *</label>
                <textarea value={newFaq.answer} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} placeholder="No prior experience required..." rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <button type="button" onClick={addFaq} disabled={!newFaq.question} className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add FAQ
              </button>
            </div>
          </div>
        )}

        {/* ── PRICING TAB ── */}
        {activeTab === 'pricing' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Display Price (used on cards)"><Input value={form.price} onChange={f('price')} placeholder="₹4,999" /></Field>
              <Field label="Original / Crossed-out Price"><Input value={form.originalPrice} onChange={f('originalPrice')} placeholder="₹9,999" /></Field>
              <Field label="Discounted Price (shown on detail page)"><Input value={form.discountedPrice} onChange={f('discountedPrice')} placeholder="₹4,999" /></Field>
              <Field label="EMI Option"><Input value={form.emi} onChange={f('emi')} placeholder="₹999/month" /></Field>
            </div>
            <Field label="What's Included (one per line)">
              <Textarea
                value={form.includes}
                onChange={f('includes')}
                rows={5}
                placeholder={"Lifetime access to recordings\nLive mentor sessions\nCertificate of completion\nProject reviews\nCommunity access"}
              />
            </Field>
          </div>
        )}

      </FormModal>

      <div className="mt-8 space-y-6 border-t border-slate-100 pt-8">
        <VisualBlockManager
          sectionKey="programs"
          title="Program Graphic Illustrations & Custom Visual Cards CMS"
          subtitle="Manage learning badges, sidebar visual blocks, and detail-page graphic panels."
        />
      </div>
    </div>
  );
}

