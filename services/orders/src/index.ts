import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import ordersRouter from "./routes/orders";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Postgres connection
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/marketplace"
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "orders" });
});

// Orders routes
app.use("/orders", ordersRouter);

app.listen(port, () => {
  console.log(`Orders service running on port ${port}`);
});

export default app;