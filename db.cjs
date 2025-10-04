const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'images.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE,
    description TEXT
  )
`);

const insertStmt = db.prepare('INSERT OR REPLACE INTO images (path, description) VALUES (?, ?)');
const searchStmt = db.prepare('SELECT path, description FROM images WHERE description LIKE ?');
const existsStmt = db.prepare('SELECT 1 FROM images WHERE path = ? LIMIT 1');

function insertImage(filePath, description) {
  insertStmt.run(filePath, description);
}

function searchImages(query) {
  return searchStmt.all(`%${query}%`);
}

function isIndexed(filePath) {
  return existsStmt.get(filePath) !== undefined;
}

module.exports = { insertImage, searchImages, isIndexed };