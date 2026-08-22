import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const siteConfigRouter = Router();

// GET /api/config (Public)
siteConfigRouter.get('/', (req, res) => {
  const config = db.getSiteConfig();
  // Strip sensitive internal config keys before returning to public client
  const safeConfig = { ...config };
  if (safeConfig.imageKitConfig) {
    safeConfig.imageKitConfig = {
      publicKey: safeConfig.imageKitConfig.publicKey ? `${safeConfig.imageKitConfig.publicKey.slice(0, 8)}...` : undefined,
      urlEndpoint: safeConfig.imageKitConfig.urlEndpoint,
    };
  }
  res.json({ success: true, config: safeConfig });
});

// PUT /api/config (Protected - CMS Admin)
siteConfigRouter.put('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Invalid configuration payload' });
  }

  const updated = db.updateSiteConfig(updates, {
    email: req.user?.email,
    name: req.user?.name,
  });

  res.json({
    success: true,
    message: 'Site configuration updated successfully',
    config: updated,
  });
});
