import { NextResponse } from 'next/server';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// ── Collect all image URLs referenced in data files ────────────────────────────
function harvestDataImages(): { name: string; url: string; folder: string; source: string }[] {
  const results: { name: string; url: string; folder: string; source: string }[] = [];

  const addUrl = (url: string, folder: string, source: string) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return;
    const name = url.split('/').pop()?.split('?')[0] || url;
    results.push({ name, url, folder, source });
  };

  // Programs
  try {
    const programs = JSON.parse(readFileSync(join(process.cwd(), 'src/data/programs-dynamic.json'), 'utf-8'));
    programs.forEach((p: any) => addUrl(p.image, 'programs', p.title));
  } catch {}
  
  // Mentors
  try {
    const mentors = JSON.parse(readFileSync(join(process.cwd(), 'src/data/mentors.json'), 'utf-8'));
    mentors.forEach((m: any) => addUrl(m.avatar, 'mentors', m.name));
  } catch {}

  // Testimonials API data (json if written)
  try {
    const testimonials = JSON.parse(readFileSync(join(process.cwd(), 'src/data/testimonials-dynamic.json'), 'utf-8'));
    testimonials.forEach((t: any) => addUrl(t.avatar, 'testimonials', t.name));
  } catch {}

  // Blog
  try {
    const blogs = JSON.parse(readFileSync(join(process.cwd(), 'src/data/blog-dynamic.json'), 'utf-8'));
    blogs.forEach((b: any) => {
      addUrl(b.image || b.coverImage, 'blogs', b.title);
      addUrl(b.author?.avatar, 'blogs', `Author: ${b.author?.name}`);
    });
  } catch {}

  // Showcase
  try {
    const showcase = JSON.parse(readFileSync(join(process.cwd(), 'src/data/showcase-dynamic.json'), 'utf-8'));
    showcase.forEach((s: any) => addUrl(s.image, 'showcase', s.title));
  } catch {}

  // Site config
  try {
    const config = JSON.parse(readFileSync(join(process.cwd(), 'src/data/site-config.json'), 'utf-8'));
    addUrl(config.ogImage, 'seo', 'OG Image');
    addUrl(config.logo, 'branding', 'Logo');
  } catch {}

  return results;
}

// ── Collect local /public images ──────────────────────────────────────────────
function harvestPublicImages(): { name: string; url: string; folder: string; source: string; size: number }[] {
  const results: { name: string; url: string; folder: string; source: string; size: number }[] = [];
  const publicDir = join(process.cwd(), 'public');
  const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif'];

  function scan(dir: string, prefix: string) {
    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const full = join(dir, item);
        const stat = statSync(full);
        if (stat.isDirectory()) {
          scan(full, `${prefix}/${item}`);
        } else {
          const ext = item.toLowerCase().slice(item.lastIndexOf('.'));
          if (IMAGE_EXTS.includes(ext)) {
            const url = `${prefix}/${item}`;
            const folder = prefix.replace('/', '') || 'root';
            results.push({ name: item, url, folder: folder.split('/')[0], source: 'public', size: stat.size });
          }
        }
      }
    } catch {}
  }

  scan(publicDir, '');
  return results;
}

export async function GET() {
  const dataImages = harvestDataImages();
  const publicImages = harvestPublicImages();

  // Deduplicate by url
  const seen = new Set<string>();
  const all = [
    ...publicImages.map((i, idx) => ({ id: `pub-${idx}`, ...i, sizeLabel: formatSize(i.size) })),
    ...dataImages
      .filter(i => !seen.has(i.url) && !seen.add(i.url))
      .map((i, idx) => ({ id: `dat-${idx}`, ...i, sizeLabel: 'external', size: 0 })),
  ];

  return NextResponse.json(all);
}

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes > 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}
