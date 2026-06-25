import { NextRequest } from "next/server";
import { leadsService } from "@/services/mongodb/db.service";
import { hasMongoConfig, getDb } from "@/services/mongodb/client";
import { apiResponse, getLocalCacheHelper } from "@/lib/api-utils";
import { Lead } from "@/types";
import { sanitizePayload, ValidationError } from "@/lib/api/sanitize-payload";
import { sendLeadEmail } from "@/lib/email-utils";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<Lead>("leads.json");

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "All";
    const sortBy = searchParams.get("sortBy") || "newest";
    const program = searchParams.get("program") || "All";
    const source = searchParams.get("source") || "All";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const downloadAll = searchParams.get("downloadAll") === "true";

    let leads: Lead[] = [];
    let totalCount = 0;
    let counts: Record<string, number> = {
      All: 0,
      New: 0,
      Contacted: 0,
      Qualified: 0,
      "Consultation Scheduled": 0,
      Converted: 0,
      Closed: 0,
      Lost: 0,
    };

    if (hasMongoConfig) {
      try {
        const db = await getDb();
        const collection = db.collection("leads");

        // Status counts over the entire DB
        const statusCounts = await collection.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ]).toArray();

        let totalAll = 0;
        statusCounts.forEach((item) => {
          const statusKey = item._id || "New";
          counts[statusKey] = item.count;
          totalAll += item.count;
        });
        counts.All = totalAll;

        // Build query
        const query: any = {};
        if (status && status !== "All") {
          query.status = status;
        }
        if (search) {
          const regex = new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");
          query.$or = [
            { name: regex },
            { email: regex },
            { phone: regex },
            { program: regex }
          ];
        }
        if (program && program !== "All") {
          query.program = program;
        }
        if (source && source !== "All") {
          query.source_page = source;
        }
        if (startDate || endDate) {
          query.created_at = {};
          if (startDate) query.created_at.$gte = startDate;
          if (endDate) query.created_at.$lte = endDate;
        }

        // Build sort
        let sort: any = { created_at: -1 };
        if (sortBy === "oldest") {
          sort = { created_at: 1 };
        } else if (sortBy === "name") {
          sort = { name: 1 };
        }

        totalCount = await collection.countDocuments(query);

        let docs: any[] = [];
        if (downloadAll) {
          docs = await collection.find(query).sort(sort).toArray();
        } else {
          docs = await collection.find(query).sort(sort).skip((page - 1) * limit).limit(limit).toArray();
        }

        leads = docs.map((d) => {
          const { _id, ...rest } = d;
          return rest as Lead;
        });

      } catch (err) {
        console.error("MongoDB leads GET error, falling back to local cache:", err);
        // Fallback code if MongoDB query fails
        const fallback = runFallbackGET();
        leads = fallback.leads;
        totalCount = fallback.totalCount;
        counts = fallback.counts;
      }
    } else {
      const fallback = runFallbackGET();
      leads = fallback.leads;
      totalCount = fallback.totalCount;
      counts = fallback.counts;
    }

    function runFallbackGET() {
      let list = cache.read();

      // Apply JS filters
      if (status && status !== "All") {
        list = list.filter((l) => l.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (l) =>
            l.name?.toLowerCase().includes(q) ||
            l.email?.toLowerCase().includes(q) ||
            l.phone?.includes(q) ||
            l.program?.toLowerCase().includes(q)
        );
      }
      if (program && program !== "All") {
        list = list.filter((l) => l.program === program);
      }
      if (source && source !== "All") {
        list = list.filter((l) => l.source_page === source);
      }
      if (startDate) {
        list = list.filter((l) => l.created_at >= startDate);
      }
      if (endDate) {
        list = list.filter((l) => l.created_at <= endDate);
      }

      // Sort
      list.sort((a, b) => {
        if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      const total = list.length;

      // Status counts over uncut list
      const uncut = cache.read();
      const fallbackCounts: Record<string, number> = {
        All: uncut.length,
        New: 0,
        Contacted: 0,
        Qualified: 0,
        "Consultation Scheduled": 0,
        Converted: 0,
        Closed: 0,
        Lost: 0,
      };
      uncut.forEach((l) => {
        const s = l.status || "New";
        fallbackCounts[s] = (fallbackCounts[s] || 0) + 1;
      });

      let pageLeads = list;
      if (!downloadAll) {
        pageLeads = list.slice((page - 1) * limit, page * limit);
      }

      return {
        leads: pageLeads,
        totalCount: total,
        counts: fallbackCounts,
      };
    }

    return apiResponse.success({
      leads,
      totalCount,
      counts,
      conversionRate: counts.All > 0 ? Math.round(((counts.Converted || 0) / counts.All) * 100) : 0,
    });
  } catch (error: any) {
    return apiResponse.error(error.message, "DATABASE_FETCH_FAILED");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Sanitize and validate payload
    let sanitized: Lead;
    try {
      sanitized = sanitizePayload.lead(body);
    } catch (valErr: any) {
      if (valErr instanceof ValidationError) {
        console.warn("⚠️ [POST /api/leads] Validation Failed:", valErr.message);
        return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
      }
      throw valErr;
    }

    const newLead: Lead = {
      ...sanitized,
      status: "New",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Dispatch email notification to stakeholders
    await sendLeadEmail(newLead);

    if (!hasMongoConfig) {
      console.log("[LEADS API local cache save]", newLead.id);
      const list = cache.read();
      list.unshift(newLead);
      cache.write(list);
      return apiResponse.success(newLead, 201);
    }

    console.log("[LEADS API POST PAYLOAD]", JSON.stringify(newLead, null, 2));

    try {
      const result = await leadsService.create(newLead);
      console.log("[LEADS API POST SUCCESS]", JSON.stringify(result, null, 2));
      return apiResponse.success(result, 201);
    } catch (dbErr: any) {
      console.error("[LEADS API POST SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database insert operation failed", "DATABASE_INSERT_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEADS API POST SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Lead ID is required", "MISSING_REQUIRED_FIELD");
    }

    if (hasMongoConfig) {
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
        // Sanitize other updates to strictly match schema fields
        let sanitized: Lead;
        try {
          const merged = { ...found, ...body };
          sanitized = sanitizePayload.lead(merged);
        } catch (valErr: any) {
          if (valErr instanceof ValidationError) {
            return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
          }
          throw valErr;
        }
        updatedPayload = {
          ...sanitized,
          updated_at: new Date().toISOString(),
        };
        delete updatedPayload.id;
      }

      console.log("[LEADS API PUT PAYLOAD]", JSON.stringify(updatedPayload, null, 2));

      try {
        const result = await leadsService.update(body.id, updatedPayload);
        console.log("[LEADS API PUT SUCCESS]", JSON.stringify(result, null, 2));
        return apiResponse.success(result);
      } catch (dbErr: any) {
        console.error("[LEADS API PUT SUPABASE ERROR]", dbErr);
        return apiResponse.error(dbErr.message || "Database update operation failed", "DATABASE_UPDATE_FAILED", dbErr);
      }
    }

    // Local Cache Fallback
    console.log("[LEADS API local cache update]", body.id);
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
      let sanitized: Lead;
      try {
        const merged = { ...list[idx], ...body };
        sanitized = sanitizePayload.lead(merged);
      } catch (valErr: any) {
        if (valErr instanceof ValidationError) {
          return apiResponse.badRequest(valErr.message, "VALIDATION_FAILED");
        }
        throw valErr;
      }
      list[idx] = {
        ...list[idx],
        ...sanitized,
        notes: list[idx].notes,
        updated_at: new Date().toISOString(),
      };
    }

    cache.write(list);
    return apiResponse.success(list[idx]);
  } catch (error: any) {
    console.error("[LEADS API PUT SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Lead ID is required", "MISSING_REQUIRED_FIELD");
    }

    console.log(`[LEADS API DELETE ID]`, id);

    if (!hasMongoConfig) {
      const list = cache.read();
      cache.write(list.filter((l) => l.id !== id));
      return apiResponse.success({ success: true });
    }

    try {
      await leadsService.delete(id);
      console.log("[LEADS API DELETE SUCCESS]");
      return apiResponse.success({ success: true });
    } catch (dbErr: any) {
      console.error("[LEADS API DELETE SUPABASE ERROR]", dbErr);
      return apiResponse.error(dbErr.message || "Database delete operation failed", "DATABASE_DELETE_FAILED", dbErr);
    }
  } catch (error: any) {
    console.error("[LEADS API DELETE SERVER ERROR]", error);
    return apiResponse.error(error.message || "Failed to process request", "SERVER_ERROR");
  }
}
