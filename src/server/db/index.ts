import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { DbSchema, DbUser, DbInquiry, DbMediaAsset, DbActivityLog } from './types';
import { SiteConfig, TeamMember, BentoGalleryItem } from '../../types';
import { MarqueeLogoItem } from '../../components/ui/marquee-logo-scroller';
import { defaultBentoGalleryData } from '../../data/gallery';
import { dlorenzExecutiveTeam } from '../../data/team';
import { enterprisePartners } from '../../data/partners';

const DB_FILE_PATH = path.join(process.cwd(), 'data_storage', 'dlorenz_db.json');
const DB_DIR = path.dirname(DB_FILE_PATH);

// Default site configuration
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: 'DLORENZ SOLUTIONS',
  tagline: 'Brand Ascension & Zero-Risk Real Estate Advisory',
  heroHeadline: 'We Engineer Dominance for Nigeria’s Boldest Brands',
  heroSubheadline:
    'From high-energy street activations and nationwide retail sampling to 100% verified real estate assets.',
  logoImage: '',
  aboutImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
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

export const DEFAULT_GALLERY_CONFIG = {
  title: 'Interactive Field Portfolio',
  description:
    'Drag to reorganize items or click any card to inspect high-resolution video reels, field activations, and verified project documentation.',
};

class Database {
  private data: DbSchema | null = null;
  private isSaving = false;
  private pendingSave = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureDir() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private async generateDefaultAdmin(): Promise<DbUser> {
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@dlorenz.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'DLorenz@2026!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    return {
      id: 'usr_admin_default',
      email: adminEmail.toLowerCase().trim(),
      passwordHash,
      name: 'DLorenz Executive Admin',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public ensureInitialized(): void {
    if (this.data) return;

    this.ensureDir();

    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        this.data = JSON.parse(raw);
        console.log(`[Database] Loaded persistent data from ${DB_FILE_PATH}`);
        return;
      } catch (err) {
        console.error('[Database] Failed to read existing DB file. Re-initializing...', err);
      }
    }

    // Default Seed Inquiries
    const seedInquiries: DbInquiry[] = [
      {
        id: 'inq_seed_1',
        type: 'contact',
        name: 'Adeola Adeleke',
        company: 'Guaranty Trust FMCG Division',
        email: 'adeola@gtfmcg.ng',
        phone: '+234 802 345 6789',
        serviceInterest: 'Retail Sampling Campaign',
        projectTypes: ['Brand Promotion & Visibility', 'Field Marketing & Sampling'],
        message: 'Requesting a nationwide retail sampling deployment proposal for Q3 product launch across 45 locations.',
        budget: '₦10M - ₦25M',
        status: 'new',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'inq_seed_2',
        type: 'consultation',
        name: 'Chief Emeka Nwosu',
        company: 'Zenith Crest Holdings',
        email: 'enwosu@zenithcrest.com',
        phone: '+234 803 111 2233',
        serviceInterest: 'Real Estate Land Title Audit',
        projectTypes: ['Zero-Risk Real Estate Acquisition', 'Clean-Titled Land Verification'],
        message: 'Inquiring about 15-hectare commercial plot verification along Lekki-Epe corridor.',
        budget: '₦50M+',
        status: 'in_review',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
    ];

    // Synchronously create initial data structure (admin password hash generated on boot)
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'DLorenz@2026!';
    const passwordHash = bcrypt.hashSync(adminPassword, 10);

    const initialAdmin: DbUser = {
      id: 'usr_admin_default',
      email: (process.env.ADMIN_DEFAULT_EMAIL || 'admin@dlorenz.com').toLowerCase().trim(),
      passwordHash,
      name: 'DLorenz Executive Admin',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data = {
      users: [initialAdmin],
      siteConfig: { ...DEFAULT_SITE_CONFIG },
      galleryConfig: { ...DEFAULT_GALLERY_CONFIG },
      bentoGallery: [...defaultBentoGalleryData],
      team: [...dlorenzExecutiveTeam],
      partners: enterprisePartners.map((p, idx) => ({
        name: p.name,
        alt: p.alt || p.name,
        category: p.category,
        src: p.src,
        gradient: p.gradient,
        order: idx + 1,
      })),
      inquiries: seedInquiries,
      mediaAssets: [],
      activityLogs: [
        {
          id: 'log_init',
          action: 'DATABASE_INITIALIZED',
          entityType: 'system',
          details: 'DLorenz Solutions backend persistence layer initialized with seed catalogs.',
          createdAt: new Date().toISOString(),
        },
      ],
      systemSettings: {},
      version: 1,
      lastUpdated: new Date().toISOString(),
    };

    this.persistSync();
    console.log(`[Database] Initialized new persistent DB at ${DB_FILE_PATH}`);
  }

  private persistSync(): void {
    if (!this.data) return;
    this.ensureDir();
    this.data.lastUpdated = new Date().toISOString();
    const tempPath = `${DB_FILE_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_FILE_PATH);
  }

  public save(): void {
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }
    this.isSaving = true;
    try {
      this.persistSync();
    } catch (err) {
      console.error('[Database] Error persisting data:', err);
    } finally {
      this.isSaving = false;
      if (this.pendingSave) {
        this.pendingSave = false;
        this.save();
      }
    }
  }

  public getRaw(): DbSchema {
    this.ensureInitialized();
    return this.data!;
  }

  // ==========================================
  // USERS & AUTH
  // ==========================================
  public getUsers(): DbUser[] {
    return this.getRaw().users;
  }

  public getUserByEmail(email: string): DbUser | undefined {
    const norm = email.toLowerCase().trim();
    return this.getUsers().find((u) => u.email.toLowerCase() === norm);
  }

  public getUserById(id: string): DbUser | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public addUser(user: DbUser): void {
    this.getRaw().users.push(user);
    this.logActivity('USER_CREATED', 'auth', user.id, `Created user ${user.name} (${user.email})`);
    this.save();
  }

  public updateUser(id: string, updates: Partial<DbUser>): DbUser | null {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  public deleteUser(id: string): boolean {
    const raw = this.getRaw();
    const idx = raw.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    const deleted = raw.users.splice(idx, 1)[0];
    this.logActivity('USER_DELETED', 'auth', id, `Deleted user ${deleted.name} (${deleted.email})`);
    this.save();
    return true;
  }

  // ==========================================
  // SITE CONFIGURATION
  // ==========================================
  public getSiteConfig(): SiteConfig {
    return this.getRaw().siteConfig;
  }

  public updateSiteConfig(config: Partial<SiteConfig>, actor?: { email?: string; name?: string }): SiteConfig {
    const raw = this.getRaw();
    raw.siteConfig = { ...raw.siteConfig, ...config };
    this.logActivity('SITE_CONFIG_UPDATED', 'site_config', 'main', 'Updated global site parameters', actor?.email, actor?.name);
    this.save();
    return raw.siteConfig;
  }

  // ==========================================
  // GALLERY
  // ==========================================
  public getBentoGallery(): BentoGalleryItem[] {
    return this.getRaw().bentoGallery;
  }

  public getGalleryConfig() {
    return this.getRaw().galleryConfig;
  }

  public updateGalleryConfig(config: { title?: string; description?: string }) {
    const raw = this.getRaw();
    raw.galleryConfig = { ...raw.galleryConfig, ...config };
    this.save();
    return raw.galleryConfig;
  }

  public setBentoGallery(items: BentoGalleryItem[], actor?: { email?: string; name?: string }): BentoGalleryItem[] {
    const raw = this.getRaw();
    raw.bentoGallery = [...items];
    this.logActivity('GALLERY_UPDATED', 'gallery', undefined, `Updated bento gallery items (${items.length} total)`, actor?.email, actor?.name);
    this.save();
    return raw.bentoGallery;
  }

  public addGalleryItem(item: BentoGalleryItem): BentoGalleryItem {
    const raw = this.getRaw();
    raw.bentoGallery.push(item);
    this.logActivity('GALLERY_ITEM_ADDED', 'gallery', String(item.id), `Added gallery item "${item.title}"`);
    this.save();
    return item;
  }

  public updateGalleryItem(id: string | number, updates: Partial<BentoGalleryItem>): BentoGalleryItem | null {
    const raw = this.getRaw();
    const item = raw.bentoGallery.find((i) => String(i.id) === String(id));
    if (!item) return null;
    Object.assign(item, updates);
    this.logActivity('GALLERY_ITEM_UPDATED', 'gallery', String(id), `Updated gallery item "${item.title}"`);
    this.save();
    return item;
  }

  public deleteGalleryItem(id: string | number): boolean {
    const raw = this.getRaw();
    const idx = raw.bentoGallery.findIndex((i) => String(i.id) === String(id));
    if (idx === -1) return false;
    const deleted = raw.bentoGallery.splice(idx, 1)[0];
    this.logActivity('GALLERY_ITEM_DELETED', 'gallery', String(id), `Deleted gallery item "${deleted.title}"`);
    this.save();
    return true;
  }

  // ==========================================
  // TEAM MEMBERS
  // ==========================================
  public getTeam(): TeamMember[] {
    return this.getRaw().team;
  }

  public setTeam(team: TeamMember[], actor?: { email?: string; name?: string }): TeamMember[] {
    const raw = this.getRaw();
    raw.team = [...team];
    this.logActivity('TEAM_UPDATED', 'team', undefined, `Updated executive team roster (${team.length} members)`, actor?.email, actor?.name);
    this.save();
    return raw.team;
  }

  public addTeamMember(member: TeamMember): TeamMember {
    const raw = this.getRaw();
    raw.team.push(member);
    this.logActivity('TEAM_MEMBER_ADDED', 'team', member.id, `Added team member "${member.name}" - ${member.role}`);
    this.save();
    return member;
  }

  public updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
    const raw = this.getRaw();
    const member = raw.team.find((m) => m.id === id);
    if (!member) return null;
    Object.assign(member, updates);
    this.logActivity('TEAM_MEMBER_UPDATED', 'team', id, `Updated team member "${member.name}"`);
    this.save();
    return member;
  }

  public deleteTeamMember(id: string): boolean {
    const raw = this.getRaw();
    const idx = raw.team.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    const deleted = raw.team.splice(idx, 1)[0];
    this.logActivity('TEAM_MEMBER_DELETED', 'team', id, `Deleted team member "${deleted.name}"`);
    this.save();
    return true;
  }

  // ==========================================
  // PARTNERS
  // ==========================================
  public getPartners(): MarqueeLogoItem[] {
    return this.getRaw().partners;
  }

  public setPartners(partners: MarqueeLogoItem[], actor?: { email?: string; name?: string }): MarqueeLogoItem[] {
    const raw = this.getRaw();
    raw.partners = [...partners];
    this.logActivity('PARTNERS_UPDATED', 'partner', undefined, `Updated enterprise partner marquee (${partners.length} partners)`, actor?.email, actor?.name);
    this.save();
    return raw.partners;
  }

  public addPartner(partner: MarqueeLogoItem): MarqueeLogoItem {
    const raw = this.getRaw();
    raw.partners.push(partner);
    this.logActivity('PARTNER_ADDED', 'partner', partner.name, `Added enterprise partner "${partner.name}"`);
    this.save();
    return partner;
  }

  public deletePartner(name: string): boolean {
    const raw = this.getRaw();
    const idx = raw.partners.findIndex((p) => p.name.toLowerCase() === name.toLowerCase());
    if (idx === -1) return false;
    const deleted = raw.partners.splice(idx, 1)[0];
    this.logActivity('PARTNER_DELETED', 'partner', name, `Deleted partner "${deleted.name}"`);
    this.save();
    return true;
  }

  // ==========================================
  // INQUIRIES & LEADS
  // ==========================================
  public getInquiries(filter?: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): { inquiries: DbInquiry[]; total: number; page: number; totalPages: number } {
    let list = [...this.getRaw().inquiries];

    if (filter?.status && filter.status !== 'all') {
      list = list.filter((i) => i.status === filter.status);
    }
    if (filter?.type && filter.type !== 'all') {
      list = list.filter((i) => i.type === filter.type);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          (i.company && i.company.toLowerCase().includes(q)) ||
          i.message.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = list.length;
    const page = Math.max(1, filter?.page || 1);
    const limit = Math.min(100, Math.max(1, filter?.limit || 50));
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = list.slice((page - 1) * limit, page * limit);

    return { inquiries: paginated, total, page, totalPages };
  }

  public getInquiryById(id: string): DbInquiry | undefined {
    return this.getRaw().inquiries.find((i) => i.id === id);
  }

  public addInquiry(inquiry: Omit<DbInquiry, 'id' | 'createdAt' | 'updatedAt'>): DbInquiry {
    const raw = this.getRaw();
    const newInq: DbInquiry = {
      ...inquiry,
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    raw.inquiries.unshift(newInq);
    this.logActivity('INQUIRY_RECEIVED', 'inquiry', newInq.id, `Received new ${newInq.type} inquiry from ${newInq.name} (${newInq.email})`);
    this.save();
    return newInq;
  }

  public updateInquiryStatus(id: string, status: DbInquiry['status'], notes?: string): DbInquiry | null {
    const raw = this.getRaw();
    const inq = raw.inquiries.find((i) => i.id === id);
    if (!inq) return null;
    inq.status = status;
    if (notes !== undefined) inq.notes = notes;
    inq.updatedAt = new Date().toISOString();
    this.logActivity('INQUIRY_STATUS_UPDATED', 'inquiry', id, `Updated inquiry ${id} status to ${status}`);
    this.save();
    return inq;
  }

  public deleteInquiry(id: string): boolean {
    const raw = this.getRaw();
    const idx = raw.inquiries.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    const deleted = raw.inquiries.splice(idx, 1)[0];
    this.logActivity('INQUIRY_DELETED', 'inquiry', id, `Deleted inquiry from ${deleted.name}`);
    this.save();
    return true;
  }

  // ==========================================
  // MEDIA ASSETS (IMAGEKIT SYNC)
  // ==========================================
  public getMediaAssets(): DbMediaAsset[] {
    return this.getRaw().mediaAssets;
  }

  public addMediaAsset(asset: Omit<DbMediaAsset, 'id' | 'createdAt'>): DbMediaAsset {
    const raw = this.getRaw();
    const newAsset: DbMediaAsset = {
      ...asset,
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    raw.mediaAssets.unshift(newAsset);
    this.logActivity('MEDIA_UPLOADED', 'media', newAsset.fileId, `Uploaded media "${newAsset.name}" to ImageKit`);
    this.save();
    return newAsset;
  }

  public removeMediaAsset(fileId: string): boolean {
    const raw = this.getRaw();
    const idx = raw.mediaAssets.findIndex((m) => m.fileId === fileId);
    if (idx === -1) return false;
    const deleted = raw.mediaAssets.splice(idx, 1)[0];
    this.logActivity('MEDIA_DELETED', 'media', fileId, `Removed media "${deleted.name}" (${fileId})`);
    this.save();
    return true;
  }

  // ==========================================
  // ACTIVITY LOGS
  // ==========================================
  public logActivity(
    action: string,
    entityType: DbActivityLog['entityType'],
    entityId?: string,
    details: string = '',
    actorEmail?: string,
    actorName?: string
  ): void {
    const raw = this.getRaw();
    const log: DbActivityLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      action,
      entityType,
      entityId,
      details,
      actorEmail,
      actorName,
      createdAt: new Date().toISOString(),
    };
    raw.activityLogs.unshift(log);
    // Keep max 500 logs
    if (raw.activityLogs.length > 500) {
      raw.activityLogs = raw.activityLogs.slice(0, 500);
    }
  }

  public getActivityLogs(limit = 100): DbActivityLog[] {
    return this.getRaw().activityLogs.slice(0, limit);
  }
}

export const db = new Database();
