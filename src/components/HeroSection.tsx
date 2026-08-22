import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Phone,
  Mail,
  Home,
  Briefcase,
  Users,
  Info,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { SiteConfig } from '../types';
import { RevealWords, ScrollRevealText } from './ui/animated-typography';
import { LiquidMetalButton } from './ui/liquid-metal-button';
import { BrandLogo } from './ui/brand-logo';

interface HeroSectionProps {
  onMeetTeam?: () => void;
  onOpenGallery?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onMeetTeam, onOpenGallery }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Dynamic Site Config for Logo & Brand name
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
      heroSubheadline: 'From high-energy street activations and nationwide retail sampling to 100% verified real estate assets.',
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

  useEffect(() => {
    const handleConfigUpdate = () => {
      try {
        const saved = localStorage.getItem('dlorenz_cms_config');
        if (saved) setSiteConfig(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('dlorenz_cms_updated', handleConfigUpdate);
    window.addEventListener('storage', handleConfigUpdate);
    return () => {
      window.removeEventListener('dlorenz_cms_updated', handleConfigUpdate);
      window.removeEventListener('storage', handleConfigUpdate);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      video.play().catch(() => {
        setIsPlaying(false);
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Close mobile menu on Esc key or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Track scroll position for sticky navbar background styling
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const shouldReduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  // Parallax scroll on hero typography
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const textParallaxY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 80]);
  const textParallaxOpacity = useTransform(scrollYProgress, [0, 0.7], [1, shouldReduceMotion ? 1 : 0.2]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 24, opacity: 0, filter: shouldReduceMotion ? 'none' : 'blur(4px)' },
    visible: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative w-full min-h-[100dvh] bg-[#111216] overflow-hidden flex flex-col justify-between"
    >
      {/* ========================================================================= */}
      {/* FULL-SCREEN BACKGROUND VIDEO LAYER                                        */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Full Screen Architectural Cinematic Background Video */}
        <div id="fullscreen-video-container" className="absolute inset-0 w-full h-full pointer-events-auto">
          <video
            ref={videoRef}
            id="hero-cinematic-video"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/assets/ultra_cinematic_poster.jpg"
            aria-label="DLORENZ Ultra Cinematic Low Angle Architecture Reel"
          >
            {/* High-speed CDN asset */}
            <source
              src="https://ik.imagekit.io/dura/Ultra_cinematic_low_angle_arch%20(1).mp4"
              type="video/mp4"
            />
          </video>

          {/* Instant High-Resolution Fallback Poster */}
          {!isVideoLoaded && (
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
              alt="Ultra cinematic low angle architecture poster"
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Ambient Cinematic Deep Charcoal & Shadow Overlays tuned for increased video visibility */}
          <div className="absolute inset-0 bg-[#111216]/30 backdrop-brightness-[0.95]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-[#111216]/55" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#111216]/20 to-[#111216]/65" />
        </div>
      </div>

      {/* Floating ambient particle glows matching About Us language */}
      <motion.div
        className="absolute top-1/4 left-1/6 w-2.5 h-2.5 rounded-full bg-[#4EFE32]/40 pointer-events-none z-10"
        animate={{
          y: [0, -18, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/5 w-3 h-3 rounded-full bg-[#00C2CB]/40 pointer-events-none z-10"
        animate={{
          y: [0, 22, 0],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* ========================================================================= */}
      {/* TOP BRAND NAVIGATION (FIXED STICKY HEADER)                                */}
      {/* ========================================================================= */}
      <motion.nav
        id="hero-navigation-bar"
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#111216]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-2.5 sm:py-3'
            : 'bg-transparent py-3.5 sm:pt-5 sm:pb-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          {/* Clickable Brand Logo - Standalone enlarged emblem mark */}
          <div id="hero-brand-logo-container" className="flex items-center">
            <BrandLogo
              siteConfig={siteConfig}
              size="default"
              onClick={scrollToHero}
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-xs uppercase font-bold tracking-wider text-[#A0A6B2] font-condensed">
            <button
              type="button"
              onClick={() => scrollToSection('about-us-section')}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4EFE32] hover:after:w-full after:transition-all after:duration-300"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('dlorenz-leadership-section')}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4EFE32] hover:after:w-full after:transition-all after:duration-300"
            >
              Leadership
            </button>
            {onOpenGallery && (
              <button
                type="button"
                onClick={() => {
                  onOpenGallery();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-[#4EFE32] hover:text-[#43e629] flex items-center gap-1.5 cursor-pointer uppercase transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4EFE32] hover:after:w-full after:transition-all after:duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EFE32] shadow-[0_0_6px_#4EFE32]" />
                <span>Job Gallery</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => scrollToSection('dlorenz-contact-section')}
              className="hover:text-[#FFFFFF] transition-colors cursor-pointer relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#4EFE32] hover:after:w-full after:transition-all after:duration-300"
            >
              Contact
            </button>
          </div>

          {/* Right Controls: Video Playback HUD & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            {/* Video Playback HUD Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-[#1A1C22]/50 border border-white/10 backdrop-blur-xl text-xs text-[#A0A6B2] shadow-sm">
              <button
                id="hero-play-pause-toggle"
                type="button"
                onClick={togglePlay}
                className="p-1 rounded-full hover:text-[#FFFFFF] transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center active:scale-90"
                title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
                aria-label={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#4EFE32]" />}
              </button>
              <button
                id="hero-mute-toggle"
                type="button"
                onClick={toggleMute}
                className="p-1 rounded-full hover:text-[#FFFFFF] transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center active:scale-90"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00C2CB]" />}
              </button>
            </div>

            {/* Mobile Navigation Toggle Button (Touch Target >= 44px) */}
            <button
              type="button"
              id="mobile-nav-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-[#1A1C22]/50 border border-white/10 text-[#FFFFFF] hover:border-[#4EFE32] hover:text-[#4EFE32] transition-colors shadow-md backdrop-blur-xl cursor-pointer active:scale-95"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#4EFE32]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ========================================================================= */}
      {/* MOBILE DROPDOWN NAVIGATION DRAWER & BACKDROP                              */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <>
          {/* Subtle backdrop overlay - click outside to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden fixed inset-x-4 top-20 z-50 p-3.5 rounded-2xl bg-[#16181D]/80 border border-white/10 shadow-2xl backdrop-blur-2xl space-y-3 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain"
          >
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1">
              {/* Home */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToHero();
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium text-neutral-200 hover:text-white hover:bg-[#1A1C22] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-neutral-400" />
                  <span>Home</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>

              {/* About Us Container with Grouped Sub-item */}
              <div className="rounded-xl bg-[#1A1C22]/40 border border-[#262933]/60 p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToSection('about-us-section');
                  }}
                  className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left text-sm font-medium text-neutral-200 hover:text-white hover:bg-[#1A1C22] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4 text-neutral-400" />
                    <span>About Us</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>

                {/* Grouped Secondary Sub-Link: Executive Leadership */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onMeetTeam) {
                      onMeetTeam();
                    } else {
                      scrollToSection('dlorenz-leadership-section');
                    }
                  }}
                  className="flex items-center justify-between w-full pl-9 pr-2.5 py-1.5 rounded-lg text-left text-xs text-neutral-400 hover:text-white hover:bg-[#1A1C22] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Executive Leadership</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
                </button>
              </div>

              {/* Our Work / Portfolio */}
              {onOpenGallery && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenGallery();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium text-neutral-200 hover:text-white hover:bg-[#1A1C22] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-neutral-400" />
                    <span>Our Work</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              )}

              {/* Contact */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection('dlorenz-contact-section');
                }}
                className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left text-sm font-medium text-neutral-200 hover:text-white hover:bg-[#1A1C22] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>Contact</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </nav>

            {/* Consolidated CTA Footer */}
            <div className="pt-3 border-t border-[#262933] space-y-2.5">
              <LiquidMetalButton
                fullWidth
                size="lg"
                variant="neon"
                label="Schedule a Consultation"
                icon={<Calendar className="w-4 h-4 text-[#4EFE32]" />}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scrollToSection('dlorenz-contact-section');
                }}
              />

              {/* Secondary Direct Contact Info */}
              <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
                <a
                  href="tel:+2349060909034"
                  className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors py-1"
                >
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  <span>+234 906 090 9034</span>
                </a>
                <a
                  href={`mailto:${siteConfig.email || 'DLorenzSolutions@gmail.com'}`}
                  className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors py-1 truncate max-w-[160px]"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span className="truncate">{siteConfig.email || 'DLorenzSolutions@gmail.com'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* ========================================================================= */}
      {/* CENTER DOMINANT HERO HEADLINE & PILL CTA                                  */}
      {/* ========================================================================= */}
      <motion.div
        id="hero-center-content"
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 my-auto pt-20 sm:pt-24 md:pt-28 pb-4 sm:pb-6 lg:pb-8 flex flex-col items-center justify-center text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ y: textParallaxY, opacity: textParallaxOpacity }}
      >
        {/* Massive Sans-Serif / Condensed Headline with fluid responsive typography & word entrance */}
        <motion.h1
          id="hero-headline-text"
          variants={itemVariants}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-[#FFFFFF] leading-[1.12] sm:leading-[1.05] uppercase max-w-5xl select-text font-condensed drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
        >
          <RevealWords
            text="Stop Being the Market’s Best-Kept Secret."
            delay={0.15}
            staggerDelay={0.04}
            className="inline"
          />{' '}
          <br className="hidden sm:inline" />
          <span className="inline-block font-bold text-[#4EFE32] drop-shadow-[0_0_24px_rgba(78,254,50,0.4)]">
            <RevealWords
              text="Command Attention."
              delay={0.4}
              staggerDelay={0.04}
              className="inline"
            />
          </span>{' '}
          <br className="hidden sm:inline" />
          <span className="inline-block font-bold">
            <RevealWords
              text="Build Unshakeable Wealth."
              delay={0.6}
              staggerDelay={0.04}
              className="inline"
            />
          </span>
        </motion.h1>

        {/* Primary Accent Liquid Metal Button with Vivid Cyan Accent Dot */}
        <motion.div id="hero-cta-wrapper" variants={itemVariants} className="mt-5 sm:mt-8 flex items-center justify-center">
          <LiquidMetalButton
            id="meet-team-pill-btn"
            variant="neon"
            size="lg"
            label="Claim Your Growth Consultation"
            icon={<span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#00C2CB] shadow-[0_0_8px_#00C2CB]" />}
            iconPosition="right"
            onClick={() => {
              if (onMeetTeam) {
                onMeetTeam();
              } else {
                scrollToSection('dlorenz-contact-section');
              }
            }}
          />
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* BOTTOM LEFT EDITORIAL MANIFESTO                                           */}
      {/* ========================================================================= */}
      <motion.div
        id="hero-bottom-manifesto"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, filter: shouldReduceMotion ? 'none' : 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-5 sm:pb-8"
      >
        <div className="max-w-2xl text-left p-3 sm:p-4 rounded-2xl bg-[#111216]/60 backdrop-blur-md border border-[#262933]/70 hover:border-[#4EFE32]/40 transition-colors">
          <p
            id="hero-manifesto-text"
            className="text-xs sm:text-sm md:text-[15px] text-[#ECECEC] font-normal leading-relaxed tracking-normal font-condensed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
          >
            <RevealWords
              text="We turn quiet brands into dominant market leaders and transform real estate investments into bulletproof, high-yield assets across Nigeria."
              delay={0.8}
              staggerDelay={0.02}
            />
          </p>
        </div>
      </motion.div>
    </section>
  );
};


