import React from 'react';
import { ArrowRight, Download, Sparkles, Building2, ShieldCheck, TrendingUp, Play } from 'lucide-react';
import { HeroMetric } from '../types';

interface HeroContentProps {
  onOpenConsultation: () => void;
  onDownloadProfile: () => void;
  onExploreSolutions: () => void;
}

const metrics: HeroMetric[] = [
  {
    id: 'growth',
    value: '$500M+',
    label: 'Value Accelerated',
    description: 'Direct enterprise market cap & revenue expansion',
  },
  {
    id: 'retention',
    value: '98.4%',
    label: 'Client Retention',
    description: 'Long-term corporate & institutional partnerships',
  },
  {
    id: 'markets',
    value: '24+',
    label: 'Global Markets',
    description: 'Cross-border strategic advisory & market entry',
  },
];

export const HeroContent: React.FC<HeroContentProps> = ({
  onOpenConsultation,
  onDownloadProfile,
  onExploreSolutions,
}) => {
  return (
    <div id="hero-content-container" className="flex flex-col justify-center h-full max-w-2xl z-20">
      {/* Dominant Headline */}
      <h1
        id="hero-main-title"
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5 sm:mb-6"
      >
        Building Dreams. <br />
        <span className="text-neutral-300 font-light italic">
          Delivering Success.
        </span>
      </h1>

      {/* Narrative Manifesto / Mission Description */}
      <p
        id="hero-mission-description"
        className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-8 sm:mb-10 text-pretty"
      >
        We leverage our expertise, diversity, and deep market insight to accelerate the growth of
        leading brands through innovative, results-driven solutions.
      </p>

      {/* Interactive Action Buttons */}
      <div
        id="hero-cta-buttons"
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10 sm:mb-12"
      >
        {/* Primary CTA */}
        <button
          id="hero-primary-consultation-btn"
          onClick={onOpenConsultation}
          className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-neutral-950 bg-neutral-100 hover:bg-white transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] active:scale-[0.98]"
        >
          <span>Schedule Consultation</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Secondary Action */}
        <button
          id="hero-secondary-solutions-btn"
          onClick={onExploreSolutions}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm sm:text-base text-neutral-200 hover:text-white bg-neutral-900/80 hover:bg-neutral-800/90 border border-neutral-700/80 backdrop-blur-md transition-all active:scale-[0.98]"
        >
          <Building2 className="w-4 h-4 text-neutral-400" />
          <span>Strategic Solutions</span>
        </button>

        {/* Tertiary Action */}
        <button
          id="hero-tertiary-download-btn"
          onClick={onDownloadProfile}
          className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
          title="Download DLorenz Executive Profile"
        >
          <Download className="w-4 h-4" />
          <span>Executive Brief</span>
        </button>
      </div>

      {/* Proof Points & Metrics Banner */}
      <div
        id="hero-metrics-grid"
        className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 border-t border-neutral-800/80"
      >
        {metrics.map((metric) => (
          <div key={metric.id} id={`metric-${metric.id}`} className="flex flex-col">
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {metric.value}
            </span>
            <span className="text-xs sm:text-sm font-medium text-neutral-400 mt-0.5">
              {metric.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
