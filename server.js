require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend access
app.use(bodyParser.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Get all hackathons
app.get("/api/hackathons", (req, res) => {
  db.query("SELECT * FROM hackathons", (err, results) => {
    if (err) {
      console.error("Error fetching hackathons:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Get all teams
app.get("/api/teams", (req, res) => {
  db.query("SELECT * FROM teams", (err, results) => {
    if (err) {
      console.error("Error fetching teams:", err);
      return res.status(500).json({ error: "Failed to fetch teams" });
    }
    res.json(results);
  });
});

// Add a new team
app.post("/api/teams", (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Team name is required" });
  }

  db.query("INSERT INTO teams (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      console.error("Error adding team:", err);
      return res.status(500).json({ error: "Failed to add team" });
    }
    res.json({ id: result.insertId, name });
  });
});

// Delete a team
app.delete("/api/teams/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM teams WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting team:", err);
      return res.status(500).json({ error: "Failed to delete team" });
    }
    res.json({ message: "Team deleted successfully" });
  });
});

// Import user routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
