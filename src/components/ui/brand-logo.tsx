import React from 'react';
import { SiteConfig } from '../../types';

export interface BrandLogoProps {
  siteConfig?: Partial<SiteConfig>;
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  siteConfig,
  size = 'default',
  showText = false,
  className = '',
  onClick,
}) => {
  const rawSiteName = siteConfig?.siteName || 'DLORENZ';
  const logoImage = siteConfig?.logoImage;

  // Doubled emblem dimensions for high prominence, distinct visibility, and ultra-legibility:
  // sm: 64px - 80px (doubled from 32-40px)
  // default (Navbar & Headers): 100px - 144px (w-24 h-24 to w-32 h-32 / w-36 h-36)
  // lg: 128px - 192px (w-32 h-32 to w-48 h-48)
  const emblemSizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    default: 'w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-36 md:h-36',
    lg: 'w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48',
  }[size];

  const content = (
    <div
      className={`inline-flex items-center group select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* ========================================================================= */}
      {/* PURE DOUBLED-SCALE LOGO (No Box, No Pill, Clean Transparent Ambient)      */}
      {/* ========================================================================= */}
      <div
        className={`relative shrink-0 ${emblemSizeClasses} flex items-center justify-center filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] drop-shadow-[0_0_24px_rgba(78,254,50,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_36px_rgba(78,254,50,0.7)]`}
      >
        {logoImage ? (
          <img
            src={logoImage}
            alt={rawSiteName}
            className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full filter drop-shadow-[0_8px_28px_rgba(0,0,0,0.95)]"
          >
            <defs>
              <linearGradient id="brandEmeraldGradDoubled" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4EFE32" />
                <stop offset="50%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#0082FB" />
              </linearGradient>
              <linearGradient id="brandSilverGradDoubled" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>
              <radialGradient id="brandCoreAmbient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4EFE32" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <filter id="emeraldGlowDoubled" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Radial Energy Glow */}
            <circle cx="50" cy="50" r="46" fill="url(#brandCoreAmbient)" />

            {/* Outer Architectural Precision Orbit Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#brandEmeraldGradDoubled)"
              strokeWidth="3"
              strokeDasharray="6 3"
              className="opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Dynamic Geometric Accent Orbit Nodes */}
            <circle cx="50" cy="5" r="3.5" fill="#4EFE32" filter="url(#emeraldGlowDoubled)" />
            <circle cx="50" cy="95" r="3.5" fill="#00E5FF" />
            <circle cx="5" cy="50" r="3.5" fill="#4EFE32" filter="url(#emeraldGlowDoubled)" />
            <circle cx="95" cy="50" r="3.5" fill="#00E5FF" />

            {/* Intermediate Diagonal Orbit Markers */}
            <circle cx="18" cy="18" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="82" cy="18" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="18" cy="82" r="2" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="82" cy="82" r="2" fill="#FFFFFF" fillOpacity="0.8" />

            {/* Primary Diamond Monolith Structure */}
            <rect
              x="22"
              y="22"
              width="56"
              height="56"
              rx="12"
              transform="rotate(45 50 50)"
              stroke="url(#brandSilverGradDoubled)"
              strokeWidth="4"
              fill="#16181D"
              fillOpacity="0.9"
            />

            {/* Inner High-Energy Neon Diamond */}
            <rect
              x="32"
              y="32"
              width="36"
              height="36"
              rx="8"
              transform="rotate(45 50 50)"
              stroke="url(#brandEmeraldGradDoubled)"
              strokeWidth="3"
              fill="#111216"
              fillOpacity="0.75"
              className="transition-all duration-300 group-hover:stroke-width-[3.5]"
            />

            {/* Precision Center Focus Aperture */}
            <circle
              cx="50"
              cy="50"
              r="11"
              fill="#0E1014"
              stroke="url(#brandSilverGradDoubled)"
              strokeWidth="2.5"
            />
            <circle
              cx="50"
              cy="50"
              r="5.5"
              fill="#4EFE32"
              filter="url(#emeraldGlowDoubled)"
            />

            {/* Precision Optical Ray Alignment Lines */}
            <line x1="50" y1="14" x2="50" y2="28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="72" x2="50" y2="86" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="14" y1="50" x2="28" y2="50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="50" x2="86" y2="50" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {/* Optional Brand Text (Only if explicitly enabled) */}
      {showText && (
        <div className="flex items-center gap-2 ml-3">
          <span className="text-xl sm:text-2xl font-black tracking-[0.16em] text-white uppercase font-condensed group-hover:text-[#4EFE32] transition-colors leading-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {rawSiteName}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#4EFE32] shadow-[0_0_8px_#4EFE32]" />
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4EFE32] rounded-full p-1 -m-1 transition-all"
        aria-label={`${rawSiteName} - Brand Logo`}
      >
        {content}
      </button>
    );
  }

  return content;
};
