"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Lightbulb, Lightning, Users } from "reicon-react";
import Link from "next/link";
import CrossfadeImages from "@/components/CrossfadeImages";
import { gsap, registerGsap } from "@/lib/gsap";

const impactAreas = [
  {
    Icon: Lightbulb,
    title: "Concientización",
    description:
      "Estamos convencidos de que para generar los cambios necesarios hacia una sociedad que cuide el ambiente, primero debemos tomar conciencia del impacto de nuestras acciones. Por eso, llevamos adelante distintos programas que buscan concientizar a la ciudadanía y promoverla como agente de cambio.",
    images: [
      { src: "/Concientizacion/concientizacion.jpg", alt: "Educación ambiental y concientización", position: "50% 50%" },
      { src: "/Concientizacion/concientizacion2.png", alt: "Preparación del suelo y agroecología", position: "50% 50%" },
      { src: "/Concientizacion/concientizacion3.png", alt: "Siembra y aprendizaje colectivo", position: "50% 50%" },
    ],
  },
  {
    Icon: Users,
    title: "Participación ciudadana",
    description:
      "Somos un grupo que decidió pasar de la preocupación a la acción. Fomentamos que cada vez más personas puedan involucrarse y ser parte activa de las soluciones que nuestro territorio necesita.",
    image: "/participacion-ciudadana/Participacion-ciudadana.jpg",
  },
  {
    Icon: Lightning,
    title: "Acción climática",
    description:
      "Impulsamos políticas públicas, proyectos y alianzas que protegen el ambiente con una mirada de justicia social y evidencia científica.",
    image: "/accion-climatica/accion-climatica-1.jpg",
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
          if (photo) {
            gsap.fromTo(
              photo,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.1,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="areas-de-impacto" className="border-y border-[var(--border)] bg-white">
      <div className="section-container !py-14 sm:!py-16">
        <div className="grid gap-6 border-b border-[var(--border)] pb-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <span className="section-label">Nuestros pilares</span>
            <h2 className="section-title">La transformación ocurre cuando el conocimiento se vuelve acción.</h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[var(--gris-calido)]">
            Construimos una agenda climática que nace en Corrientes, cuida los ecosistemas del litoral y convoca a quienes quieren participar.
          </p>
        </div>

        <div ref={cardsRef} className="divide-y divide-[var(--border)]">
          {impactAreas.map((area, index) => {
            const Icon = area.Icon;
            const isReversed = index % 2 === 1;
            return (
              <article
                key={area.title}
                data-impact-card
                className="grid gap-8 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center lg:gap-14"
              >
                <div className={`relative aspect-[16/10] overflow-hidden bg-[var(--verde-palido)] ${isReversed ? "lg:order-2" : ""}`}>
                  <div data-impact-photo className="absolute inset-[-7%] will-change-transform">
                    {area.images ? (
                      <CrossfadeImages
                        images={area.images}
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        quality={88}
                        className="h-full w-full"
                      />
                    ) : (
                      <Image
                        src={area.image!}
                        alt={area.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        quality={88}
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className={`max-w-xl ${isReversed ? "lg:order-1" : ""}`}>
                  <Icon size={28} className="text-[var(--verde-hoja)]" />
                  <h3 className="mt-6 text-3xl sm:text-4xl">{area.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-[var(--gris-calido)] sm:text-lg">
                    {area.description}
                  </p>
                </div>
              </article>
            );
          })}
          <div className="pt-8">
            <Link href="/quienes-somos" className="action-link">
              Conocé cómo trabajamos <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
