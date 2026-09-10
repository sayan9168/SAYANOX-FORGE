import type { ProjectFile } from '../types';

export interface ValidationIssue {
  file: string;
  severity: 'error' | 'warning';
  message: string;
}

export function validateProject(files: ProjectFile[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const file of files) {
    if (/\.json$/i.test(file.path)) {
      try { JSON.parse(file.content); } catch { issues.push({ file: file.path, severity: 'error', message: 'Invalid JSON syntax.' }); }
    }
    if (/package\.json$/i.test(file.path)) {
      try {
        const pkg = JSON.parse(file.content) as Record<string, unknown>;
        if (typeof pkg.name !== 'string' || !pkg.name.trim()) issues.push({ file: file.path, severity: 'warning', message: 'package.json is missing a valid name.' });
        if (pkg.private !== true && !pkg.license) issues.push({ file: file.path, severity: 'warning', message: 'Public package has no license field.' });
      } catch { /* JSON issue already reported above */ }
    }
    if (/\.ya?ml$/i.test(file.path) && /^\s*[^:#\n]+:\s*$/m.test(file.content) && /:\s*$/m.test(file.content)) {
      issues.push({ file: file.path, severity: 'warning', message: 'YAML contains empty mapping values; verify configuration intent.' });
    }
  }
  if (!files.length) issues.push({ file: '(project)', severity: 'warning', message: 'No files were loaded for analysis.' });
  return issues;
}

export function projectStats(files: ProjectFile[]) {
  const extensions = new Map<string, number>();
  let bytes = 0;
  for (const file of files) {
    bytes += file.size;
    const match = file.path.match(/\.([A-Za-z0-9]+)$/);
    const ext = match ? `.${match[1].toLowerCase()}` : '[no extension]';
    extensions.set(ext, (extensions.get(ext) ?? 0) + 1);
  }
  return { fileCount: files.length, totalBytes: bytes, extensions: [...extensions.entries()].sort((a, b) => b[1] - a[1]) };
}
