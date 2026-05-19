import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mentorsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';

const FILE_PATH = join(process.cwd(), 'src/data/mentors.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return []; }
}

function write(d: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(d, null, 2));
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await mentorsService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase mentors GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  const n = { id: `mentor-${Date.now()}`, ...b };

  if (hasSupabaseConfig) {
    try {
      const created = await mentorsService.create(n);
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      console.error('Supabase mentors POST error, falling back to local:', err);
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
      const updated = await mentorsService.update(b.id, b);
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error('Supabase mentors PUT error, falling back to local:', err);
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
      await mentorsService.delete(id);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Supabase mentors DELETE error, falling back to local:', err);
    }
  }

  write(read().filter((x: any) => x.id !== id));
  return NextResponse.json({ success: true });
}

