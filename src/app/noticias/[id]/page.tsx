import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import ReadingProgress from "@/components/ReadingProgress";
import {
  getNoticiaExcerpt,
  getPublishedNoticia,
  getPublishedNoticias,
} from "@/lib/noticias";

const fallbackRelatedCovers = ["/hero-bg.png", "/education-bg.png", "/research-bg.png"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const noticia = await getPublishedNoticia(id);

  if (!noticia) return { title: "Noticia no encontrada" };

  return {
    title: noticia.titulo,
    description: getNoticiaExcerpt(noticia.contenido, 160),
    openGraph: {
      title: noticia.titulo,
      description: getNoticiaExcerpt(noticia.contenido, 160),
      type: "article",
      publishedTime: noticia.fecha_publicacion ?? undefined,
      images: noticia.imagen_url ? [{ url: noticia.imagen_url }] : [],
    },
  };
}

export default async function NoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const noticia = await getPublishedNoticia(id);

  if (!noticia) notFound();

  const relatedNoticias = await getPublishedNoticias({ excludeId: id, limit: 3 });

  return (
    <>
      <ReadingProgress />

      <section className="relative pt-32 pb-16 overflow-hidden min-h-[420px] flex items-end">
        {noticia.imagen_url ? (
          <>
            <Image
              src={noticia.imagen_url}
              alt={noticia.titulo}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/95 via-[#0B3D2E]/65 to-[#0B3D2E]/30" />
          </>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, #071f17 0%, #0B3D2E 40%, #1A5C3A 100%)",
            }}
          />
        )}

        <div
          aria-hidden
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full bg-[var(--dorado)] opacity-[0.05] blur-[80px] pointer-events-none"
        />

        <div className="section-container relative z-10 max-w-4xl mx-auto w-full pb-2">
          <AnimatedSection>
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
            >
              ← Volver a noticias
            </Link>

            <div className="flex gap-2 flex-wrap mb-4">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/12 text-[var(--dorado-suave)] border border-white/15 backdrop-blur-sm">
                noticias
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/12 text-[var(--dorado-suave)] border border-white/15 backdrop-blur-sm">
                correntinos
              </span>
            </div>

            <h1 className="!text-white !text-3xl sm:!text-4xl mb-6 leading-tight max-w-4xl">
              {noticia.titulo}
            </h1>

            <div className="flex items-center gap-4 text-sm text-white/50 flex-wrap">
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[var(--verde-hoja)] flex items-center justify-center text-xs text-white font-bold">
                  E
                </span>
                Equipo Correntinos
              </span>
              {noticia.fecha_publicacion && (
                <time>
                  {new Date(noticia.fecha_publicacion).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-container max-w-3xl mx-auto">
          <AnimatedSection>
            <article
              className="prose"
              dangerouslySetInnerHTML={{ __html: noticia.contenido }}
            />
          </AnimatedSection>

          <div className="mt-14 pt-8 border-t border-[var(--border)]">
            <Link href="/noticias" className="btn-secondary text-sm py-2.5 px-5">
              ← Ver todas las noticias
            </Link>
          </div>
        </div>
      </section>

      {relatedNoticias.length > 0 && (
        <section className="bg-[var(--crema)]">
          <div className="section-container !pt-12 !pb-16">
            <AnimatedSection>
              <h2 className="text-xl mb-8">Seguí leyendo</h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedNoticias.map((relatedNoticia, index) => {
                const cover =
                  relatedNoticia.imagen_url ??
                  fallbackRelatedCovers[index % fallbackRelatedCovers.length];

                return (
                  <AnimatedSection key={relatedNoticia.id} delay={index * 80}>
                    <Link
                      href={`/noticias/${relatedNoticia.id}`}
                      className="group block relative overflow-hidden rounded-xl"
                      style={{ minHeight: 220 }}
                    >
                      <Image
                        src={cover}
                        alt={relatedNoticia.titulo}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071f17]/88 via-[#0B3D2E]/30 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <div className="flex gap-1.5 flex-wrap mb-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white/85 border border-white/20">
                            noticias
                          </span>
                        </div>
                        <h3 className="!text-white text-sm font-bold leading-snug line-clamp-2 mb-1">
                          {relatedNoticia.titulo}
                        </h3>
                        <p className="text-white/60 text-xs leading-relaxed line-clamp-2 mb-3">
                          {getNoticiaExcerpt(relatedNoticia.contenido, 88)}
                        </p>
                        <span className="text-[11px] font-semibold text-[var(--dorado)] group-hover:translate-x-0.5 transition-transform duration-300">
                          Leer →
                        </span>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
