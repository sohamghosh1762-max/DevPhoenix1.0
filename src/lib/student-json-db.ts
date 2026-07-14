import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

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
