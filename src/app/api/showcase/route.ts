import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { showcaseProjectsData } from '@/data/showcase';
import { showcaseService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';

const FILE_PATH = join(process.cwd(), 'src/data/showcase-dynamic.json');

const INITIAL_SEED = showcaseProjectsData.map((project, idx) => ({
  ...project,
  id: `showcase-static-${project.id || idx}`
}));

function read() {
  if (!existsSync(FILE_PATH)) {
    writeFileSync(FILE_PATH, JSON.stringify(INITIAL_SEED, null, 2));
    return INITIAL_SEED;
  }
  try {
    const data = JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
    if (!Array.isArray(data) || data.length === 0) {
      writeFileSync(FILE_PATH, JSON.stringify(INITIAL_SEED, null, 2));
      return INITIAL_SEED;
    }
    return data;
  } catch {
    return INITIAL_SEED;
  }
}

function write(d: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(d, null, 2));
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await showcaseService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase showcase GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const n = { id: `showcase-${Date.now()}`, ...b };

  if (hasSupabaseConfig) {
    try {
      const created = await showcaseService.create(n);
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      console.error('Supabase showcase POST error, falling back to local:', err);
    }
  }

  const items = read();
  items.push(n);
  write(items);
  return NextResponse.json(n, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const b = await req.json();

  if (hasSupabaseConfig) {
    try {
      const updated = await showcaseService.update(b.id, b);
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error('Supabase showcase PUT error, falling back to local:', err);
    }
  }

  const items = read();
  const i = items.findIndex((x: any) => x.id === b.id);
  if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  items[i] = { ...items[i], ...b };
  write(items);
  return NextResponse.json(items[i]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (hasSupabaseConfig) {
    try {
      await showcaseService.delete(id);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Supabase showcase DELETE error, falling back to local:', err);
    }
  }

  write(read().filter((x: any) => x.id !== id));
  return NextResponse.json({ success: true });
}

