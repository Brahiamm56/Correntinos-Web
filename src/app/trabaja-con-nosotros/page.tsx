import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Trabajá con Nosotros",
  description:
    "Sumate al equipo de la Fundación Correntinos Contra el Cambio Climático. Buscamos voluntarios, profesionales y colaboradores comprometidos con la acción climática.",
};

const oportunidades = [
  {
    icon: "🌿",
    title: "Voluntariado Ambiental",
    description:
      "Participá en jornadas de campo, talleres educativos y actividades de conservación. No necesitás experiencia previa, solo ganas de hacer la diferencia.",
    ideal: "Estudiantes, profesionales, vecinos comprometidos",
  },
  {
    icon: "🔬",
    title: "Investigación y Datos",
    description:
      "Si tenés formación en ciencias ambientales, biología, geografía o áreas afines, tu conocimiento puede potenciar nuestros proyectos de investigación.",
    ideal: "Profesionales y estudiantes avanzados en ciencias",
  },
  {
    icon: "📣",
    title: "Comunicación y Difusión",
    description:
      "Ayudanos a amplificar el mensaje. Necesitamos personas con habilidades en redes sociales, diseño, fotografía o redacción.",
    ideal: "Comunicadores, diseñadores, creadores de contenido",
  },
  {
    icon: "🤝",
    title: "Alianzas Institucionales",
    description:
      "Si representás una organización, empresa o institución educativa, podemos generar sinergias que multipliquen nuestro impacto.",
    ideal: "Empresas, ONGs, instituciones educativas",
  },
];

export default function TrabajaConNosotrosPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #071f17 0%, #0B3D2E 40%, #1A5C3A 100%)",
        }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-[var(--dorado)] opacity-[0.05] blur-[100px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-[var(--verde-menta)] opacity-[0.06] blur-[80px]" />
        </div>

        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <span className="section-label justify-center !text-[var(--dorado-suave)]">
              Oportunidades
            </span>
            <h1 className="!text-white mb-6">
              Sumate al{" "}
              <span className="text-[var(--dorado)]">cambio</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mx-auto">
              Buscamos personas comprometidas que quieran aportar su tiempo,
              conocimiento o recursos a la lucha contra el cambio climático en
              Corrientes.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── OPPORTUNITIES ─── */}
      <section className="bg-white">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="section-label justify-center">
                ¿Cómo podés participar?
              </span>
              <h2>Formas de sumarte</h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {oportunidades.map((op, i) => (
              <AnimatedSection key={op.title} delay={i * 100}>
                <div className="glass-card p-8 h-full flex flex-col">
                  <span className="text-4xl mb-4">{op.icon}</span>
                  <h3 className="text-xl mb-3">{op.title}</h3>
                  <p className="text-[var(--gris-calido)] leading-relaxed flex-1 mb-4">
                    {op.description}
                  </p>
                  <p className="text-xs font-semibold text-[var(--verde-hoja)] border-t border-[var(--border)] pt-4">
                    Ideal para: {op.ideal}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO APPLY ─── */}
      <section className="bg-[var(--crema)]">
        <div className="section-container">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <span className="section-label justify-center">
                  Proceso
                </span>
                <h2>¿Cómo postularte?</h2>
              </div>

              <div className="space-y-6">
                {[
                  {
                    step: "01",
                    title: "Elegí tu área de interés",
                    text: "Revisá las oportunidades disponibles y elegí la que mejor se adapte a tu perfil y disponibilidad.",
                  },
                  {
                    step: "02",
                    title: "Escribinos",
                    text: "Envianos un mensaje por email o WhatsApp contándonos quién sos, qué te motiva y cómo te gustaría colaborar.",
                  },
                  {
                    step: "03",
                    title: "Conversamos",
                    text: "Coordinamos una charla para conocernos, entender tus expectativas y encontrar el mejor espacio para vos en la fundación.",
                  },
                ].map((item, i) => (
                  <AnimatedSection key={item.step} delay={i * 120}>
                    <div className="glass-card p-6 flex items-start gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--verde-selva)] to-[var(--verde-hoja)] flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg mb-1">{item.title}</h3>
                        <p className="text-sm text-[var(--gris-calido)] leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--verde-profundo) 0%, var(--verde-selva) 100%)",
        }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--dorado)] opacity-[0.06] blur-3xl" />

        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="!text-white mb-6">
                ¿Listo para hacer la diferencia?
              </h2>
              <p className="text-lg text-white/70 mb-10 mx-auto">
                No importa tu experiencia ni tu profesión. Lo que compartimos es
                la convicción de que Corrientes merece un futuro sustentable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:correntinosclim@gmail.com?subject=Quiero%20sumarme%20a%20la%20fundación"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full bg-[var(--dorado)] text-[var(--verde-profundo)] hover:bg-[var(--dorado-suave)] transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  id="apply-email-cta"
                >
                  Envianos un email
                </a>
                <a
                  href="https://wa.me/543794059015?text=Hola!%20Quiero%20sumarme%20a%20la%20fundación"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
                  id="apply-whatsapp-cta"
                >
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
