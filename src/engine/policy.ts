import type { Finding, Severity } from '../types';

export interface ScanPolicy {
  enabledSeverities: ReadonlySet<Severity>;
  ignoredRules: ReadonlySet<string>;
  ignoredPaths: ReadonlyArray<string>;
}

const wildcardToRegExp = (pattern: string): RegExp => {
  const escaped = pattern.trim().replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
};

export function filterFindings(findings: Finding[], policy: ScanPolicy): Finding[] {
  return findings.filter((finding) => {
    if (!policy.enabledSeverities.has(finding.severity)) return false;
    if (policy.ignoredRules.has(finding.rule)) return false;
    return !policy.ignoredPaths.some((pattern) => wildcardToRegExp(pattern).test(finding.file));
  });
}
