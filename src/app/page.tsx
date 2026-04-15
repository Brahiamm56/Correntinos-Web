import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import HeroScene from "@/components/HeroScene";
import ImpactSection from "@/components/ImpactSection";
import ParallaxLayer from "@/components/ParallaxLayer";
import StatsCounter from "@/components/StatsCounter";
import { getAllPosts } from "@/lib/posts";

const stats = [
  { value: 500, suffix: "+", label: "Estudiantes alcanzados", icon: "🌱" },
  { value: 12, suffix: "", label: "Escuelas rurales", icon: "🏫" },
  { value: 3, suffix: "", label: "Investigaciones activas", icon: "🔬" },
  { value: 1, suffix: "ra", label: "Fundación climática de Corrientes", icon: "⭐" },
];

export default function HomePage() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroScene />

      {/* ─── MISSION STATEMENT ─── */}
      <section
        id="mision"
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0B3D2E 0%, #1A5C3A 8%, #2D7A4F 18%, var(--verde-palido) 48%, var(--crema) 100%)",
        }}
      >
        {/* Forest silhouette bridging the hero — parallaxes down */}
        <ParallaxLayer
          speed={0.25}
          aria-hidden
          className="absolute -top-10 left-0 right-0 h-72 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(11,61,46,0.55) 0%, transparent 70%)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>

        {/* Soft grid texture (matches hero) to extend the mood */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-80 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,0.9) 0%, transparent 100%)",
          }}
        />

        {/* Decorative parallax blobs */}
        <ParallaxLayer
          speed={0.4}
          aria-hidden
          className="absolute top-[30%] -left-24 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--verde-menta) 0%, transparent 65%)",
            opacity: 0.45,
            filter: "blur(60px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>
        <ParallaxLayer
          speed={-0.3}
          aria-hidden
          className="absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--dorado-claro) 0%, transparent 65%)",
            opacity: 0.5,
            filter: "blur(70px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>

        {/* Ambient floating leaves, gently parallaxing */}
        <ParallaxLayer
          speed={-0.5}
          rotate={8}
          aria-hidden
          className="absolute top-[18%] right-[10%] text-5xl pointer-events-none select-none"
          style={{ opacity: 0.12 }}
        >
          🍃
        </ParallaxLayer>
        <ParallaxLayer
          speed={0.6}
          rotate={-6}
          aria-hidden
          className="absolute bottom-[12%] left-[12%] text-4xl pointer-events-none select-none"
          style={{ opacity: 0.14 }}
        >
          🌿
        </ParallaxLayer>

        <div className="section-container relative z-10 pt-40 sm:pt-48">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <span className="section-label justify-center">
                Nuestra Razón de Ser
              </span>
              <h2 className="mb-6">
                Acción climática local para un impacto global
              </h2>
              <p className="text-lg text-[var(--gris-calido)] leading-relaxed mx-auto">
                Corrientes es una de las provincias más vulnerables al cambio
                climático en Argentina. Sus humedales, su biodiversidad y sus
                comunidades rurales están en la primera línea del impacto. Desde
                la fundación, creemos que la solución empieza aquí, con nosotros,
                con vos.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── IMPACT AREAS (parallax alternating layout) ─── */}
      <ImpactSection />

      {/* ─── STATS ─── */}
      <section
        id="impacto-numeros"
        className="relative bg-white overflow-hidden"
      >
        <ParallaxLayer
          speed={0.5}
          aria-hidden
          className="absolute -top-20 right-[8%] w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--verde-palido) 0%, transparent 70%)",
            opacity: 0.7,
            filter: "blur(40px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>
        <ParallaxLayer
          speed={-0.3}
          aria-hidden
          className="absolute bottom-10 left-[6%] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--dorado-claro) 0%, transparent 70%)",
            opacity: 0.5,
            filter: "blur(50px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>

        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="section-label justify-center">
                Nuestro Impacto
              </span>
              <h2>Números que hablan</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 120}>
                <div className="glass-card p-8 text-center flex flex-col items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{
                      background: "linear-gradient(135deg, var(--verde-palido), var(--dorado-claro))",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div>
                    <StatsCounter value={stat.value} suffix={stat.suffix} />
                    <p className="text-sm text-[var(--gris-calido)] mt-1.5 font-medium leading-snug max-w-[12ch] mx-auto">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LATEST NEWS ─── */}
      <section
        id="ultimas-noticias"
        className="relative bg-[var(--crema)] overflow-hidden"
      >
        <ParallaxLayer
          speed={0.4}
          rotate={6}
          aria-hidden
          className="absolute top-10 -right-24 w-[360px] h-[360px] rounded-[40%] pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, var(--verde-palido), transparent)",
            opacity: 0.6,
            filter: "blur(30px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>

        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="mb-12">
              <span className="section-label">Noticias</span>
              <h2>Últimas novedades</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {latestPosts.map((post, i) => {
              const cover = post.meta.cover ?? ["/hero-bg.png", "/education-bg.png", "/research-bg.png"][i % 3];
              return (
                <AnimatedSection key={post.slug} delay={i * 100}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block relative overflow-hidden rounded-2xl"
                    style={{ minHeight: 320 }}
                  >
                    <Image
                      src={cover}
                      alt={post.meta.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/90 via-[#0B3D2E]/35 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <div className="flex gap-1.5 flex-wrap mb-2">
                        {post.meta.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/85 backdrop-blur-sm border border-white/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="!text-white text-base font-bold leading-snug mb-1.5 line-clamp-2">
                        {post.meta.title}
                      </h3>
                      <p className="text-white/60 text-xs line-clamp-2 mb-3">
                        {post.meta.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <time className="text-white/45 text-[11px]">
                          {new Date(post.meta.date).toLocaleDateString("es-AR", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                        <span className="text-[11px] font-semibold text-[var(--dorado)] group-hover:translate-x-0.5 transition-transform duration-300">
                          Leer →
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection>
            <div className="text-center mt-10">
              <Link href="/blog" className="btn-secondary">
                Ver todas las noticias →
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        id="cta-principal"
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--verde-profundo) 0%, var(--verde-selva) 50%, var(--verde-hoja) 100%)",
        }}
      >
        {/* Parallax decorative orbs */}
        <ParallaxLayer
          speed={0.45}
          aria-hidden
          className="absolute -top-40 -right-32 w-[460px] h-[460px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--dorado) 0%, transparent 65%)",
            opacity: 0.12,
            filter: "blur(50px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>
        <ParallaxLayer
          speed={-0.35}
          scale={0.15}
          aria-hidden
          className="absolute -bottom-28 -left-24 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--verde-menta) 0%, transparent 70%)",
            opacity: 0.18,
            filter: "blur(50px)",
          }}
        >
          <span className="sr-only" />
        </ParallaxLayer>

        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-white mb-6">
                El cambio empieza con una decisión
              </h2>
              <p className="text-lg text-white/70 mb-10 mx-auto">
                Sumate a la fundación. Ya sea como voluntario, colaborador o
                difundiendo nuestra causa, tu participación genera impacto real
                en la lucha contra el cambio climático en Corrientes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/trabaja-con-nosotros"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full bg-[var(--dorado)] text-[var(--verde-profundo)] hover:bg-[var(--dorado-suave)] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  Quiero sumarme
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                >
                  Contactanos
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
