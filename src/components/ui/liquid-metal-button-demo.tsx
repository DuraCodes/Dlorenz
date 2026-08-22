import { LiquidMetalButton } from "@/src/components/ui/liquid-metal-button";
import { ArrowRight, Sparkles, PhoneCall, ShieldCheck, Compass } from "lucide-react";

export default function LiquidMetalButtonDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 bg-[#111216] rounded-2xl border border-white/10">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Dynamic Liquid Metal Controls</h3>
        <p className="text-xs text-[#A0A6B2]">Adaptive shader-driven dynamic buttons with custom shaders, variants, and dimensions</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Default dynamic text button */}
        <LiquidMetalButton label="Get Started" />

        {/* Neon green DLORENZ variant with icon */}
        <LiquidMetalButton
          label="Executive Advisory"
          variant="neon"
          size="lg"
          icon={<ShieldCheck size={18} />}
          iconPosition="left"
        />

        {/* Cyan variant with right arrow */}
        <LiquidMetalButton
          label="Explore Bento Gallery"
          variant="cyan"
          icon={<ArrowRight size={16} />}
          iconPosition="right"
        />

        {/* Gold luxury variant */}
        <LiquidMetalButton
          label="Book Strategic Call"
          variant="gold"
          icon={<PhoneCall size={16} />}
        />

        {/* Icon only mode */}
        <LiquidMetalButton
          viewMode="icon"
          variant="neon"
          icon={<Compass size={18} />}
        />

        <LiquidMetalButton
          viewMode="icon"
          variant="default"
          icon={<Sparkles size={18} />}
        />
      </div>
    </div>
  );
}
