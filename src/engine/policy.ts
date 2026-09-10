import type { Finding, Severity, ProjectFile } from '../types';

export interface ScanPolicy {
  enabledSeverities: ReadonlySet<Severity>;
  ignoredRules: ReadonlySet<string>;
  ignoredPaths: ReadonlyArray<string>;
}

const wildcardToRegExp = (pattern: string): RegExp => {
  const normalized = pattern.trim().replace(/\/+$|\/$/g, '');
  const escaped = normalized.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}(?:$|/.*$)`, 'i');
};

export function parseForgeIgnore(files: ProjectFile[]): string[] {
  const ignore = files.find(f => f.path === '.forgeignore' || f.path.endsWith('/.forgeignore'));
  if (!ignore) return [];
  return ignore.content.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#') && !line.startsWith('!'));
}

export function filterFindings(findings: Finding[], policy: ScanPolicy): Finding[] {
  return findings.filter((finding) => {
    if (!policy.enabledSeverities.has(finding.severity)) return false;
    if (policy.ignoredRules.has(finding.rule)) return false;
    return !policy.ignoredPaths.some((pattern) => wildcardToRegExp(pattern).test(finding.file));
  });
}
