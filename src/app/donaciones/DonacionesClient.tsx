"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { Heart, Sprout, ArrowUpRight, Mail, Phone, ShieldCheck } from "lucide-react";

const tiers = [
  {
    amount: "1.000",
    label: "Brote",
    icon: "🌱",
    desc: "Apadriná un kit de educación ambiental para una escuela rural.",
  },
  {
    amount: "5.000",
    label: "Árbol nativo",
    icon: "🌳",
    desc: "Plantamos un especimen autóctono en zona afectada por incendios.",
  },
  {
    amount: "10.000",
    label: "Taller",
    icon: "🏫",
    desc: "Llevamos un taller climático a una comunidad correntina.",
  },
  {
    amount: "25.000",
    label: "Guardián",
    icon: "🌿",
    desc: "Sostenés un mes completo de monitoreo en humedales del Iberá.",
  },
];

const impactSplit = [
  { pct: 65, label: "Programas en territorio", color: "var(--verde-claro)" },
  { pct: 25, label: "Educación ambiental", color: "var(--dorado)" },
  { pct: 10, label: "Logística y operación", color: "var(--verde-menta)" },
];

export default function DonacionesClient() {
  const sectionRef = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<string>("5.000");
  const [custom, setCustom] = useState<string>("");

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

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
              start: "top 90%",
              once: true,
            },
          }
        );

        const cardEls =
          tiersRef.current?.querySelectorAll<HTMLElement>(".tier-card");
        if (cardEls?.length) {
          gsap.fromTo(
            cardEls,
            { y: 50, opacity: 0, scale: 0.92 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "back.out(1.4)",
              stagger: 0.1,
              scrollTrigger: {
                trigger: tiersRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        }

        // Impact split bars grow on scroll
        const bars = splitRef.current?.querySelectorAll<HTMLElement>(".bar-fill");
        bars?.forEach((bar) => {
          const target = bar.dataset.target ?? "0";
          gsap.fromTo(
            bar,
            { width: "0%" },
            {
              width: `${target}%`,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: {
                trigger: splitRef.current,
                start: "top 80%",
                once: true,
              },
            }
          );
        });

        [orb1Ref.current, orb2Ref.current].forEach((orb, i) => {
          if (!orb) return;
          gsap.to(orb, {
            yPercent: i % 2 === 0 ? -25 : 25,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        });

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

      // Refresh ScrollTrigger
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 600);
      return () => window.clearTimeout(t);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const finalAmount = selected === "Otro" ? custom : selected;

  return (
    <div className="min-h-screen bg-[var(--crema)]">
      {/* ─── HERO BANNER ─── */}
      <section
        ref={sectionRef}
        className="relative isolate overflow-hidden pt-36 pb-24"
        style={{
          background:
            "linear-gradient(135deg, #07251B 0%, var(--verde-profundo) 35%, var(--verde-selva) 75%, var(--verde-hoja) 100%)",
        }}
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="topo-don" patternUnits="userSpaceOnUse" width="60" height="60">
              <path d="M0 30 Q15 10 30 30 T60 30" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#topo-don)" />
        </svg>

        <div
          ref={orb1Ref}
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-32 h-[520px] w-[520px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--dorado) 0%, transparent 65%)",
            opacity: 0.2,
            filter: "blur(60px)",
          }}
        />
        <div
          ref={orb2Ref}
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full"
          style={{
            background: "radial-gradient(circle, var(--verde-menta) 0%, transparent 70%)",
            opacity: 0.25,
            filter: "blur(70px)",
          }}
        />

        <div
          ref={particlesRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="dn-particle absolute block rounded-full bg-[var(--dorado-suave)]"
              style={{
                left: `${(i * 6.4) % 100}%`,
                bottom: `${5 + ((i * 11) % 70)}%`,
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                opacity: 0.6,
                filter: "blur(0.5px)",
                boxShadow: "0 0 12px rgba(232,185,49,0.6)",
              }}
            />
          ))}
        </div>

        <div className="section-container relative z-10 !pt-0 !pb-0">
          <div ref={headlineRef} className="mx-auto max-w-3xl text-center">
            <div
              ref={heartRef}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--dorado)] to-[var(--dorado-suave)] shadow-[0_10px_40px_rgba(232,185,49,0.45)]"
            >
              <Heart className="h-8 w-8 fill-[var(--verde-profundo)] text-[var(--verde-profundo)]" />
            </div>
            <span className="text-[var(--dorado-suave)] text-xs font-semibold uppercase tracking-[0.3em]">
              Tu aporte se transforma
            </span>
            <h1 className="mt-4 !text-white">Doná hoy. Cuidá Corrientes mañana.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Cada peso financia educación ambiental, reforestación nativa y la
              protección de los humedales del Iberá. 100% del aporte vuelve al
              territorio.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TIERS / AMOUNT PICKER ─── */}
      <section className="section-container">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <span className="section-label justify-center">Elegí tu impacto</span>
            <h2>¿Cuánto querés aportar?</h2>
          </div>

          <div ref={tiersRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {tiers.map((t) => {
              const active = selected === t.amount;
              return (
                <button
                  key={t.amount}
                  type="button"
                  onClick={() => setSelected(t.amount)}
                  className={`tier-card group relative flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all duration-300 ${
                    active
                      ? "border-[var(--dorado)] bg-gradient-to-br from-[var(--dorado-claro)] to-white shadow-[0_12px_40px_rgba(232,185,49,0.25)] -translate-y-1"
                      : "border-[var(--border)] bg-white/70 hover:-translate-y-1 hover:border-[var(--verde-claro)] hover:shadow-[0_8px_24px_rgba(11,61,46,0.1)]"
                  }`}
                >
                  <span className="text-3xl">{t.icon}</span>
                  <span className="text-2xl font-bold text-[var(--verde-profundo)]">
                    ${t.amount}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--verde-claro)]">
                    {t.label}
                  </span>
                  <span className="text-xs text-[var(--gris-calido)] leading-snug">
                    {t.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom amount */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-8">
            <button
              type="button"
              onClick={() => setSelected("Otro")}
              className={`px-5 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                selected === "Otro"
                  ? "border-[var(--dorado)] bg-[var(--dorado-claro)] text-[var(--verde-profundo)]"
                  : "border-[var(--border)] bg-white text-[var(--gris-medio)] hover:border-[var(--verde-claro)]"
              }`}
            >
              Otro monto
            </button>
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gris-calido)] font-semibold">
                $
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={100}
                placeholder="Ingresá un monto"
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  setSelected("Otro");
                }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
              />
            </div>
            <Link
              href="/contacto"
              aria-label={`Donar ${finalAmount || ""}`}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--dorado)] px-6 py-3 text-sm font-bold text-[var(--verde-profundo)] shadow-[0_8px_24px_rgba(232,185,49,0.4)] transition-all hover:-translate-y-0.5 hover:bg-[var(--dorado-suave)]"
            >
              <Sprout className="h-4 w-4" />
              Donar {finalAmount && finalAmount !== "Otro" ? `$${finalAmount}` : "ahora"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-xs text-[var(--gris-calido)] mb-12">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--verde-claro)]" />
              Pagos seguros
            </span>
            <span className="inline-flex items-center gap-2">
              <Sprout className="h-4 w-4 text-[var(--verde-claro)]" />
              100% al territorio
            </span>
            <span className="inline-flex items-center gap-2">
              <Heart className="h-4 w-4 text-[var(--dorado)]" />
              Reportes públicos
            </span>
          </div>
        </div>
      </section>

      {/* ─── IMPACT SPLIT ─── */}
      <section className="section-container !pt-0">
        <div className="mx-auto max-w-4xl">
          <div className="glass-card p-8 md:p-12">
            <div className="text-center mb-8">
              <span className="section-label justify-center">Transparencia</span>
              <h2>¿Cómo se usa tu donación?</h2>
            </div>
            <div ref={splitRef} className="space-y-5">
              {impactSplit.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-semibold text-[var(--verde-profundo)]">
                      {item.label}
                    </span>
                    <span className="font-bold text-[var(--verde-hoja)]">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--verde-palido)]">
                    <div
                      className="bar-fill h-full rounded-full"
                      data-target={String(item.pct)}
                      style={{
                        background: `linear-gradient(90deg, ${item.color}, var(--verde-claro))`,
                        width: 0,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── ALTERNATIVE CONTACT ─── */}
      <section className="section-container">
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-8 md:p-10 text-center">
            <h3 className="mb-3">¿Preferís coordinar tu donación?</h3>
            <p className="text-[var(--gris-calido)] mb-6 mx-auto">
              Escribinos directamente y te ayudamos a hacer tu aporte por
              transferencia, alianza con tu empresa o donaciones en especie.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto">
              <a
                href="mailto:correntinosclim@gmail.com"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--verde-palido)] border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--verde-profundo)] hover:bg-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                correntinosclim@gmail.com
              </a>
              <a
                href="https://wa.me/543794059015"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[var(--verde-palido)] border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--verde-profundo)] hover:bg-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                +54 379 405 9015
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
