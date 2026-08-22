import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { Marquee } from './ui/marquee';
import { dlorenzExecutiveTeam, TeamMember } from '../data/team';
import { RevealWords, ScrollRevealText } from './ui/animated-typography';

interface TeamSectionProps {
  onOpenConsultation?: () => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  onOpenConsultation,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dlorenz_cms_team');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return dlorenzExecutiveTeam;
  });

  useEffect(() => {
    const handleCmsUpdate = () => {
      try {
        const saved = localStorage.getItem('dlorenz_cms_team');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTeam(parsed);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="dlorenz-leadership-section"
      className="relative w-full overflow-hidden bg-[#111216] py-12 sm:py-16 md:py-20 lg:py-24 border-t border-[#262933] text-[#FFFFFF]"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Ambient background abstract vector curve */}
      <div className="pointer-events-none absolute right-0 bottom-0 opacity-10 text-[#4EFE32] select-none">
        <svg
          fill="none"
          height="180"
          viewBox="0 0 460 154"
          width="460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32"
          />
        </svg>
      </div>

      {/* Decorative ambient floating glow points */}
      <motion.div
        className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-[#4EFE32]/5 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#00C2CB]/5 blur-3xl pointer-events-none"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Executive Team Header */}
        <motion.div className="mx-auto mb-10 max-w-3xl text-center flex flex-col items-center" variants={itemVariants}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1A1C22] border border-[#262933] text-[#4EFE32] shadow-sm mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2CB] shadow-[0_0_6px_#00C2CB]" />
            Executive Leadership &amp; Board
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] uppercase font-condensed leading-tight mb-3">
            <RevealWords
              text="Meet Our Strategic Growth Partners"
              highlightWords={["Strategic", "Growth", "Partners"]}
              delay={0.1}
              staggerDelay={0.04}
            />
          </h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#4EFE32] via-[#00C2CB] to-[#4EFE32] rounded-full mb-4"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : { width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <ScrollRevealText delay={0.2} yOffset={12} className="text-sm sm:text-base text-[#A0A6B2] font-condensed leading-relaxed max-w-xl">
            <p>Seasoned marketing directors, experiential campaign architects, and licensed land acquisition specialists.</p>
          </ScrollRevealText>
        </motion.div>

        {/* Marquee Scroller with Custom Card Badges */}
        <motion.div className="relative w-full overflow-hidden" variants={itemVariants}>
          {/* Gradient Mask Edge Fades */}
          <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 sm:w-36 bg-gradient-to-r from-[#111216] to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 sm:w-36 bg-gradient-to-l from-[#111216] to-transparent" />

          <Marquee className="[--gap:1.75rem] py-4" pauseOnHover repeat={4} duration="28s">
            {(Array.isArray(team) && team.length > 0 ? team : dlorenzExecutiveTeam).map((member, idx) => (
              <motion.div
                key={member.id || `team-${idx}`}
                id={`team-card-${member.id || idx}`}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative flex w-72 sm:w-80 shrink-0 flex-col overflow-hidden rounded-2xl bg-[#1A1C22] border border-[#262933] hover:border-[#4EFE32] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(78,254,50,0.18)]"
              >
                {/* Executive Portrait Image Container */}
                <div className="relative h-[360px] sm:h-[390px] w-full overflow-hidden bg-[#111216]">
                  <img
                    src={member.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={member.name}
                    className="h-full w-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  
                  {/* Subtle top ambient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#111216]/40 via-transparent to-[#111216]/80 pointer-events-none" />

                  {/* Top Status Pill */}
                  <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-full bg-[#111216]/80 backdrop-blur-md border border-[#262933] text-[11px] font-semibold text-[#4EFE32] uppercase font-condensed tracking-wider flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4EFE32] animate-pulse" />
                    <span>{member.status}</span>
                  </div>

                  {/* Signature Custom Nameplate Badge */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex shadow-2xl rounded-sm overflow-hidden border border-[#262933] group-hover:border-[#4EFE32] transition-colors">
                    {/* Left Accent Green Box */}
                    <div className="w-20 sm:w-24 bg-[#4EFE32] flex items-center justify-between px-2.5 sm:px-3 shrink-0">
                      {/* Cyan Indicator Dot */}
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00C2CB] shadow-[0_0_6px_#00C2CB] shrink-0" />
                      {/* White Growth Arrow */}
                      <svg
                        className="w-8 h-8 sm:w-9 sm:h-9 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>

                    {/* Right White Nameplate Box */}
                    <div className="flex-1 bg-[#FFFFFF] py-2 sm:py-2.5 px-3 sm:px-4 flex flex-col justify-center text-left">
                      <h3 className="font-bold text-[#111216] font-condensed tracking-tight text-sm sm:text-base uppercase leading-tight">
                        {member.name}
                      </h3>
                      <div className="w-full border-b border-[#111216]/20 my-1"></div>
                      <p className="text-[11px] sm:text-xs font-semibold text-[#111216] font-condensed tracking-wider uppercase">
                        {member.shortRole || member.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>

        {/* Bottom Testimonial & Endorsement Quote / Core Purpose */}
        <motion.div className="mx-auto mt-16 max-w-3xl px-6 text-center lg:px-0" variants={itemVariants}>
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="p-6 sm:p-8 rounded-3xl bg-[#1A1C22]/80 border border-[#262933] hover:border-[#4EFE32]/40 backdrop-blur-md shadow-xl text-left sm:text-center transition-colors"
          >
            <p className="mb-4 font-medium text-base sm:text-lg text-[#FFFFFF] leading-relaxed font-condensed">
              &ldquo;Your brand is not just a logo—it is your single most valuable growth engine. We exist to unleash its full magnetic power, turning passive onlookers into hyper-loyal customers and sustainable market share.&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-[#A0A6B2] leading-relaxed font-condensed max-w-2xl mx-auto">
              <strong className="text-[#FFFFFF] uppercase">Our Mission:</strong> To transform ambitious companies into household names through high-impact experiential marketing, while providing secure, transparent, and hassle-free real estate solutions that build generational wealth.
            </p>
            <div className="flex flex-col items-center gap-2 mt-6">
              {onOpenConsultation && (
                <motion.button
                  type="button"
                  onClick={onOpenConsultation}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-[#121212] bg-[#4EFE32] hover:bg-[#43e629] transition-colors shadow-[0_4px_16px_rgba(78,254,50,0.25)] uppercase font-condensed tracking-wider cursor-pointer"
                >
                  <span>Claim Your Growth Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
