import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Últimas noticias y novedades de la Fundación Correntinos Contra el Cambio Climático.",
};

const FALLBACK_COVERS = ["/hero-bg.png", "/education-bg.png", "/research-bg.png", "/community-bg.png", "/forest-bg.png"];

export default function BlogPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      {/* ─── HERO ─── */}
      <section
        className="relative pt-28 pb-14 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #071f17 0%, #0B3D2E 45%, #1A5C3A 100%)",
        }}
      >
        <div
          aria-hidden
          className="absolute top-[20%] left-[15%] w-[380px] h-[380px] rounded-full bg-[var(--dorado)] opacity-[0.05] blur-[90px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-[10%] w-[260px] h-[260px] rounded-full bg-[var(--verde-menta)] opacity-[0.07] blur-[70px] pointer-events-none"
        />
        <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
          <AnimatedSection>
            <span className="section-label justify-center !text-[var(--dorado-suave)]">
              Blog
            </span>
            <h1 className="!text-white mb-4">
              Noticias y{" "}
              <span className="text-[var(--dorado)]">Novedades</span>
            </h1>
            <p className="text-base text-white/65 leading-relaxed mx-auto">
              Seguí de cerca nuestras acciones, investigaciones y el estado del
              medio ambiente en Corrientes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── POSTS ─── */}
      <section className="bg-[var(--crema)]">
        <div className="section-container !pt-10 !pb-20">
          {posts.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-16">
                <span className="text-5xl mb-4 block">📰</span>
                <h2 className="text-2xl mb-3">Próximamente</h2>
                <p className="text-[var(--gris-calido)]">
                  Estamos preparando contenido. ¡Volvé pronto!
                </p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="space-y-4">
              {/* ─ Featured: full-width tall card ─ */}
              {featured && (
                <AnimatedSection>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group block relative overflow-hidden rounded-2xl"
                    style={{ minHeight: 400 }}
                  >
                    {/* Background image */}
                    <Image
                      src={featured.meta.cover ?? FALLBACK_COVERS[0]}
                      alt={featured.meta.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      priority
                      quality={85}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/90 via-[#0B3D2E]/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                      <div className="flex gap-2 flex-wrap mb-3">
                        {featured.meta.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm border border-white/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h2 className="!text-white text-2xl sm:text-3xl md:text-4xl mb-2 max-w-2xl leading-tight">
                        {featured.meta.title}
                      </h2>
                      <p className="text-white/70 text-sm sm:text-base line-clamp-2 max-w-xl mb-4">
                        {featured.meta.excerpt}
                      </p>
                      <div className="flex items-center gap-4">
                        <time className="text-white/50 text-xs">
                          {new Date(featured.meta.date).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        <span className="text-xs font-semibold text-[var(--dorado)] group-hover:translate-x-1 transition-transform duration-300">
                          Leer artículo →
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              )}

              {/* ─ Rest: 3-column grid ─ */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((post, i) => {
                    const cover = post.meta.cover ?? FALLBACK_COVERS[(i + 1) % FALLBACK_COVERS.length];
                    return (
                      <AnimatedSection key={post.slug} delay={i * 80}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group block relative overflow-hidden rounded-xl"
                          style={{ minHeight: 280 }}
                        >
                          <Image
                            src={cover}
                            alt={post.meta.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={75}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/88 via-[#0B3D2E]/35 to-transparent" />

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
                            <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-3">
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
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
