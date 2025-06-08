import { DB } from './engine/db';
import readlineSync from 'readline-sync';

const db = new DB('db/data.db', 'db/wal.log');

console.log('SimpleDB started. Type SQL commands like:');
console.log('- INSERT INTO table VALUES (1, "hello")');
console.log('- SELECT * FROM table WHERE id = 1');
console.log('- DELETE FROM table WHERE id = 1');
console.log('- ALL, EXIT');

while (true) {
  const input = readlineSync.question('> ');
  try {
    const result = db.execute(input.trim());
    if (result) console.log(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error:', err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}
