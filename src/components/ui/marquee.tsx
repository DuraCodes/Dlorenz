import React from 'react';
import { cn } from '@/src/lib/utils';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  className,
  reverse = false,
  pauseOnHover = true,
  children,
  vertical = false,
  repeat = 4,
  duration = '30s',
  ...props
}) => {
  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-scroll-reverse {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (hover: hover) and (pointer: fine) {
          .group:hover .marquee-track-pause {
            animation-play-state: paused !important;
          }
        }
      `}</style>
      <div
        {...props}
        className={cn(
          'group flex overflow-hidden p-2 [--gap:1.5rem] [gap:var(--gap)] touch-pan-y',
          vertical ? 'flex-col' : 'flex-row',
          className
        )}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex shrink-0 justify-around [gap:var(--gap)]',
              vertical ? 'flex-col animate-marquee-vertical' : 'flex-row',
              pauseOnHover && 'marquee-track-pause'
            )}
            style={{
              animation: `${reverse ? 'marquee-scroll-reverse' : 'marquee-scroll'} ${duration} linear infinite`,
            }}
          >
            {children}
          </div>
        ))}
      </div>
    </>
  );
};
