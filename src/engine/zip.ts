import type { ProjectFile } from '../types';

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (const byte of data) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u16(v: number): number[] { return [v & 0xff, (v >>> 8) & 0xff]; }
function u32(v: number): number[] { return [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff]; }

function safeZipPath(path: string): string {
  const normalized = path.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!normalized || normalized.split('/').some(part => part === '..' || part === '')) {
    throw new Error(`Unsafe ZIP path: ${path}`);
  }
  return normalized;
}

/** Creates a standards-compatible ZIP using the STORE method (no compression). */
export function createZip(files: ProjectFile[]): Blob {
  if (files.length > 0xffff) throw new Error('ZIP supports at most 65,535 files in this implementation.');

  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const seen = new Set<string>();

  for (const file of files) {
    const path = safeZipPath(file.path);
    if (seen.has(path)) throw new Error(`Duplicate ZIP path: ${path}`);
    seen.add(path);

    const name = encoder.encode(path);
    const data = encoder.encode(file.content);
    if (name.length > 0xffff) throw new Error(`ZIP filename is too long: ${path}`);
    if (data.length > 0xffffffff || offset > 0xffffffff) {
      throw new Error('ZIP archive exceeds the classic ZIP 4 GiB limit.');
    }

    const crc = crc32(data);
    const local = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0x800), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...name,
    ]);
    chunks.push(local, data);
    central.push(new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x800), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name,
    ]));
    offset += local.length + data.length;
  }

  const centralSize = central.reduce((n, x) => n + x.length, 0);
  const end = new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(files.length), ...u16(files.length),
    ...u32(centralSize), ...u32(offset), ...u16(0),
  ]);

  const total = offset + centralSize + end.length;
  const output = new Uint8Array(total);
  let cursor = 0;
  for (const chunk of chunks) { output.set(chunk, cursor); cursor += chunk.length; }
  for (const chunk of central) { output.set(chunk, cursor); cursor += chunk.length; }
  output.set(end, cursor);

  // Copy into a dedicated ArrayBuffer so DOM BlobPart typing remains portable
  // across TypeScript versions where Uint8Array may use ArrayBufferLike.
  const buffer = new ArrayBuffer(output.byteLength);
  new Uint8Array(buffer).set(output);
  return new Blob([buffer], { type: 'application/zip' });
}

export function downloadZip(filename: string, files: ProjectFile[]): void {
  const url = URL.createObjectURL(createZip(files));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
