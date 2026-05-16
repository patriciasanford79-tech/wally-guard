import { Router } from 'express';
import { platforms, getPlatformById } from '../data/platforms.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'spectre-api', time: new Date().toISOString() });
});

router.get('/platforms', (_req, res) => {
  res.json({
    count: platforms.length,
    platforms: platforms.map(({ id, name, tagline, color }) => ({
      id,
      name,
      tagline,
      color,
    })),
  });
});

router.get('/platforms/:id', (req, res) => {
  const platform = getPlatformById(req.params.id);
  if (!platform) {
    return res.status(404).json({ error: `Unknown platform: ${req.params.id}` });
  }
  res.json(platform);
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!email || !message) {
    return res.status(400).json({ error: 'email and message are required' });
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'invalid email' });
  }
  console.log('[contact]', {
    name: name?.toString().slice(0, 120),
    email: email.slice(0, 200),
    message: message.toString().slice(0, 2000),
    at: new Date().toISOString(),
  });
  res.status(201).json({ ok: true });
});

export default router;
