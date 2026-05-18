import { supabase } from './client';
import { Program, Blog, Testimonial, Mentor, Lead, HomepageSettings, ProjectShowcase } from '@/types';

// Generic error handler
const handleError = (error: any) => {
  console.error('Supabase Error:', error);
  throw new Error(error.message || 'Database error occurred');
};

// ==========================================
// PROGRAMS
// ==========================================
export const programsService = {
  async getAll(): Promise<Program[]> {
    const { data, error } = await supabase.from('programs').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async getById(id: string): Promise<Program | null> {
    const { data, error } = await supabase.from('programs').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },
  async getBySlug(slug: string): Promise<Program | null> {
    const { data, error } = await supabase.from('programs').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },
  async create(program: Partial<Program>): Promise<Program> {
    const { data, error } = await supabase.from('programs').insert(program).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, program: Partial<Program>): Promise<Program> {
    const { data, error } = await supabase.from('programs').update(program).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// BLOGS
// ==========================================
export const blogsService = {
  async getAll(publishedOnly = false): Promise<Blog[]> {
    let query = supabase.from('blogs').select('*').order('publishedAt', { ascending: false });
    if (publishedOnly) query = query.eq('isPublished', true);
    const { data, error } = await query;
    if (error) handleError(error);
    return data || [];
  },
  async getBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },
  // Add create, update, delete similarly...
};

// ==========================================
// TESTIMONIALS
// ==========================================
export const testimonialsService = {
  async getAll(): Promise<Testimonial[]> {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  // Add CRUD...
};

// ==========================================
// MENTORS
// ==========================================
export const mentorsService = {
  async getAll(): Promise<Mentor[]> {
    const { data, error } = await supabase.from('mentors').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  // Add CRUD...
};

// ==========================================
// LEADS (CRM)
// ==========================================
export const leadsService = {
  async getAll(): Promise<Lead[]> {
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async create(lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (error) handleError(error);
    return data;
  },
  // Add update status...
};

// ==========================================
// SITE CONFIG
// ==========================================
export const siteConfigService = {
  async get(): Promise<HomepageSettings | null> {
    const { data, error } = await supabase.from('site_config').select('*').eq('id', 'global').single();
    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },
  async update(config: Partial<HomepageSettings>): Promise<HomepageSettings> {
    const { data, error } = await supabase.from('site_config').update(config).eq('id', 'global').select().single();
    if (error) handleError(error);
    return data;
  }
};
