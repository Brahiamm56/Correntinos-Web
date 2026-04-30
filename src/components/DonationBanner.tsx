"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Heart, Sprout, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

const amounts = [
  { value: "1.000", label: "Un café por la selva", icon: "☕" },
  { value: "5.000", label: "Un árbol nativo", icon: "🌳" },
  { value: "10.000", label: "Un taller en escuela rural", icon: "🏫" },
  { value: "Otro", label: "Elegí tu monto", icon: "✨" },
];

export default function DonationBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Floating heart pulse — always on (subtle)
      if (heartRef.current) {
        gsap.to(heartRef.current, {
          scale: 1.08,
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline reveal
        gsap.fromTo(
          headlineRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        // Cards stagger
        const cardEls =
          cardsRef.current?.querySelectorAll<HTMLElement>(".donate-card");
        if (cardEls && cardEls.length) {
          gsap.fromTo(
            cardEls,
            { y: 40, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "back.out(1.4)",
              stagger: 0.1,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        }

        // CTA reveal
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );

        // Orb parallax
        [orb1Ref.current, orb2Ref.current].forEach((orb, i) => {
          if (!orb) return;
          gsap.to(orb, {
            yPercent: i % 2 === 0 ? -30 : 30,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        });

        // Floating particles
        const particleEls =
          particlesRef.current?.querySelectorAll<HTMLElement>(".dn-particle");
        particleEls?.forEach((el) => {
          const dur = 6 + Math.random() * 6;
          const dx = (Math.random() - 0.5) * 60;
          gsap.to(el, {
            y: -120,
            x: dx,
            opacity: 0,
            duration: dur,
            ease: "sine.inOut",
            repeat: -1,
            delay: Math.random() * dur,
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="donar"
      aria-label="Sumate con tu donación"
      className="relative isolate overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #07251B 0%, var(--verde-profundo) 35%, var(--verde-selva) 75%, var(--verde-hoja) 100%)",
      }}
    >
      {/* Iberá silhouette / topographic SVG backdrop */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="topo" patternUnits="userSpaceOnUse" width="60" height="60">
            <path
              d="M0 30 Q15 10 30 30 T60 30"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1200" height="600" fill="url(#topo)" />
      </svg>

      {/* Glowing parallax orbs */}
      <div
        ref={orb1Ref}
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--dorado) 0%, transparent 65%)",
          opacity: 0.18,
          filter: "blur(60px)",
        }}
      />
      <div
        ref={orb2Ref}
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--verde-menta) 0%, transparent 70%)",
          opacity: 0.22,
          filter: "blur(70px)",
        }}
      />

      {/* Floating particles (leaves / sparks) */}
      <div
        ref={particlesRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="dn-particle absolute block rounded-full bg-[var(--dorado-suave)]"
            style={{
              left: `${(i * 7.3) % 100}%`,
              bottom: `${5 + ((i * 13) % 70)}%`,
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              opacity: 0.6,
              filter: "blur(0.5px)",
              boxShadow: "0 0 12px rgba(232,185,49,0.6)",
            }}
          />
        ))}
      </div>

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-5xl">
          {/* Headline */}
          <div ref={headlineRef} className="text-center">
            <div
              ref={heartRef}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--dorado)] to-[var(--dorado-suave)] shadow-[0_10px_40px_rgba(232,185,49,0.45)]"
            >
              <Heart className="h-8 w-8 fill-[var(--verde-profundo)] text-[var(--verde-profundo)]" />
            </div>
            <span className="text-[var(--dorado-suave)] text-xs font-semibold uppercase tracking-[0.3em]">
              Tu aporte se transforma
            </span>
            <h2 className="mt-4 !text-white">
              Doná hoy. Cuidá Corrientes mañana.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Con un click sostenés programas de educación ambiental,
              reforestación nativa y la protección de los humedales del Iberá.
              Cada peso vuelve al territorio.
            </p>
          </div>

          {/* Amount cards */}
          <div
            ref={cardsRef}
            className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
          >
            {amounts.map((a) => (
              <Link
                key={a.value}
                href="/donaciones"
                className="donate-card group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-5 text-center backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--dorado)]/60 hover:bg-white/[0.12]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-y-full bg-gradient-to-b from-[var(--dorado)]/15 to-transparent transition-transform duration-500 group-hover:translate-y-0"
                />
                <span className="relative z-10 text-3xl">{a.icon}</span>
                <span className="relative z-10 text-2xl font-bold text-white">
                  {a.value === "Otro" ? a.value : `$${a.value}`}
                </span>
                <span className="relative z-10 text-[11px] font-medium uppercase tracking-wider text-white/60">
                  {a.label}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div
            ref={ctaRef}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/donaciones"
              className="group inline-flex items-center gap-2 rounded-full bg-[var(--dorado)] px-8 py-4 text-base font-bold text-[var(--verde-profundo)] shadow-[0_10px_30px_rgba(232,185,49,0.4)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--dorado-suave)] hover:shadow-[0_16px_40px_rgba(232,185,49,0.55)]"
            >
              <Sprout className="h-5 w-5" />
              Quiero donar ahora
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-white/10"
            >
              También podés comprar en la tienda
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-center text-xs uppercase tracking-[0.25em] text-white/40">
            100% destinado al territorio · Reportes públicos · Acción local
          </p>
        </div>
      </div>
    </section>
  );
}
