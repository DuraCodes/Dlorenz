import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const partnersRouter = Router();

// GET /api/partners (Public)
partnersRouter.get('/', (req, res) => {
  const partners = db.getPartners();
  res.json({ success: true, partners });
});

// PUT /api/partners (Protected - Bulk update/reorder partners list)
partnersRouter.put('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { partners } = req.body || {};
  if (!Array.isArray(partners)) {
    return res.status(400).json({ error: 'Expected array of partners' });
  }

  const updated = db.setPartners(partners, { email: req.user?.email, name: req.user?.name });
  res.json({ success: true, message: 'Partners updated successfully', partners: updated });
});

// POST /api/partners (Protected - Add single partner)
partnersRouter.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data?.name) {
    return res.status(400).json({ error: 'Partner name is required' });
  }

  const partner = db.addPartner(data);
  res.status(201).json({ success: true, partner });
});

// DELETE /api/partners/:name (Protected - Delete partner)
partnersRouter.delete('/:name', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.params;
  const deleted = db.deletePartner(name);
  if (!deleted) {
    return res.status(404).json({ error: 'Partner not found' });
  }
  res.json({ success: true, message: 'Partner removed successfully' });
});
