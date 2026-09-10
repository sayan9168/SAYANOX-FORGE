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

export function toJson(findings: Finding[], score: number, fileCount: number, scannedAt = new Date().toISOString()): string {
  return JSON.stringify({ tool: 'SAYANOX FORGE', version: '0.2.0', scannedAt, healthScore: score, filesScanned: fileCount, findings }, null, 2);
}

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char);

export function toHtml(findings: Finding[], score: number, fileCount: number): string {
  const rows = findings.map(f => `<tr><td>${escapeHtml(f.severity.toUpperCase())}</td><td>${escapeHtml(f.rule)}</td><td>${escapeHtml(f.title)}</td><td>${escapeHtml(f.file)}:${f.line}</td><td>${escapeHtml(f.message)}</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAYANOX FORGE Report</title><style>body{font-family:system-ui,sans-serif;max-width:1200px;margin:40px auto;padding:0 20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}.score{font-size:2rem;font-weight:700}</style></head><body><h1>SAYANOX FORGE Scan Report</h1><p class="score">${score}/100</p><p>${fileCount} files scanned · ${findings.length} findings</p><table><thead><tr><th>Severity</th><th>Rule</th><th>Title</th><th>Location</th><th>Message</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No findings detected.</td></tr>'}</tbody></table></body></html>`;
}
