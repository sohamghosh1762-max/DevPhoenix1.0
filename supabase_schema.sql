-- DevPhoeniX Ecosystem - Production-Ready Supabase Schema
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- ── 1. PROGRAMS TABLE ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  overview TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  type TEXT NOT NULL,
  price TEXT NOT NULL,
  practicalHours TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL,
  outcomes TEXT[] NOT NULL DEFAULT '{}',
  projects INTEGER NOT NULL DEFAULT 0,
  
  curriculum JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  pricingDetails JSONB DEFAULT '{}'::jsonb,
  tools TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 2. BLOGS TABLE ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  coverImage TEXT NOT NULL,
  publishedAt TEXT NOT NULL,
  readTime TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author JSONB NOT NULL DEFAULT '{"name": "Admin", "role": "Instructor", "avatar": ""}'::jsonb,
  isPublished BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 3. TESTIMONIALS TABLE ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  program TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 4. MENTORS TABLE ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mentors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  avatar TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  isVerified BOOLEAN NOT NULL DEFAULT true,
  followers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 5. LEADS TABLE (CRM) ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  program TEXT NOT NULL DEFAULT '',
  currentStatus TEXT NOT NULL DEFAULT '',
  message TEXT,
  source_page TEXT DEFAULT '',
  source_campaign TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'New',
  notes JSONB DEFAULT '[]'::jsonb,
  assigned_admin TEXT,
  last_contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 6. SITE CONFIG TABLE (SINGLETON) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero JSONB NOT NULL,
  contact JSONB NOT NULL,
  socials JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 7. SHOWCASE TABLE ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS showcase (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  githubUrl TEXT,
  liveUrl TEXT,
  authorName TEXT NOT NULL,
  programName TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 8. VISUAL BLOCKS TABLE ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS visual_blocks (
  id TEXT PRIMARY KEY,
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  badge TEXT,
  cta_text TEXT,
  cta_link TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  visibility BOOLEAN NOT NULL DEFAULT true,
  theme_variant TEXT NOT NULL DEFAULT 'glass',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── 9. ADMIN USERS TABLE ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- ── 10. INSERT INITIAL GLOBAL CONFIGURATION ───────────────────────────────────
INSERT INTO site_config (id, hero, contact, socials)
VALUES (
  'global',
  '{"badge":"The Elite Builder Ecosystem","headline1":"Learn. Build.","headline2":"Scale Faster.","subheadline":"Join a premium community of top 1% developers, founders, and creators building the future.","primaryCta":{"text":"Explore Programs","href":"/programs"},"secondaryCta":{"text":"Join Community","href":"/community"},"stats":[{"value":"1000+","label":"Active Builders"},{"value":"₹20M+","label":"Total Placements"},{"value":"50+","label":"Industry Mentors"}]}',
  '{"email":"hello@devphoenix.tech","phone":"+91 9876543210"}',
  '{"instagram":"#","linkedin":"#","facebook":"#","twitter":"#","github":"#"}'
) ON CONFLICT (id) DO NOTHING;

-- ── 11. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────────────
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to programs" ON programs;
CREATE POLICY "Allow public read-only access to programs" ON programs FOR SELECT USING (true);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to blogs" ON blogs;
CREATE POLICY "Allow public read-only access to blogs" ON blogs FOR SELECT USING (true);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to testimonials" ON testimonials;
CREATE POLICY "Allow public read-only access to testimonials" ON testimonials FOR SELECT USING (true);

ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to mentors" ON mentors;
CREATE POLICY "Allow public read-only access to mentors" ON mentors FOR SELECT USING (true);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to site config" ON site_config;
CREATE POLICY "Allow public read-only access to site config" ON site_config FOR SELECT USING (true);

ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to showcase" ON showcase;
CREATE POLICY "Allow public read-only access to showcase" ON showcase FOR SELECT USING (true);

ALTER TABLE visual_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read-only access to visual blocks" ON visual_blocks;
CREATE POLICY "Allow public read-only access to visual blocks" ON visual_blocks FOR SELECT USING (true);

-- Leads and admin users tables are protected from public read access.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Note: Since Next.js server-side API routes bypass RLS using the SUPABASE_SERVICE_ROLE_KEY 
-- (or perform authenticated admin actions), you can create write policies or rely on Service Role.

-- ── 12. STORAGE BUCKET CREATION & POLICIES ─────────────────────────────────────

-- Ensure extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create public media bucket
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'media',
  'media',
  true,
  10485760,
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/gif',
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- PUBLIC READ ACCESS
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');

-- AUTHENTICATED UPLOAD ACCESS
DROP POLICY IF EXISTS "Allow Authenticated Uploads" ON storage.objects;
CREATE POLICY "Allow Authenticated Uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- AUTHENTICATED DELETE ACCESS
DROP POLICY IF EXISTS "Allow Authenticated Deletes" ON storage.objects;
CREATE POLICY "Allow Authenticated Deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media');
