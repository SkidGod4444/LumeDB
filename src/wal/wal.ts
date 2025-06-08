// src/wal/wal.ts
import fs from 'fs';

export class WAL {
  private fd: number;

  constructor(path: string) {
    this.fd = fs.openSync(path, 'a');
  }

  log(record: string): void {
    fs.writeSync(this.fd, record + '\n');
  }

  close(): void {
    fs.closeSync(this.fd);
  }
}