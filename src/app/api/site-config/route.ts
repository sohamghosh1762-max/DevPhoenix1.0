import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const FILE_PATH = join(process.cwd(), 'src/data/site-config.json');

function read() {
  try { return JSON.parse(readFileSync(FILE_PATH, 'utf-8')); }
  catch { return {}; }
}

export async function GET() {
  return NextResponse.json(read());
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const current = read();
  const updated = { ...current, ...body };
  writeFileSync(FILE_PATH, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
