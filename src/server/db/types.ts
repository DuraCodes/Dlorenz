import { SiteConfig, TeamMember, BentoGalleryItem } from '../../types';
import { MarqueeLogoItem } from '../../components/ui/marquee-logo-scroller';

export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface DbInquiry {
  id: string;
  type: 'consultation' | 'contact' | 'partnership';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  projectTypes?: string[];
  message: string;
  budget?: string;
  status: 'new' | 'in_review' | 'resolved' | 'archived';
  notes?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbMediaAsset {
  id: string;
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  filePath?: string;
  fileType?: 'image' | 'video' | 'document' | 'other';
  size?: number;
  tags?: string[];
  uploadedBy?: string;
  createdAt: string;
}

export interface DbActivityLog {
  id: string;
  action: string;
  entityType: 'auth' | 'site_config' | 'gallery' | 'team' | 'partner' | 'inquiry' | 'media' | 'system';
  entityId?: string;
  details: string;
  actorEmail?: string;
  actorName?: string;
  createdAt: string;
}

export interface DbSchema {
  users: DbUser[];
  siteConfig: SiteConfig;
  galleryConfig: {
    title: string;
    description: string;
  };
  bentoGallery: BentoGalleryItem[];
  team: TeamMember[];
  partners: MarqueeLogoItem[];
  inquiries: DbInquiry[];
  mediaAssets: DbMediaAsset[];
  activityLogs: DbActivityLog[];
  systemSettings: Record<string, any>;
  version: number;
  lastUpdated: string;
}
