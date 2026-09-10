import { describe, expect, it } from 'vitest';
import { detectDependencies, detectLicenseHints } from '../src/engine/dependencies';
import { getTemplate } from '../src/engine/project';
import { toSarif, toMarkdown } from '../src/engine/reports';
import { fromEntries } from '../src/engine/files';

describe('FORGE utilities', () => {
  it('detects npm dependencies and license files', () => {
    const files = fromEntries({'package.json': JSON.stringify({dependencies:{react:'^19.0.0'}}), 'LICENSE':'Apache-2.0'});
    expect(detectDependencies(files)).toEqual([{name:'react',version:'^19.0.0',ecosystem:'npm',file:'package.json'}]);
    expect(detectLicenseHints(files)).toContain('LICENSE');
  });
  it('provides deterministic templates', () => { const t=getTemplate('static-web'); expect(t?.files.map(f=>f.path)).toEqual(['index.html','README.md']); });
  it('exports valid report structures', () => {
    const findings = [{id:'x',rule:'SEC001',title:'Secret',severity:'high' as const,file:'app.ts',line:3,message:'secret'}];
    const sarif=toSarif(findings); expect(sarif.version).toBe('2.1.0'); expect(sarif.runs[0].results[0].ruleId).toBe('SEC001');
    expect(toMarkdown(findings,85,2)).toContain('85/100');
  });
});
