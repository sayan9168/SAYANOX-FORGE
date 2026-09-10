export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export interface Finding { id: string; rule: string; title: string; severity: Severity; file: string; line: number; message: string; }
export interface ProjectFile { path: string; content: string; size: number; }
export interface ScanResult { findings: Finding[]; files: ProjectFile[]; score: number; scannedAt: string; }
export interface ForgePlugin { id: string; name: string; version: string; description: string; run: (files: ProjectFile[]) => Finding[]; }
