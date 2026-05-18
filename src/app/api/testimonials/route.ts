import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function makeRoute(filename: string) {
  const FILE_PATH = join(process.cwd(), `src/data/${filename}.json`);

  function read() {
    try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
    catch { return []; }
  }
  function write(data: any[]) {
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  }

  return {
    GET: async () => NextResponse.json(read()),
    POST: async (req: NextRequest) => {
      const body = await req.json();
      const items = read();
      const newItem = { id: `${filename}-${Date.now()}`, ...body };
      items.push(newItem);
      write(items);
      return NextResponse.json(newItem, { status: 201 });
    },
    PUT: async (req: NextRequest) => {
      const body = await req.json();
      const items = read();
      const idx = items.findIndex((i: any) => i.id === body.id);
      if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      items[idx] = { ...items[idx], ...body };
      write(items);
      return NextResponse.json(items[idx]);
    },
    DELETE: async (req: NextRequest) => {
      const { id } = await req.json();
      write(read().filter((i: any) => i.id !== id));
      return NextResponse.json({ success: true });
    },
  };
}

export const { GET, POST, PUT, DELETE } = makeRoute('testimonials');
