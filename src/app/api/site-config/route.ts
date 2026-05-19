import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { siteConfigService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';

const FILE_PATH = join(process.cwd(), 'src/data/site-config.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return {}; }
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const config = await siteConfigService.get();
      if (config) return NextResponse.json(config);
    } catch (err: any) {
      console.error('Supabase site-config GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (hasSupabaseConfig) {
    try {
      const updated = await siteConfigService.update(body);
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error('Supabase site-config PUT error, falling back to local:', err);
    }
  }

  const current = read();
  const updated = { ...current, ...body };
  writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}

