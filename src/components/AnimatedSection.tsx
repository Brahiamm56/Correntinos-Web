"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}

export default function AnimatedSection({ children, className = "", delay = 0, distance = 22 }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("motion-observer-ready");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      window.setTimeout(() => setIsVisible(true), 0);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const motionStyle = {
    "--motion-delay": `${delay}ms`,
    "--motion-distance": `${distance}px`,
  } as CSSProperties;

  return (
    <div ref={ref} className={`motion-item ${isVisible ? "is-visible" : ""} ${className}`} style={motionStyle}>
      {children}
    </div>
  );
}
