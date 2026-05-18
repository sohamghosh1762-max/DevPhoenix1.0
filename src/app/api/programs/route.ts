import { NextRequest, NextResponse } from 'next/server';
import { programsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Temporary fallback for local JSON if Supabase is not yet configured
const PROGRAMS_PATH = join(process.cwd(), 'src/data/programs-dynamic.json');
function readLocalPrograms() {
  try { return JSON.parse(readFileSync(PROGRAMS_PATH, 'utf-8')); } 
  catch {
    try { return JSON.parse(readFileSync(join(process.cwd(), 'src/data/programs-static.json'), 'utf-8')); }
    catch { return []; }
  }
}
function writeLocalPrograms(data: any[]) { writeFileSync(PROGRAMS_PATH, JSON.stringify(data, null, 2)); }


export async function GET() {
  if (!hasSupabaseConfig) {
    return NextResponse.json(readLocalPrograms());
  }

  try {
    const programs = await programsService.getAll();
    return NextResponse.json(programs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!hasSupabaseConfig) {
    const programs = readLocalPrograms();
    const newProgram = { ...body, id: body.id || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
    programs.push(newProgram);
    writeLocalPrograms(programs);
    return NextResponse.json(newProgram, { status: 201 });
  }

  try {
    const newProgram = { ...body, id: body.id || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') };
    const program = await programsService.create(newProgram);
    return NextResponse.json(program, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  if (!hasSupabaseConfig) {
    const programs = readLocalPrograms();
    const idx = programs.findIndex((p: any) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    programs[idx] = { ...programs[idx], ...body };
    writeLocalPrograms(programs);
    return NextResponse.json(programs[idx]);
  }

  try {
    const program = await programsService.update(body.id, body);
    return NextResponse.json(program);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!hasSupabaseConfig) {
    const programs = readLocalPrograms();
    writeLocalPrograms(programs.filter((p: any) => p.id !== id));
    return NextResponse.json({ success: true });
  }

  try {
    await programsService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
