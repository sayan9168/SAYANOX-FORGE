import type { ProjectFile } from '../types';

export interface Dependency { name: string; version: string; ecosystem: 'npm' | 'python' | 'unknown'; file: string; }

export function detectDependencies(files: ProjectFile[]): Dependency[] {
  const out: Dependency[] = [];
  for (const file of files) {
    if (file.path.endsWith('package.json')) {
      try {
        const p = JSON.parse(file.content) as { dependencies?: Record<string,string>; devDependencies?: Record<string,string> };
        for (const group of [p.dependencies, p.devDependencies]) for (const [name, version] of Object.entries(group ?? {})) out.push({name, version, ecosystem:'npm', file:file.path});
      } catch { /* analyzer handles malformed source separately */ }
    }
    if (file.path === 'requirements.txt' || file.path.endsWith('/requirements.txt')) {
      for (const line of file.content.split(/\r?\n/)) { const m = line.match(/^\s*([A-Za-z0-9_.-]+)\s*(?:==|>=|<=|~=|>|<)?\s*([0-9][^\s;]*)?/); if (m?.[1]) out.push({name:m[1],version:m[2] ?? '*',ecosystem:'python',file:file.path}); }
    }
  }
  return out;
}

const LICENSE_RE = /\b(license|licence)\b[^\n]{0,80}/i;
export function detectLicenseHints(files: ProjectFile[]): string[] {
  return files.filter(f => LICENSE_RE.test(f.content) || /(^|\/)LICENSE(?:\.[A-Za-z0-9.-]+)?$/i.test(f.path)).map(f => f.path);
}
