"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

// Stylised capybara silhouette — Iberá wetland native
function CapybaraSVG({
  className,
  flipped,
}: {
  className?: string;
  flipped?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 68"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={flipped ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      {/* Body — barrel-shaped */}
      <ellipse cx="72" cy="42" rx="44" ry="22" />
      {/* Head */}
      <ellipse cx="26" cy="33" rx="19" ry="17" />
      {/* Muzzle — capybaras have a distinctive blocky snout */}
      <rect x="6" y="29" width="18" height="15" rx="5" />
      {/* Ear */}
      <ellipse cx="22" cy="16" rx="6" ry="5" />
      {/* Front legs */}
      <rect x="35" y="60" width="9" height="12" rx="4" />
      <rect x="50" y="60" width="9" height="12" rx="4" />
      {/* Back legs */}
      <rect x="88" y="60" width="9" height="12" rx="4" />
      <rect x="103" y="60" width="8" height="12" rx="4" />
      {/* Eye — subtle highlight */}
      <circle cx="18" cy="30" r="3" fill="rgba(255,255,255,0.3)" /> h
    </svg>
  );
}

export default function HeroScene() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const capybaraGroupRef = useRef<HTMLDivElement>(null);
  const capybara1Ref = useRef<HTMLDivElement>(null);
  const capybara2Ref = useRef<HTMLDivElement>(null);
  const capybara3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            bgRef.current,
            overlayRef.current,
            titleLine1Ref.current,
            titleLine2Ref.current,
            subtitleRef.current,
            ctaRef.current,
            scrollIndicatorRef.current,
            capybaraGroupRef.current,
          ],
          { opacity: 1, clearProps: "transform" }
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ── Entry timeline ──────────────────────────────────────────────
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo(
          bgRef.current,
          { scale: 1.18, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2 }
        )
          .fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1.2 },
            0.3
          )
          .fromTo(
            titleLine1Ref.current,
            { y: 80, opacity: 0, skewY: 4 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.1 },
            0.55
          )
          .fromTo(
            titleLine2Ref.current,
            { y: 80, opacity: 0, skewY: 4 },
            { y: 0, opacity: 1, skewY: 0, duration: 1.1 },
            0.75
          )
          .fromTo(
            subtitleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            1.05
          )
          .fromTo(
            ctaRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            1.3
          )
          .fromTo(
            scrollIndicatorRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.6 },
            1.7
          )
          // Capybaras rise from the mist last
          .fromTo(
            capybaraGroupRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" },
            1.9
          );

        // ── Background parallax ─────────────────────────────────────────
        gsap.to(bgRef.current, {
          yPercent: 18,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // ── Content scroll-fade (fromTo + immediateRender:false so
        //    scrubbing back up restores opacity:1 correctly) ─────────────
        gsap.fromTo(
          [
            titleLine1Ref.current,
            titleLine2Ref.current,
            subtitleRef.current,
            ctaRef.current,
          ],
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -40,
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "15% top",
              end: "70% top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── Capybara group scroll-fade ──────────────────────────────────
        gsap.fromTo(
          capybaraGroupRef.current,
          { opacity: 1, yPercent: 0 },
          {
            opacity: 0,
            yPercent: -15,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: heroRef.current,
              start: "18% top",
              end: "60% top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── Individual capybara grazing bob ─────────────────────────────
        const caps = [
          capybara1Ref.current,
          capybara2Ref.current,
          capybara3Ref.current,
        ];
        caps.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            y: -(5 + i * 1.5),
            rotation: i % 2 === 0 ? 1.8 : -1.8,
            duration: 3.2 + i * 1.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 1.3,
          });
        });

        // ── Ambient floating particles ──────────────────────────────────
        const particles = particlesRef.current?.children;
        if (particles) {
          Array.from(particles).forEach((particle, i) => {
            gsap.to(particle, {
              y: "random(-40, 40)",
              x: "random(-20, 20)",
              rotation: "random(-15, 15)",
              duration: "random(5, 9)",
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.4,
            });
          });
        }
      });
    }, heroRef);

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
      ref={heroRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: "#071f17" }}
    >
      {/* Background image with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ opacity: 0 }}
      >
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={95}
        />
      </div>

      {/* Gradient overlays for readability */}
      <div ref={overlayRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#071f17]/80 via-[#0B3D2E]/60 to-[#1A5C3A]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071f17]/40 to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(7,31,23,0.5) 100%)",
          }}
        />
      </div>

      {/* Floating nature particles */}
      <div
        ref={particlesRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        aria-hidden
      >
        <span className="absolute top-[12%] left-[8%] text-5xl opacity-20">🍃</span>
        <span className="absolute top-[25%] right-[15%] text-3xl opacity-15">🌿</span>
        <span className="absolute bottom-[30%] left-[18%] text-4xl opacity-10">🌱</span>
        <span className="absolute top-[55%] right-[8%] text-2xl opacity-15">🍂</span>
        <span className="absolute bottom-[15%] left-[45%] text-3xl opacity-10">🌾</span>
        <span className="absolute top-[40%] left-[60%] text-2xl opacity-[0.08]">✨</span>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Capybara silhouettes — Iberá wetland visitors ─────────────── */}
      {/* Layered in front of particles (z-[3]) but behind the mist
          gradient (z-[4]), so their legs dissolve into the water */}
      <div
        ref={capybaraGroupRef}
        className="absolute bottom-[68px] sm:bottom-20 left-0 right-0 z-[3] pointer-events-none"
        aria-hidden
        style={{ opacity: 0 }}
      >
        {/* Large — foreground left, grazing */}
        <div
          ref={capybara1Ref}
          className="absolute left-[4%] sm:left-[7%] bottom-0"
          style={{ opacity: 0.52 }}
        >
          <CapybaraSVG className="w-24 h-14 sm:w-32 sm:h-[74px] text-[#0a1e14]" />
        </div>

        {/* Medium — foreground right, facing left */}
        <div
          ref={capybara2Ref}
          className="absolute right-[5%] sm:right-[9%] bottom-1"
          style={{ opacity: 0.42 }}
        >
          <CapybaraSVG
            className="w-20 h-12 sm:w-[100px] sm:h-[58px] text-[#0a1e14]"
            flipped
          />
        </div>

        {/* Small — mid-distance center, desktop only */}
        <div
          ref={capybara3Ref}
          className="hidden sm:block absolute left-[42%] bottom-6"
          style={{ opacity: 0.2 }}
        >
          <CapybaraSVG className="w-14 h-8 text-[#142b1e]" />
        </div>
      </div>

      {/* ── Bottom gradient bridge ─────────────────────────────────────
          Fades the hero cleanly into the mission section (#0B3D2E),
          eliminating the hard cut at the scroll boundary.
          z-[4] sits above the capybaras so their legs dissolve into mist. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-64 z-[4] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(11,61,46,0.25) 28%, rgba(7,31,23,0.72) 62%, #071f17 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-container text-center max-w-5xl mx-auto pt-28 pb-20">
        <h1 className="!text-white mb-8" style={{ lineHeight: 1.05 }}>
          <span
            ref={titleLine1Ref}
            className="block will-change-transform"
            style={{ opacity: 0 }}
          >
            Correntinos
          </span>
          <span
            ref={titleLine2Ref}
            className="block text-[var(--dorado)] mt-2 will-change-transform"
            style={{ opacity: 0 }}
          >
            contra el cambio climático
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed will-change-transform"
          style={{ opacity: 0 }}
        >
          Somos una fundación socioambiental de Corrientes que trabaja en toda
          la región del NEA para impulsar acción climática concreta. Promovemos
          la participación ciudadana, fortalecemos la educación ambiental y
          fomentamos el desarrollo de políticas públicas responsables, basadas
          en evidencia científica.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <Link
            href="/quienes-somos"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full bg-[var(--dorado)] text-[var(--verde-profundo)] hover:bg-[var(--dorado-suave)] transition-all duration-400 hover:-translate-y-1 shadow-xl shadow-[var(--dorado)]/20 text-base"
          >
            Conocé nuestra misión
          </Link>
          <Link
            href="/noticias"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border-2 border-white/25 text-white hover:bg-white/10 transition-all duration-400 hover:-translate-y-1 backdrop-blur-sm text-base"
          >
            Últimas noticias →
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        style={{ opacity: 0 }}
      >
        <span className="text-white/40 text-xs tracking-[0.25em] uppercase font-medium">
          Descubrí más
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-white/50 animate-[scrollDown_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
