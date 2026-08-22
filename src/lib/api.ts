/**
 * DLorenz Solutions API & Cloud Persistence Client
 * Connects frontend components to Google Cloud Firestore, ImageKit CDN, and backend endpoints.
 */

import { SiteConfig, TeamMember, BentoGalleryItem } from '../types';
import { MarqueeLogoItem } from '../components/ui/marquee-logo-scroller';
import {
  getFirebaseSiteConfig,
  saveFirebaseSiteConfig,
  getFirebaseGallery,
  saveFirebaseGallery,
  getFirebaseTeam,
  saveFirebaseTeam,
  getFirebasePartners,
  saveFirebasePartners,
  submitFirebaseInquiry,
  getFirebaseInquiries,
  updateFirebaseInquiryStatus,
  deleteFirebaseInquiry,
  logFirebaseActivity,
  getFirebaseActivityLogs,
} from './firebaseDb';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLoginAt?: string;
}

export interface InquiryItem {
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
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  actorEmail?: string;
  actorName?: string;
  createdAt: string;
}

// Token helper
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dlorenz_auth_token');
};

export const setAuthToken = (token: string | null) => {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('dlorenz_auth_token', token);
  } else {
    localStorage.removeItem('dlorenz_auth_token');
  }
};

const getHeaders = (withAuth = false): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (withAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// ==========================================
// AUTHENTICATION
// ==========================================
export async function apiLogin(email: string, password: string): Promise<{ success: boolean; token?: string; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Authentication failed' };
    }
    if (data.token) {
      setAuthToken(data.token);
    }
    // Log login to Firebase Audit Log
    logFirebaseActivity('ADMIN_LOGIN', 'auth', data.user?.id, `Executive logged in (${data.user?.email})`, data.user?.email, data.user?.name);
    return { success: true, token: data.token, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to auth server' };
  }
}

export async function apiGetMe(): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const res = await fetch('/api/auth/me', {
      headers: getHeaders(true),
    });
    if (!res.ok) {
      return { success: false };
    }
    const data = await res.json();
    return { success: true, user: data.user };
  } catch {
    return { success: false };
  }
}

export function apiLogout() {
  setAuthToken(null);
}

// ==========================================
// SITE CONFIGURATION (Cloud Firestore Sync)
// ==========================================
export async function apiGetSiteConfig(): Promise<SiteConfig | null> {
  try {
    // 1. Try Firebase Firestore Cloud Database first
    const cloudConfig = await getFirebaseSiteConfig();
    if (cloudConfig && cloudConfig.siteName) {
      return cloudConfig;
    }
    // 2. Fallback to API server
    const res = await fetch('/api/config');
    if (!res.ok) return null;
    const data = await res.json();
    return data.config || null;
  } catch (err) {
    console.error('Failed to fetch site config:', err);
    return null;
  }
}

export async function apiUpdateSiteConfig(config: Partial<SiteConfig>): Promise<{ success: boolean; config?: SiteConfig; error?: string }> {
  try {
    // 1. Save to Firebase Firestore
    await saveFirebaseSiteConfig(config as SiteConfig);
    logFirebaseActivity('SITE_CONFIG_UPDATED', 'site_config', 'main', 'Updated site configuration parameters in Firestore');

    // 2. Synchronize with Express Server as well
    fetch('/api/config', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(config),
    }).catch((e) => console.warn('API sync warning:', e));

    return { success: true, config: config as SiteConfig };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

// ==========================================
// BENTO GALLERY (Cloud Firestore Sync)
// ==========================================
export async function apiGetGallery(): Promise<{ items: BentoGalleryItem[]; config: { title: string; description: string } } | null> {
  try {
    // 1. Query Firebase Firestore
    const cloudItems = await getFirebaseGallery();
    if (cloudItems && cloudItems.length > 0) {
      return {
        items: cloudItems,
        config: {
          title: 'Interactive Field Portfolio',
          description: 'Drag to reorganize items or click any card to inspect high-resolution video reels, field activations, and verified project documentation.',
        },
      };
    }

    // 2. Fallback to Express API
    const res = await fetch('/api/gallery');
    if (!res.ok) return null;
    const data = await res.json();
    return { items: data.items || [], config: data.config };
  } catch (err) {
    console.error('Failed to fetch gallery:', err);
    return null;
  }
}

export async function apiSaveGallery(
  items: BentoGalleryItem[],
  config?: { title: string; description: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Save directly to Firebase Firestore
    await saveFirebaseGallery(items);
    logFirebaseActivity('GALLERY_SAVED', 'gallery', undefined, `Updated ${items.length} items in Cloud Firestore`);

    // 2. Sync to Express server API
    fetch('/api/gallery', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ items, config }),
    }).catch(() => {});

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// TEAM (Cloud Firestore Sync)
// ==========================================
export async function apiGetTeam(): Promise<TeamMember[] | null> {
  try {
    const cloudTeam = await getFirebaseTeam();
    if (cloudTeam && cloudTeam.length > 0) {
      return cloudTeam;
    }
    const res = await fetch('/api/team');
    if (!res.ok) return null;
    const data = await res.json();
    return data.team || null;
  } catch (err) {
    console.error('Failed to fetch team:', err);
    return null;
  }
}

export async function apiSaveTeam(team: TeamMember[]): Promise<{ success: boolean; error?: string }> {
  try {
    await saveFirebaseTeam(team);
    logFirebaseActivity('TEAM_SAVED', 'team', undefined, `Updated ${team.length} leadership members in Cloud Firestore`);

    fetch('/api/team', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ team }),
    }).catch(() => {});

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// PARTNERS (Cloud Firestore Sync)
// ==========================================
export async function apiGetPartners(): Promise<MarqueeLogoItem[] | null> {
  try {
    const cloudPartners = await getFirebasePartners();
    if (cloudPartners && cloudPartners.length > 0) {
      return cloudPartners;
    }
    const res = await fetch('/api/partners');
    if (!res.ok) return null;
    const data = await res.json();
    return data.partners || null;
  } catch (err) {
    console.error('Failed to fetch partners:', err);
    return null;
  }
}

export async function apiSavePartners(partners: MarqueeLogoItem[]): Promise<{ success: boolean; error?: string }> {
  try {
    await saveFirebasePartners(partners as any);
    logFirebaseActivity('PARTNERS_SAVED', 'partner', undefined, `Updated ${partners.length} partner logos in Cloud Firestore`);

    fetch('/api/partners', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ partners }),
    }).catch(() => {});

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// INQUIRIES & CONTACT (Cloud Firestore & API)
// ==========================================
export async function apiSubmitInquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  projectTypes?: string[];
  message: string;
  budget?: string;
  type?: 'consultation' | 'contact' | 'partnership';
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // 1. Submit directly to Firebase Firestore
    const cloudRes = await submitFirebaseInquiry({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || '',
      company: payload.company || '',
      serviceInterest: payload.serviceInterest || (payload.projectTypes || []).join(', '),
      projectTypes: payload.projectTypes || [],
      message: payload.message,
      budget: payload.budget || '',
      type: payload.type || 'contact',
    });

    // 2. Also forward to Express API for dual synchronization
    fetch('/api/inquiries', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    }).catch(() => {});

    if (cloudRes.success) {
      return { success: true, message: 'Your briefing was successfully stored in the DLorenz database.' };
    }
    return { success: false, error: cloudRes.error || 'Submission failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Submission failed' };
  }
}

export async function apiGetInquiries(filters?: {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ inquiries: InquiryItem[]; total: number; page: number; totalPages: number; stats: any } | null> {
  try {
    // 1. Query from Cloud Firestore
    const inquiries = await getFirebaseInquiries(filters?.status);
    let list = [...inquiries];

    if (filters?.type && filters.type !== 'all') {
      list = list.filter((i) => i.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (i) =>
          (i.name && i.name.toLowerCase().includes(q)) ||
          (i.email && i.email.toLowerCase().includes(q)) ||
          (i.company && i.company.toLowerCase().includes(q)) ||
          (i.message && i.message.toLowerCase().includes(q))
      );
    }

    const total = list.length;
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.min(100, Math.max(1, filters?.limit || 50));
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    const stats = {
      total: inquiries.length,
      new: inquiries.filter((i) => i.status === 'new').length,
      inReview: inquiries.filter((i) => i.status === 'in_review').length,
      resolved: inquiries.filter((i) => i.status === 'resolved').length,
      archived: inquiries.filter((i) => i.status === 'archived').length,
    };

    return { inquiries: paginated, total, page, totalPages, stats };
  } catch (err) {
    console.error('Failed to fetch inquiries from Firestore:', err);
    // Fallback to Express API
    try {
      const res = await fetch('/api/inquiries', { headers: getHeaders(true) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export async function apiUpdateInquiryStatus(
  id: string,
  status: 'new' | 'in_review' | 'resolved' | 'archived',
  notes?: string
): Promise<{ success: boolean; inquiry?: InquiryItem; error?: string }> {
  try {
    const success = await updateFirebaseInquiryStatus(id, status, notes);
    if (success) {
      logFirebaseActivity('INQUIRY_STATUS_UPDATED', 'inquiry', id, `Updated inquiry status to ${status}`);
      // Sync with Express API
      fetch(`/api/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ status, notes }),
      }).catch(() => {});
      return { success: true };
    }
    return { success: false, error: 'Failed to update status in Firestore' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function apiDeleteInquiry(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const success = await deleteFirebaseInquiry(id);
    if (success) {
      logFirebaseActivity('INQUIRY_DELETED', 'inquiry', id, 'Deleted inquiry lead record');
      fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      }).catch(() => {});
      return { success: true };
    }
    return { success: false, error: 'Failed to delete inquiry from Firestore' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// IMAGEKIT & MEDIA
// ==========================================
export async function apiDeleteImageKitFile(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/imagekit/delete/${fileId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// AUDIT LOGS (Cloud Firestore Sync)
// ==========================================
export async function apiGetActivityLogs(): Promise<ActivityLogItem[]> {
  try {
    const cloudLogs = await getFirebaseActivityLogs();
    if (cloudLogs && cloudLogs.length > 0) {
      return cloudLogs;
    }
    const res = await fetch('/api/activity-logs?limit=50', {
      headers: getHeaders(true),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch {
    return [];
  }
}
