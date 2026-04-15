"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

interface ParallaxLayerProps {
  children: ReactNode;
  /** Normalized strength. Positive pulls up, negative pushes down. Typical: 0.15–0.6. */
  speed?: number;
  /** Optional rotation in degrees across the viewport. */
  rotate?: number;
  /** Optional scale delta across the viewport. */
  scale?: number;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
}

export default function ParallaxLayer({
  children,
  speed = 0.3,
  rotate = 0,
  scale = 0,
  className,
  style,
  "aria-hidden": ariaHidden,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Only animate on desktop with no reduced-motion preference
    mm.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
      () => {
        const tween = gsap.fromTo(
          el,
          { yPercent: -speed * 25, rotate: -rotate, scale: 1 - scale / 2 },
          {
            yPercent: speed * 25,
            rotate,
            scale: 1 + scale / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
        return () => tween.kill();
      }
    );

    return () => mm.revert();
  }, [speed, rotate, scale]);

  return (
    <div
      ref={ref}
      className={className}
      aria-hidden={ariaHidden}
      style={{ willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
