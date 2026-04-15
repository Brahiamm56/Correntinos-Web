"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

interface StatsCounterProps {
  value: number;
  suffix?: string;
}

export default function StatsCounter({ value, suffix = "" }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => {
            numEl.textContent = Math.floor(counter.val).toString();
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        numEl.textContent = value.toString();
      });
    }, el);

    return () => ctx.revert();
  }, [value]);

  return (
    <div ref={ref} className="inline-block">
      <span
        className="text-4xl sm:text-5xl font-bold text-[var(--verde-profundo)] tabular-nums"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <span ref={numRef}>0</span>
        <span className="text-[var(--dorado)]">{suffix}</span>
      </span>
    </div>
  );
}
