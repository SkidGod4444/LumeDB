// src/engine/record.ts
export interface Record {
    key: number;
    value: string;
  }
  
  export function serializeRecord(record: Record): Buffer {
    const buffer = Buffer.alloc(512); // example fixed-size record
    buffer.writeUInt32BE(record.key, 0);
    buffer.write(record.value, 4, 'utf8');
    return buffer;
  }
  
  export function deserializeRecord(buffer: Buffer): Record {
    const key = buffer.readUInt32BE(0);
    const value = buffer.toString('utf8', 4).replace(/\0/g, '');
    return { key, value };
  }