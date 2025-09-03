import fastify from 'fastify';
import dotenv from 'dotenv';
import listingsRouter from './routes/listings';
import fastifyJwt from '@fastify/jwt';

dotenv.config();

const server = fastify({ logger: true });

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'devsecret',
});


server.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

server.register(listingsRouter, { prefix: '/listings' });

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT || 4001), host: '0.0.0.0' });
    server.log.info(`listings service listening on ${process.env.PORT || 4001}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
