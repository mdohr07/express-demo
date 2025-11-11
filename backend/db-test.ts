import Database from "better-sqlite3";

const db = new Database("test.db");

// Tabelle anlegen
db.prepare(
  `
    CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    longUrl TEXT NOT NULL,
    shortUrl TEXT NOT NULL
    )
    `
).run();

// Daten einfügen
const insert = db.prepare("INSERT INTO links (longUrl, shortUrl) VALUES (?, ?)");
insert.run("https://example.com", "abc123");

// Einträge anzeigen
const rows = db.prepare("SELECT * FROM links").all();
console.log(rows);