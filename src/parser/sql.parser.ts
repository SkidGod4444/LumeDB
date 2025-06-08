export function parseSQL(input: string):
  | { type: 'INSERT'; key: number; value: string }
  | { type: 'SELECT'; key: number }
  | { type: 'DELETE'; key: number }
  | { type: 'ALL' }
  | { type: 'EXIT' } {

  const cleaned = input.trim().toUpperCase();
  if (cleaned === 'ALL') return { type: 'ALL' };
  if (cleaned === 'EXIT') return { type: 'EXIT' };

  const insertMatch = input.match(/INSERT INTO \w+ VALUES \((\d+),\s*"(.+)"\)/i);
  if (insertMatch && insertMatch[1] && insertMatch[2]) {
    return { type: 'INSERT', key: parseInt(insertMatch[1]), value: insertMatch[2] };
  }

  const selectMatch = input.match(/SELECT \* FROM \w+ WHERE id ?= ?(\d+)/i);
  if (selectMatch && selectMatch[1]) {
    return { type: 'SELECT', key: parseInt(selectMatch[1]) };
  }

  const deleteMatch = input.match(/DELETE FROM \w+ WHERE id ?= ?(\d+)/i);
  if (deleteMatch && deleteMatch[1]) {
    return { type: 'DELETE', key: parseInt(deleteMatch[1]) };
  }

  throw new Error('Invalid SQL syntax');
}
