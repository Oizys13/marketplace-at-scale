import express from "express";
import listingsRouter from "./routes/listings";

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
app.listen(PORT, () => {
  console.log(`Listings service listening on port ${PORT}`);
});
