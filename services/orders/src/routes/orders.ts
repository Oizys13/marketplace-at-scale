import { Router } from "express";
import { pool } from "../index";

const router = Router();

// Create new order + write to outbox
router.post("/", async (req, res) => {
  const { buyer_id, listing_id, amount } = req.body;

  if (!buyer_id || !listing_id || !amount) {
    return res.status(400).json({ error: "buyer_id, listing_id, amount required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (buyer_id, listing_id, amount, created_at) 
       VALUES ($1, $2, $3, NOW()) RETURNING id`,
      [buyer_id, listing_id, amount]
    );
    const orderId = orderResult.rows[0].id;

    // Insert into outbox
    await client.query(
      `INSERT INTO outbox (topic, payload) 
       VALUES ($1, $2)`,
      [
        "order.created",
        JSON.stringify({ order_id: orderId, buyer_id, listing_id, amount })
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({ id: orderId, buyer_id, listing_id, amount });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

// Get all orders
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
