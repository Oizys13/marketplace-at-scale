import amqp from "amqplib";
import { jest } from "@jest/globals";

jest.mock("amqplib");

describe("Worker Service", () => {
  let channelMock: any;

  beforeEach(() => {
    channelMock = {
      assertQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
    };

    (amqp.connect as jest.Mock).mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(channelMock),
    });
  });

  it("should connect to RabbitMQ and consume messages", async () => {
    const startWorker = require("../index").startWorker;
    await startWorker();

    expect(channelMock.assertQueue).toHaveBeenCalledWith("notifications", { durable: true });
    expect(channelMock.consume).toHaveBeenCalledWith("notifications", expect.any(Function));
  });

  it("should process a 'ListingCreated' event", async () => {
    const startWorker = require("../index").startWorker;
    await startWorker();

    const messageHandler = channelMock.consume.mock.calls[0][1];
    const mockMessage = {
      content: Buffer.from(JSON.stringify({ type: "ListingCreated", data: { title: "Test", price: 100 } })),
    };

    messageHandler(mockMessage);

    expect(channelMock.ack).toHaveBeenCalledWith(mockMessage);
  });
});
