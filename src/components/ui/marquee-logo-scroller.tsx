import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/src/lib/utils';

// Define the type for individual logo props
export interface MarqueeLogoItem {
  name: string;
  category?: string;
  src?: string;
  alt?: string;
  svgIcon?: React.ReactNode;
  gradient?: {
    from: string;
    via: string;
    to: string;
  };
}

// Define the props for the main component
export interface MarqueeLogoScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  logos: MarqueeLogoItem[];
  speed?: 'normal' | 'slow' | 'fast';
}

/**
 * A responsive, self-contained, and infinitely scrolling marquee component.
 * It pauses on hover and matches DLorenz Solutions' high-contrast dark theme.
 */
const MarqueeLogoScroller = React.forwardRef<HTMLDivElement, MarqueeLogoScrollerProps>(
  ({ title, description, logos, speed = 'normal', className, ...props }, ref) => {
    const headerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(headerRef, { once: false, amount: 0.2 });

    // Map speed prop to animation duration
    const durationMap = {
      normal: '35s',
      slow: '65s',
      fast: '15s',
    };
    const animationDuration = durationMap[speed];

    return (
      <>
        {/* Keyframes for the marquee animation */}
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
        
        <section
          ref={ref}
          aria-label={title}
          id="marquee-partners-scroller"
          className={cn(
            'w-full bg-[#111216] text-[#FFFFFF] border-y border-[#262933] overflow-hidden py-10 sm:py-14 md:py-16 relative',
            className
          )}
          {...props}
        >
          {/* Subtle Ambient Glow */}
          <motion.div
            className="absolute top-1/2 -left-20 w-64 h-64 rounded-full bg-[#4EFE32]/5 blur-3xl pointer-events-none"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />

          {/* Header Section */}
          <div ref={headerRef} className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8 sm:mb-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 lg:gap-8 pb-6 border-b border-[#262933] items-end">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] uppercase font-condensed mb-2"
                >
                  {title}
                </motion.h2>
                <motion.div
                  className="w-20 h-1 bg-gradient-to-r from-[#4EFE32] to-[#00C2CB] rounded-full"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 80 } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-sm sm:text-base text-[#A0A6B2] font-condensed leading-relaxed lg:text-right"
              >
                {description}
              </motion.p>
            </div>
          </div>

          {/* Marquee Section with gradient mask edges */}
          <div
            className="w-full overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
          >
            <div 
              className="flex w-max items-center gap-5 sm:gap-6 py-4 pr-6 hover:[animation-play-state:paused] transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing" 
              style={{
                animation: `marquee ${animationDuration} linear infinite`,
              }}
            >
              {/* Render logos twice to create a seamless infinite loop */}
              {(() => {
                const list = Array.isArray(logos) && logos.length > 0 ? logos : [];
                const doubleList = list.length > 0 ? [...list, ...list] : [];
                return doubleList.map((logo, index) => (
                  <LogoCard key={`${logo?.alt || logo?.name || 'partner'}-${index}`} logo={logo} />
                ));
              })()}
            </div>
          </div>
        </section>
      </>
    );
  }
);

MarqueeLogoScroller.displayName = 'MarqueeLogoScroller';

// Sub-component for individual logo card with hover effects and graceful image fallback
const LogoCard: React.FC<{ logo: MarqueeLogoItem }> = ({ logo }) => {
  const [imgError, setImgError] = useState(false);

  if (!logo) return null;

  const gradientFrom = logo.gradient?.from || '#1e3a8a';
  const gradientVia = logo.gradient?.via || '#00C2CB';
  const gradientTo = logo.gradient?.to || '#4EFE32';
  const isValidSvg = React.isValidElement(logo.svgIcon);

  return (
    <div
      className="group relative h-24 sm:h-28 w-44 sm:w-52 shrink-0 flex flex-col items-center justify-center rounded-2xl bg-[#1A1C22] border border-[#262933] hover:border-[#4EFE32] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(78,254,50,0.15)] select-none px-4"
    >
      {/* Gradient background revealed on hover */}
      <div
        style={{
          '--from': gradientFrom,
          '--via': gradientVia,
          '--to': gradientTo,
        } as React.CSSProperties}
        className="absolute inset-0 scale-125 opacity-0 transition-all duration-500 ease-out group-hover:opacity-20 group-hover:scale-100 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)]"
      />

      {/* Primary Brand Visual / SVG */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        {isValidSvg ? (
          <div className="transition-transform duration-300 group-hover:scale-105">
            {logo.svgIcon}
          </div>
        ) : logo.src && !imgError ? (
          <img
            src={logo.src}
            alt={logo.alt || logo.name || 'Partner'}
            onError={() => setImgError(true)}
            className="h-10 sm:h-12 w-auto max-w-[80%] object-contain filter grayscale group-hover:grayscale-0 brightness-125 group-hover:brightness-100 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-lg font-bold text-[#FFFFFF] group-hover:text-[#4EFE32] uppercase tracking-wider font-condensed transition-colors">
              {logo.name || 'Enterprise Partner'}
            </span>
            {logo.category && (
              <span className="text-[10px] text-[#A0A6B2] font-mono tracking-tight uppercase mt-0.5">
                {logo.category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Subtle indicator accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00C2CB] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export { MarqueeLogoScroller };
