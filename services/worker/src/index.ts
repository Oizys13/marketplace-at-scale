import amqp from "amqplib";

async function startWorker() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("notifications", { durable: true });

  console.log("Worker is listening for notifications...");

  channel.consume("notifications", msg => {
    if (msg) {
      const event = JSON.parse(msg.content.toString());
      console.log("📧 Sending notification:", event);

      // Simulate email sending
      if (event.type === "ListingCreated") {
        console.log(`Email: New listing created: ${event.data.title} ($${event.data.price})`);
      }

      channel.ack(msg);
    }
  });
}

startWorker().catch(err => {
  console.error("Worker failed:", err);
});
