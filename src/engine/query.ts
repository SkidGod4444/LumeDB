// src/engine/query.ts
import { BTree } from "../btree/btree";
import { parseSQL } from "../parser/sql.parser";
import { WAL } from "../wal/wal";

export class QueryEngine {
  constructor(private tree: BTree, private wal: WAL) {}

  execute(sql: string): string {
    try {
      const command = parseSQL(sql);
      if (command.type === 'INSERT') {
        this.wal.log(JSON.stringify(command));
        this.tree.insert(command.key, command.value);
        return 'OK';
      } else if (command.type === 'SELECT') {
        const rows = this.tree.all();
        return rows.map(([k, v]) => `${k}: ${v}`).join('\n') || 'No data.';
      }
      return 'Unknown command';
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  }
}