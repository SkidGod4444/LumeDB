// src/btree/btree.ts
export class BTree {
    private data = new Map<number, string>();
  
    insert(key: number, value: string) {
      this.data.set(key, value);
    }
  
    search(key: number): string | undefined {
      return this.data.get(key);
    }
  
    delete(key: number) {
      this.data.delete(key);
    }
  
    all(): [number, string][] {
      return [...this.data.entries()].sort((a, b) => a[0] - b[0]);
    }
  }