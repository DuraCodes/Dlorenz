import React from 'react';
import { MarqueeLogoItem } from '../components/ui/marquee-logo-scroller';

export const enterprisePartners: MarqueeLogoItem[] = [
  {
    name: 'Martell',
    alt: 'Martell Cognac',
    category: 'Maison Fondée en 1715',
    src: '/assets/logos/martell.svg',
    gradient: { from: '#1e3a8a', via: '#d97706', to: '#78350f' },
    svgIcon: (
      <div className="flex flex-col items-center justify-center select-none">
        {/* Official Martell Swift Bird Icon & Typography */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <svg className="w-5 h-5 text-[#d4af37]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <span className="text-xl font-serif font-bold text-[#FFFFFF] group-hover:text-[#d4af37] tracking-[0.22em] uppercase transition-colors">
          MARTELL
        </span>
        <span className="text-[9px] text-[#A0A6B2] tracking-[0.3em] uppercase font-sans mt-0.5">
          COGNAC 1715
        </span>
      </div>
    ),
  },
  {
    name: 'MTN Group',
    alt: 'MTN',
    category: 'Telecommunications & Mobile Money',
    src: '/assets/logos/mtn.svg',
    gradient: { from: '#facc15', via: '#eab308', to: '#ca8a04' },
    svgIcon: (
      <div className="flex items-center justify-center select-none">
        {/* Official MTN Oval Badge */}
        <div className="w-24 h-12 rounded-full border-2 border-[#ffcc00] bg-[#ffcc00] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <span className="text-black font-black text-lg tracking-tighter italic font-sans">
            MTN
          </span>
        </div>
      </div>
    ),
  },
  {
    name: 'Coca-Cola',
    alt: 'Coca-Cola',
    category: 'Global Beverage Leader',
    src: '/assets/logos/cocacola.svg',
    gradient: { from: '#ef4444', via: '#dc2626', to: '#991b1b' },
    svgIcon: (
      <div className="flex items-center justify-center select-none">
        <img
          src="/assets/logos/cocacola.svg"
          alt="Coca-Cola"
          className="h-9 w-auto object-contain filter group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] transition-all"
        />
      </div>
    ),
  },
  {
    name: 'Honeywell Group',
    alt: 'Honeywell Group',
    category: 'Industrial Tech & Investments',
    src: '/assets/logos/honeywell.svg',
    gradient: { from: '#ef4444', via: '#b91c1c', to: '#7f1d1d' },
    svgIcon: (
      <div className="flex flex-col items-center justify-center select-none">
        <span className="text-xl font-black text-[#e53935] tracking-wider uppercase font-sans">
          Honeywell
        </span>
        <span className="text-[10px] text-[#A0A6B2] tracking-[0.25em] uppercase font-mono mt-0.5">
          GROUP
        </span>
      </div>
    ),
  },
  {
    name: 'Livespot360',
    alt: 'Livespot360',
    category: 'Creative Production & Entertainment',
    src: '/assets/logos/livespot.png',
    gradient: { from: '#a855f7', via: '#9333ea', to: '#581c87' },
    svgIcon: (
      <div className="flex items-center justify-center select-none">
        {/* Authentic Livespot360 Vector Wordmark */}
        <span className="text-xl font-black text-[#FFFFFF] tracking-tight uppercase font-sans">
          LIVESPOT<span className="text-[#a855f7] drop-shadow-[0_0_8px_#a855f7]">360</span>
        </span>
      </div>
    ),
  },
  {
    name: 'Chowdeck',
    alt: 'Chowdeck',
    category: 'On-Demand Food Logistics',
    src: '/assets/logos/chowdeck.png',
    gradient: { from: '#10b981', via: '#059669', to: '#047857' },
    svgIcon: (
      <div className="flex items-center gap-2.5 justify-center select-none">
        {/* Official Chowdeck App Mark & Clean Wordmark */}
        <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center shadow-sm">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
        </div>
        <span className="text-xl font-black text-[#FFFFFF] group-hover:text-[#10b981] tracking-tight font-sans transition-colors lowercase">
          chowdeck
        </span>
      </div>
    ),
  },
  {
    name: 'Nestlé',
    alt: 'Nestle',
    category: 'Nutrition, Health & Wellness',
    src: '/assets/logos/nestle.svg',
    gradient: { from: '#3b82f6', via: '#1d4ed8', to: '#1e3a8a' },
    svgIcon: (
      <div className="flex items-center justify-center select-none">
        <img
          src="/assets/logos/nestle.svg"
          alt="Nestlé"
          className="h-8 w-auto object-contain filter brightness-150 group-hover:brightness-200 transition-all"
        />
      </div>
    ),
  },
  {
    name: 'Nile University',
    alt: 'Nile University of Nigeria',
    category: 'Higher Education & Research',
    src: '/assets/logos/nile_university.png',
    gradient: { from: '#0284c7', via: '#0369a1', to: '#075985' },
    svgIcon: (
      <div className="flex items-center gap-2 justify-center select-none">
        {/* Official Nile University Shield Mark */}
        <div className="w-8 h-8 rounded-lg bg-[#0369a1] border border-[#38bdf8]/40 flex items-center justify-center text-white font-bold text-xs">
          <svg className="w-5 h-5 text-[#facc15]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-black text-[#FFFFFF] uppercase tracking-wider font-sans leading-none">
            NILE UNIVERSITY
          </span>
          <span className="text-[8px] text-[#38bdf8] tracking-[0.2em] uppercase font-mono mt-0.5">
            OF NIGERIA
          </span>
        </div>
      </div>
    ),
  },
  {
    name: 'Wazobia',
    alt: 'Wazobia FM - The Correct Scent',
    category: 'Broadcast & Media Network',
    src: '/assets/logos/wazobia.png',
    gradient: { from: '#f59e0b', via: '#d97706', to: '#b45309' },
    svgIcon: (
      <div className="flex flex-col items-center justify-center select-none text-center">
        <div className="flex items-center gap-1">
          <span className="text-xl font-black text-[#f59e0b] tracking-wider uppercase font-sans">
            WAZOBIA
          </span>
          <span className="text-xs font-black text-[#4EFE32] bg-[#1A1C22] px-1 py-0.5 rounded border border-[#4EFE32]/40 font-mono">
            FM
          </span>
        </div>
        <span className="text-[10px] text-[#4EFE32] font-semibold tracking-wider font-condensed uppercase mt-0.5">
          The Correct Scent
        </span>
      </div>
    ),
  },
];

export function sanitizePartnersList(savedList: any[]): MarqueeLogoItem[] {
  if (!Array.isArray(savedList) || savedList.length === 0) {
    return enterprisePartners;
  }

  return savedList.map((item, index) => {
    // Find matching default partner for original svgIcon if available
    const defaultPartner = enterprisePartners.find(
      (p) => p.name.toLowerCase() === (item.name || '').toLowerCase() || p.alt.toLowerCase() === (item.alt || '').toLowerCase()
    );

    const svgIcon = React.isValidElement(item.svgIcon)
      ? item.svgIcon
      : defaultPartner?.svgIcon;

    return {
      name: item.name || `Partner ${index + 1}`,
      alt: item.alt || item.name || `Partner ${index + 1}`,
      category: item.category || 'Enterprise Client',
      src: item.src || defaultPartner?.src || '',
      gradient: {
        from: item.gradient?.from || defaultPartner?.gradient.from || '#1e3a8a',
        via: item.gradient?.via || defaultPartner?.gradient.via || '#00C2CB',
        to: item.gradient?.to || defaultPartner?.gradient.to || '#4EFE32',
      },
      svgIcon,
    };
  });
}
