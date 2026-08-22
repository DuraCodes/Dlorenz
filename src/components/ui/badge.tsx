import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-condensed tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-[#4EFE32] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#4EFE32] text-[#121212] font-bold shadow-sm",
        secondary:
          "border-[#262933] bg-[#16181D]/90 text-[#ECECEC] backdrop-blur-sm",
        destructive:
          "border-transparent bg-red-600 text-white shadow-sm",
        outline: "border-[#262933] text-[#A0A6B2] bg-transparent hover:border-[#4EFE32] hover:text-[#FFFFFF]",
        cyan: "border-transparent bg-[#00C2CB] text-[#121212] font-bold shadow-sm",
        gold: "border-transparent bg-[#EAD9B4] text-[#121212] font-bold shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
