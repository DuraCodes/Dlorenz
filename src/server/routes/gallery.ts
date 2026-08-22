import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const galleryRouter = Router();

const galleryItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  type: z.enum(['image', 'video']),
  title: z.string().min(1, 'Title is required'),
  desc: z.string().default(''),
  url: z.string().min(1, 'Media URL is required'),
  span: z.string().default('col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-2'),
  tags: z.array(z.string()).optional(),
  alt: z.string().optional(),
});

// GET /api/gallery (Public - List all gallery items and config)
galleryRouter.get('/', (req, res) => {
  const items = db.getBentoGallery();
  const config = db.getGalleryConfig();
  res.json({
    success: true,
    items,
    config,
  });
});

// PUT /api/gallery (Protected - Bulk update/reorder entire gallery list)
galleryRouter.put('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { items, config } = req.body || {};

  if (Array.isArray(items)) {
    db.setBentoGallery(items, { email: req.user?.email, name: req.user?.name });
  }

  if (config && typeof config === 'object') {
    db.updateGalleryConfig(config);
  }

  res.json({
    success: true,
    message: 'Gallery saved successfully',
    items: db.getBentoGallery(),
    config: db.getGalleryConfig(),
  });
});

// POST /api/gallery/item (Protected - Add single gallery item)
galleryRouter.post('/item', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const parsed = galleryItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid gallery item' });
  }

  const newItem = {
    ...parsed.data,
    id: parsed.data.id || Date.now(),
  };

  const created = db.addGalleryItem(newItem);
  res.status(201).json({
    success: true,
    item: created,
  });
});

// PUT /api/gallery/item/:id (Protected - Update single gallery item)
galleryRouter.put('/item/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateGalleryItem(id, req.body);

  if (!updated) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  res.json({
    success: true,
    item: updated,
  });
});

// DELETE /api/gallery/item/:id (Protected - Delete single gallery item)
galleryRouter.delete('/item/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteGalleryItem(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Gallery item not found' });
  }

  res.json({
    success: true,
    message: 'Gallery item deleted successfully',
  });
});
