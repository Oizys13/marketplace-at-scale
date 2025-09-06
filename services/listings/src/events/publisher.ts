import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost:5672");
  channel = await connection.createChannel();
  console.log("Listings service connected to RabbitMQ");
}

export async function publishEvent(queue: string, message: any) {
  if (!channel) throw new Error("RabbitMQ not connected");
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  console.log("Published event:", queue, message);
}
