import React, { useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Globe2, Compass, Layers } from 'lucide-react';

interface SolutionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

const solutionPillars = [
  {
    icon: Compass,
    title: 'Market Insight & Positioning',
    description:
      'Rigorous competitive intelligence, sector analysis, and differentiated positioning to capture dominant market share.',
  },
  {
    icon: TrendingUp,
    title: 'Brand Acceleration Engines',
    description:
      'High-velocity commercial frameworks and marketing execution that scale enterprise client acquisition.',
  },
  {
    icon: Globe2,
    title: 'Global Scalability & Expansion',
    description:
      'Cross-border operational and strategic advisory helping visionary companies establish multi-market presence.',
  },
  {
    icon: Layers,
    title: 'Results-Driven Solutions',
    description:
      'Quantifiable outcomes, measurable return on investment, and customized go-to-market strategies.',
  },
];

export const SolutionsDrawer: React.FC<SolutionsDrawerProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="solutions-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="solutions-modal-dialog"
        className="relative w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl text-neutral-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-solutions-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close solutions dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 font-semibold">
            DLORENZ SOLUTIONS CAPABILITIES
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">Strategic Solutions Portfolio</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Tailored advisory services engineered to turn visionary dreams into commercial success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {solutionPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center mb-3 text-neutral-200">
                  <Icon className="w-5 h-5 text-neutral-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <div>
            <div className="text-sm font-semibold text-white">Ready to partner with DLorenz?</div>
            <div className="text-xs text-neutral-400">Schedule an executive strategy session.</div>
          </div>
          <button
            id="solutions-cta-btn"
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-neutral-950 bg-neutral-100 hover:bg-white transition-all shadow-md"
          >
            Start Strategic Engagement
          </button>
        </div>
      </div>
    </div>
  );
};
