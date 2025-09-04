declare module "amqplib" {
  export interface Channel {
    assertQueue(queue: string, options?: any): Promise<void>;
    sendToQueue(queue: string, content: Buffer, options?: any): void;
    // Add other methods as needed
  }

  export interface Connection {
    createChannel(): Promise<Channel>;
  }

  export function connect(url: string): Promise<Connection>;
}
