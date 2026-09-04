"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowDown, ArrowRight } from "reicon-react";
import CrossfadeImages from "@/components/CrossfadeImages";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const communityHeroImages = [
  { src: "/hero-section/imagen-hero1.jpg", alt: "Acción ambiental comunitaria en Corrientes", position: "50% 50%" },
  { src: "/hero-section/imagen-hero2.jpg", alt: "Cumbre Climática de las Juventudes LCOY", position: "50% 50%" },
  { src: "/hero-section/imagen-hero3.jpeg", alt: "Educación ambiental y talleres participativos", position: "50% 50%" },
  { src: "/hero-section/imagen-hero4.jpg", alt: "Comunidad en defensa del Parque Caraguatá", position: "50% 50%" },
];

export default function HeroScene({ intro }: { intro?: string }) {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(imageRef.current, {
          yPercent: 8,
          scale: 1.03,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.1, invalidateOnRefresh: true },
        });
        gsap.to(contentRef.current, {
          yPercent: -8,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: heroRef.current, start: "52% top", end: "bottom top", scrub: 0.8, invalidateOnRefresh: true },
        });
      });
    }, heroRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative isolate flex min-h-[44rem] items-end overflow-hidden bg-[#0a2f23] sm:min-h-[50rem] lg:min-h-[min(58rem,94svh)]">
      <div ref={imageRef} className="absolute inset-x-[-5%] bottom-[-4%] top-[-8%] will-change-transform">
        <CrossfadeImages
          images={communityHeroImages}
          eagerFirst
          quality={95}
          sizes="100vw"
          intervalSeconds={5.5}
          className="h-full w-full"
          imageClassName="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-[#071f17]/68" />

      <div ref={contentRef} className="section-container relative z-10 w-full !pb-14 !pt-32 sm:!pb-20 sm:!pt-40">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em] text-white/65">Corrientes · Argentina</p>
          <h1 className="!text-white">Correntinos</h1>
          <p className="mt-3 text-2xl leading-tight text-[var(--dorado-suave)] sm:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>contra el cambio climático</p>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">{intro ?? "Somos una fundación socioambiental que transforma conocimiento, participación y alianzas en acción climática concreta para Corrientes y el NEA."}</p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Link href="#areas-de-impacto" className="group inline-flex w-fit items-center gap-3 border-b-2 border-[var(--dorado)] pb-2 text-sm font-bold text-[var(--dorado-suave)] transition-colors hover:border-white hover:text-white">
              Conocé nuestro trabajo <ArrowDown size={19} className="transition-transform duration-300 group-hover:translate-y-1" />
            </Link>
            <Link href="#ultimas-noticias" className="group inline-flex w-fit items-center gap-3 border-b-2 border-white/35 pb-2 text-sm font-bold text-white transition-colors hover:border-[var(--dorado)] hover:text-[var(--dorado-suave)]">
              Ver últimas noticias <ArrowDown size={19} className="transition-transform duration-300 group-hover:translate-y-1" />
            </Link>
            <Link href="/trabaja-con-nosotros" className="group inline-flex w-fit items-center gap-3 border-b-2 border-white/35 pb-2 text-sm font-bold text-white transition-colors hover:border-[var(--dorado)] hover:text-[var(--dorado-suave)]">
              Sumate a la comunidad <ArrowRight size={19} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
