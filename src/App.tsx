/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MarqueeLogoScroller, MarqueeLogoItem } from './components/ui/marquee-logo-scroller';
import AboutUsSection from './components/ui/about-us-section';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ui/contact';
import { Footer } from './components/Footer';
import { GalleryPage } from './components/GalleryPage';
import { AdminCMS } from './components/AdminCMS';
import { enterprisePartners, sanitizePartnersList } from './data/partners';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'gallery' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || search.includes('admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'home';
  });

  const [partners, setPartners] = useState<MarqueeLogoItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_partners');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return sanitizePartnersList(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    return enterprisePartners;
  });

  useEffect(() => {
    const handleCmsUpdate = () => {
      try {
        const saved = localStorage.getItem('dlorenz_cms_partners');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPartners(sanitizePartnersList(parsed));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('dlorenz_cms_updated', handleCmsUpdate);
    window.addEventListener('storage', handleCmsUpdate);
    return () => {
      window.removeEventListener('dlorenz_cms_updated', handleCmsUpdate);
      window.removeEventListener('storage', handleCmsUpdate);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret Admin shortcut: Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setCurrentView((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };

    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('/admin')) {
        setCurrentView('admin');
      } else if (currentView === 'admin') {
        setCurrentView('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentView]);

  const handleScrollToContact = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const contactSection = document.getElementById('dlorenz-contact-section');
        contactSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const contactSection = document.getElementById('dlorenz-contact-section');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToLeadership = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const leadershipSection = document.getElementById('dlorenz-leadership-section');
        leadershipSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const leadershipSection = document.getElementById('dlorenz-leadership-section');
      leadershipSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentView === 'admin') {
    return (
      <AdminCMS
        onExit={() => {
          setCurrentView('home');
          window.history.pushState({}, '', '/');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (currentView === 'gallery') {
    return (
      <div className="relative min-h-[100dvh] w-full bg-[#111216] text-[#FFFFFF] font-sans selection:bg-[#4EFE32] selection:text-[#121212] overflow-x-clip">
        <GalleryPage
          onBackToHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenConsultation={handleScrollToContact}
        />
        <MarqueeLogoScroller
          title="Trusted by Industry Titans"
          description="Martell | MTN | Honeywell | Livespot | Wazobia | Nile University | Coca-Cola | B2O | Nestlé | Chowdeck"
          logos={partners}
          speed="normal"
        />
        <Footer
          onOpenTeamModal={handleScrollToLeadership}
          onOpenGallery={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div
      id="dlorenz-growth-app"
      className="relative min-h-[100dvh] w-full bg-[#111216] text-[#FFFFFF] font-sans selection:bg-[#4EFE32] selection:text-[#121212] overflow-x-clip"
    >
      {/* Primary Hero Section based on reference design */}
      <HeroSection
        onMeetTeam={handleScrollToContact}
        onOpenGallery={() => {
          setCurrentView('gallery');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Infinite Scrolling Enterprise Partners Marquee */}
      <MarqueeLogoScroller
        title="Trusted by Industry Titans"
        description="Martell | MTN | Honeywell | Livespot | Wazobia | Nile University | Coca-Cola | B2O | Nestlé | Chowdeck"
        logos={partners}
        speed="normal"
      />

      {/* Adapted High-Impact About Us & Strategic Pillars Section */}
      <AboutUsSection
        onOpenConsultation={handleScrollToContact}
        onExplorePortfolio={() => {
          setCurrentView('gallery');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* DLorenz Executive Leadership Team Showcase */}
      <TeamSection
        onOpenConsultation={handleScrollToContact}
      />

      {/* Contact & Consultation Section with specified background image */}
      <ContactSection />

      {/* Tailored DLorenz Solutions Footer */}
      <Footer
        onOpenTeamModal={handleScrollToLeadership}
        onOpenGallery={() => {
          setCurrentView('gallery');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
