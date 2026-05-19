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
  async create(blog: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabase.from('blogs').insert(blog).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, blog: Partial<Blog>): Promise<Blog> {
    const { data, error } = await supabase.from('blogs').update(blog).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) handleError(error);
  }
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
  async create(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) handleError(error);
  }
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
  async create(mentor: Partial<Mentor>): Promise<Mentor> {
    const { data, error } = await supabase.from('mentors').insert(mentor).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, mentor: Partial<Mentor>): Promise<Mentor> {
    const { data, error } = await supabase.from('mentors').update(mentor).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('mentors').delete().eq('id', id);
    if (error) handleError(error);
  }
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
  async update(id: string, lead: Partial<Lead>): Promise<Lead> {
    const { data, error } = await supabase.from('leads').update(lead).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) handleError(error);
  }
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

// ==========================================
// PROJECT SHOWCASE
// ==========================================
export const showcaseService = {
  async getAll(): Promise<ProjectShowcase[]> {
    const { data, error } = await supabase.from('showcase').select('*').order('created_at', { ascending: false });
    if (error) handleError(error);
    return data || [];
  },
  async create(project: Partial<ProjectShowcase>): Promise<ProjectShowcase> {
    const { data, error } = await supabase.from('showcase').insert(project).select().single();
    if (error) handleError(error);
    return data;
  },
  async update(id: string, project: Partial<ProjectShowcase>): Promise<ProjectShowcase> {
    const { data, error } = await supabase.from('showcase').update(project).eq('id', id).select().single();
    if (error) handleError(error);
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('showcase').delete().eq('id', id);
    if (error) handleError(error);
  }
};

// ==========================================
// VISUAL BLOCKS
// ==========================================
export const visualBlocksService = {
  async getAll(): Promise<any[]> {
    const { data, error } = await supabase.from('visual_blocks').select('*').order('position', { ascending: true });
    if (error) handleError(error);
    return data || [];
  },
  async saveAll(blocks: any[]): Promise<void> {
    // Standard visual block sync: delete existing, insert new
    // Bypassing RLS requires service role, else table has insert/delete rules.
    const { error: deleteError } = await supabase.from('visual_blocks').delete().neq('id', 'placeholder-non-existent');
    if (deleteError) handleError(deleteError);
    if (blocks.length > 0) {
      const { error: insertError } = await supabase.from('visual_blocks').insert(blocks);
      if (insertError) handleError(insertError);
    }
  }
};

