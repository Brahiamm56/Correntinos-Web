"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";

export type HeroImage = {
  src: string;
  alt: string;
  position?: string;
};

interface HeroImageCarouselProps {
  images: HeroImage[];
  sizes: string;
}

const HOLD_SECONDS = 5.5;
const FADE_SECONDS = 1.35;

export default function HeroImageCarousel({ images, sizes }: HeroImageCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Array<HTMLImageElement | null>>([]);

  useEffect(() => {
    registerGsap();
    const context = gsap.context(() => {
      const layers = layerRefs.current.filter((layer): layer is HTMLImageElement => Boolean(layer));
      if (!layers.length) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(layers, { autoAlpha: 0, scale: 1.04 });
        gsap.set(layers[0], { autoAlpha: 1, scale: 1 });

        const timeline = gsap.timeline({ repeat: -1 });
        layers.forEach((current, index) => {
          const next = layers[(index + 1) % layers.length];
          timeline
            .to({}, { duration: HOLD_SECONDS })
            .to(current, { autoAlpha: 0, scale: 1.015, duration: FADE_SECONDS, ease: "power2.inOut" })
            .to(next, { autoAlpha: 1, scale: 1, duration: FADE_SECONDS, ease: "power2.inOut" }, "<");
        });

        return () => timeline.kill();
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(layers, { autoAlpha: 0, clearProps: "transform" });
        gsap.set(layers[0], { autoAlpha: 1 });
      });
    }, containerRef);

    return () => context.revert();
  }, [images.length]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {images.map((image, index) => (
        <Image
          key={image.src}
          ref={(node) => { layerRefs.current[index] = node; }}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          quality={90}
          sizes={sizes}
          aria-hidden={index > 0}
          className="hero-image-layer object-cover"
          style={{ objectPosition: image.position }}
        />
      ))}
    </div>
  );
}
