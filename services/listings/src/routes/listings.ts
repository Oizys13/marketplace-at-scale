import { Router } from "express";
import { pool } from "../index";

const router = Router();

// Get all listings
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM listings ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// Create a new listing
router.post("/", async (req, res) => {
  const { title, description, price, seller_id } = req.body;

  if (!title || !price || !seller_id) {
    return res.status(400).json({ error: "title, price, and seller_id are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO listings (title, description, price, seller_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
      [title, description || "", price, seller_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

// Get a single listing by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM listings WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
});

export default router;
