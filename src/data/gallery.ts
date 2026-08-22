import { BentoGalleryItem } from '../types';
export type { BentoGalleryItem };

export interface BentoSpanPreset {
  id: string;
  label: string;
  shortLabel: string;
  spanClass: string;
  description: string;
  gridFootprint: { cols: number; rows: number };
}

export const BENTO_SPAN_PRESETS: BentoSpanPreset[] = [
  {
    id: 'hero-2x2',
    label: 'Featured 2x2 Block (Large Square)',
    shortLabel: '2x2 Hero',
    spanClass: 'col-span-1 sm:col-span-2 md:col-span-2 sm:row-span-2 md:row-span-2',
    description: 'Great for high-energy videos or prominent flagship hero campaigns.',
    gridFootprint: { cols: 2, rows: 2 },
  },
  {
    id: 'tall-1x3',
    label: 'Tall 1x3 Pillar (Vertical Highlight)',
    shortLabel: '1x3 Tall',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-3',
    description: 'Ideal for vertical photography, mobile captures, and portrait assets.',
    gridFootprint: { cols: 1, rows: 3 },
  },
  {
    id: 'compact-1x2',
    label: 'Compact 1x2 Tile (Standard)',
    shortLabel: '1x2 Tile',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-2',
    description: 'Balanced tile for sampling booths, packaging, and secondary showcases.',
    gridFootprint: { cols: 1, rows: 2 },
  },
  {
    id: 'wide-2x1',
    label: 'Wide 2x1 Banner (Horizontal)',
    shortLabel: '2x1 Banner',
    spanClass: 'col-span-1 sm:col-span-2 md:col-span-2 sm:row-span-1 md:row-span-1',
    description: 'Cinematic landscape panorama or wide banner format.',
    gridFootprint: { cols: 2, rows: 1 },
  },
  {
    id: 'hero-tall-2x3',
    label: 'Grand 2x3 Monumental Block',
    shortLabel: '2x3 Grand',
    spanClass: 'col-span-1 sm:col-span-2 md:col-span-2 sm:row-span-3 md:row-span-3',
    description: 'Maximum prominence on desktop displays.',
    gridFootprint: { cols: 2, rows: 3 },
  },
];

export const defaultBentoGalleryData: BentoGalleryItem[] = [
  {
    id: 1,
    type: 'video',
    title: 'Nationwide Street Activation & DJ Truck Tour',
    desc: 'High-energy mobile DJ trucks, crowd engagements, and live giveaways across major commercial intersections.',
    url: 'https://cdn.pixabay.com/video/2024/07/24/222837_large.mp4',
    span: 'col-span-1 sm:col-span-2 md:col-span-2 sm:row-span-2 md:row-span-2',
    tags: ['Street Tour', 'DJ Activation', 'Experiential Marketing'],
  },
  {
    id: 2,
    type: 'image',
    title: 'Supermarket & FMCG Sampling Campaign',
    desc: 'Trained brand ambassadors deploying branded tasting booths across 45+ premier retail outlets.',
    url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-3',
    tags: ['Retail Sampling', 'Supermarket Booths', 'FMCG'],
  },
  {
    id: 3,
    type: 'image',
    title: 'Nightclub & VIP Lounge Tasting',
    desc: 'Custom illuminated VIP tasting lounges and bespoke mixology experiences for premium beverage brands.',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-2',
    tags: ['Nightlife Activation', 'VIP Lounge', 'Beverage'],
  },
  {
    id: 4,
    type: 'video',
    title: 'Commercial Land & Asset Drone Survey',
    desc: 'High-definition aerial boundary verification, topography mapping, and zero-risk title documentation.',
    url: 'https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4',
    span: 'col-span-1 sm:col-span-2 md:col-span-2 sm:row-span-2 md:row-span-2',
    tags: ['Real Estate', 'Drone Survey', 'Due Diligence'],
  },
  {
    id: 5,
    type: 'image',
    title: 'Studio Bottle & Commercial Photography',
    desc: '4K commercial product photography, reflective lighting setups, and e-commerce packaging assets.',
    url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-3',
    tags: ['Commercial Studio', '4K Photography', 'Retouching'],
  },
  {
    id: 6,
    type: 'image',
    title: 'Retail Packaging & POS Display Architecture',
    desc: 'Structural packaging engineering, corrugated display stands, and high-impact supermarket shelf banners.',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    span: 'col-span-1 sm:col-span-1 md:col-span-1 sm:row-span-2 md:row-span-2',
    tags: ['Packaging Design', 'POS Displays', 'Retail Structural'],
  },
  {
    id: 7,
    type: 'video',
    title: 'Experiential Brand Roadshow Execution',
    desc: 'Multi-city roadshow campaigns reaching over 25,000 verified consumer touchpoints in 30 days.',
    url: 'https://cdn.pixabay.com/video/2020/07/30/46026-447087782_large.mp4',
    span: 'col-span-1 sm:col-span-2 md:col-span-2 sm:row-span-2 md:row-span-2',
    tags: ['Roadshow', 'Live Engagement', 'Brand Ascension'],
  },
];

/**
 * Sanitizes and validates a list of bento gallery items.
 * Migrates legacy data if necessary and ensures fallback values.
 */
export function sanitizeBentoGalleryList(raw: any[]): BentoGalleryItem[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return defaultBentoGalleryData;
  }

  return raw.map((item, idx) => {
    // Migration fallback for legacy JobItem format
    const url = item.url || item.imageSrc || defaultBentoGalleryData[idx % defaultBentoGalleryData.length].url;
    const isVideo =
      item.type === 'video' ||
      (typeof url === 'string' && (url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('/video/')));

    return {
      id: item.id || `bento-${idx + 1}-${Date.now()}`,
      type: isVideo ? 'video' : 'image',
      title: item.title || `Project Showcase ${idx + 1}`,
      desc: item.desc || item.description || 'Verified experiential campaign execution by DLORENZ.',
      url: url || defaultBentoGalleryData[0].url,
      span: item.span || BENTO_SPAN_PRESETS[idx % BENTO_SPAN_PRESETS.length].spanClass,
      tags: Array.isArray(item.tags) ? item.tags : ['Campaign', 'DLORENZ'],
      alt: item.alt || item.title || 'DLORENZ Gallery Artifact',
    };
  });
}
