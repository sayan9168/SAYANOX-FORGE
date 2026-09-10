import { describe, expect, it } from 'vitest';
import { analyzeFiles, healthScore } from '../src/engine/analyzer';
import { fromEntries } from '../src/engine/files';
describe('FORGE analyzer',()=>{
 it('detects risky source patterns',()=>{const files=fromEntries({'app.ts':'const apiKey = "123456789";\neval(input);'});const findings=analyzeFiles(files);expect(findings.some(f=>f.rule==='SEC001')).toBe(true);expect(findings.some(f=>f.rule==='SEC003')).toBe(true);});
 it('keeps a clean project healthy',()=>{const files=fromEntries({'readme.md':'hello'});expect(healthScore(analyzeFiles(files),files.length)).toBe(91);});
});
