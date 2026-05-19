import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { blogPosts } from '@/data/blog';
import { blogsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';

const FILE_PATH = join(process.cwd(), 'src/data/blog-dynamic.json');

const INITIAL_SEED = blogPosts.map((post, idx) => ({
  id: `blog-static-${idx}`,
  createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  ...post
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
      const items = await blogsService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase blogs GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const n = { id: `blog-${Date.now()}`, createdAt: new Date().toISOString(), ...b };

  if (hasSupabaseConfig) {
    try {
      const created = await blogsService.create(n);
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      console.error('Supabase blogs POST error, falling back to local:', err);
    }
  }

  const items = read();
  items.unshift(n);
  write(items);
  return NextResponse.json(n, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const b = await req.json();

  if (hasSupabaseConfig) {
    try {
      const updated = await blogsService.update(b.id, b);
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error('Supabase blogs PUT error, falling back to local:', err);
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
      await blogsService.delete(id);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Supabase blogs DELETE error, falling back to local:', err);
    }
  }

  write(read().filter((x: any) => x.id !== id));
  return NextResponse.json({ success: true });
}

