import { NextRequest } from "next/server";
import { leadsService } from "@/services/supabase/db.service";
import { hasSupabaseConfig } from "@/services/supabase/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { LeadCMS } from "@/types/cms-schema";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<LeadCMS>("leads.json");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let leads: LeadCMS[] = [];
    if (hasSupabaseConfig) {
      try {
        leads = await leadsService.getAll();
      } catch (err) {
        console.error("Supabase leads GET error, falling back to local cache:", err);
        leads = cache.read();
      }
    } else {
      leads = cache.read();
    }

    if (status && status !== "All") {
      leads = leads.filter((l) => l.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.program?.toLowerCase().includes(q)
      );
    }

    return apiResponse.success(leads);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
      return apiResponse.badRequest("Name, Email, and Phone are required parameters.");
    }

    const now = new Date().toISOString();
    const newLead: LeadCMS = {
      id: body.id || `lead-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      program: body.program || "",
      currentStatus: body.currentStatus || "",
      message: body.message || "",
      source_page: body.source_page || "",
      status: "New",
      notes: [],
      created_at: now,
    };

    if (!hasSupabaseConfig) {
      const list = cache.read();
      list.unshift(newLead);
      cache.write(list);
      return apiResponse.success(newLead, 201);
    }

    const result = await leadsService.create(newLead);
    return apiResponse.success(result, 201);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Lead ID is required");
    }

    if (hasSupabaseConfig) {
      const existingLeads = await leadsService.getAll();
      const found = existingLeads.find((l) => l.id === body.id);
      if (!found) return apiResponse.notFound("Lead not found");

      let updatedPayload: any = {};
      if (body.action === "add_note") {
        const note = {
          id: `note-${Date.now()}`,
          content: body.note,
          created_at: new Date().toISOString(),
          author: body.author || "Admin",
        };
        updatedPayload = {
          notes: [...(found.notes || []), note],
          updated_at: new Date().toISOString(),
        };
      } else {
        updatedPayload = {
          ...body,
          updated_at: new Date().toISOString(),
        };
        delete updatedPayload.id;
      }

      const result = await leadsService.update(body.id, updatedPayload);
      return apiResponse.success(result);
    }

    // Local Cache Fallback
    const list = cache.read();
    const idx = list.findIndex((l) => l.id === body.id);
    if (idx === -1) return apiResponse.notFound("Lead not found");

    if (body.action === "add_note") {
      const note = {
        id: `note-${Date.now()}`,
        content: body.note,
        created_at: new Date().toISOString(),
        author: body.author || "Admin",
      };
      list[idx].notes = [...(list[idx].notes || []), note];
      list[idx].updated_at = new Date().toISOString();
    } else {
      list[idx] = {
        ...list[idx],
        ...body,
        notes: list[idx].notes,
        updated_at: new Date().toISOString(),
      };
    }

    cache.write(list);
    return apiResponse.success(list[idx]);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Lead ID is required");
    }

    if (!hasSupabaseConfig) {
      const list = cache.read();
      cache.write(list.filter((l) => l.id !== id));
      return apiResponse.success({ success: true });
    }

    await leadsService.delete(id);
    return apiResponse.success({ success: true });
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}
