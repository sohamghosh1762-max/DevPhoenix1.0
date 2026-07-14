import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiResponse } from '@/lib/api-utils';
import { readFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    let programs = await prisma.program.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    // Fallback to local static programs if database returns empty
    if (!programs || programs.length === 0) {
      try {
        const filePath = join(process.cwd(), 'src/data/programs-static.json');
        const fileContent = readFileSync(filePath, 'utf8');
        const staticData = JSON.parse(fileContent);
        if (Array.isArray(staticData)) {
          programs = staticData.map((p: any) => ({
            id: p.id,
            title: p.title
          }));
        }
      } catch (err) {
        console.error('Failed to load programs-static.json fallback:', err);
      }
    }

    return apiResponse.success(programs);
  } catch (error: any) {
    console.error('GET admin programs error:', error);
    return apiResponse.error(error.message || 'Server error', 'SERVER_ERROR');
  }
}
