import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Compass,
  Globe,
  Leaf,
  Tree,
  Users,
} from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";
import DonationBanner from "@/components/DonationBanner";
import HeroScene from "@/components/HeroScene";
import ImpactSection from "@/components/ImpactSection";
import ProductsCarousel from "@/components/ProductsCarousel";
import StatsCounter from "@/components/StatsCounter";
import { db } from "@/db";
import { categorias, productos } from "@/db/schema";
import { getNoticiaExcerpt, getPublishedNoticias } from "@/lib/noticias";
import { getPublicConfiguration } from "@/lib/configuracion";
import type { Categoria, Producto } from "@/types/database";
import { desc, eq } from "drizzle-orm";

const stats = [
  { value: 90, suffix: "+", label: "Voluntarios", Icon: Users },
  { value: 1000, suffix: "+", label: "Estudiantes alcanzados", Icon: Leaf },
  { value: 15, suffix: "+", label: "Programas impulsados", Icon: Compass },
  { value: 100, suffix: "+", label: "Emprendedores sustentables", Icon: Tree },
];

const trustSignals = [
  { value: "Corrientes", label: "Nuestro punto de partida" },
  { value: "90+", label: "Personas voluntarias" },
  { value: "NEA", label: "Una agenda regional" },
];

const fallbackNewsCovers = ["/research-bg.png", "/education-bg.png", "/community-bg.png"];

async function getFeaturedProductos() {
  try {
    const rows = await db
      .select({
        id: productos.id,
        nombre: productos.nombre,
        descripcion: productos.descripcion,
        precio: productos.precio,
        stock: productos.stock,
        imagen_url: productos.imagen_url,
        categoria_id: productos.categoria_id,
        activo: productos.activo,
        creado_en: productos.creado_en,
        actualizado_en: productos.actualizado_en,
        categoria_nombre: categorias.nombre,
        categoria_descripcion: categorias.descripcion,
      })
      .from(productos)
      .leftJoin(categorias, eq(productos.categoria_id, categorias.id))
      .where(eq(productos.activo, true))
      .orderBy(desc(productos.creado_en))
      .limit(12);

    return rows.map((row) => ({
      ...row,
      precio: Number(row.precio),
      stock: row.stock ?? 0,
      activo: row.activo ?? true,
      creado_en: row.creado_en?.toISOString() ?? new Date().toISOString(),
      actualizado_en: row.actualizado_en?.toISOString() ?? new Date().toISOString(),
      categoria: row.categoria_id
        ? {
            id: row.categoria_id,
            nombre: row.categoria_nombre ?? "",
            descripcion: row.categoria_descripcion ?? null,
          }
        : null,
    })) as (Omit<Producto, "categoria"> & { categoria: Categoria | null })[];
  } catch (error) {
    console.error("Error cargando productos destacados:", error);
    return [] as (Omit<Producto, "categoria"> & { categoria: Categoria | null })[];
  }
}

const formatDate = (date: Date | string | null) =>
  date
    ? new Date(date).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Sin fecha";

export default async function HomePage() {
  const [latestNoticias, featuredProductos, configuration] = await Promise.all([
    getPublishedNoticias({ limit: 3 }),
    getFeaturedProductos(),
    getPublicConfiguration(),
  ]);
  const featuredNews = latestNoticias[0];

  return (
    <>
      <HeroScene intro={configuration.homeIntro} />

      <section aria-label="Alcance de la fundación" className="border-b border-[var(--border)] bg-[var(--papel)]">
        <div className="section-container !py-0">
          <div className="grid sm:grid-cols-3">
            {trustSignals.map((signal, index) => (
              <div
                key={signal.label}
                className={`py-6 sm:px-7 ${index > 0 ? "border-t border-[var(--border)] sm:border-l sm:border-t-0" : ""}`}
              >
                <p className="text-xl text-[var(--verde-profundo)]" style={{ fontFamily: "var(--font-heading)" }}>
                  {signal.value}
                </p>
                <p className="mt-1 text-sm text-[var(--gris-calido)]">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mision" className="dark-section">
        <div className="section-container !py-16 sm:!py-24">
          <AnimatedSection>
            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] lg:items-end">
              <div>
                <span className="section-label !text-[var(--dorado-suave)]">Nuestra razón de ser</span>
                <h2 className="section-title max-w-4xl !text-white">
                  El cambio climático se siente acá. La respuesta también puede empezar acá.
                </h2>
              </div>
              <p className="border-t border-white/25 pt-6 text-lg leading-relaxed text-white/72">
                Cuidamos humedales, biodiversidad y comunidades a través de una acción sostenida,
                cercana y colectiva.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <ImpactSection />

      <section id="impacto-numeros" className="paper-section">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-6 border-b border-[var(--border-strong)] pb-8 lg:grid-cols-2 lg:items-end">
              <div>
                <span className="section-label">Impacto</span>
                <h2 className="section-title">Resultados que vuelven al territorio.</h2>
              </div>
              <p className="text-[var(--gris-calido)]">
                Medimos para aprender, rendir cuentas y ampliar el alcance de cada iniciativa.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.Icon;
              return (
                <AnimatedSection key={stat.label} delay={index * 70} className="h-full">
                  <div className={`flex h-full flex-col py-8 sm:px-6 ${index > 0 ? "border-t border-[var(--border)] sm:border-l sm:border-t-0" : ""}`}>
                    <Icon size={25} className="text-[var(--verde-hoja)]" />
                    <div className="mt-10">
                      <StatsCounter value={stat.value} suffix={stat.suffix} />
                      <p className="mt-2 text-sm text-[var(--gris-calido)]">{stat.label}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
          <AnimatedSection>
            <p className="flex items-start gap-3 border-t border-[var(--border-strong)] pt-6 text-sm font-semibold leading-relaxed text-[var(--verde-profundo)]">
              <Globe size={20} className="mt-0.5 shrink-0 text-[var(--verde-hoja)]" />
              Organizadores de la Cumbre Climática de las Juventudes 2022.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section id="ultimas-noticias" className="bg-white">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-7 sm:flex-row sm:items-end">
              <div>
                <span className="section-label">Desde el territorio</span>
                <h2 className="section-title">Historias, aprendizajes y agenda.</h2>
              </div>
              <Link href="/noticias" className="action-link">
                Ver todas las noticias <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedSection>

          {featuredNews ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
              <AnimatedSection>
                <article className="group grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] md:items-end">
                  <Link href={`/noticias/${featuredNews.id}`} className="relative block aspect-[4/3] overflow-hidden">
                    <Image
                      src={featuredNews.imagen_url ?? fallbackNewsCovers[0]}
                      alt={featuredNews.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 45vw"
                      quality={88}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <div className="border-t border-[var(--border-strong)] pt-5">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--verde-hoja)]">
                      <Calendar size={16} /> {formatDate(featuredNews.fecha_publicacion)}
                    </p>
                    <h3 className="mt-5 text-3xl sm:text-4xl">{featuredNews.titulo}</h3>
                    <p className="mt-4 line-clamp-3 text-[var(--gris-calido)]">
                      {getNoticiaExcerpt(featuredNews.contenido, 190)}
                    </p>
                    <Link href={`/noticias/${featuredNews.id}`} className="action-link mt-7">
                      Leer artículo <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              </AnimatedSection>
              <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {latestNoticias.slice(1).map((noticia, index) => (
                  <AnimatedSection key={noticia.id} delay={index * 85}>
                    <article className="group grid grid-cols-[7rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                      <Link href={`/noticias/${noticia.id}`} className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={noticia.imagen_url ?? fallbackNewsCovers[(index + 1) % fallbackNewsCovers.length]}
                          alt={noticia.titulo}
                          fill
                          sizes="144px"
                          quality={78}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </Link>
                      <div>
                        <p className="text-xs text-[var(--gris-calido)]">{formatDate(noticia.fecha_publicacion)}</p>
                        <h3 className="mt-2 !text-xl transition-colors group-hover:!text-[var(--verde-hoja)]">
                          {noticia.titulo}
                        </h3>
                        <Link href={`/noticias/${noticia.id}`} className="action-link mt-3 !text-xs">
                          Abrir <ArrowRight size={15} />
                        </Link>
                      </div>
                    </article>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          ) : (
            <AnimatedSection>
              <div className="border-y border-[var(--border)] py-10">
                <h3>Las novedades están en camino.</h3>
                <p className="mt-2 text-[var(--gris-calido)]">
                  Cuando publiquemos nuevas historias, las vas a encontrar acá.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <DonationBanner />
      <ProductsCarousel productos={featuredProductos} />
    </>
  );
}
