import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CampaignOnboardingDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: () => void;
}

export function CampaignOnboardingDialog({
  trigger,
  open,
  onOpenChange,
  onComplete,
}: CampaignOnboardingDialogProps) {
  const [step, setStep] = useState(1);

  const stepContent = [
    {
      title: "Tell Us About Your Brand Goals",
      category: "Step 01 / Objective",
      description:
        "Whether you're launching a new FMCG product, acquiring verified land, or rolling out supermarket sampling, define your primary target.",
      image:
        "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Field Logistics & Campaign Scope",
      category: "Step 02 / Execution",
      description:
        "Our team deploys experienced brand ambassadors, street promo DJ trucks, drone survey audits, and precision retail booths.",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Verified Measurement & Launch",
      category: "Step 03 / Delivery",
      description:
        "Track customer engagements, verified sample distribution, and legal land documentation with zero guesswork.",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const totalSteps = stepContent.length;

  const handleContinue = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) setStep(1);
        if (onOpenChange) onOpenChange(isOpen);
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="gap-0 p-0 sm:max-w-[440px] max-h-[90dvh] overflow-y-auto overscroll-contain bg-[#16181D] border-[#262933]">
        <div className="p-3 bg-[#111216]">
          <div className="relative h-40 sm:h-48 w-full overflow-hidden rounded-xl border border-[#262933]">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              src={stepContent[step - 1].image}
              alt="campaign step"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16181D] via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-3 left-3 text-[11px] font-bold text-[#4EFE32] uppercase tracking-wider drop-shadow-md">
              {stepContent[step - 1].category}
            </span>
          </div>
        </div>

        <div className="space-y-5 px-6 pb-6 pt-3 font-condensed">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight text-white">
              {stepContent[step - 1].title}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#A0A6B2] leading-relaxed">
              {stepContent[step - 1].description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center pt-2 border-t border-[#262933]">
            {/* Step Indicators */}
            <div className="flex justify-center space-x-1.5 max-sm:order-1">
              {[...Array(totalSteps)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    index + 1 === step
                      ? "w-6 bg-[#4EFE32] shadow-[0_0_8px_#4EFE32]"
                      : "w-1.5 bg-[#262933]"
                  )}
                />
              ))}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold uppercase text-[#A0A6B2]"
                >
                  Skip
                </Button>
              </DialogClose>
              {step < totalSteps ? (
                <Button
                  className="group font-bold uppercase text-xs tracking-wider"
                  size="sm"
                  type="button"
                  onClick={handleContinue}
                >
                  Next Step
                  <ArrowRight
                    className="-me-1 ms-1.5 opacity-80 transition-transform group-hover:translate-x-0.5"
                    size={14}
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <DialogClose asChild>
                  <Button
                    type="button"
                    size="sm"
                    className="font-bold uppercase text-xs tracking-wider bg-[#00C2CB] hover:bg-[#00a9b1] text-[#121212]"
                    onClick={handleContinue}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Book Briefing
                  </Button>
                </DialogClose>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
