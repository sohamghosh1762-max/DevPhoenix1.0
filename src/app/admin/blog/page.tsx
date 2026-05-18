"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, PenSquare } from 'lucide-react';
import FormModal, { Field, Input, Textarea, Select } from '@/components/admin/FormModal';
import ImagePicker from '@/components/admin/ImagePicker';

const EMPTY = { id: '', slug: '', title: '', excerpt: '', category: 'AI & Automation', readTime: '5 min read', date: '', image: '', content: '', published: true, author: { name: 'DevPhoeniX Team', role: 'Engineering', avatar: '/logo/devphoenix-logo.png' } };

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);

  const load = () => fetch('/api/blog').then(r => r.json()).then(d => setPosts(Array.isArray(d) ? d : [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...EMPTY, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) }); setEditing(null); setModalOpen(true); };
  const openEdit = (p: any) => { setForm(p); setEditing(p); setModalOpen(true); };
  const f = (field: string) => (e: any) => setForm((prev: any) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
    await fetch('/api/blog', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setModalOpen(false); setLoading(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Blog</h1>
          <p className="text-slate-500 mt-1">{posts.length} articles</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {posts.map(post => (
            <motion.div key={post.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 group"
            >
              {post.image && <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100"><img src={post.image} alt={post.title} className="w-full h-full object-cover" /></div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.readTime}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 truncate">{post.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
              </div>
              <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(post)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-orange-50 flex items-center justify-center transition-colors">
                  <Edit2 className="w-4 h-4 text-slate-600" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-red-50 flex items-center justify-center transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {posts.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
            <PenSquare className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No articles yet. Write your first one!</p>
          </div>
        )}
      </div>

      <FormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Article' : 'New Article'} onSubmit={handleSave} loading={loading} submitLabel="Publish">
        <Field label="Title" required><Input value={form.title} onChange={f('title')} placeholder="Building AI Agents with n8n..." /></Field>
        <Field label="Slug (URL)"><Input value={form.slug} onChange={f('slug')} placeholder="building-ai-agents-n8n" /></Field>
        <Field label="Excerpt"><Textarea value={form.excerpt} onChange={f('excerpt')} rows={2} placeholder="A short summary shown on the blog listing page..." /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category"><Select value={form.category} onChange={f('category')}><option>AI & Automation</option><option>Builder Journey</option><option>Cloud & DevOps</option><option>Data Science</option><option>Career</option></Select></Field>
          <Field label="Read Time"><Input value={form.readTime} onChange={f('readTime')} placeholder="8 min read" /></Field>
        </div>
        <ImagePicker value={form.image} onChange={url => setForm((p: any) => ({ ...p, image: url }))} label="Cover Image" />
        <Field label="Content (HTML)" required>
          <Textarea value={form.content} onChange={f('content')} rows={10} placeholder="<h2>Introduction</h2><p>Your article content here...</p>" className="font-mono text-xs" />
        </Field>
      </FormModal>
    </div>
  );
}
