import request from "supertest";
import app from "../index";
import { publishEvent } from "../events/publisher";

jest.mock("../events/publisher");

describe("Listings Routes", () => {
  it("should fetch all listings", async () => {
    const response = await request(app).get("/listings");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, title: "Beautiful Apartment", price: 1200 },
      { id: 2, title: "Cozy Studio", price: 800 },
    ]);
  });

  it("should create a new listing and publish an event", async () => {
    const response = await request(app)
      .post("/listings")
      .send({ title: "New Listing", price: 1500 });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: 3, title: "New Listing", price: 1500 });
    expect(publishEvent).toHaveBeenCalledWith("notifications", {
      type: "ListingCreated",
      data: { id: 3, title: "New Listing", price: 1500 },
    });
  });
});
