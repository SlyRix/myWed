const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(process.env.STORAGE_PATH || '/gallery-storage', 'gallery.db');

let db;

function getDb() {
  if (!db) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    db.exec(schema);
  }
  return db;
}

module.exports = { getDb };
