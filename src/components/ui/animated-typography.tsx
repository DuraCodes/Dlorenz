import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

export interface RevealWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  highlightWords?: string[];
  highlightClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

/**
 * Splits text into words and animates them with a staggered entrance.
 * Gracefully falls back to instant reveal when prefers-reduced-motion is active.
 */
export const RevealWords: React.FC<RevealWordsProps> = ({
  text,
  className,
  wordClassName,
  delay = 0,
  staggerDelay = 0.04,
  duration = 0.55,
  highlightWords = [],
  highlightClassName = 'text-[#4EFE32] drop-shadow-[0_0_20px_rgba(78,254,50,0.35)]',
  as: Component = 'span',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 16,
      filter: 'blur(3px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      className={cn('inline-block', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {words.map((word, i) => {
        // Strip punctuation for matching highlight words
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isHighlighted = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord || word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className={cn(
              'inline-block mr-[0.25em] last:mr-0',
              isHighlighted && highlightClassName,
              wordClassName
            )}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.span>
  );
};

export interface ScrollRevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

/**
 * Smooth, hardware-accelerated scroll-triggered entrance for headings, subheadings, and paragraphs.
 */
export const ScrollRevealText: React.FC<ScrollRevealTextProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.6,
  yOffset = 20,
  as: Component = 'div',
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: yOffset, filter: 'blur(2px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
};

export interface SectionHeadingProps {
  badgeText?: string;
  title: string;
  highlightWords?: string[];
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  dividerWidth?: number;
}

/**
 * Standardized premium section heading with staggered entrance for badge, headline, gradient rule, and narrative subtitle.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badgeText,
  title,
  highlightWords = [],
  subtitle,
  align = 'center',
  className,
  dividerWidth = 96,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col mb-8 sm:mb-12 relative z-10',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {badgeText && (
        <ScrollRevealText delay={0.05} yOffset={10} className="mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#1A1C22] border border-[#262933] text-[#4EFE32] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2CB] shadow-[0_0_6px_#00C2CB]" />
            {badgeText}
          </span>
        </ScrollRevealText>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFFFF] uppercase font-condensed leading-tight mb-3">
        <RevealWords
          text={title}
          highlightWords={highlightWords}
          delay={0.1}
          staggerDelay={0.035}
        />
      </h2>

      <motion.div
        className="h-1 bg-gradient-to-r from-[#4EFE32] via-[#00C2CB] to-[#4EFE32] rounded-full mb-4"
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: dividerWidth, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.25, ease: 'easeOut' }}
      />

      {subtitle && (
        <ScrollRevealText
          delay={0.2}
          yOffset={14}
          className={cn(
            'text-sm sm:text-base text-[#A0A6B2] font-condensed leading-relaxed',
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-xl'
          )}
        >
          <p>{subtitle}</p>
        </ScrollRevealText>
      )}
    </div>
  );
};

export interface InteractiveTextLinkProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  activeColor?: string;
}

/**
 * Text link with subtle hover elevation and smooth color/glow transitions.
 */
export const InteractiveTextLink: React.FC<InteractiveTextLinkProps> = ({
  href,
  onClick,
  children,
  className,
  activeColor = '#4EFE32',
}) => {
  const content = (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1.5 transition-colors relative group py-0.5 cursor-pointer',
        className
      )}
      whileHover={{ x: 2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <span className="relative">
        {children}
        <span
          className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-current transition-all duration-300 group-hover:w-full"
          style={{ backgroundColor: activeColor }}
        />
      </span>
    </motion.span>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className="inline-block text-inherit no-underline">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block text-inherit bg-transparent border-0 p-0 text-left">
      {content}
    </button>
  );
};
