import fastify from "fastify";
import userRoutes from "../routes/users";
import { pool } from "../db";
import bcrypt from "bcrypt";

jest.mock("../../db");
jest.mock("bcrypt");

describe("User Routes", () => {
  const app = fastify();

  beforeAll(async () => {
    app.register(userRoutes);
  });

  afterAll(() => app.close());

  it("should register a new user", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: 1, email: "test@example.com" }],
    });

    const response = await app.inject({
      method: "POST",
      url: "/register",
      payload: { email: "test@example.com", password: "password123" },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({ id: 1, email: "test@example.com" });
  });

  it("should login a user with valid credentials", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({
      rows: [{ id: 1, email: "test@example.com", password_hash: "hashedpassword" }],
    });
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const response = await app.inject({
      method: "POST",
      url: "/login",
      payload: { email: "test@example.com", password: "password123" },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toHaveProperty("token");
  });
});
