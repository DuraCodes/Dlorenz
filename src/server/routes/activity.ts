import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const activityRouter = Router();

// GET /api/activity-logs (Protected - CMS Audit Trail)
activityRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const logs = db.getActivityLogs(limit);
  res.json({ success: true, logs });
});

// GET /api/analytics/summary (Protected - CMS Dashboard Overview)
activityRouter.get('/summary', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const raw = db.getRaw();
  const inquiries = raw.inquiries;

  res.json({
    success: true,
    stats: {
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === 'new').length,
      inReviewInquiries: inquiries.filter((i) => i.status === 'in_review').length,
      resolvedInquiries: inquiries.filter((i) => i.status === 'resolved').length,
      galleryItemsCount: raw.bentoGallery.length,
      teamMembersCount: raw.team.length,
      partnersCount: raw.partners.length,
      mediaAssetsCount: raw.mediaAssets.length,
      usersCount: raw.users.length,
      lastUpdated: raw.lastUpdated,
    },
  });
});
