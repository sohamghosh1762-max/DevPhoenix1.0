import { NextRequest } from "next/server";
import { programsService } from "@/services/supabase/db.service";
import { hasSupabaseConfig } from "@/services/supabase/client";
import { apiResponse, getLocalCacheHelper, slugify } from "@/lib/api-utils";
import { ProgramCMS } from "@/types/cms-schema";

export const dynamic = "force-dynamic";

const cache = getLocalCacheHelper<ProgramCMS>("programs-dynamic.json", "programs-static.json");

export async function GET() {
  if (!hasSupabaseConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await programsService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return apiResponse.badRequest("Program title is required");
    }

    const cleanSlug = slugify(body.slug || body.title);
    const newProgram: ProgramCMS = {
      ...body,
      id: body.id || cleanSlug,
      slug: cleanSlug,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      const list = cache.read();
      list.push(newProgram);
      cache.write(list);
      return apiResponse.success(newProgram, 201);
    }

    const result = await programsService.create(newProgram);
    return apiResponse.success(result, 201);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Program ID is required");
    }

    const cleanSlug = slugify(body.slug || body.title || body.id);
    const updatedPayload = {
      ...body,
      slug: cleanSlug,
      updated_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      const list = cache.read();
      const idx = list.findIndex((p) => p.id === body.id);
      if (idx === -1) return apiResponse.notFound("Program not found");
      list[idx] = { ...list[idx], ...updatedPayload };
      cache.write(list);
      return apiResponse.success(list[idx]);
    }

    const result = await programsService.update(body.id, updatedPayload);
    return apiResponse.success(result);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Program ID is required");
    }

    if (!hasSupabaseConfig) {
      const list = cache.read();
      cache.write(list.filter((p) => p.id !== id));
      return apiResponse.success({ success: true });
    }

    await programsService.delete(id);
    return apiResponse.success({ success: true });
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}
