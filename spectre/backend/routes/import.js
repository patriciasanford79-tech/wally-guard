import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

import { listRoutes, routeFor } from '../data/routing.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const STORE_PATH = path.join(DATA_DIR, 'imports.json');

await fs.mkdir(UPLOAD_DIR, { recursive: true });

const MAX_FILE_BYTES = 50 * 1024 * 1024;   // 50 MB / file
const MAX_FILES_PER_REQUEST = 12;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeBase = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]+/g, '_')
      .slice(0, 120);
    cb(null, `${Date.now()}_${randomUUID().slice(0, 8)}_${safeBase}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_BYTES, files: MAX_FILES_PER_REQUEST },
});

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeStore(rows) {
  await fs.writeFile(STORE_PATH, JSON.stringify(rows, null, 2), 'utf-8');
}

const router = Router();

router.get('/routing', (_req, res) => {
  res.json({ routes: listRoutes() });
});

router.post('/routing/preview', (req, res) => {
  const files = Array.isArray(req.body?.files) ? req.body.files : null;
  if (!files) return res.status(400).json({ error: 'files array required' });
  const previews = files.map((f, i) => {
    const filename = String(f?.filename || '').slice(0, 240);
    const mime = String(f?.mime || '').slice(0, 120);
    const size = Number.isFinite(f?.size) ? Number(f.size) : null;
    const route = routeFor({ filename, mime });
    return { index: i, filename, mime, size, route };
  });
  res.json({ previews });
});

router.post('/import', (req, res, next) => {
  upload.array('files', MAX_FILES_PER_REQUEST)(req, res, async (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' ? 413 : 400;
      return res.status(status).json({ error: err.message, code: err.code });
    }
    try {
      const files = req.files || [];
      if (files.length === 0) {
        return res.status(400).json({ error: 'no files in upload' });
      }
      const importId = randomUUID();
      const at = new Date().toISOString();
      const items = files.map((f) => {
        const route = routeFor({ filename: f.originalname, mime: f.mimetype });
        return {
          id: randomUUID(),
          originalName: f.originalname,
          storedName: f.filename,
          mime: f.mimetype,
          size: f.size,
          route: {
            id: route.id,
            label: route.label,
            cloud: { provider: route.cloud.provider, model: route.cloud.model },
            local: { provider: route.local.provider, model: route.local.model },
          },
        };
      });
      const record = { importId, at, items };
      const store = await readStore();
      store.unshift(record);
      await writeStore(store.slice(0, 200));
      res.status(201).json({
        importId,
        at,
        count: items.length,
        items: items.map((it) => ({
          id: it.id,
          name: it.originalName,
          size: it.size,
          mime: it.mime,
          route: routeFor({ filename: it.originalName, mime: it.mime }),
        })),
      });
    } catch (e) {
      next(e);
    }
  });
});

router.get('/import/:id', async (req, res) => {
  const store = await readStore();
  const found = store.find((r) => r.importId === req.params.id);
  if (!found) return res.status(404).json({ error: 'import not found' });
  res.json({
    ...found,
    items: found.items.map((it) => ({
      id: it.id,
      name: it.originalName,
      size: it.size,
      mime: it.mime,
      route: routeFor({ filename: it.originalName, mime: it.mime }),
    })),
  });
});

export default router;
