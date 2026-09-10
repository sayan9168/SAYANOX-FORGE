import type { Finding } from '../types';

export function toSarif(findings: Finding[]) {
  return { version: '2.1.0', $schema: 'https://json.schemastore.org/sarif-2.1.0.json', runs: [{ tool: { driver: { name: 'SAYANOX FORGE', version: '0.2.0', informationUri: 'https://github.com/sayan9168/SAYANOX-FORGE' } }, results: findings.map(f => ({ ruleId: f.rule, level: f.severity === 'critical' || f.severity === 'high' ? 'error' : f.severity === 'medium' ? 'warning' : 'note', message: { text: f.message }, locations: [{ physicalLocation: { artifactLocation: { uri: f.file }, region: { startLine: f.line } } }] })) }] };
}

export function toMarkdown(findings: Finding[], score: number, fileCount: number): string {
  const lines = ['# SAYANOX FORGE Scan Report', '', `- Health score: **${score}/100**`, `- Files scanned: **${fileCount}**`, `- Findings: **${findings.length}**`, '', '## Findings', ''];
  if (!findings.length) lines.push('No findings detected.');
  for (const f of findings) lines.push(`- **${f.severity.toUpperCase()}** ${f.rule} — ${f.title} — \`${f.file}:${f.line}\` — ${f.message}`);
  return lines.join('\n');
}
