import type { Metadata } from "next";
import { Bullhorn, HandHeart, Leaf, Microscope } from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Trabajá con Nosotros",
  description:
    "Sumate al equipo de la Fundación Correntinos Contra el Cambio Climático. Buscamos voluntarios, profesionales y colaboradores comprometidos con la acción climática.",
};

const oportunidades = [
  {
    Icon: Leaf,
    title: "Voluntariado Ambiental",
    description:
      "Participá en jornadas de campo, talleres educativos y actividades de conservación. No necesitás experiencia previa, solo ganas de hacer la diferencia.",
    ideal: "Estudiantes, profesionales, vecinos comprometidos",
  },
  {
    Icon: Microscope,
    title: "Investigación y Datos",
    description:
      "Si tenés formación en ciencias ambientales, biología, geografía o áreas afines, tu conocimiento puede potenciar nuestros proyectos de investigación.",
    ideal: "Profesionales y estudiantes avanzados en ciencias",
  },
  {
    Icon: Bullhorn,
    title: "Comunicación y Difusión",
    description:
      "Ayudanos a amplificar el mensaje. Necesitamos personas con habilidades en redes sociales, diseño, fotografía o redacción.",
    ideal: "Comunicadores, diseñadores, creadores de contenido",
  },
  {
    Icon: HandHeart,
    title: "Alianzas Institucionales",
    description:
      "Si representás una organización, empresa o institución educativa, podemos generar sinergias que multipliquen nuestro impacto.",
    ideal: "Empresas, ONGs, instituciones educativas",
  },
];

export default function TrabajaConNosotrosPage() {
  return (
    <div className="pt-[4.75rem]">
      <section className="dark-section">
        <div className="section-container !py-16 sm:!py-24">
          <AnimatedSection>
            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
              <div><span className="section-label !text-[var(--dorado-suave)]">Participar</span><h1 className="!text-white">Tu experiencia puede convertirse en acción.</h1></div>
              <p className="border-t border-white/25 pt-6 text-lg leading-relaxed text-white/72">Hay lugar para el tiempo, las ideas, el conocimiento profesional y las alianzas que ayuden a cuidar Corrientes.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-6 border-b border-[var(--border-strong)] pb-8 lg:grid-cols-2 lg:items-end"><div><span className="section-label">¿Cómo podés participar?</span><h2>Encontrá tu forma de sumarte.</h2></div><p className="text-[var(--gris-calido)]">No hace falta encajar en un perfil único. Buscamos compromiso, responsabilidad y ganas de aprender con otras personas.</p></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2">
            {oportunidades.map((op, i) => {
              const Icon = op.Icon;
              return <AnimatedSection key={op.title} delay={i * 100}>
                <article className={`h-full border-b border-[var(--border)] py-8 md:px-8 ${i % 2 === 1 ? "md:border-l" : ""}`}>
                  <Icon size={27} className="text-[var(--verde-hoja)]" /><h3 className="mt-6 text-2xl">{op.title}</h3><p className="mt-4 leading-relaxed text-[var(--gris-calido)]">{op.description}</p><p className="mt-6 border-t border-[var(--border)] pt-4 text-xs font-bold uppercase tracking-[0.07em] text-[var(--verde-hoja)]">Puede interesarle a: {op.ideal}</p>
                </article>
              </AnimatedSection>;
            })}
          </div>
        </div>
      </section>

      <section className="paper-section border-y border-[var(--border)]">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-10 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)]">
              <div><span className="section-label">Proceso</span><h2>Empezar es simple.</h2><p className="mt-4 text-[var(--gris-calido)]">Primero queremos conocerte y entender cómo te gustaría participar.</p></div>
              <div className="border-t border-[var(--border-strong)]">
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
                ].map((item) => (
                  <div key={item.step} className="grid gap-3 border-b border-[var(--border)] py-7 sm:grid-cols-[3rem_minmax(10rem,0.65fr)_minmax(0,1.35fr)] sm:gap-6">
                    <p className="font-extrabold text-[var(--verde-hoja)]">{item.step}</p><h3 className="!text-xl">{item.title}</h3><p className="text-sm leading-relaxed text-[var(--gris-calido)]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="warm-section">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div><h2>¿Conversamos?</h2><p className="mt-4 max-w-2xl text-lg text-[var(--gris-calido)]">Contanos qué te motiva, qué sabés hacer y cuánto tiempo te gustaría dedicar.</p></div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:correntinosclim@gmail.com?subject=Quiero%20sumarme%20a%20la%20fundación"
                  className="action-primary"
                  id="apply-email-cta"
                >
                  Envianos un email
                </a>
                <a
                  href="https://wa.me/543794059015?text=Hola!%20Quiero%20sumarme%20a%20la%20fundación"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-link justify-center"
                  id="apply-whatsapp-cta"
                >
                  Escribinos por WhatsApp
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
