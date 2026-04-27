import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata = {
  title: "Donaciones",
  description: "Apoyá la causa ambiental en Corrientes con tu donación.",
};

export default function DonacionesPage() {
  return (
    <div className="min-h-screen bg-[var(--crema)]">
      {/* Hero */}
      <section
        className="relative pt-36 pb-20 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--verde-profundo) 0%, var(--verde-selva) 50%, var(--verde-hoja) 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, var(--dorado) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, var(--verde-menta) 0%, transparent 40%)`,
            }}
          />
        </div>
        <div className="section-container relative z-10 text-center">
          <AnimatedSection>
            <span className="inline-block text-[var(--dorado)] text-sm font-semibold tracking-widest uppercase mb-4">
              Tu aporte cuenta
            </span>
            <h1 className="text-white mb-6">Doná para proteger Corrientes</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Cada donación nos permite seguir trabajando por un futuro
              sustentable para nuestra provincia. Tu apoyo financia
              investigaciones, programas educativos y acciones de conservación.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="section-container">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="glass-card p-8 md:p-12 text-center mb-10">
              <div className="text-6xl mb-6">🌱</div>
              <h2 className="mb-4">Integración de pagos próximamente</h2>
              <p className="text-[var(--gris-calido)] mb-8 max-w-lg mx-auto">
                Estamos trabajando para habilitar donaciones online a través de
                Mercado Pago. Mientras tanto, podés contactarnos directamente
                para hacer tu aporte.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="p-4 rounded-xl bg-[var(--verde-palido)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--gris-calido)] mb-1">Email</p>
                  <p className="font-semibold text-sm text-[var(--verde-profundo)]">
                    correntinosclim@gmail.com
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--verde-palido)] border border-[var(--border)]">
                  <p className="text-xs text-[var(--gris-calido)] mb-1">WhatsApp</p>
                  <p className="font-semibold text-sm text-[var(--verde-profundo)]">
                    +54 379 405 9015
                  </p>
                </div>
              </div>

              <Link href="/contacto" className="btn-primary">
                Contactanos para donar
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="glass-card p-8 md:p-12">
              <h3 className="mb-6 text-center">¿Cómo se usan las donaciones?</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { icon: "🏫", title: "Educación", desc: "Programas de educación ambiental en escuelas rurales de Corrientes" },
                  { icon: "🔬", title: "Investigación", desc: "Estudios sobre el impacto del cambio climático en los ecosistemas locales" },
                  { icon: "🌳", title: "Conservación", desc: "Proyectos de reforestación y protección de humedales" },
                ].map((item) => (
                  <div key={item.title} className="text-center">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="text-sm font-bold mb-2 text-[var(--verde-profundo)]">{item.title}</h4>
                    <p className="text-xs text-[var(--gris-calido)] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
