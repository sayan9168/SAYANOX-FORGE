import { describe, expect, it } from 'vitest';
import { createZip } from '../src/engine/zip';
import { projectStats, validateProject } from '../src/engine/validation';
import { listPlugins, registerPlugin } from '../src/engine/plugins';
import type { ProjectFile } from '../src/types';

const files: ProjectFile[] = [
  { path: 'package.json', content: '{"name":"demo","private":true}', size: 33 },
  { path: 'src/app.ts', content: 'export const ok = true;\n', size: 24 },
];

describe('v0.3 engineering engine', () => {
  it('creates a non-empty ZIP archive', async () => {
    const blob = createZip(files);
    expect(blob.type).toBe('application/zip');
    expect(blob.size).toBeGreaterThan(50);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 0x03, 0x04]);
  });

  it('calculates deterministic project statistics', () => {
    const stats = projectStats(files);
    expect(stats.fileCount).toBe(2);
    expect(stats.totalBytes).toBe(57);
    expect(stats.extensions).toEqual([['.json', 1], ['.ts', 1]]);
  });

  it('validates malformed JSON and valid package metadata', () => {
    expect(validateProject(files)).toEqual([]);
    expect(validateProject([{ path: 'broken.json', content: '{', size: 1 }])[0]?.severity).toBe('error');
  });

  it('rejects duplicate plugin IDs and exposes manifests', () => {
    const id = 'test.v03.plugin';
    registerPlugin({ id, name: 'v0.3 test plugin', version: '1.0.0', description: 'test', run: () => [] });
    expect(listPlugins().some(p => p.id === id)).toBe(true);
    expect(() => registerPlugin({ id, name: 'duplicate', version: '1.0.0', description: 'test', run: () => [] })).toThrow();
  });
});
