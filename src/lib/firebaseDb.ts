import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { SiteConfig, BentoGalleryItem, TeamMember } from '../types';
import { MarqueeLogoItem } from '../components/ui/marquee-logo-scroller';
import { InquiryItem, ActivityLogItem } from './api';
import { defaultBentoGalleryData } from '../data/gallery';
import { dlorenzExecutiveTeam as defaultTeamData } from '../data/team';
import { enterprisePartners as defaultPartners } from '../data/partners';

export const defaultSiteConfig: SiteConfig = {
  siteName: 'DLORENZ SOLUTIONS',
  tagline: 'Brand Ascension & Zero-Risk Real Estate Advisory',
  heroHeadline: 'We Engineer Dominance for Nigeria’s Boldest Brands',
  heroSubheadline:
    'From high-energy street activations and nationwide retail sampling to 100% verified real estate assets.',
  logoImage: '',
  aboutImage:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  aboutHeadline: 'Architecting Market Dominance',
  logoIconText: 'DL',
  logoType: 'both',
  primaryPhone: '+234 906 090 9034',
  secondaryPhone: '+234 816 866 1924',
  email: 'DLorenzSolutions@gmail.com',
  officeAddress: 'Federal Peace Estate, Lasu Igando Road, Lagos, Nigeria',
  consultationsActive: true,
  realEstateActive: true,
  emergencyHotline: true,
};

// ============================================================================
// SITE CONFIGURATION
// ============================================================================
export async function getFirebaseSiteConfig(): Promise<SiteConfig> {
  try {
    const docRef = doc(db, 'site_config', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteConfig;
    }
    // Initialize default if not exists
    await setDoc(docRef, defaultSiteConfig);
    return defaultSiteConfig;
  } catch (err) {
    console.error('Error fetching site config from Firebase:', err);
    return defaultSiteConfig;
  }
}

export async function saveFirebaseSiteConfig(config: SiteConfig): Promise<boolean> {
  try {
    const docRef = doc(db, 'site_config', 'main');
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Error saving site config to Firebase:', err);
    return false;
  }
}

// ============================================================================
// BENTO GALLERY & PORTFOLIO
// ============================================================================
export async function getFirebaseGallery(): Promise<BentoGalleryItem[]> {
  try {
    const coll = collection(db, 'bento_gallery');
    const q = query(coll, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as unknown as BentoGalleryItem[];
    }

    // Seed defaults if collection is empty
    for (let i = 0; i < defaultBentoGalleryData.length; i++) {
      const item = defaultBentoGalleryData[i];
      const strId = String(item.id || `item-${i + 1}`);
      const itemDoc = doc(db, 'bento_gallery', strId);
      await setDoc(itemDoc, {
        ...item,
        id: strId,
        order: i,
        updatedAt: new Date().toISOString(),
      });
    }
    return defaultBentoGalleryData;
  } catch (err) {
    console.error('Error loading gallery from Firebase:', err);
    return defaultBentoGalleryData;
  }
}

export async function saveFirebaseGallery(items: BentoGalleryItem[]): Promise<boolean> {
  try {
    // Update or create each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const docId = String(item.id || `item-${Date.now()}-${i}`);
      const docRef = doc(db, 'bento_gallery', docId);
      await setDoc(docRef, {
        ...item,
        id: docId,
        order: i,
        updatedAt: new Date().toISOString(),
      });
    }
    return true;
  } catch (err) {
    console.error('Error saving gallery to Firebase:', err);
    return false;
  }
}

// ============================================================================
// TEAM MEMBERS
// ============================================================================
export async function getFirebaseTeam(): Promise<TeamMember[]> {
  try {
    const coll = collection(db, 'team_members');
    const q = query(coll, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as unknown as TeamMember[];
    }

    // Seed default team members
    for (let i = 0; i < defaultTeamData.length; i++) {
      const mem = defaultTeamData[i];
      const strId = String(mem.id || `member-${i + 1}`);
      const memDoc = doc(db, 'team_members', strId);
      await setDoc(memDoc, {
        ...mem,
        id: strId,
        order: i,
      });
    }
    return defaultTeamData;
  } catch (err) {
    console.error('Error loading team from Firebase:', err);
    return defaultTeamData;
  }
}

export async function saveFirebaseTeam(team: TeamMember[]): Promise<boolean> {
  try {
    for (let i = 0; i < team.length; i++) {
      const mem = team[i];
      const docId = String(mem.id || `member-${Date.now()}-${i}`);
      const docRef = doc(db, 'team_members', docId);
      await setDoc(docRef, {
        ...mem,
        id: docId,
        order: i,
      });
    }
    return true;
  } catch (err) {
    console.error('Error saving team to Firebase:', err);
    return false;
  }
}

// ============================================================================
// PARTNERS & MARQUEE
// ============================================================================
export async function getFirebasePartners(): Promise<MarqueeLogoItem[]> {
  try {
    const coll = collection(db, 'partner_logos');
    const q = query(coll, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      return snap.docs.map((d) => ({
        ...d.data(),
      })) as unknown as MarqueeLogoItem[];
    }

    // Seed default partners
    for (let i = 0; i < defaultPartners.length; i++) {
      const p = defaultPartners[i];
      const strId = `partner-${i + 1}`;
      const pDoc = doc(db, 'partner_logos', strId);
      await setDoc(pDoc, {
        name: p.name,
        src: p.src || '',
        category: p.category || '',
        alt: p.alt || p.name,
        order: i,
      });
    }
    return defaultPartners;
  } catch (err) {
    console.error('Error loading partners from Firebase:', err);
    return defaultPartners;
  }
}

export async function saveFirebasePartners(partners: MarqueeLogoItem[]): Promise<boolean> {
  try {
    for (let i = 0; i < partners.length; i++) {
      const p = partners[i];
      const docId = `partner-${i + 1}`;
      const docRef = doc(db, 'partner_logos', docId);
      await setDoc(docRef, {
        name: p.name,
        src: p.src || '',
        category: p.category || '',
        alt: p.alt || p.name,
        order: i,
      });
    }
    return true;
  } catch (err) {
    console.error('Error saving partners to Firebase:', err);
    return false;
  }
}

// ============================================================================
// INQUIRIES & LEADS CRM
// ============================================================================
export async function submitFirebaseInquiry(inquiry: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  projectTypes?: string[];
  message: string;
  budget?: string;
  type?: 'consultation' | 'contact' | 'partnership';
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const coll = collection(db, 'inquiries');
    const docData = {
      ...inquiry,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(coll, docData);
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error('Error submitting inquiry to Firebase:', err);
    return { success: false, error: err.message || 'Failed to submit inquiry' };
  }
}

export async function getFirebaseInquiries(filterStatus?: string): Promise<InquiryItem[]> {
  try {
    const coll = collection(db, 'inquiries');
    let q = query(coll, orderBy('createdAt', 'desc'));

    if (filterStatus && filterStatus !== 'all') {
      q = query(coll, where('status', '==', filterStatus), orderBy('createdAt', 'desc'));
    }

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as unknown as InquiryItem[];
  } catch (err) {
    console.error('Error fetching inquiries from Firebase:', err);
    return [];
  }
}

export async function updateFirebaseInquiryStatus(
  id: string,
  status: 'new' | 'in_review' | 'resolved' | 'archived',
  notes?: string
): Promise<boolean> {
  try {
    const docRef = doc(db, 'inquiries', id);
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (notes !== undefined) updateData.notes = notes;
    await updateDoc(docRef, updateData);
    return true;
  } catch (err) {
    console.error('Error updating inquiry in Firebase:', err);
    return false;
  }
}

export async function deleteFirebaseInquiry(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'inquiries', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Error deleting inquiry from Firebase:', err);
    return false;
  }
}

// ============================================================================
// AUDIT LOGS
// ============================================================================
export async function logFirebaseActivity(
  action: string,
  entityType: string,
  entityId?: string,
  details?: string,
  actorEmail?: string,
  actorName?: string
): Promise<void> {
  try {
    const coll = collection(db, 'activity_logs');
    await addDoc(coll, {
      action,
      entityType,
      entityId: entityId || '',
      details: details || '',
      actorEmail: actorEmail || 'system',
      actorName: actorName || 'System Administrator',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Could not log activity in Firebase:', err);
  }
}

export async function getFirebaseActivityLogs(): Promise<ActivityLogItem[]> {
  try {
    const coll = collection(db, 'activity_logs');
    const q = query(coll, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as unknown as ActivityLogItem[];
  } catch (err) {
    console.error('Error fetching activity logs from Firebase:', err);
    return [];
  }
}
