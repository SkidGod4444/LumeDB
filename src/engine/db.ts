import { Pager } from '../storage/pager';
import { WAL } from '../wal/wal';
import { BTree } from '../btree/btree';
import { parseSQL } from '../parser/sql.parser';

type TableEntry = {
  btree: BTree;
  pager: Pager;
};

type SQLCommand = 
  | { type: 'INSERT'; key: number; value: string }
  | { type: 'SELECT'; key: number }
  | { type: 'DELETE'; key: number }
  | { type: 'ALL' }
  | { type: 'EXIT' };

export class DB {
  private wal: WAL;
  private tables: Map<string, TableEntry> = new Map();

  constructor(dbFileBase: string, walFile: string) {
    this.wal = new WAL(walFile);
    this.loadTable('table', dbFileBase); // default table
  }

  execute(sql: string): string | void {
    const cmd: SQLCommand = parseSQL(sql);
    const table = this.tables.get('table'); // Since we only have one table
    if (!table) throw new Error('Table not found');

    if (cmd.type === 'INSERT') {
      this.wal.log(JSON.stringify(cmd));
      table.btree.insert(cmd.key, cmd.value);
      this.persist('table');
      return 'Inserted';
    }
    if (cmd.type === 'SELECT') {
      const value = table.btree.search(cmd.key);
      return value ? `Result: ${value}` : 'Not found';
    }
    if (cmd.type === 'DELETE') {
      const value = table.btree.search(cmd.key);
      if (value) {
        this.wal.log(JSON.stringify(cmd));
        table.btree.delete(cmd.key);
        this.persist('table');
        return 'Deleted';
      }
      return 'Key not found';
    }
    if (cmd.type === 'ALL') {
      return table.btree.all().map(([k, v]) => `${k}: ${v}`).join('\n');
    }
    if (cmd.type === 'EXIT') {
      this.close();
      process.exit(0);
    }
    throw new Error('Unknown command');
  }

  private loadTable(name: string, baseFile: string): void {
    const pager = new Pager(`${baseFile}.${name}`);
    const btree = new BTree();
    const entries = pager.readAll();
    for (const [k, v] of entries) btree.insert(k, v);
    this.tables.set(name, { btree, pager });
  }

  private persist(name: string): void {
    const { btree, pager } = this.tables.get(name)!;
    pager.writeAll(btree.all());
  }

  private close(): void {
    this.wal.close();
    for (const name of this.tables.keys()) {
      this.persist(name);
    }
  }
}
