import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SiteConfig, BentoGalleryItem } from '../types';
import InteractiveBentoGallery, { MediaItemType } from './ui/interactive-bento-gallery';
import { defaultBentoGalleryData, sanitizeBentoGalleryList } from '../data/gallery';
import { LiquidMetalButton } from './ui/liquid-metal-button';
import { BrandLogo } from './ui/brand-logo';

interface GalleryPageProps {
  onBackToHome: () => void;
  onOpenConsultation: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onBackToHome,
  onOpenConsultation,
}) => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      siteName: 'DLORENZ SOLUTIONS',
      tagline: 'Brand Ascension & Zero-Risk Real Estate Advisory',
      heroHeadline: 'We Engineer Dominance for Nigeria’s Boldest Brands',
      heroSubheadline:
        'From high-energy street activations and nationwide retail sampling to 100% verified real estate assets.',
      logoImage: '',
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
  });

  const [galleryHeader, setGalleryHeader] = useState<{ title: string; description: string }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_gallery_config');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      title: 'Interactive Field Portfolio',
      description:
        'Drag to reorganize items or click any card to inspect high-resolution video reels, field activations, and verified project documentation.',
    };
  });

  const [bentoItems, setBentoItems] = useState<MediaItemType[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_bento_gallery');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sanitizeBentoGalleryList(parsed) as MediaItemType[];
          }
        }
        // Fallback check for legacy projects key if bento gallery isn't set
        const legacy = localStorage.getItem('dlorenz_cms_projects');
        if (legacy) {
          const parsedLegacy = JSON.parse(legacy);
          if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
            return sanitizeBentoGalleryList(parsedLegacy) as MediaItemType[];
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return defaultBentoGalleryData as MediaItemType[];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedConfig = localStorage.getItem('dlorenz_cms_config');
        if (savedConfig) {
          setSiteConfig(JSON.parse(savedConfig));
        }

        const savedHeader = localStorage.getItem('dlorenz_cms_gallery_config');
        if (savedHeader) {
          setGalleryHeader(JSON.parse(savedHeader));
        }

        const savedBento = localStorage.getItem('dlorenz_cms_bento_gallery');
        if (savedBento) {
          const parsed = JSON.parse(savedBento);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBentoItems(sanitizeBentoGalleryList(parsed) as MediaItemType[]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dlorenz_cms_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dlorenz_cms_updated', handleStorageChange);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#111216] text-[#FFFFFF] font-sans selection:bg-[#4EFE32] selection:text-[#121212] flex flex-col justify-between">
      {/* Sticky Gallery Header */}
      <header className="sticky top-0 z-50 w-full bg-[#111216]/60 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] px-4 sm:px-8 lg:px-12 py-3.5 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <LiquidMetalButton
              size="sm"
              variant="outline"
              label="Back to Overview"
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
              onClick={onBackToHome}
            />
            <div className="hidden sm:flex items-center pl-3 border-l border-[#262933]">
              <BrandLogo
                siteConfig={siteConfig}
                size="sm"
                onClick={onBackToHome}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiquidMetalButton
              size="sm"
              variant="neon"
              label="Book Consultation"
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#4EFE32]" />}
              iconPosition="right"
              onClick={onOpenConsultation}
            />
          </div>
        </div>
      </header>

      {/* Main Interactive Bento Gallery */}
      <main className="flex-1 py-8 sm:py-12">
        <InteractiveBentoGallery
          mediaItems={bentoItems}
          title={galleryHeader.title}
          description={galleryHeader.description}
        />
      </main>

      {/* Gallery Bottom Trust Indicator */}
      <footer className="w-full border-t border-[#262933] bg-[#16181D]/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-condensed">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Zap className="w-3.5 h-3.5 text-[#4EFE32]" />
              <span>300% Average Activation Engagement</span>
            </span>
            <span className="hidden md:inline-block text-[#262933]">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>100% Verified Real Estate Due Diligence</span>
            </span>
          </div>

          <button
            onClick={onOpenConsultation}
            className="text-[#4EFE32] hover:underline cursor-pointer flex items-center gap-1 font-bold uppercase tracking-wider"
          >
            <span>Start a Campaign with Us</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </footer>
    </div>
  );
};
