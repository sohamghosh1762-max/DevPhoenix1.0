"use client";

import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Search, Inbox, BookOpen } from 'lucide-react';
import FormModal, { Field, Input, Textarea } from '@/components/admin/FormModal';
import { learningPathsData } from '@/data/learningPaths';
import VisualBlockManager from '@/components/admin/VisualBlockManager';

const EMPTY = { title: '', description: '', duration: '', level: '', modules: '', tags: '', image: '' };

export default function AdminLearningPathsPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    // Load static learning paths data
    setPaths(Array.isArray(learningPathsData) ? learningPathsData : []);
  }, []);

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  const filtered = paths.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Learning Paths</h1>
          <p className="text-slate-400">{paths.length} structured paths</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Path
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search paths..."
          className="w-full bg-[#151821] border border-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500/50" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#151821] border border-slate-800 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">No learning paths found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((path, i) => (
            <div key={path.id || i} className="bg-[#151821] border border-slate-800 rounded-2xl p-5 hover:border-slate-600 transition-all">
              {path.image && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900 mb-4">
                  <img src={path.image} alt={path.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-white">{path.title}</h3>
                <span className="text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-full font-semibold whitespace-nowrap shrink-0">
                  {path.level || 'All Levels'}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">{path.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {path.duration && <span>⏱ {path.duration}</span>}
                {path.modules && <span>📚 {Array.isArray(path.modules) ? path.modules.length : path.modules} modules</span>}
              </div>
            </div>
          ))}
        </div>
      )}


      <div className="mt-8 space-y-6">
        <VisualBlockManager
          sectionKey="learning-paths"
          title="Learning Path Custom Roadmaps & Cards CMS"
          subtitle="Add, remove, reorder or configure custom roadmaps, learning steps and interactive badges."
        />
      </div>

      {modal && (
        <FormModal isOpen={modal} title="Add Learning Path" onClose={() => { setModal(false); setEditing(null); setForm(EMPTY); }} onSubmit={() => setModal(false)}>
          <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="AI Builder Roadmap" /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={f('description')} rows={2} placeholder="What this path teaches..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration"><Input value={form.duration} onChange={f('duration')} placeholder="3 Months" /></Field>
            <Field label="Level"><Input value={form.level} onChange={f('level')} placeholder="Beginner" /></Field>
          </div>
          <Field label="Cover Image URL"><Input value={form.image} onChange={f('image')} placeholder="https://..." /></Field>
          <p className="text-xs text-slate-600 bg-slate-800/50 rounded-lg px-3 py-2">
            ℹ️ To add this path to the live site, update <code className="text-orange-400">src/data/learningPaths.ts</code> and redeploy.
          </p>
        </FormModal>
      )}
    </div>
  );
}

