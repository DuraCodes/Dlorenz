import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './src/server/routes/auth';
import { siteConfigRouter } from './src/server/routes/siteConfig';
import { galleryRouter } from './src/server/routes/gallery';
import { teamRouter } from './src/server/routes/team';
import { partnersRouter } from './src/server/routes/partners';
import { inquiriesRouter } from './src/server/routes/inquiries';
import { imageKitRouter, getImageKitClient } from './src/server/routes/imagekit';
import { activityRouter } from './src/server/routes/activity';
import { db } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize and verify database on boot
  db.ensureInitialized();

  // Trust proxy for reverse proxy in Cloud Run / container
  app.set('trust proxy', 1);

  // Body parsing for JSON & large base64 uploads (up to 50MB)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const ik = getImageKitClient();
    res.json({
      status: 'ok',
      service: 'DLorenz Solutions Full-Stack API',
      timestamp: new Date().toISOString(),
      imagekitConfigured: Boolean(ik),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/config', siteConfigRouter);
  app.use('/api/gallery', galleryRouter);
  app.use('/api/team', teamRouter);
  app.use('/api/partners', partnersRouter);
  app.use('/api/inquiries', inquiriesRouter);
  app.use('/api/imagekit', imageKitRouter);
  app.use('/api/activity-logs', activityRouter);
  app.use('/api/analytics', activityRouter);

  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: `API endpoint ${req.method} ${req.originalUrl} not found`,
    });
  });

  // Global error handler for API
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Server Error]', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  // Vite middleware in development vs static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 DLorenz Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
