import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { prisma } from './prisma';

const SRC_PATH = join(process.cwd(), 'src/data/students.json');
const TMP_PATH = '/tmp/students.json';

export function readStudentsJson(): any[] {
  // Check /tmp/students.json first
  if (existsSync(TMP_PATH)) {
    try {
      const content = readFileSync(TMP_PATH, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error('Failed to read /tmp/students.json:', err);
    }
  }

  // Fallback to source path
  try {
    if (existsSync(SRC_PATH)) {
      const content = readFileSync(SRC_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Failed to read src/data/students.json:', err);
  }
  
  return [];
}

export function writeStudentsJson(data: any[]): boolean {
  // Try writing to src path first (works locally)
  try {
    writeFileSync(SRC_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err: any) {
    // Fallback to /tmp if filesystem is read-only (Vercel)
    if (err.code === 'EROFS' || err.message.includes('read-only') || err.message.includes('permission denied')) {
      console.warn('⚠️ Read-only filesystem detected, writing to /tmp/students.json');
      try {
        writeFileSync(TMP_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
      } catch (tmpErr) {
        console.error('Failed to write to /tmp/students.json:', tmpErr);
      }
    } else {
      console.error('Failed to write to src/data/students.json:', err);
    }
  }
  return false;
}

export async function ensureProgramsSeeded() {
  try {
    const isDatabaseConfigured = 
      !!process.env.DATABASE_URL && 
      (process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://'));

    if (!isDatabaseConfigured) return;

    // Check count of programs
    const count = await prisma.program.count();
    if (count === 0) {
      console.log('🌱 Seeding database programs from programs-static.json...');
      const filePath = join(process.cwd(), 'src/data/programs-static.json');
      if (existsSync(filePath)) {
        const fileContent = readFileSync(filePath, 'utf8');
        const staticPrograms = JSON.parse(fileContent);

        if (Array.isArray(staticPrograms)) {
          for (const prog of staticPrograms) {
            // Seed program record
            const record: any = {
              id: prog.id,
              slug: prog.slug || prog.id,
              title: prog.title,
              description: prog.description || '',
              overview: prog.overview || '',
              category: prog.category || '',
              level: prog.level || '',
              duration: prog.duration || '',
              type: prog.type || '',
              price: prog.price || '',
              practicalHours: prog.practicalHours || '',
              tags: prog.tags || [],
              image: prog.image || '',
              outcomes: prog.outcomes || [],
              projectsCount: typeof prog.projects === 'number' ? prog.projects : 0,
              curriculum: prog.curriculum || null,
              faqs: prog.faqs || null,
              pricingDetails: prog.pricingDetails || null,
              tools: prog.tools || [],
              certifications: prog.certifications || []
            };

            await prisma.program.upsert({
              where: { id: prog.id },
              update: record,
              create: record
            });

            // Also seed CourseModule records for this program if defined in curriculum
            if (Array.isArray(prog.curriculum)) {
              let modNum = 1;
              for (const mod of prog.curriculum) {
                const moduleNumberStr = modNum.toString().padStart(2, '0');
                const moduleRecord = {
                  programId: prog.id,
                  moduleNumber: moduleNumberStr,
                  title: mod.title || `Module ${modNum}`,
                  topics: Array.isArray(mod.topics) ? mod.topics : [],
                  resourcesCount: 0
                };
                // Check if module already exists to prevent duplicate entries
                const existingModule = await prisma.courseModule.findFirst({
                  where: {
                    programId: prog.id,
                    moduleNumber: moduleNumberStr
                  }
                });
                if (!existingModule) {
                  await prisma.courseModule.create({
                    data: moduleRecord
                  });
                }
                modNum++;
              }
            }
          }
          console.log('✅ Seeded programs and modules successfully!');
        }
      }
    }
  } catch (err) {
    console.error('Error seeding programs:', err);
  }
}
