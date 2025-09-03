import fp from 'fastify-plugin';

export default fp(async (fastify, opts) => {
  fastify.decorate("authenticate", async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
