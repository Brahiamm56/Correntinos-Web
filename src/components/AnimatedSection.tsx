"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export default function AnimatedSection({ children, className = "", delay = 0, distance = 22 }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const element = ref.current;
    if (!element) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: distance, scale: 0.985, filter: "blur(7px)", willChange: "transform, filter" },
        {
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.78,
          delay: delay / 1000,
          ease: "power3.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        },
      );
    }, ref);

    return () => context.revert();
  }, [delay, distance]);

  return (
    <div ref={ref} className={`motion-item ${className}`}>
      {children}
    </div>
  );
}
