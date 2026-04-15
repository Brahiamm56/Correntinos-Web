"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Override the y distance in px. Default: 40 */
  distance?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  distance = 40,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          el,
          { y: distance, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            delay: delay / 1000,
            ease: "expo.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el, { opacity: 1, y: 0 });
      });
    }, el);

    return () => ctx.revert();
  }, [delay, distance]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
