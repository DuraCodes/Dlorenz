import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest, rateLimit } from '../auth';

export const inquiriesRouter = Router();

const consultationInquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  projectTypes: z.array(z.string()).optional(),
  message: z.string().min(3, 'Message must be at least 3 characters'),
  budget: z.string().optional(),
  type: z.enum(['consultation', 'contact', 'partnership']).default('contact'),
});

// POST /api/inquiries (Public with rate limiting)
inquiriesRouter.post('/', rateLimit(60000, 15), async (req, res) => {
  const parsed = consultationInquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || 'Invalid form submission',
      details: parsed.error.issues,
    });
  }

  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';

  const inquiry = db.addInquiry({
    ...parsed.data,
    status: 'new',
    ipAddress: clientIp,
  });

  console.log(`[Inquiries] New ${inquiry.type} inquiry recorded from ${inquiry.name} <${inquiry.email}> (${inquiry.company || 'Direct'})`);

  res.status(201).json({
    success: true,
    message: 'Your strategic briefing has been received. Our executive partners will reach out within 24 hours.',
    inquiry: {
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      createdAt: inquiry.createdAt,
    },
  });
});

// GET /api/inquiries (Protected - List inquiries with filtering, search, pagination)
inquiriesRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const status = req.query.status as string | undefined;
  const type = req.query.type as string | undefined;
  const search = req.query.search as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  const result = db.getInquiries({ status, type, search, page, limit });

  // Also calculate stats
  const allInquiries = db.getRaw().inquiries;
  const stats = {
    total: allInquiries.length,
    new: allInquiries.filter((i) => i.status === 'new').length,
    inReview: allInquiries.filter((i) => i.status === 'in_review').length,
    resolved: allInquiries.filter((i) => i.status === 'resolved').length,
    archived: allInquiries.filter((i) => i.status === 'archived').length,
    consultationsCount: allInquiries.filter((i) => i.type === 'consultation').length,
    contactsCount: allInquiries.filter((i) => i.type === 'contact').length,
  };

  res.json({
    success: true,
    ...result,
    stats,
  });
});

// GET /api/inquiries/:id (Protected - Get single inquiry)
inquiriesRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const inquiry = db.getInquiryById(id);
  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json({ success: true, inquiry });
});

// PATCH /api/inquiries/:id/status (Protected - Update inquiry status and internal notes)
inquiriesRouter.patch('/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body || {};

  if (!status || !['new', 'in_review', 'resolved', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value. Allowed: new, in_review, resolved, archived' });
  }

  const updated = db.updateInquiryStatus(id, status, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  res.json({
    success: true,
    message: `Inquiry status changed to ${status}`,
    inquiry: updated,
  });
});

// DELETE /api/inquiries/:id (Protected - Delete inquiry)
inquiriesRouter.delete('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = db.deleteInquiry(id);
  if (!deleted) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }
  res.json({ success: true, message: 'Inquiry removed successfully' });
});
