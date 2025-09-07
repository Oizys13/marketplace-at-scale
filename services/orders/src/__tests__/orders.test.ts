import request from "supertest";
import app from "../index";
import { pool } from "../index";
import { describe } from "node:test";

jest.mock("../../index");

describe("Orders Routes", () => {
  it("should create a new order", async () => {
    (pool.connect as jest.Mock).mockResolvedValueOnce({
      query: jest.fn()
        .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // Order insert
        .mockResolvedValueOnce({}), // Outbox insert
      release: jest.fn(),
    });

    const response = await request(app)
      .post("/orders")
      .send({ buyer_id: 1, listing_id: 2, amount: 100 });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: 1, buyer_id: 1, listing_id: 2, amount: 100 });
  });

  it("should fetch all orders", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: 1, buyer_id: 1, listing_id: 2, amount: 100 }],
    });

    const response = await request(app).get("/orders");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([{ id: 1, buyer_id: 1, listing_id: 2, amount: 100 }]);
  });
});
