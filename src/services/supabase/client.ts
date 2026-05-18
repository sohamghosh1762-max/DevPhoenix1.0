import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.warn('⚠️ SUPABASE CREDENTIALS MISSING: Running in disconnected mode. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local to connect to the database.');
}

// If credentials are not provided, we export a client that connects to localhost just to satisfy type requirements.
// The actual services should check `hasSupabaseConfig` and optionally fallback.
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321', 
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE1MzYwMDAsImV4cCI6MTk4NzExMzYwMH0.placeholder'
);
