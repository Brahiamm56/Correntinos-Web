"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const impactAreas = [
  {
    icon: "💡",
    title: "Concientización",
    description:
      "No se puede proteger lo que no se conoce. Por eso, promovemos la educación ambiental y desarrollamos campañas que buscan informar, sensibilizar y generar una conciencia crítica sobre la crisis climática.",
    image: "/education-bg.png",
    color: "#E8B931",
  },
  {
    icon: "🤝",
    title: "Participación ciudadana",
    description:
      "El ambiente es nuestra casa común y su cuidado es una responsabilidad colectiva. A través de programas de voluntariado, impulsamos que más personas se involucren y se conviertan en agentes activos de cambio.",
    image: "/community-bg.png",
    color: "#4CAF6E",
  },
  {
    icon: "⚡",
    title: "Acción climática",
    description:
      "La respuesta a la crisis ambiental es necesariamente colectiva. Trabajamos para exigir el cumplimiento de las normativas vigentes y promover políticas públicas y leyes que garanticen la protección del ambiente.",
    image: "/hero-bg.png",
    color: "#2D7A4F",
  },
];

export default function ImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Header reveal
        gsap.fromTo(
          headerRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        const cards =
          cardsContainerRef.current?.querySelectorAll<HTMLDivElement>(".impact-card");
        if (!cards) return;

        cards.forEach((card) => {
          const image = card.querySelector<HTMLElement>(".impact-image");
          const content = card.querySelector<HTMLElement>(".impact-content");
          const iconEl = card.querySelector<HTMLElement>(".impact-icon");
          const line = card.querySelector<HTMLElement>(".impact-line");
          const number = card.querySelector<HTMLElement>(".impact-number");

          // Reveal timeline
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              once: true,
            },
          });

          tl.fromTo(
            card,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "expo.out" }
          )
            .fromTo(
              image,
              { scale: 1.25, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1.3, ease: "expo.out" },
              0.1
            )
            .fromTo(
              iconEl,
              { scale: 0, rotation: -180 },
              { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.6)" },
              0.3
            )
            .fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.7, ease: "expo.out" },
              0.4
            )
            .fromTo(
              content,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: "expo.out" },
              0.5
            );

          // Scrub: image drifts up (parallax inside the frame)
          if (image) {
            gsap.fromTo(
              image,
              { yPercent: -6 },
              {
                yPercent: 6,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.2,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          // Scrub: giant background number drifts opposite direction
          if (number) {
            gsap.fromTo(
              number,
              { yPercent: 25 },
              {
                yPercent: -25,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.5,
                },
              }
            );
          }
        });
      });
    }, sectionRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 600);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="areas-de-impacto"
      className="relative bg-[var(--crema)] overflow-hidden"
    >
      {/* Background texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--verde-hoja) 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, var(--verde-hoja) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="section-container relative z-10 py-16 sm:py-24">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <span className="section-label justify-center">Nuestros pilares</span>
          <h2 className="mb-4">Nuestros pilares fundamentales</h2>
          <p className="text-[var(--gris-calido)] max-w-xl mx-auto">
            En nuestra fundación entendemos que la acción climática se construye
            sobre tres ejes clave:
          </p>
        </div>

        {/* Impact cards — alternating layout */}
        <div ref={cardsContainerRef} className="space-y-12 sm:space-y-20">
          {impactAreas.map((area, i) => {
            const isEven = i % 2 === 0;

            return (
              <div key={area.title} className="impact-card relative group">
                <div
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-0 items-center`}
                >
                  {/* Image side */}
                  <div className="w-full lg:w-[55%] relative">
                    <div className="relative overflow-hidden rounded-3xl aspect-[16/10] shadow-2xl">
                      <div className="impact-image absolute inset-[-6%] will-change-transform">
                        <Image
                          src={area.image}
                          alt={area.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          quality={80}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                      {/* Giant floating number */}
                      <span
                        className="impact-number absolute bottom-6 right-6 text-[9rem] leading-none font-bold opacity-[0.09] text-white will-change-transform"
                        style={{ fontFamily: "var(--font-heading)" }}
                        aria-hidden
                      >
                        0{i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content side */}
                  <div
                    className={`w-full lg:w-[45%] ${
                      isEven ? "lg:pl-16 xl:pl-20" : "lg:pr-16 xl:pr-20"
                    } relative`}
                  >
                    <div
                      className="impact-icon w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg will-change-transform"
                      style={{
                        background: `linear-gradient(135deg, ${area.color}22, ${area.color}11)`,
                        border: `2px solid ${area.color}33`,
                      }}
                    >
                      {area.icon}
                    </div>

                    <div
                      className="impact-line h-1 w-16 rounded-full mb-6 origin-left will-change-transform"
                      style={{ background: area.color }}
                    />

                    <div className="impact-content will-change-transform">
                      <h3 className="text-2xl sm:text-3xl mb-4">{area.title}</h3>
                      <p className="text-[var(--gris-calido)] text-lg leading-relaxed">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
