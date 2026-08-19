"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Archive, ArrowRight, Calendar, Search } from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";

interface NoticiaPreview { id: string; titulo: string; contenido: string; imagen_url: string | null; fecha_publicacion: string | null; }
interface Props { noticias: NoticiaPreview[]; total: number; }
const PER_PAGE = 6;
const FALLBACK_COVERS = ["/research-bg.png", "/education-bg.png", "/community-bg.png", "/forest-bg.png"];

function excerpt(html: string) { const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); return text.length > 155 ? `${text.slice(0, 155)}...` : text; }
function formatDate(value: string | null) { return value ? new Date(value).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" }) : "Sin fecha"; }

export default function NoticiasClient({ noticias, total }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const filtered = noticias.filter((noticia) => noticia.titulo.toLowerCase().includes(search.toLowerCase()));
  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1, 1 + page * PER_PAGE);
  const hasMore = filtered.length > 1 + rest.length;
  const label = search ? `${filtered.length} resultado${filtered.length === 1 ? "" : "s"}` : `${total} noticia${total === 1 ? "" : "s"} publicada${total === 1 ? "" : "s"}`;

  return <div className="min-h-screen bg-[var(--papel)] pt-[4.75rem]">
    <section className="dark-section"><div className="section-container !py-16 sm:!py-20"><AnimatedSection><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)] lg:items-end"><div><span className="section-label !text-[var(--dorado-suave)]">Archivo vivo</span><h1 className="!text-white">Noticias con raíces en el territorio.</h1><p className="mt-5 max-w-xl text-lg text-white/72">Proyectos, investigaciones y acciones que sostienen una agenda climática para Corrientes.</p></div><div className="border-t border-white/25 pt-5"><label htmlFor="news-search" className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-white/65">Buscar en noticias</label><div className="relative"><Search size={19} className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--dorado-suave)]" /><input id="news-search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Escribí un título" className="h-12 w-full border-b border-white/35 bg-transparent pl-8 pr-2 text-sm text-white placeholder:text-white/50 focus:border-[var(--dorado)] focus:outline-none" /></div><p className="mt-3 text-sm text-white/60" aria-live="polite">{label}</p></div></div></AnimatedSection></div></section>
    <section className="section-container !py-14 sm:!py-20">{filtered.length === 0 ? <AnimatedSection><div className="border-y border-[var(--border)] py-12"><Archive size={30} className="text-[var(--verde-hoja)]" /><h2 className="section-title mt-4 !text-3xl">No encontramos noticias.</h2><p className="mt-2 text-[var(--gris-calido)]">Probá una búsqueda distinta.</p></div></AnimatedSection> : <>{featured && <AnimatedSection><article className="group grid gap-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-end"><Link href={`/noticias/${featured.id}`} className="relative block aspect-[16/10] overflow-hidden"><Image src={featured.imagen_url ?? FALLBACK_COVERS[0]} alt={featured.titulo} fill sizes="(max-width: 1024px) 100vw, 60vw" quality={90} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></Link><div className="border-t border-[var(--border-strong)] pt-6"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--verde-hoja)]"><Calendar size={16} /> {formatDate(featured.fecha_publicacion)}</p><h2 className="section-title mt-6 !text-4xl sm:!text-5xl">{featured.titulo}</h2><p className="mt-5 leading-relaxed text-[var(--gris-calido)]">{excerpt(featured.contenido)}</p><Link href={`/noticias/${featured.id}`} className="action-link mt-8">Leer artículo <ArrowRight size={18} /></Link></div></article></AnimatedSection>}
      {rest.length > 0 && <div className="mt-10"><div className="mb-6 border-b border-[var(--border)] pb-4"><h2 className="section-title !text-3xl">Más novedades</h2></div><div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{rest.map((noticia, index) => <AnimatedSection key={noticia.id} delay={index * 65}><article className="group h-full"><Link href={`/noticias/${noticia.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--verde-palido)]"><Image src={noticia.imagen_url ?? FALLBACK_COVERS[(index + 1) % FALLBACK_COVERS.length]} alt={noticia.titulo} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={82} className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" /></Link><p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--gris-calido)]"><Calendar size={14} /> {formatDate(noticia.fecha_publicacion)}</p><Link href={`/noticias/${noticia.id}`}><h3 className="mt-2 transition-colors group-hover:!text-[var(--verde-hoja)]">{noticia.titulo}</h3></Link><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--gris-calido)]">{excerpt(noticia.contenido)}</p><Link href={`/noticias/${noticia.id}`} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--verde-profundo)]">Abrir <ArrowRight size={15} /></Link></article></AnimatedSection>)}</div></div>}
      {hasMore && <div className="mt-14"><button type="button" onClick={() => setPage((current) => current + 1)} className="action-link">Cargar más noticias <ArrowRight size={17} /></button></div>}
    </>}</section>
  </div>;
}
