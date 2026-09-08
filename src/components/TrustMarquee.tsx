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

    const media = gsap.matchMedia();
    media.add("(min-width: 640px)", () => {
      gsap.set(track, { xPercent: reverse ? -50 : 0 });
      gsap.to(track, {
        xPercent: reverse ? 0 : -50,
        duration: reverse ? 25 : 22,
        ease: "none",
        repeat: -1,
      });
    });
    media.add("(max-width: 639px)", () => {
      gsap.set(track, { xPercent: 0 });
    });

    return () => {
      media.revert();
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
