import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #071f17 0%, #0B3D2E 45%, #1A5C3A 100%)" }}
    >
      {/* Decorative blobs */}
      <div aria-hidden className="absolute top-[15%] right-[10%] w-[380px] h-[380px] rounded-full bg-[var(--dorado)] opacity-[0.05] blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-[10%] left-[5%] w-[280px] h-[280px] rounded-full bg-[var(--verde-menta)] opacity-[0.07] blur-[80px] pointer-events-none" />

      {/* Grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
        {/* Big 404 */}
        <p
          className="text-[10rem] sm:text-[14rem] font-bold leading-none text-white/[0.06] select-none mb-0 -mb-8"
          style={{ fontFamily: "var(--font-heading)" }}
          aria-hidden
        >
          404
        </p>

        <div className="relative z-10">
          <span className="section-label justify-center !text-[var(--dorado-suave)] mb-4">
            Página no encontrada
          </span>
          <h1 className="!text-white !text-3xl sm:!text-4xl mb-5">
            Este camino no lleva a ningún lugar
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-md mx-auto">
            La página que buscás no existe o fue movida. Pero el planeta sí nos necesita —
            volvé al inicio y seguí navegando.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full bg-[var(--dorado)] text-[var(--verde-profundo)] hover:bg-[var(--dorado-suave)] transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              Volver al inicio
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border-2 border-white/25 text-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
            >
              Ver noticias →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
