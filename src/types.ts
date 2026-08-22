export type ViewMode = 'split' | 'fullscreen' | 'standard';

export interface SiteConfig {
  siteName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  logoImage?: string;
  logoIconText?: string;
  logoType?: 'image' | 'text' | 'both';
  aboutImage?: string;
  aboutHeadline?: string;
  heroBackgroundImage?: string;
  primaryPhone: string;
  secondaryPhone: string;
  email: string;
  officeAddress: string;
  consultationsActive: boolean;
  realEstateActive: boolean;
  emergencyHotline: boolean;
  imageKitConfig?: {
    publicKey?: string;
    privateKey?: string;
    urlEndpoint?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortRole?: string;
  division?: string;
  bio?: string;
  image?: string;
  avatar?: string;
  expertise?: string[] | string;
  status?: string;
  badge?: string;
  credentials?: string[];
  directAdvisoryScope?: string;
}

export interface TalentCategory {
  id: string;
  title: string;
  tagline: string;
  count: string;
  skills: string[];
}

export interface HeroMetric {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface ConsultationForm {
  name: string;
  email: string;
  company: string;
  serviceInterest: string;
  message: string;
}

export interface BentoGalleryItem {
  id: string | number;
  type: 'image' | 'video';
  title: string;
  desc: string;
  url: string;
  span: string;
  tags?: string[];
  alt?: string;
}

export interface BentoGalleryConfig {
  title: string;
  description: string;
  items: BentoGalleryItem[];
}
