import express from "express";
import cors from "cors";

// initialise express
const app = express();
app.use(cors({ origin: ["http://localhost:5173"] })); // cors is now gonna allow the request from the frontend-port
/* ℹ️ cors is like a bridge between frontend & backend.
 *  With it requests can be sent between the two different ports.
 */
app.use(express.json());

const shortLinks: Record<string, string> = {};

app.get("/", (req, res) => {
  res.json({ message: "Server online 🛰️" });
});

// POST /shorten
app.post("/shorten", (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL fehlt" });
    }

        const short = Math.random().toString(36).substring(2, 8);
        shortLinks[short] = url;

        res.json({ shortLink: short, originalUrl: url })   
});

// GET /:shortlink -> Weiterleitung
app.get("/:shortlink", (req, res) => {
    const { shortlink } = req.params;
    const target = shortLinks[shortlink];

    if (!target) return res.status(404).send("Kurzlink nicht gefunden");
    res.redirect(301, target);
})

// Server starten
app.listen(8080, () => {
  // Port-number and what happens next
  console.log("Server läuft auf Port 8080");
});
