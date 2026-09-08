"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export default function PublicTemplate({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    registerGsap();
    const element = ref.current;
    if (!element) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: 12, scale: 0.992, filter: "blur(5px)" },
        { y: 0, scale: 1, filter: "blur(0px)", duration: 0.62, ease: "power2.out", clearProps: "transform,filter" },
      );
    }, ref);

    return () => context.revert();
  }, []);

  return <div ref={ref} className="route-template">{children}</div>;
}
