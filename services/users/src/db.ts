import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'pguser',
  password: process.env.PGPASSWORD || 'pgpass',
  database: process.env.PGDATABASE || 'marketplace',
});
