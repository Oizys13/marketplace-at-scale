import { Router } from "express";
import { publishEvent } from "../events/publisher";

const router = Router();

// In-memory mock database
let listings = [
  { id: 1, title: "Beautiful Apartment", price: 1200 },
  { id: 2, title: "Cozy Studio", price: 800 }
];

// GET all listings
router.get("/", (req, res) => {
  res.json(listings);
});

// GET single listing by ID
router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const listing = listings.find(l => l.id === id);
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
});

// POST create new listing
router.post("/", async (req, res) => {
  const { title, price } = req.body;
  const newListing = { id: listings.length + 1, title, price };
  listings.push(newListing);

  // Publish event
  await publishEvent("notifications", {
    type: "ListingCreated",
    data: newListing
  });

  res.status(201).json(newListing);
});


// PUT update listing
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, price } = req.body;
  const listingIndex = listings.findIndex(l => l.id === id);
  if (listingIndex === -1) {
    return res.status(404).json({ message: "Listing not found" });
  }
  listings[listingIndex] = { id, title, price };
  res.json(listings[listingIndex]);
});

// DELETE listing
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  listings = listings.filter(l => l.id !== id);
  res.status(204).send();
});

export default router;
