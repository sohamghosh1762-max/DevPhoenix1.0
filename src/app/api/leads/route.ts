import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Lead, LeadNote } from '@/types';
import { leadsService } from '@/services/supabase/db.service';
import { hasSupabaseConfig } from '@/services/supabase/client';

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

if (!hasSupabaseConfig) {
  console.warn('⚠️ WARNING [Leads API]: Supabase keys missing. Falling back to local JSON persistence.');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get('status');
  const search = searchParams.get('search');
  
  let leads: Lead[] = [];
  if (hasSupabaseConfig) {
    try {
      leads = await leadsService.getAll();
    } catch (err: any) {
      console.error('Supabase leads GET error, falling back to local:', err);
      leads = readLeads();
    }
  } else {
    leads = readLeads();
  }

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

  if (hasSupabaseConfig) {
    try {
      const created = await leadsService.create(newLead);
      return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
      console.error('Supabase leads POST error, falling back to local:', err);
    }
  }

  const leads = readLeads();
  leads.unshift(newLead);
  writeLeads(leads);
  return NextResponse.json(newLead, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  
  if (hasSupabaseConfig) {
    try {
      let leadToUpdate: Partial<Lead> = {};
      
      if (body.action === 'add_note') {
        const { data, error } = await (leadsService as any).getAll(); // Fetch all to find the specific lead
        const existingLeads = await leadsService.getAll();
        const found = existingLeads.find(l => l.id === body.id);
        if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        
        const note: LeadNote = {
          id: `note-${Date.now()}`,
          content: body.note,
          created_at: new Date().toISOString(),
          author: body.author || 'Admin',
        };
        leadToUpdate = {
          notes: [...(found.notes || []), note],
          updated_at: new Date().toISOString()
        };
      } else {
        leadToUpdate = { 
          ...body,
          updated_at: new Date().toISOString()
        };
        // Remove id and notes if present to prevent updating primary key or overwriting notes
        delete leadToUpdate.id;
        if (body.status) {
          leadToUpdate.last_contacted_at = new Date().toISOString();
        }
      }
      
      const updated = await leadsService.update(body.id, leadToUpdate);
      return NextResponse.json(updated);
    } catch (err: any) {
      console.error('Supabase leads PUT error, falling back to local:', err);
    }
  }

  // Local fallback
  const leads = readLeads();
  const idx = leads.findIndex(l => l.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

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
      notes: leads[idx].notes,
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

  if (hasSupabaseConfig) {
    try {
      await leadsService.delete(id);
      return NextResponse.json({ success: true });
    } catch (err: any) {
      console.error('Supabase leads DELETE error, falling back to local:', err);
    }
  }

  const leads = readLeads();
  writeLeads(leads.filter(l => l.id !== id));
  return NextResponse.json({ success: true });
}

