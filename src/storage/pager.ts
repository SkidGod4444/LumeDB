import fs from 'fs';

export class Pager {
  static PAGE_SIZE = 4096;
  constructor(private path: string) {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '');
    }
  }

  writeAll(data: [number, string][]) {
    const buffers: Buffer[] = [];
    for (const [k, v] of data) {
      const line = `${k}:${v}\n`;
      buffers.push(Buffer.from(line));
    }
    fs.writeFileSync(this.path, Buffer.concat(buffers));
  }

  readAll(): [number, string][] {
    const content = fs.readFileSync(this.path, 'utf8');
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.map((line) => {
      const [k, v] = line.split(':');
      if (!k || !v) throw new Error(`Invalid data format in line: ${line}`);
      return [parseInt(k), v];
    });
  }

  close() {}
}
