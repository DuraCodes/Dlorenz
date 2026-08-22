import { Router, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import {
  generateToken,
  comparePassword,
  hashPassword,
  requireAuth,
  requireSuperAdmin,
  AuthenticatedRequest,
  rateLimit,
} from '../auth';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'editor', 'super_admin']).default('admin'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// POST /api/auth/login
authRouter.post('/login', rateLimit(60000, 10), async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid login details' });
  }

  const { email, password } = parsed.data;
  const user = db.getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Update last login
  db.updateUser(user.id, { lastLoginAt: new Date().toISOString() });
  db.logActivity('USER_LOGIN', 'auth', user.id, `User ${user.name} logged in successfully`, user.email, user.name);

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    },
  });
});

// GET /api/auth/me
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    },
  });
});

// POST /api/auth/change-password
authRouter.post('/change-password', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
  }

  const user = db.getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isMatch = await comparePassword(parsed.data.currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  db.updateUser(user.id, { passwordHash: newHash });
  db.logActivity('PASSWORD_CHANGED', 'auth', user.id, `User ${user.email} changed their password`, user.email, user.name);

  res.json({ success: true, message: 'Password updated successfully.' });
});

// GET /api/auth/users (Super Admin only)
authRouter.get('/users', requireSuperAdmin, (req, res) => {
  const users = db.getUsers().map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
  }));
  res.json({ success: true, users });
});

// POST /api/auth/users (Super Admin only - Add new admin user)
authRouter.post('/users', requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
  }

  const { email, name, password, role } = parsed.data;
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'A user with this email address already exists.' });
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email: email.toLowerCase().trim(),
    name: name.trim(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.addUser(newUser);

  res.status(201).json({
    success: true,
    message: `Admin user ${name} created successfully.`,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
  });
});

// DELETE /api/auth/users/:id (Super Admin only)
authRouter.delete('/users/:id', requireSuperAdmin, (req: AuthenticatedRequest, res: Response) => {
  const targetId = req.params.id;
  if (targetId === req.user!.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  const success = db.deleteUser(targetId);
  if (!success) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({ success: true, message: 'User deleted successfully.' });
});
