import { pool } from "./index";
import amqp from "amqplib";

async function run() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672");
  const ch = await conn.createChannel();
  await ch.assertExchange("marketplace", "topic", { durable: true });

  console.log("Outbox worker started...");

  while (true) {
    const r = await pool.query(
      `SELECT id, topic, payload 
       FROM outbox 
       WHERE published_at IS NULL 
       ORDER BY id 
       LIMIT 10 
       FOR UPDATE SKIP LOCKED`
    );

    for (const row of r.rows) {
      const ok = ch.publish(
        "marketplace",
        row.topic,
        Buffer.from(JSON.stringify(row.payload)),
        { persistent: true }
      );

      if (ok) {
        await pool.query("UPDATE outbox SET published_at = now() WHERE id = $1", [row.id]);
        console.log("Published event:", row.topic, row.payload);
      }
    }

    // sleep for 1 second
    await new Promise(res => setTimeout(res, 1000));
  }
}

run().catch(console.error);
