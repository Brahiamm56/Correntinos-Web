"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

interface TrustMarqueeProps {
  children: ReactNode;
  reverse?: boolean;
}

export default function TrustMarquee({ children, reverse = false }: TrustMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const track = trackRef.current;
    if (!track) return;

    gsap.set(track, { xPercent: reverse ? -50 : 0 });
    const tween = gsap.to(track, {
      xPercent: reverse ? 0 : -50,
      duration: reverse ? 25 : 22,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [reverse]);

  return (
    <div className="trust-marquee">
      <div ref={trackRef} className="trust-marquee-track">
        {children}
      </div>
    </div>
  );
}
