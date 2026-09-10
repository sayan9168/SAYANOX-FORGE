import type { ForgePlugin, Finding, ProjectFile } from '../types';

export interface PluginManifest { id: string; name: string; version: string; description: string; }

const plugins: ForgePlugin[] = [];

export function registerPlugin(plugin: ForgePlugin): void {
  if (!plugin.id || !plugin.name || !plugin.version || typeof plugin.run !== 'function') throw new Error('Invalid FORGE plugin manifest.');
  if (plugins.some(p => p.id === plugin.id)) throw new Error(`Plugin already registered: ${plugin.id}`);
  plugins.push(plugin);
}

export function listPlugins(): PluginManifest[] {
  return plugins.map(({ id, name, version, description }) => ({ id, name, version, description }));
}

export function runPlugins(files: ProjectFile[]): Finding[] {
  return plugins.flatMap(plugin => {
    try { return plugin.run(files); } catch { return []; }
  });
}
