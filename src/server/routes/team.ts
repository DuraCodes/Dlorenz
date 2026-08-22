import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const teamRouter = Router();

// GET /api/team (Public)
teamRouter.get('/', (req, res) => {
  const team = db.getTeam();
  res.json({ success: true, team });
});

// PUT /api/team (Protected - Bulk update/reorder entire team list)
teamRouter.put('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { team } = req.body || {};
  if (!Array.isArray(team)) {
    return res.status(400).json({ error: 'Expected array of team members' });
  }

  const updated = db.setTeam(team, { email: req.user?.email, name: req.user?.name });
  res.json({ success: true, message: 'Team updated successfully', team: updated });
});

// POST /api/team/member (Protected - Add single team member)
teamRouter.post('/member', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  if (!data?.name || !data?.role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const id = data.id || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const member = db.addTeamMember({ ...data, id });
  res.status(201).json({ success: true, member });
});

// PUT /api/team/member/:id (Protected - Update single member)
teamRouter.put('/member/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateTeamMember(id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json({ success: true, member: updated });
});

// DELETE /api/team/member/:id (Protected - Delete single member)
teamRouter.delete('/member/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteTeamMember(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json({ success: true, message: 'Team member deleted successfully' });
});
