"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";

interface NoticiaPreview {
  id: string;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
}

interface Props {
  noticias: NoticiaPreview[];
  total: number;
}

const PER_PAGE = 6;
const FALLBACK_COVERS = ["/hero-bg.png", "/education-bg.png", "/research-bg.png", "/community-bg.png"];

export default function NoticiasClient({ noticias, total }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1, 1 + page * PER_PAGE);
  const hasMore = filtered.length > 1 + rest.length;

  function excerpt(html: string) {
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return text.length > 150 ? text.slice(0, 150) + "..." : text;
  }

  const resultsLabel = search
    ? `${filtered.length} resultado${filtered.length === 1 ? "" : "s"} para \"${search}\"`
    : `${total} noticia${total === 1 ? "" : "s"} publicada${total === 1 ? "" : "s"}`;

  return (
    <div className="min-h-screen bg-[var(--crema)]">
      <section
        className="relative pt-28 pb-20 overflow-hidden"
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
              Noticias
            </span>
            <h1 className="!text-white mb-4">
              Noticias y <span className="text-[var(--dorado)]">Novedades</span>
            </h1>
            <p className="text-base text-white/65 leading-relaxed mx-auto">
              Mantenete informado sobre nuestros proyectos, investigaciones y acciones climáticas.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative bg-[var(--crema)]">
        <div className="section-container !pt-0 !pb-0">
          <AnimatedSection>
            <div className="relative -mt-10 rounded-[28px] border border-[var(--border)] bg-white/80 px-5 py-5 shadow-[0_28px_90px_rgba(11,61,46,0.08)] backdrop-blur-md sm:px-6 sm:py-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--verde-hoja)]/70 mb-1">
                    Archivo vivo
                  </p>
                  <h2 className="text-xl sm:text-2xl">Todas las noticias publicadas</h2>
                  <p className="text-sm text-[var(--gris-calido)] mt-1">{resultsLabel}</p>
                </div>

                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gris-calido)]" />
                  <input
                    type="text"
                    placeholder="Buscar noticia por título..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-xl border-2 border-[var(--border)] bg-white pl-10 pr-4 py-3 text-sm transition-colors focus:border-[var(--verde-claro)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-[var(--crema)]">
        <div className="section-container !pt-8 !pb-20">
        {filtered.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-20">
                <p className="text-4xl mb-4">📰</p>
                <p className="text-[var(--gris-calido)]">No se encontraron noticias.</p>
              </div>
            </AnimatedSection>
        ) : (
          <>
            <div className="space-y-4">
              {featured && (
                <AnimatedSection>
                  <Link
                    href={`/noticias/${featured.id}`}
                    className="group block relative overflow-hidden rounded-2xl"
                    style={{ minHeight: 400 }}
                  >
                    <Image
                      src={featured.imagen_url ?? FALLBACK_COVERS[0]}
                      alt={featured.titulo}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1280px) 100vw, 1280px"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/90 via-[#0B3D2E]/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
                      <div className="flex gap-2 flex-wrap mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm border border-white/20">
                          noticias
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm border border-white/20">
                          fundacion
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm border border-white/20">
                          corrientes
                        </span>
                      </div>
                      <h2 className="!text-white text-2xl sm:text-3xl md:text-4xl mb-2 max-w-2xl leading-tight">
                        {featured.titulo}
                      </h2>
                      <p className="text-white/70 text-sm sm:text-base line-clamp-2 max-w-xl mb-4">
                        {excerpt(featured.contenido)}
                      </p>
                      <div className="flex items-center gap-4">
                        <time className="text-white/50 text-xs">
                          {featured.fecha_publicacion
                            ? new Date(featured.fecha_publicacion).toLocaleDateString("es-AR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Sin fecha de publicación"}
                        </time>
                        <span className="text-xs font-semibold text-[var(--dorado)] group-hover:translate-x-1 transition-transform duration-300">
                          Leer artículo →
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((noticia, i) => {
                    const cover =
                      noticia.imagen_url ??
                      FALLBACK_COVERS[(i + 1) % FALLBACK_COVERS.length];

                    return (
                      <AnimatedSection key={noticia.id} delay={i * 80}>
                        <Link
                          href={`/noticias/${noticia.id}`}
                          className="group block relative overflow-hidden rounded-xl"
                          style={{ minHeight: 280 }}
                        >
                          <Image
                            src={cover}
                            alt={noticia.titulo}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            quality={75}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/88 via-[#0B3D2E]/35 to-transparent" />

                          <div className="absolute inset-0 flex flex-col justify-end p-5">
                            <div className="flex gap-1.5 flex-wrap mb-2">
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/85 backdrop-blur-sm border border-white/20">
                                noticias
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/85 backdrop-blur-sm border border-white/20">
                                corrientes
                              </span>
                            </div>
                            <h3 className="!text-white text-base font-bold leading-snug mb-1.5 line-clamp-2">
                              {noticia.titulo}
                            </h3>
                            <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-3">
                              {excerpt(noticia.contenido)}
                            </p>
                            <div className="flex items-center justify-between">
                              <time className="text-white/45 text-[11px]">
                                {noticia.fecha_publicacion
                                  ? new Date(noticia.fecha_publicacion).toLocaleDateString("es-AR", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Sin fecha"}
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

            {hasMore && (
              <div className="text-center mt-10">
                <button onClick={() => setPage((p) => p + 1)} className="btn-secondary">
                  Cargar más noticias
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </section>
    </div>
  );
}
