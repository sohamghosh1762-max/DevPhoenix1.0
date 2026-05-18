import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Lead, LeadNote } from '@/types';

const FILE_PATH = join(process.cwd(), 'src/data/leads.json');

function readLeads(): Lead[] {
  try {
    return JSON.parse(readFileSync(FILE_PATH, 'utf-8'));
  } catch {
    return [];
  }
}

function writeLeads(data: Lead[]) {
  writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  
  let leads = readLeads();
  if (status && status !== 'All') leads = leads.filter(l => l.status === status);
  if (search) {
    const q = search.toLowerCase();
    leads = leads.filter(l => 
      l.name?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.program?.toLowerCase().includes(q)
    );
  }
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const leads = readLeads();
  const now = new Date().toISOString();
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: body.name,
    email: body.email,
    phone: body.phone,
    program: body.program || '',
    currentStatus: body.currentStatus || '',
    message: body.message || '',
    source_page: body.source_page || '',
    source_campaign: body.source_campaign || '',
    status: 'New',
    notes: [],
    created_at: now,
    updated_at: now,
  };
  leads.unshift(newLead);
  writeLeads(leads);
  return NextResponse.json(newLead, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Handle adding a note
  if (body.action === 'add_note') {
    const note: LeadNote = {
      id: `note-${Date.now()}`,
      content: body.note,
      created_at: new Date().toISOString(),
      author: body.author || 'Admin',
    };
    leads[idx].notes = [...(leads[idx].notes || []), note];
    leads[idx].updated_at = new Date().toISOString();
  } else {
    leads[idx] = { 
      ...leads[idx], 
      ...body,
      notes: leads[idx].notes, // Preserve notes
      updated_at: new Date().toISOString(),
    };
    if (body.status !== leads[idx].status) {
      leads[idx].last_contacted_at = new Date().toISOString();
    }
  }
  
  writeLeads(leads);
  return NextResponse.json(leads[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const leads = readLeads();
  writeLeads(leads.filter(l => l.id !== id));
  return NextResponse.json({ success: true });
}
