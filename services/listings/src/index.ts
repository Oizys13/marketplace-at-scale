import express from "express";
import listingsRouter from "./routes/listings";
import { connectRabbitMQ } from "./events/publisher";


const app = express();
app.use(express.json());

// Routes
app.use("/listings", listingsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "listings service is running" });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, async () => {
  await connectRabbitMQ();
  console.log(`Listings service running on port ${PORT}`);
});

export default app;