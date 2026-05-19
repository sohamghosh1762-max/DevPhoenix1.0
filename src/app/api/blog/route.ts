import { NextRequest } from "next/server";
import { blogPosts } from "@/data/blog";
import { blogsService } from "@/services/supabase/db.service";
import { hasSupabaseConfig } from "@/services/supabase/client";
import { apiResponse, getLocalCacheHelper, slugify } from "@/lib/api-utils";
import { BlogCMS } from "@/types/cms-schema";

export const dynamic = "force-dynamic";

const INITIAL_SEED: BlogCMS[] = blogPosts.map((post, idx) => ({
  id: `blog-static-${idx}`,
  created_at: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  category: post.category,
  readTime: post.readTime,
  date: post.date,
  image: post.image,
  published: true,
  author: post.author,
}));

const cache = getLocalCacheHelper<BlogCMS>("blog-dynamic.json", undefined, INITIAL_SEED);

export async function GET() {
  if (!hasSupabaseConfig) {
    return apiResponse.success(cache.read());
  }
  try {
    const data = await blogsService.getAll();
    return apiResponse.success(data);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title?.trim()) {
      return apiResponse.badRequest("Article title is required");
    }

    const cleanSlug = slugify(body.slug || body.title);
    const newPost: BlogCMS = {
      ...body,
      id: body.id || `blog-${Date.now()}`,
      slug: cleanSlug,
      created_at: new Date().toISOString(),
    };

    if (!hasSupabaseConfig) {
      const list = cache.read();
      list.unshift(newPost);
      cache.write(list);
      return apiResponse.success(newPost, 201);
    }

    const result = await blogsService.create(newPost);
    return apiResponse.success(result, 201);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return apiResponse.badRequest("Article ID is required");
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
      if (idx === -1) return apiResponse.notFound("Article not found");
      list[idx] = { ...list[idx], ...updatedPayload };
      cache.write(list);
      return apiResponse.success(list[idx]);
    }

    const result = await blogsService.update(body.id, updatedPayload);
    return apiResponse.success(result);
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return apiResponse.badRequest("Article ID is required");
    }

    if (!hasSupabaseConfig) {
      const list = cache.read();
      cache.write(list.filter((p) => p.id !== id));
      return apiResponse.success({ success: true });
    }

    await blogsService.delete(id);
    return apiResponse.success({ success: true });
  } catch (error: any) {
    return apiResponse.error(error.message);
  }
}
