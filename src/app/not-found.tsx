import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[var(--verde-profundo)]">

      <div className="section-container relative z-10 text-center max-w-2xl mx-auto">
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
              className="action-primary"
            >
              Volver al inicio
            </Link>
            <Link
              href="/noticias"
              className="inline-flex min-h-11 items-center justify-center border-b border-white/40 px-2 text-sm font-semibold text-white transition-colors hover:border-[var(--dorado)] hover:text-[var(--dorado-suave)]"
            >
              Ver noticias →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
