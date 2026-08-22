import React from 'react';
import { ViewMode } from '../types';
import { Sparkles, Maximize2, Columns, PhoneCall, Download } from 'lucide-react';
import { LiquidMetalButton } from './ui/liquid-metal-button';

interface HeaderProps {
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  onOpenConsultation: () => void;
  onDownloadProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onToggleViewMode,
  onOpenConsultation,
  onDownloadProfile,
}) => {
  return (
    <header
      id="main-header"
      className="fixed top-0 left-0 right-0 z-40 w-full px-4 sm:px-6 lg:px-12 py-3 sm:py-4 transition-all duration-300 bg-transparent"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div id="brand-identity-container" className="flex items-center gap-3 sm:gap-4">
          <div
            id="brand-logo-mark"
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900/60 shadow-md group"
          >
            {/* Architectural Monolith Icon */}
            <div className="w-6 h-6 border border-neutral-300/80 rounded-sm flex items-center justify-center rotate-45 transition-transform duration-500 group-hover:rotate-90">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-100 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                id="brand-title"
                className="text-base sm:text-lg font-bold tracking-[0.2em] text-neutral-100"
              >
                DLORENZ
              </span>
              <span className="text-base sm:text-lg font-light tracking-[0.2em] text-neutral-400">
                SOLUTIONS
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available Q3/Q4
              </span>
            </div>
            <span
              id="brand-tagline"
              className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-neutral-400 uppercase"
            >
              Building Dreams, Selling Success
            </span>
          </div>
        </div>

        {/* Right Navigation & Controls */}
        <div id="header-actions-group" className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Switcher */}
          <button
            id="toggle-layout-btn"
            onClick={onToggleViewMode}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 transition-colors cursor-pointer"
            title={viewMode === 'immersive' ? 'Switch to Split Layout' : 'Switch to Full-Bleed Layout'}
            aria-label="Toggle Hero View Mode"
          >
            {viewMode === 'immersive' ? (
              <>
                <Columns className="w-3.5 h-3.5 text-neutral-400" />
                <span>Split View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
                <span>Full-Bleed</span>
              </>
            )}
          </button>

          {/* Download Profile Button */}
          <button
            id="header-download-btn"
            onClick={onDownloadProfile}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/70 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Profile PDF</span>
          </button>

          {/* Consultation CTA with Liquid Metal Shader */}
          <LiquidMetalButton
            id="header-cta-btn"
            size="sm"
            variant="neon"
            label="Get in Touch"
            icon={<PhoneCall className="w-3.5 h-3.5 text-[#4EFE32]" />}
            onClick={onOpenConsultation}
          />
        </div>
      </div>
    </header>
  );
};
