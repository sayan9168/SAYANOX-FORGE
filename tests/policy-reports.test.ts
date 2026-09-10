import { describe, expect, it } from 'vitest';
import { analyzeFiles } from '../src/engine/analyzer';
import { fromEntries } from '../src/engine/files';
import { filterFindings } from '../src/engine/policy';
import { toHtml, toJson } from '../src/engine/reports';

describe('FORGE v0.2 policy and reports', () => {
  const findings = analyzeFiles(fromEntries({ 'src/app.ts': 'eval(input);\nconsole.log(secret);' }));

  it('filters findings by severity, rule and path', () => {
    const filtered = filterFindings(findings, {
      enabledSeverities: new Set(['high']),
      ignoredRules: new Set(['SEC003']),
      ignoredPaths: ['tests/**'],
    });
    expect(filtered.every(f => f.severity === 'high')).toBe(true);
    expect(filtered.some(f => f.rule === 'SEC003')).toBe(false);
  });

  it('supports wildcard path suppression', () => {
    const source = analyzeFiles(fromEntries({ 'dist/app.ts': 'eval(input);', 'src/app.ts': 'eval(input);' }));
    const filtered = filterFindings(source, {
      enabledSeverities: new Set(['high']),
      ignoredRules: new Set(),
      ignoredPaths: ['dist/**'],
    });
    expect(filtered.every(f => f.file === 'src/app.ts')).toBe(true);
  });

  it('exports valid JSON and escaped HTML', () => {
    const json = JSON.parse(toJson(findings, 75, 1));
    expect(json.tool).toBe('SAYANOX FORGE');
    expect(json.healthScore).toBe(75);
    const html = toHtml([{ ...findings[0], message: '<script>alert(1)</script>' }], 75, 1);
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>alert(1)</script>');
  });
});
