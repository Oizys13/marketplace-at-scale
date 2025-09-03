import { FastifyInstance } from 'fastify';
import { pool } from '../db';
import bcrypt from 'bcrypt';

export default async function (server: FastifyInstance) {
  server.post('/register', async (req, reply) => {
    const body = req.body as any;
    const tenant = req.headers['x-tenant-id'] as string || 'default';
    if (!body.email || !body.password) return reply.status(400).send({ error: 'email+password required' });
    const hashed = await bcrypt.hash(body.password, 10);
    const res = await pool.query(
      'INSERT INTO users (email, password_hash, tenant_id) VALUES ($1, $2, $3) RETURNING id, email',
      [body.email, hashed, tenant]
    );
    reply.send(res.rows[0]);
  });

  server.post('/login', async (req, reply) => {
    const body = req.body as any;
    const tenant = req.headers['x-tenant-id'] as string || 'default';
    const r = await pool.query('SELECT id, email, password_hash FROM users WHERE email=$1 AND tenant_id=$2', [body.email, tenant]);
    if (r.rows.length === 0) return reply.status(401).send({ error: 'invalid' });
    const user = r.rows[0];
    const ok = await bcrypt.compare(body.password, user.password_hash);
    if (!ok) return reply.status(401).send({ error: 'invalid' });
    const token = server.jwt.sign({ sub: user.id, email: user.email, tenant });
    reply.send({ token });
  });

  server.get('/me', { onRequest: [server.authenticate] }, async (req: any, reply) => {
    const user = req.user;
    reply.send({ id: user.sub, email: user.email, tenant: user.tenant });
  });
}
