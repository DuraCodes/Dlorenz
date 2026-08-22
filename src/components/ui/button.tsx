import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";
import { LiquidMetalButton } from "./liquid-metal-button";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium font-condensed tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#4EFE32] text-[#121212] font-bold uppercase tracking-wider hover:bg-[#43e629] shadow-[0_4px_16px_rgba(78,254,50,0.25)]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-[#262933] bg-[#1A1C22]/80 text-[#FFFFFF] hover:bg-[#1A1C22] hover:border-[#4EFE32]",
        secondary: "bg-[#1A1C22] text-[#FFFFFF] border border-[#262933] hover:border-[#00C2CB]",
        ghost: "text-[#A0A6B2] hover:text-[#FFFFFF] hover:bg-[#1A1C22]",
        link: "text-[#4EFE32] underline-offset-4 hover:underline",
        "liquid-metal": "",
        "liquid-neon": "",
        "liquid-cyan": "",
        "liquid-gold": "",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  liquidIcon?: React.ReactNode;
  liquidIconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, onClick, disabled, type, id, title, liquidIcon, liquidIconPosition, fullWidth, ...props }, ref) => {
    // If liquid metal variant is chosen, route through dynamic shader button
    if (variant === "liquid-metal" || variant === "liquid-neon" || variant === "liquid-cyan" || variant === "liquid-gold") {
      const liquidVariant = variant === "liquid-neon" ? "neon" : variant === "liquid-cyan" ? "cyan" : variant === "liquid-gold" ? "gold" : "default";
      const liquidSize = size === "icon" ? "icon" : size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
      
      return (
        <LiquidMetalButton
          variant={liquidVariant}
          size={liquidSize}
          className={className}
          onClick={onClick as any}
          disabled={disabled}
          type={type as any}
          id={id}
          title={title}
          icon={liquidIcon}
          iconPosition={liquidIconPosition}
          fullWidth={fullWidth}
        >
          {children}
        </LiquidMetalButton>
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        type={type}
        id={id}
        title={title}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, LiquidMetalButton };
