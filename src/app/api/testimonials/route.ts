import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { testimonialsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';

export const dynamic = 'force-dynamic';


const FILE_PATH = join(process.cwd(), 'src/data/testimonials.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return []; }
}

function write(data: any[]) {
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export async function GET() {
  if (hasSupabaseConfig) {
    try {
      const items = await testimonialsService.getAll();
      return NextResponse.json(items);
    } catch (err: any) {
      console.error('Supabase testimonials GET error, falling back to local:', err);
    }
  }
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newItem = { id: `testimonials-${Date.now()}`, ...body };

  if (hasSupabaseConfig) {
    try {
      const created = await testimonialsService.create(newItem);
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      console.error('Supabase testimonials POST error, falling back to local:', err);
    }
  }

  const items = read();
  items.push(newItem);
  write(items);
  return NextResponse.json(newItem, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (hasSupabaseConfig) {
    try {
      const updated = await testimonialsService.update(body.id, body);
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error('Supabase testimonials PUT error, falling back to local:', err);
    }
  }

  const items = read();
  const idx = items.findIndex((i: any) => i.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  items[idx] = { ...items[idx], ...body };
  write(items);
  return NextResponse.json(items[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (hasSupabaseConfig) {
    try {
      await testimonialsService.delete(id);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Supabase testimonials DELETE error, falling back to local:', err);
    }
  }

  write(read().filter((i: any) => i.id !== id));
  return NextResponse.json({ success: true });
}

