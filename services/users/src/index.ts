import fastify from 'fastify';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import fastifyJwt from '@fastify/jwt';

dotenv.config();

const server = fastify({ logger: true });

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'devsecret',
});

// ✅ Add this decorator
server.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

server.register(userRoutes, { prefix: '/users' });

const start = async () => {
  try {
    await server.listen({ port: Number(process.env.PORT || 4000), host: '0.0.0.0' });
    server.log.info(`users service listening on ${process.env.PORT || 4000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
