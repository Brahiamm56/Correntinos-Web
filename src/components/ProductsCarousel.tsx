"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Plus, ArrowRight, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useCartStore } from "@/store/cart";
import type { Producto, Categoria } from "@/types/database";

type ProductoConCategoria = Producto & { categoria?: Categoria | null };

interface Props {
  productos: ProductoConCategoria[];
}

export default function ProductsCarousel({ productos }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const { addItem } = useCartStore();

  // Duplicate the list so the marquee loop feels seamless
  const loopItems =
    productos.length > 0 ? [...productos, ...productos] : productos;

  useEffect(() => {
    if (productos.length === 0) return;
    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Background blob parallax
      [blob1Ref.current, blob2Ref.current].forEach((blob, i) => {
        if (!blob) return;
        gsap.to(blob, {
          yPercent: i % 2 === 0 ? -25 : 25,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const track = trackRef.current;
        if (!track) return;

        // We measure half the track because items are duplicated;
        // looping by exactly that distance gives a seamless infinite scroll.
        const setupMarquee = () => {
          tweenRef.current?.kill();
          gsap.set(track, { xPercent: 0 });
          tweenRef.current = gsap.to(track, {
            xPercent: -50,
            duration: Math.max(28, productos.length * 4.5),
            ease: "none",
            repeat: -1,
          });
        };

        setupMarquee();

        // Pause on hover / focus, resume on leave
        const pause = () => tweenRef.current?.timeScale(0.15);
        const resume = () => tweenRef.current?.timeScale(1);
        track.addEventListener("mouseenter", pause);
        track.addEventListener("mouseleave", resume);
        track.addEventListener("focusin", pause);
        track.addEventListener("focusout", resume);

        // Refresh on load to keep ScrollTrigger correct
        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);

        return () => {
          track.removeEventListener("mouseenter", pause);
          track.removeEventListener("mouseleave", resume);
          track.removeEventListener("focusin", pause);
          track.removeEventListener("focusout", resume);
          window.removeEventListener("resize", onResize);
          tweenRef.current?.kill();
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [productos.length]);

  if (productos.length === 0) return null;

  const handleAdd = (p: ProductoConCategoria) => {
    addItem({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen_url: p.imagen_url,
      stock: p.stock,
    });
    setAdded(p.id);
    window.setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1400);
  };

  return (
    <section
      ref={sectionRef}
      id="tienda-destacada"
      aria-label="Productos destacados de la tienda"
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--crema) 0%, #F3EFE3 55%, var(--verde-palido) 100%)",
      }}
    >
      {/* Ultra soft gradient bridge extending further down to eliminate the clash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[260px] -mt-px"
        style={{
          background:
            "linear-gradient(180deg, #071f17 0%, rgba(7,31,23,0.7) 20%, rgba(7,31,23,0.3) 50%, rgba(7,31,23,0.08) 75%, transparent 100%)",
        }}
      />
      
      {/* Subtle grain on the bridge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Animated background blobs */}
      <div
        ref={blob1Ref}
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-[460px] w-[460px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--verde-menta) 0%, transparent 65%)",
          opacity: 0.5,
          filter: "blur(70px)",
        }}
      />
      <div
        ref={blob2Ref}
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, var(--dorado-claro) 0%, transparent 65%)",
          opacity: 0.6,
          filter: "blur(70px)",
        }}
      />
      {/* Subtle dotted texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, var(--verde-hoja) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="section-container relative z-10 !pt-16 !pb-8 sm:!pt-20">
        <div
          ref={headerRef}
          className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <span className="section-label">
              <Sparkles className="inline h-4 w-4" /> Tienda solidaria
            </span>
            <h2 className="mb-3">
              Llevate algo lindo, dejá huella verde
            </h2>
            <p className="text-[var(--gris-calido)]">
              Cada compra financia programas de educación ambiental,
              reforestación y protección de los humedales del Iberá.
            </p>
          </div>
          <Link
            href="/tienda"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-[var(--border-strong)] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[var(--verde-profundo)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--verde-claro)] hover:bg-white"
          >
            <ShoppingBag className="h-4 w-4" />
            Ver toda la tienda
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Marquee carousel — overflows full bleed */}
      <div
        className="relative z-10 pb-14"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-5 px-6"
          style={{ willChange: "transform" }}
        >
          {loopItems.map((producto, i) => {
            const isAdded = added === producto.id;
            const outOfStock = producto.stock === 0;
            return (
              <article
                key={`${producto.id}-${i}`}
                className="group relative flex w-[260px] shrink-0 flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-white/85 shadow-[0_20px_60px_rgba(11,61,46,0.08)] backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(11,61,46,0.18)] sm:w-[280px]"
              >
                <Link
                  href={`/tienda/${producto.id}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-[var(--verde-palido)]"
                  aria-label={`Ver detalle de ${producto.nombre}`}
                >
                  {producto.imagen_url ? (
                    <Image
                      src={producto.imagen_url}
                      alt={producto.nombre}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="280px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl">
                      🌿
                    </div>
                  )}

                  {/* Top-right category chip */}
                  {producto.categoria && (
                    <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                      {producto.categoria.nombre}
                    </span>
                  )}

                  {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                        Agotado
                      </span>
                    </div>
                  )}

                  {/* Bottom gradient with price */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <span className="text-xl font-bold text-white drop-shadow">
                      ${producto.precio.toLocaleString("es-AR")}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-1 items-center justify-between gap-3 p-4">
                  <Link
                    href={`/tienda/${producto.id}`}
                    className="line-clamp-2 text-sm font-bold text-[var(--verde-profundo)] transition-colors hover:text-[var(--verde-hoja)]"
                  >
                    {producto.nombre}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAdd(producto)}
                    disabled={outOfStock}
                    aria-label={`Agregar ${producto.nombre} al carrito`}
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30 ${
                      isAdded
                        ? "scale-110 bg-[var(--verde-claro)]"
                        : "bg-gradient-to-br from-[var(--verde-selva)] to-[var(--verde-profundo)] hover:scale-110 hover:shadow-[0_8px_24px_rgba(11,61,46,0.35)]"
                    }`}
                  >
                    <Plus
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isAdded ? "rotate-45" : ""
                      }`}
                    />
                    {isAdded && (
                      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--verde-profundo)] px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                        ¡Agregado!
                      </span>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
