const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new Database("devlog.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    technology TEXT NOT NULL,
    description TEXT NOT NULL,
    solution TEXT NOT NULL,
    date TEXT NOT NULL
  )
`).run();

app.get("/", (req, res) => res.json({ message: "DevLog API is running", status: "ok" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/bugs", (req, res) => {
  const { title, technology, description, solution, date } = req.body;

  if (!title || !technology || !description || !solution || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const result = db.prepare(`
    INSERT INTO bugs (title, technology, description, solution, date)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, technology, description, solution, date);

  const bug = db.prepare("SELECT * FROM bugs WHERE id = ?").get(result.lastInsertRowid);

  res.status(201).json(bug);
});

app.get("/bugs", (req, res) => {
  const bugs = db.prepare("SELECT * FROM bugs ORDER BY id DESC").all();
  res.json(bugs);
});

app.put("/bugs/:id", (req, res) => {
  const { title, technology, description, solution, date } = req.body;
  const id = Number(req.params.id);

  const existing = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ error: "Bug not found" });
  }

  if (!title || !technology || !description || !solution || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.prepare(`
    UPDATE bugs
    SET title = ?, technology = ?, description = ?, solution = ?, date = ?
    WHERE id = ?
  `).run(title, technology, description, solution, date, id);

  const updated = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);

  res.json(updated);
});

app.delete("/bugs/:id", (req, res) => {
  const id = Number(req.params.id);

  const existing = db.prepare("SELECT * FROM bugs WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ error: "Bug not found" });
  }

  db.prepare("DELETE FROM bugs WHERE id = ?").run(id);

  res.json({ message: "Bug deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`DevLog backend running on http://localhost:${PORT}`);
});
