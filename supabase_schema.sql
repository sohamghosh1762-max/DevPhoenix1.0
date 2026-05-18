-- DevPhoeniX Ecosystem - Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. Programs Table
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
  
  -- Deep Dynamic Schema
  curriculum JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  pricingDetails JSONB,
  tools TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  coverImage TEXT NOT NULL,
  publishedAt TEXT NOT NULL,
  readTime TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  author JSONB NOT NULL, -- { name, avatar, role }
  isPublished BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT,
  avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  program TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  avatar TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  isVerified BOOLEAN NOT NULL DEFAULT true,
  followers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Leads Table (CRM)
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

-- 6. Site Config Table (Singleton)
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero JSONB NOT NULL, -- { badge, headline1, headline2, subheadline, primaryCta, secondaryCta, stats }
  contact JSONB NOT NULL, -- { email, phone }
  socials JSONB NOT NULL, -- { instagram, linkedin, facebook, twitter, github }
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Showcase Table
CREATE TABLE IF NOT EXISTS showcase (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 8. Admin Users (For future RBAC)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor', -- super_admin, editor, content_manager
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Insert initial dummy Site Config if empty
INSERT INTO site_config (id, hero, contact, socials)
VALUES (
  'global',
  '{"badge":"The Elite Builder Ecosystem","headline1":"Learn. Build.","headline2":"Scale Faster.","subheadline":"Join a premium community of top 1% developers, founders, and creators building the future.","primaryCta":{"text":"Explore Programs","href":"/programs"},"secondaryCta":{"text":"Join Community","href":"/community"},"stats":[{"value":"1000+","label":"Active Builders"},{"value":"₹20M+","label":"Total Placements"},{"value":"50+","label":"Industry Mentors"}]}',
  '{"email":"hello@devphoenix.tech","phone":"+91 9876543210"}',
  '{"instagram":"#","linkedin":"#","facebook":"#","twitter":"#","github":"#"}'
) ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies
-- Note: Since we are using Next.js Server Components / API Routes with a Service Role Key (eventually), 
-- we can allow anonymous reads and restrict writes, OR completely bypass RLS if using the service role.
-- For now, enabling public read access to content tables.

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to programs" ON programs FOR SELECT USING (true);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to published blogs" ON blogs FOR SELECT USING (isPublished = true);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to testimonials" ON testimonials FOR SELECT USING (true);

ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to mentors" ON mentors FOR SELECT USING (true);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to site config" ON site_config FOR SELECT USING (true);

ALTER TABLE showcase ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-only access to showcase" ON showcase FOR SELECT USING (true);

-- Leads and Admin Users should NOT have public read access.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Note: To allow Next.js API routes (or Server Actions) to write to these tables,
-- you MUST use the SUPABASE_SERVICE_ROLE_KEY on the server side, which bypasses RLS.
