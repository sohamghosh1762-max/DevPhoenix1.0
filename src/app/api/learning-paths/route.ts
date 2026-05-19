import { NextRequest, NextResponse } from 'next/server';
import { learningPathsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { learningPathsData } from '@/data/learningPaths';

export const dynamic = 'force-dynamic';

const FILE_PATH = join(process.cwd(), 'src/data/learningPaths-dynamic.json');

// Helper to sanitize standard builds
const initialSeedData = learningPathsData.map(p => ({
  ...p,
  build: p.build.map(b => ({ text: b.text, icon: '' })) // Stringify/sanitize icon element for json compatibility
}));

function readLocalPaths() {
  if (!existsSync(FILE_PATH)) {
    try {
      writeFileSync(FILE_PATH, JSON.stringify(initialSeedData, null, 2));
    } catch (e) {
      console.error('Failed to write initial seed learning paths:', e);
    }
    return initialSeedData;
  }
  try {
    return JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
  } catch {
    return initialSeedData;
  }
}

function writeLocalPaths(data: any[]) {
  try {
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write dynamic local learning paths:', e);
  }
}

if (!hasSupabaseConfig) {
  console.warn('⚠️ WARNING [Learning Paths API]: Supabase keys missing. Falling back to local JSON persistence.');
}

export async function GET() {
  console.log('GET /api/learning-paths invoked');
  if (!hasSupabaseConfig) {
    return NextResponse.json(readLocalPaths(), {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  }

  try {
    let items = await learningPathsService.getAll();
    if (!items || items.length === 0) {
      console.log('Database empty. Seeding learning paths to Supabase...');
      for (const item of initialSeedData) {
        await learningPathsService.create(item);
      }
      items = await learningPathsService.getAll();
    }
    return NextResponse.json(items, {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch (error: any) {
    console.error('Error fetching learning paths from Supabase:', error);
    return NextResponse.json(readLocalPaths(), {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = body.id || `path-${Date.now()}`;
  const newPath = { 
    ...body, 
    id, 
    included: Array.isArray(body.included) ? body.included : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    build: Array.isArray(body.build) ? body.build : []
  };

  console.log('POST /api/learning-paths invoked with body:', body);

  if (!hasSupabaseConfig) {
    const paths = readLocalPaths();
    paths.push(newPath);
    writeLocalPaths(paths);
    return NextResponse.json(newPath, { status: 201 });
  }

  try {
    const created = await learningPathsService.create(newPath);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('Error creating learning path in Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  console.log('PUT /api/learning-paths invoked with body:', body);

  if (!hasSupabaseConfig) {
    const paths = readLocalPaths();
    const idx = paths.findIndex((p: any) => p.id === body.id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    paths[idx] = { ...paths[idx], ...body };
    writeLocalPaths(paths);
    return NextResponse.json(paths[idx]);
  }

  try {
    const updated = await learningPathsService.update(body.id, body);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating learning path in Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  console.log(`DELETE /api/learning-paths invoked for id = ${id}`);

  if (!hasSupabaseConfig) {
    const paths = readLocalPaths();
    writeLocalPaths(paths.filter((p: any) => p.id !== id));
    return NextResponse.json({ success: true });
  }

  try {
    await learningPathsService.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting learning path from Supabase:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
