import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail,
  Instagram,
  Facebook,
  Linkedin,
  Heart,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import FooterControls from './ui/footer';
import { LegalModal } from './ui/legal-modal';
import { SiteConfig } from '../types';
import { BrandLogo } from './ui/brand-logo';

interface FooterProps {
  onOpenTeamModal?: () => void;
  onOpenGallery?: () => void;
}

const navigation = {
  categories: [
    {
      id: 'growth-solutions',
      name: 'Solutions & Services',
      sections: [
        {
          id: 'core-services',
          name: 'Services',
          items: [
            { name: 'Brand Activations', href: '#dlorenz-contact-section' },
            { name: 'In-Store Sampling', href: '#dlorenz-contact-section' },
            { name: 'Commercial Photos', href: '#dlorenz-contact-section' },
            { name: 'Field Logistics', href: '#dlorenz-contact-section' },
          ],
        },
        {
          id: 'company',
          name: 'Company',
          items: [
            { name: 'About DLorenz', href: '#dlorenz-leadership-section' },
            { name: 'Leadership Team', href: '#dlorenz-leadership-section' },
            { name: 'Book Briefing', href: '#dlorenz-contact-section' },
            { name: 'Client Proof', href: '#dlorenz-leadership-section' },
          ],
        },
        {
          id: 'governance',
          name: 'Contact',
          items: [
            { name: 'hello@dlorenz.com', href: 'mailto:DLorenzSolutions@gmail.com' },
            { name: '+234 906 090 9034', href: 'tel:+2349060909034' },
            { name: '+234 816 866 1924', href: 'tel:+2348168661924' },
            { name: 'Lagos, Nigeria', href: '#dlorenz-contact-section' },
          ],
        },
      ],
    },
  ],
};

const Underline =
  'group relative hover:-translate-y-0.5 border border-[#262933] hover:border-[#4EFE32] rounded-xl p-2.5 sm:p-2 bg-[#1A1C22]/80 hover:bg-[#1A1C22] text-[#A0A6B2] hover:text-[#FFFFFF] transition-all duration-200 shadow-sm flex items-center justify-center min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]';

export const Footer: React.FC<FooterProps> = ({ onOpenTeamModal, onOpenGallery }) => {
  const [activeLegalDoc, setActiveLegalDoc] = useState<'privacy' | 'terms' | null>(null);
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.1 });

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

  return (
    <motion.footer
      ref={footerRef}
      id="dlorenz-main-footer"
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full bg-[#111216] border-t border-[#262933] text-[#FFFFFF] font-condensed pt-8 pb-6"
    >
      {/* Brand Narrative & Value Proposition */}
      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-center pb-6 border-b border-[#262933]">
        <div className="flex items-center w-fit">
          <BrandLogo
            siteConfig={siteConfig}
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#A0A6B2] leading-relaxed max-w-lg">
            Experiential marketing campaigns, retail sampling, and verified real estate advisory across Nigeria.
          </p>
          <div className="flex items-center gap-2">
            {onOpenGallery && (
              <motion.button
                onClick={onOpenGallery}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3.5 py-1.5 rounded-full font-bold text-xs text-[#FFFFFF] bg-[#1A1C22] border border-[#262933] hover:border-[#4EFE32] hover:text-[#4EFE32] transition-all whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Projects</span>
              </motion.button>
            )}
            {onOpenTeamModal && (
              <motion.button
                onClick={onOpenTeamModal}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-1.5 rounded-full font-bold text-xs text-[#121212] bg-[#4EFE32] hover:bg-[#43e629] transition-all shadow-[0_2px_10px_rgba(78,254,50,0.25)] whitespace-nowrap uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Team</span>
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Navigation Grid */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-6">
        {navigation.categories.map((category) => (
          <div key={category.name}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 leading-5">
              {category.sections.map((section) => (
                <div key={section.name} className="flex flex-col space-y-2">
                  <h3 className="text-xs font-bold text-[#4EFE32] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#00C2CB]" />
                    {section.name}
                  </h3>
                  <ul role="list" className="flex flex-col space-y-1.5">
                    {section.items.map((item) => (
                      <li key={item.name} className="flow-root">
                        <a
                          href={item.href}
                          className="text-xs text-[#A0A6B2] hover:text-[#FFFFFF] hover:translate-x-0.5 transition-all duration-150 inline-block"
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="border-b border-[#262933] mt-6"></div>
      </div>

      {/* Social Links & Floating Control Actions */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 py-2">
        {/* Requested Social Network Icons: LinkedIn, Facebook, X, Instagram, Email, TikTok */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* LinkedIn */}
          <a
            aria-label="LinkedIn"
            href="https://linkedin.com/company/dlorenzsolutions"
            rel="noreferrer"
            target="_blank"
            className={Underline}
            title="LinkedIn"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>

          {/* Facebook */}
          <a
            aria-label="Facebook"
            href="https://facebook.com/dlorenzsolutions"
            rel="noreferrer"
            target="_blank"
            className={Underline}
            title="Facebook"
          >
            <Facebook className="h-3.5 w-3.5" />
          </a>

          {/* X (formerly Twitter) */}
          <a
            aria-label="X"
            href="https://x.com/dlorenzgrowth"
            rel="noreferrer"
            target="_blank"
            className={Underline}
            title="X"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            aria-label="Instagram"
            href="https://instagram.com/dlorenzsolutions"
            rel="noreferrer"
            target="_blank"
            className={Underline}
            title="Instagram"
          >
            <Instagram className="h-3.5 w-3.5" />
          </a>

          {/* TikTok */}
          <a
            aria-label="TikTok"
            href="https://tiktok.com/@dlorenzsolutions"
            rel="noreferrer"
            target="_blank"
            className={Underline}
            title="TikTok"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.87-4.49V8.69a8.18 8.18 0 0 0 4.9 1.6v-3.6z" />
            </svg>
          </a>

          {/* Email */}
          <a
            aria-label="Email"
            href="mailto:DLorenzSolutions@gmail.com"
            rel="noreferrer"
            className={Underline}
            title="Email DLorenz"
          >
            <Mail className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Floating Scroll-to-Top & Theme Controls */}
        <FooterControls />
      </div>

      {/* Bottom Copyright & Guarantee */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mt-4 pt-4 border-t border-[#262933]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#A0A6B2]">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
          <span>© {new Date().getFullYear()}</span>
          <span className="font-bold text-[#FFFFFF]">DLORENZ SOLUTIONS</span>
          <span>— All rights reserved.</span>
        </div>

        {/* Legal Policy Dialog Triggers */}
        <div className="flex items-center gap-2.5 text-xs text-[#A0A6B2]">
          <button
            type="button"
            onClick={() => setActiveLegalDoc('privacy')}
            className="hover:text-[#4EFE32] transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Privacy Policy
          </button>
          <span className="text-[#262933]">•</span>
          <button
            type="button"
            onClick={() => setActiveLegalDoc('terms')}
            className="hover:text-[#4EFE32] transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            Terms of Service
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[#A0A6B2]">
          <span>Nationwide Execution</span>
          <span>•</span>
          <span className="text-[#00C2CB]">Lagos, Nigeria</span>
        </div>
      </div>

      {/* Reusable Legal Dialog Modal */}
      <LegalModal
        type={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
      />
    </motion.footer>
  );
};

