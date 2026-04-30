"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";

export default function HeroScene() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleLine1Ref = useRef<HTMLSpanElement>(null);
  const titleLine2Ref = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);

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
          ],
          { opacity: 1, clearProps: "transform" }
        );
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // -- Entry timeline ------------------------------------------
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
          );

        // -- Background parallax -------------------------------------
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

        // -- Content scroll-fade ------------------------------------
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

        // -- Mist drift ----------------------------------------------
        if (mistRef.current) {
          gsap.to(mistRef.current, {
            xPercent: 6,
            duration: 7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }

        // -- Ambient floating particles ------------------------------
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
      style={{ background: "#071f17", perspective: "1200px" }}
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
        <span className="absolute top-[12%] left-[8%] text-5xl opacity-20">??</span>
        <span className="absolute top-[25%] right-[15%] text-3xl opacity-15">??</span>
        <span className="absolute bottom-[30%] left-[18%] text-4xl opacity-10">??</span>
        <span className="absolute top-[55%] right-[8%] text-2xl opacity-15">??</span>
        <span className="absolute bottom-[15%] left-[45%] text-3xl opacity-10">??</span>
        <span className="absolute top-[40%] left-[60%] text-2xl opacity-[0.08]">?</span>
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

      {/* -- Wetland mist layer behind capybaras -------------------- */}
      <div
        ref={mistRef}
        aria-hidden
        className="absolute bottom-[40px] sm:bottom-[60px] left-[-10%] right-[-10%] h-40 z-[3] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(168,230,195,0.18) 0%, rgba(168,230,195,0.06) 50%, transparent 80%)",
          filter: "blur(12px)",
        }}
      />

      {/* -- Capybaras removed ------------------------------------- */}

      {/* -- Bottom gradient bridge -----------------------------------
          Smoothly fades the hero into the next section. */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-96 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(11,61,46,0.12) 18%, rgba(7,31,23,0.4) 42%, rgba(7,31,23,0.72) 68%, rgba(7,31,23,0.92) 90%, #071f17 100%)",
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
    </section>
  );
}
