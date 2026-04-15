"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export default function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const bar = barRef.current;
    if (!bar) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const setter = gsap.quickSetter(bar, "scaleX");

      const update = () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setter(docHeight > 0 ? scrollTop / docHeight : 0);
      };

      window.addEventListener("scroll", update, { passive: true });
      update();
      return () => window.removeEventListener("scroll", update);
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (bar) bar.style.display = "none";
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        ref={barRef}
        className="h-full origin-left will-change-transform"
        style={{
          background:
            "linear-gradient(90deg, var(--verde-hoja), var(--dorado))",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}
