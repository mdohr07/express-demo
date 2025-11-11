import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";
import Database from "better-sqlite3";

// initialise express
const app = express();
app.use(cors({ origin: ["http://localhost:5173"] })); // cors is now gonna allow the request from the frontend-port
/* ℹ️ cors is like a bridge between frontend & backend.
 *  With it requests can be sent between the two different ports.
 */
app.use(express.json());

// DB 🥪 Verbindung herstellen oder neue DB-Datei anlegen
const db = new Database("./shortlinks.db");
console.log("📁 Datenbank-Pfad:", db.name);

// Tabelle erzeugen
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short TEXT UNIQUE,
    long TEXT
  )
`
).run();

/*
 * Record<K, V> ist ein TypeScript-Typ, der sagt:
 * „Ein Objekt mit Schlüsseln vom Typ K und Werten vom Typ V“
 * Hier: <Kurzlink String, Original URL String>
 */
// const shortLinks: Record<string, string> = {};
// GET /testroute
app.get("/", (req, res) => {
  res.json({ message: "Server online 🛰️" });
});

// POST /shorten
app.post("/shorten", (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL fehlt" });
  }

  // const short = Math.random().toString(36).substring(2, 8); // Zeichen von Index 2 bis 7
  const short = nanoid(6);
  try {
    db.prepare("INSERT INTO links (short, long) VALUES (?, ?)").run(short, url);
    res.json({ shortLink: short, originalUrl: url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fehler beim Speichern in DB" });
  }
  // res.json({ shortLink: short, originalUrl: url });
});

// GET /:shortlink -> Weiterleitung
app.get("/:shortlink", (req, res) => {
  const { shortlink } = req.params; // params enthält alle dynamischen Teile der URL, die mit : markiert sind
  const row = db.prepare("SELECT long FROM links WHERE short = ?").get(shortlink) as { long: string } | undefined;
  // const target = shortLinks[shortlink];

  if (!row) return res.status(404).send("Kurzlink nicht gefunden");
  res.redirect(301, row.long);
});

// Server starten
app.listen(8080, () => {
  // Port-number and what happens next
  console.log("Server läuft auf Port 8080");
});
