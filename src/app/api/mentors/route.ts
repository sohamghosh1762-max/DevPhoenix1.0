import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
export const { GET, POST, PUT, DELETE } = (() => {
  const FILE_PATH = join(process.cwd(), 'src/data/mentors.json');
  const read = () => { try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); } catch { return []; } };
  const write = (d: any[]) => writeFileSync(FILE_PATH, JSON.stringify(d, null, 2));
  return {
    GET: async () => NextResponse.json(read()),
    POST: async (req: NextRequest) => { const b = await req.json(); const items = read(); const n = { id: `mentor-${Date.now()}`, ...b }; items.push(n); write(items); return NextResponse.json(n, { status: 201 }); },
    PUT: async (req: NextRequest) => { const b = await req.json(); const items = read(); const i = items.findIndex((x: any) => x.id === b.id); if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 }); items[i] = { ...items[i], ...b }; write(items); return NextResponse.json(items[i]); },
    DELETE: async (req: NextRequest) => { const { id } = await req.json(); write(read().filter((x: any) => x.id !== id)); return NextResponse.json({ success: true }); },
  };
})();
