import type { ProjectFile } from '../types';
export function fromEntries(entries: Record<string,string>): ProjectFile[] { return Object.entries(entries).map(([path,content])=>({path,content,size:new Blob([content]).size})); }
export async function readFileList(list: FileList): Promise<ProjectFile[]> { return Promise.all(Array.from(list).map(async f=>({path:f.webkitRelativePath||f.name,content:await f.text(),size:f.size}))); }
export const demoFiles=fromEntries({'src/app.ts':`const apiKey = "DEMO_NOT_A_REAL_SECRET_123456";\nconsole.log(apiKey);\neval(input);`,'README.md':'# Demo project\n\nScanned locally by SAYANOX FORGE.','package.json':'{"name":"demo","dependencies":{"react":"latest"}}'});
