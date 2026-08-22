import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { DbUser } from './db/types';

const JWT_SECRET = process.env.JWT_SECRET || 'dlorenz_enterprise_secret_key_2026_growth_solutions';
const TOKEN_EXPIRY = '7d';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function generateToken(user: DbUser): string {
  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.headers['x-access-token']) {
    return String(req.headers['x-access-token']).trim();
  }
  return null;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Please log in to access this resource.',
      code: 'AUTH_REQUIRED',
    });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({
      error: 'Invalid or expired session. Please log in again.',
      code: 'TOKEN_INVALID',
    });
  }

  // Verify user still exists in database
  const user = db.getUserById(payload.userId);
  if (!user) {
    return res.status(401).json({
      error: 'User account not found or deactivated.',
      code: 'USER_NOT_FOUND',
    });
  }

  req.user = payload;
  next();
}

export function requireSuperAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({
        error: 'Forbidden. Super Admin privileges required.',
        code: 'FORBIDDEN',
      });
    }
    next();
  });
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
}

// Simple in-memory rate limiter for brute-force protection
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(windowMs: number = 60 * 1000, maxRequests: number = 20) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown_ip';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please slow down and try again shortly.',
        retryAfterMs: entry.resetTime - now,
      });
    }

    next();
  };
}
