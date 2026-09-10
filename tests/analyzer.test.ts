import { describe, expect, it } from 'vitest';
import { analyzeFiles, getSecurityRuleCount, healthScore } from '../src/engine/analyzer';
import { fromEntries } from '../src/engine/files';

describe('FORGE analyzer', () => {
  it('has at least 20 security rules', () => {
    expect(getSecurityRuleCount()).toBeGreaterThanOrEqual(20);
  });

  it('detects risky source patterns', () => {
    const files = fromEntries({
      'app.ts': 'const apiKey = "123456789";\neval(input);\nconsole.log(process.env.SECRET);',
    });
    const findings = analyzeFiles(files);
    expect(findings.some(f => f.rule === 'SEC001')).toBe(true);
    expect(findings.some(f => f.rule === 'SEC003')).toBe(true);
    expect(findings.some(f => f.rule === 'SEC005')).toBe(true);
    expect(findings.some(f => f.rule === 'SEC024')).toBe(true);
  });

  it('detects representative security categories', () => {
    const files = fromEntries({
      'web.ts': 'element.innerHTML = input;\ndocument.write(input);\nconst x = Math.random();',
      'server.ts': 'child_process.exec(input);\nfetch("http://example.com");\nconst c = crypto.createHash("md5");',
      'docker.yml': 'privileged: true',
      'key.pem': '-----BEGIN PRIVATE KEY-----',
    });
    const rules = new Set(analyzeFiles(files).map(f => f.rule));
    expect(rules).toEqual(expect.any(Set));
    for (const id of ['SEC002', 'SEC004', 'SEC007', 'SEC008', 'SEC010', 'SEC012', 'SEC014', 'SEC022']) {
      expect(rules.has(id)).toBe(true);
    }
  });

  it('does not report a clean project for unrelated text', () => {
    const files = fromEntries({ 'readme.md': 'hello world' });
    expect(analyzeFiles(files)).toHaveLength(0);
    expect(healthScore(analyzeFiles(files), files.length)).toBe(91);
  });
});
