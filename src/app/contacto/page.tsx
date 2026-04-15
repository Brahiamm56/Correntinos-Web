import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a la Fundación Correntinos Contra el Cambio Climático. Encontrá nuestros datos de contacto, redes sociales y ubicación.",
};

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "correntinosclim@gmail.com",
    href: "mailto:correntinosclim@gmail.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: "Teléfono",
    value: "+54 379 405 9015",
    href: "tel:+543794059015",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    label: "Instagram",
    value: "@correntinosclim",
    href: "https://www.instagram.com/correntinosclim/",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "Ubicación",
    value: "Corrientes, Argentina",
    href: "https://maps.google.com/?q=Corrientes,Argentina",
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #071f17 0%, #0B3D2E 40%, #1A5C3A 100%)" }}
      >
        <div aria-hidden className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[var(--verde-menta)] opacity-[0.05] blur-[100px] pointer-events-none" />
        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <span className="section-label justify-center !text-[var(--dorado-suave)]">Hablemos</span>
            <h1 className="!text-white mb-6">
              Contactá <span className="text-[var(--dorado)]">con nosotros</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mx-auto">
              ¿Tenés una consulta, propuesta o querés sumarte? Estamos abiertos
              a escucharte. Escribinos o encontranos en nuestras redes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CONTACT CARDS ─── */}
      <section className="bg-white">
        <div className="section-container">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contactInfo.map((item, i) => (
              <AnimatedSection key={item.label} delay={i * 90}>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="glass-card p-6 flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--verde-palido)] text-[var(--verde-hoja)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--verde-hoja)] group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--gris-calido)] mb-1 uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-[var(--verde-profundo)] group-hover:text-[var(--verde-hoja)] transition-colors duration-300">
                      {item.value}
                    </p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHATSAPP CTA — dark section ─── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #071f17 0%, #0B3D2E 60%, #1A5C3A 100%)" }}
      >
        <div aria-hidden className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#25D366] opacity-[0.07] blur-3xl pointer-events-none" />
        <div aria-hidden className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[var(--dorado)] opacity-[0.06] blur-3xl pointer-events-none" />

        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              {/* WhatsApp icon */}
              <div className="w-16 h-16 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>

              <h2 className="!text-white mb-4">¿Preferís WhatsApp?</h2>
              <p className="text-white/65 text-lg mb-8 mx-auto">
                También podés escribirnos directamente por WhatsApp para una respuesta más rápida.
                Estamos disponibles para consultas, propuestas y colaboraciones.
              </p>
              <a
                href="https://wa.me/543794059015?text=Hola!%20Me%20interesa%20saber%20más%20sobre%20la%20fundación"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 font-semibold rounded-full bg-[#25D366] text-white hover:bg-[#20BD5A] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[#25D366]/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribinos por WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
