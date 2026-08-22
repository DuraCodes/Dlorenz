import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { Sparkles } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";

export interface LiquidMetalButtonProps {
  label?: string;
  children?: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  viewMode?: "text" | "icon" | "both";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "default" | "neon" | "cyan" | "gold" | "crimson" | "dark" | "outline";
  size?: "sm" | "default" | "lg" | "xl" | "icon" | "full";
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  id?: string;
  title?: string;
  "aria-label"?: string;
  width?: number | string;
  fullWidth?: boolean;
}

export function LiquidMetalButton({
  label = "Get Started",
  children,
  onClick,
  viewMode = "text",
  icon,
  iconPosition = "left",
  variant = "default",
  size = "default",
  className = "",
  style,
  disabled = false,
  type = "button",
  id,
  title,
  "aria-label": ariaLabel,
  width,
  fullWidth = false,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; id: number }>
  >([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/suspicious/noExplicitAny: External library without types
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const displayLabel = children || label;
  const isIconButton = viewMode === "icon" || size === "icon";

  // Dynamic dimension calculations based on size & content
  const dimensions = useMemo(() => {
    if (isIconButton) {
      const sizeMap = {
        sm: { width: 36, height: 36, innerWidth: 32, innerHeight: 32, shaderWidth: 36, shaderHeight: 36, fontSize: "12px", iconSize: 14 },
        default: { width: 46, height: 46, innerWidth: 42, innerHeight: 42, shaderWidth: 46, shaderHeight: 46, fontSize: "14px", iconSize: 16 },
        lg: { width: 54, height: 54, innerWidth: 48, innerHeight: 48, shaderWidth: 54, shaderHeight: 54, fontSize: "16px", iconSize: 18 },
        xl: { width: 62, height: 62, innerWidth: 56, innerHeight: 56, shaderWidth: 62, shaderHeight: 62, fontSize: "18px", iconSize: 20 },
        icon: { width: 46, height: 46, innerWidth: 42, innerHeight: 42, shaderWidth: 46, shaderHeight: 46, fontSize: "14px", iconSize: 16 },
        full: { width: 46, height: 46, innerWidth: 42, innerHeight: 42, shaderWidth: 46, shaderHeight: 46, fontSize: "14px", iconSize: 16 },
      };
      return sizeMap[size] || sizeMap.default;
    }

    // Estimate width if not explicitly provided
    let calculatedWidth = 142;
    if (typeof width === "number") {
      calculatedWidth = width;
    } else if (typeof displayLabel === "string") {
      const charLength = displayLabel.length;
      const basePadding = (viewMode === "both" || icon) ? 72 : 48;
      calculatedWidth = Math.max(120, charLength * 8.5 + basePadding);
    }

    const sizePresets = {
      sm: { height: 38, innerOffset: 4, fontSize: "12px", iconSize: 13, minWidth: 100 },
      default: { height: 46, innerOffset: 4, fontSize: "14px", iconSize: 16, minWidth: 130 },
      lg: { height: 52, innerOffset: 6, fontSize: "15px", iconSize: 18, minWidth: 160 },
      xl: { height: 60, innerOffset: 6, fontSize: "16px", iconSize: 20, minWidth: 190 },
      icon: { height: 46, innerOffset: 4, fontSize: "14px", iconSize: 16, minWidth: 46 },
      full: { height: 48, innerOffset: 4, fontSize: "14px", iconSize: 16, minWidth: 130 },
    };

    const preset = sizePresets[size] || sizePresets.default;
    const finalWidth = Math.max(preset.minWidth, calculatedWidth);

    return {
      width: finalWidth,
      height: preset.height,
      innerWidth: finalWidth - preset.innerOffset,
      innerHeight: preset.height - preset.innerOffset,
      shaderWidth: finalWidth,
      shaderHeight: preset.height,
      fontSize: preset.fontSize,
      iconSize: preset.iconSize,
    };
  }, [size, isIconButton, width, displayLabel, viewMode, icon]);

  // Variant shader color parameters & themes
  const shaderParams = useMemo(() => {
    switch (variant) {
      case "neon":
        return {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.1,
          u_shiftBlue: 0.8, // Shifts into high-vibrancy DLORENZ electric green / lime
          u_distortion: 0.05,
          u_contour: 0.2,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        };
      case "cyan":
        return {
          u_repetition: 4,
          u_softness: 0.6,
          u_shiftRed: 0.05,
          u_shiftBlue: 0.95,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 30,
          u_scale: 7,
          u_shape: 1,
          u_offsetX: 0.0,
          u_offsetY: 0.0,
        };
      case "gold":
        return {
          u_repetition: 3.5,
          u_softness: 0.5,
          u_shiftRed: 0.7,
          u_shiftBlue: 0.1,
          u_distortion: 0,
          u_contour: 0.1,
          u_angle: 60,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        };
      case "crimson":
        return {
          u_repetition: 4,
          u_softness: 0.4,
          u_shiftRed: 0.9,
          u_shiftBlue: 0.2,
          u_distortion: 0.1,
          u_contour: 0.1,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        };
      case "dark":
      case "outline":
      case "default":
      default:
        return {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        };
    }
  }, [variant]);

  // Variant-specific styling (text, background gradient, glow)
  const variantStyles = useMemo(() => {
    switch (variant) {
      case "neon":
        return {
          textColor: "#4EFE32",
          textShadow: "0px 0px 10px rgba(78, 254, 50, 0.6), 0px 1px 2px rgba(0, 0, 0, 0.8)",
          innerBg: "linear-gradient(180deg, #152213 0%, #080d07 100%)",
          iconColor: "#4EFE32",
          borderAccent: "rgba(78, 254, 50, 0.4)",
        };
      case "cyan":
        return {
          textColor: "#00E5FF",
          textShadow: "0px 0px 10px rgba(0, 229, 255, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.8)",
          innerBg: "linear-gradient(180deg, #0e1c24 0%, #060b0e 100%)",
          iconColor: "#00E5FF",
          borderAccent: "rgba(0, 229, 255, 0.4)",
        };
      case "gold":
        return {
          textColor: "#FCD34D",
          textShadow: "0px 0px 10px rgba(252, 211, 77, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.8)",
          innerBg: "linear-gradient(180deg, #241c10 0%, #0d0a06 100%)",
          iconColor: "#FCD34D",
          borderAccent: "rgba(252, 211, 77, 0.4)",
        };
      case "crimson":
        return {
          textColor: "#FF4D4D",
          textShadow: "0px 0px 10px rgba(255, 77, 77, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.8)",
          innerBg: "linear-gradient(180deg, #241010 0%, #0e0606 100%)",
          iconColor: "#FF4D4D",
          borderAccent: "rgba(255, 77, 77, 0.4)",
        };
      case "outline":
        return {
          textColor: "#E2E8F0",
          textShadow: "0px 1px 2px rgba(0, 0, 0, 0.8)",
          innerBg: "linear-gradient(180deg, #1A1C22 0%, #111216 100%)",
          iconColor: "#A0A6B2",
          borderAccent: "rgba(255, 255, 255, 0.15)",
        };
      case "default":
      default:
        return {
          textColor: "#F1F5F9",
          textShadow: "0px 1px 3px rgba(0, 0, 0, 0.8)",
          innerBg: "linear-gradient(180deg, #22242B 0%, #0D0E12 100%)",
          iconColor: "#4EFE32",
          borderAccent: "rgba(255, 255, 255, 0.12)",
        };
    }
  }, [variant]);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 100px !important;
        }
        @keyframes ripple-animation {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
        if (shaderRef.current) {
          if (shaderMount.current?.destroy) {
            shaderMount.current.destroy();
          }

          shaderMount.current = new ShaderMount(
            shaderRef.current,
            liquidMetalFragmentShader,
            shaderParams,
            undefined,
            0.6,
          );
        }
      } catch (error) {
        console.warn("[LiquidMetalButton] Shader initialization skipped or unsupported:", error);
      }
    };

    loadShader();

    return () => {
      if (shaderMount.current?.destroy) {
        shaderMount.current.destroy();
        shaderMount.current = null;
      }
    };
  }, [shaderParams]);

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(0.6);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (shaderMount.current?.setSpeed) {
      shaderMount.current.setSpeed(2.4);
      setTimeout(() => {
        if (isHovered) {
          shaderMount.current?.setSpeed?.(1);
        } else {
          shaderMount.current?.setSpeed?.(0.6);
        }
      }, 300);
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };

      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.(e);
  };

  const effectiveWidth = fullWidth ? "100%" : `${dimensions.width}px`;

  return (
    <div
      className={cn(
        "relative inline-block select-none",
        fullWidth && "w-full",
        disabled && "opacity-50 pointer-events-none cursor-not-allowed",
        className
      )}
      style={style}
    >
      <div
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        <div
          style={{
            position: "relative",
            width: effectiveWidth,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            transition:
              "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
            transform: "none",
          }}
        >
          {/* Layer 1: Foreground Content & Icons */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${dimensions.height}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              paddingLeft: isIconButton ? "0px" : "16px",
              paddingRight: isIconButton ? "0px" : "16px",
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, gap 0.4s ease",
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {/* Render left icon if present or icon mode */}
            {isIconButton ? (
              icon ? (
                <span style={{ color: variantStyles.iconColor, display: "inline-flex" }}>{icon}</span>
              ) : (
                <Sparkles
                  size={dimensions.iconSize}
                  style={{
                    color: variantStyles.iconColor,
                    filter: "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5))",
                    transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isHovered ? "scale(1.15) rotate(8deg)" : "scale(1)",
                  }}
                />
              )
            ) : (
              <>
                {icon && iconPosition === "left" && (
                  <span
                    style={{
                      color: variantStyles.iconColor,
                      display: "inline-flex",
                      alignItems: "center",
                      transition: "transform 0.3s ease",
                      transform: isHovered ? "translateX(-2px)" : "none",
                    }}
                  >
                    {icon}
                  </span>
                )}
                <span
                  style={{
                    fontSize: dimensions.fontSize,
                    color: variantStyles.textColor,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textShadow: variantStyles.textShadow,
                    transition: "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isPressed ? "scale(0.98)" : "scale(1)",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {displayLabel}
                </span>
                {icon && iconPosition === "right" && (
                  <span
                    style={{
                      color: variantStyles.iconColor,
                      display: "inline-flex",
                      alignItems: "center",
                      transition: "transform 0.3s ease",
                      transform: isHovered ? "translateX(2px)" : "none",
                    }}
                  >
                    {icon}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Layer 2: Core Metal Pill Background with Bevel */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: fullWidth ? "calc(100% - 4px)" : `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: "100px",
                background: variantStyles.innerBg,
                border: `1px solid ${variantStyles.borderAccent}`,
                boxShadow: isPressed
                  ? "inset 0px 2px 4px rgba(0, 0, 0, 0.6), inset 0px 1px 2px rgba(0, 0, 0, 0.5)"
                  : isHovered
                    ? "inset 0px 1px 2px rgba(255, 255, 255, 0.15), 0px 0px 16px rgba(78, 254, 50, 0.15)"
                    : "inset 0px 1px 1px rgba(255, 255, 255, 0.08)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* Layer 3: Shader Liquid Metal Canvas & Ambient Glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${dimensions.height}px`,
              transformStyle: "preserve-3d",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : "translateY(0) scale(1)"}`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                height: `${dimensions.height}px`,
                width: "100%",
                borderRadius: "100px",
                boxShadow: isPressed
                  ? "0px 0px 0px 1px rgba(0, 0, 0, 0.5), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)"
                  : isHovered
                    ? "0px 0px 0px 1px rgba(78, 254, 50, 0.3), 0px 12px 20px 0px rgba(0, 0, 0, 0.4), 0px 4px 8px 0px rgba(78, 254, 50, 0.2)"
                    : "0px 0px 0px 1px rgba(255, 255, 255, 0.06), 0px 8px 16px 0px rgba(0, 0, 0, 0.35)",
                transition:
                  "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease, box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
                background: "rgb(0 0 0 / 0)",
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: "100px",
                  overflow: "hidden",
                  position: "relative",
                  width: "100%",
                  height: `${dimensions.shaderHeight}px`,
                  transition: "width 0.4s ease, height 0.4s ease",
                }}
              />
            </div>
          </div>

          {/* Layer 4: Interactive Trigger & Ripple Surface */}
          <button
            ref={buttonRef}
            id={id}
            type={type}
            disabled={disabled}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => !disabled && setIsPressed(true)}
            onMouseUp={() => !disabled && setIsPressed(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${dimensions.height}px`,
              background: "transparent",
              border: "none",
              cursor: disabled ? "not-allowed" : "pointer",
              outline: "none",
              zIndex: 40,
              transformStyle: "preserve-3d",
              transform: "translateZ(25px)",
              transition:
                "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.4s ease, height 0.4s ease",
              overflow: "hidden",
              borderRadius: "100px",
            }}
            title={title}
            aria-label={ariaLabel || (typeof displayLabel === "string" ? displayLabel : "Button")}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)",
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
