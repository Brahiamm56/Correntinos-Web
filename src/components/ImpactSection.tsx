"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Lightbulb, Lightning, Users } from "reicon-react";
import Link from "next/link";
import CrossfadeImages from "@/components/CrossfadeImages";
import { gsap, registerGsap } from "@/lib/gsap";

const impactAreas = [
  {
    Icon: Lightbulb,
    title: "Concientización",
    description: "Junto a la Fundación Marandé trabajamos en un taller de huerta comunitaria para aprender y compartir herramientas de agroecología. Primero armamos una compostera y conversamos sobre cómo aprovechar los residuos orgánicos; después preparamos el suelo desde cero, acondicionamos la tierra y realizamos la siembra. Seguimos acompañando este proceso como un espacio de educación ambiental, aprendizaje colectivo y trabajo comunitario.",
    images: [
      { src: "/concientizacion1.png", alt: "Taller de huerta comunitaria en la Fundación Marandé", position: "50% 50%" },
      { src: "/concientizacion2.png", alt: "Preparación del suelo para la huerta comunitaria", position: "50% 50%" },
      { src: "/concientizacion3.png", alt: "Siembra en el taller de huerta comunitaria", position: "50% 50%" },
    ],
  },
  {
    Icon: Users,
    title: "Participación ciudadana",
    description: "Acompañamos a personas y organizaciones que quieren involucrarse, construir redes y ser parte activa de las soluciones que el territorio necesita.",
  },
  {
    Icon: Lightning,
    title: "Acción climática",
    description: "Impulsamos políticas públicas, proyectos y alianzas que protegen el ambiente con una mirada de justicia social y evidencia científica.",
  },
];

export default function ImpactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = cardsRef.current?.querySelectorAll<HTMLElement>("[data-impact-card]");
        cards?.forEach((card) => {
          const photo = card.querySelector<HTMLElement>("[data-impact-photo]");
          if (photo) gsap.fromTo(photo, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1.1, invalidateOnRefresh: true } });
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return <section ref={sectionRef} id="areas-de-impacto" className="border-y border-[var(--border)] bg-white">
    <div className="section-container !py-14 sm:!py-16">
      <div className="grid gap-6 border-b border-[var(--border)] pb-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div><span className="section-label">Nuestros pilares</span><h2 className="section-title">La transformación ocurre cuando el conocimiento se vuelve acción.</h2></div>
        <p className="self-end text-lg leading-relaxed text-[var(--gris-calido)]">Construimos una agenda climática que nace en Corrientes, cuida los ecosistemas del litoral y convoca a quienes quieren participar.</p>
      </div>

      <div ref={cardsRef}>
        {impactAreas.map((area, index) => {
          const Icon = area.Icon;
          if (index === 0) {
            return <article key={area.title} data-impact-card className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-end lg:gap-14">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--verde-palido)]"><div data-impact-photo className="absolute inset-[-7%] will-change-transform"><CrossfadeImages images={area.images ?? []} sizes="(max-width: 1024px) 100vw, 65vw" quality={88} className="h-full w-full" /></div></div>
              <div className="max-w-xl border-t border-[var(--border-strong)] pt-6"><Icon size={28} className="text-[var(--verde-hoja)]" /><h3 className="mt-6 text-3xl sm:text-4xl">{area.title}</h3><p className="mt-5 text-base leading-relaxed text-[var(--gris-calido)] sm:text-lg">{area.description}</p></div>
            </article>;
          }
          return <article key={area.title} data-impact-card className="grid gap-5 border-t border-[var(--border)] py-8 sm:grid-cols-[3rem_minmax(0,1fr)] lg:py-10">
            <Icon size={28} className="text-[var(--verde-hoja)]" />
            <div className="max-w-3xl"><h3 className="text-2xl sm:text-3xl">{area.title}</h3><p className="mt-3 leading-relaxed text-[var(--gris-calido)] sm:text-lg">{area.description}</p></div>
          </article>;
        })}
        <Link href="/quienes-somos" className="action-link mt-4">Conocé cómo trabajamos <ArrowRight size={17} /></Link>
      </div>
    </div>
  </section>;
}
