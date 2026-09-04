import type { Metadata } from "next";
import Image from "next/image";
import { Bullhorn, Eye, Globe, HandHeart, Leaf, Microscope, Scale, Target } from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";
import CrossfadeImages from "@/components/CrossfadeImages";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conocé la misión, visión y valores de la Fundación Correntinos Contra el Cambio Climático. Un equipo comprometido con la acción climática en Corrientes.",
};

const valores = [
  { Icon: Microscope, title: "Evidencia", description: "Basamos cada acción en datos científicos verificables." },
  { Icon: Globe, title: "Compromiso", description: "Trabajamos con convicción por el futuro de nuestra tierra." },
  { Icon: HandHeart, title: "Comunidad", description: "Creemos en el poder de la acción colectiva y participativa." },
  { Icon: Bullhorn, title: "Transparencia", description: "Rendimos cuentas de cada proyecto y cada recurso utilizado." },
  { Icon: Leaf, title: "Sustentabilidad", description: "Pensamos a largo plazo en cada decisión que tomamos." },
  { Icon: Scale, title: "Justicia socioambiental", description: "Entendemos que la crisis climática también es social, y promovemos soluciones inclusivas y equitativas." },
];

const consejo = [
  { nombre: "Guido Paparella", rol: "Presidente" },
  { nombre: "Camila Núñez", rol: "Secretaria" },
  { nombre: "Deborah Iserre", rol: "Tesorera" },
  { nombre: "Nicolás Duarte", rol: "Fundador" },
];

const comunidadImages = [
  { src: "/hero-section/imagen-hero4.jpg", alt: "Asamblea en defensa del Parque Caraguatá", position: "50% 50%" },
  { src: "/hero-section/imagen-hero1.jpg", alt: "Vecinos y activistas en defensa del ambiente", position: "50% 50%" },
];

const hitos = [
  { year: "2020", title: "El inicio", text: "Un grupo de amigos, preocupados por la crisis climática y la falta de acción en Corrientes, decide organizarse y comenzar a actuar de manera colectiva. Así nace Correntinos Contra el Cambio Climático." },
  { year: "2020", title: "Red de Emprendedores Sustentables", text: "Uno de los primeros programas de la organización. Surge con el objetivo de acompañar y fortalecer a emprendedores que desarrollan productos con una mirada ambiental, promoviendo el trabajo articulado y la construcción de una economía circular." },
  { year: "2020", title: "Ordenanza \"Corrientes sin colillas\"", text: "Tras un año de trabajo —desde la redacción del proyecto hasta su impulso en el Concejo Deliberante y en las calles— logramos la aprobación de una ordenanza municipal destinada a reducir el impacto ambiental de las colillas de cigarrillo." },
  { year: "2022", title: "Cumbre Climática de las Juventudes (LCOY)", text: "Nos propusimos un objetivo ambicioso: organizar uno de los encuentros ambientales juveniles más importantes del país. Reunimos a más de 400 jóvenes de 20 provincias para debatir, intercambiar ideas y construir propuestas frente a la crisis climática." },
  { year: "2022", title: "Participación internacional", text: "La organización de la LCOY nos abrió las puertas a espacios internacionales clave. Participamos en la RCOY en Costa Rica, la COY en Egipto y el C40 en Buenos Aires, llevando la voz del litoral y visibilizando las problemáticas ambientales que enfrenta nuestra región en el contexto de la crisis climática global." },
  { year: "2023", title: "Formalización", text: "Consolidamos nuestro crecimiento con la constitución legal de la organización como fundación." },
  { year: "2025", title: "Educación ambiental", text: "Lanzamos el programa \"Ñangareko Yvy\", a través del cual desarrollamos charlas, talleres y actividades lúdicas, alcanzando a más de 300 jóvenes de 10 escuelas." },
];

export default function QuienesSomosPage() {
  return (
    <div className="pt-[4.75rem]">
      <section className="relative isolate overflow-hidden dark-section">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-section/imagen-hero2.jpg"
            alt="Acción local para una crisis global"
            fill
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#071f17]/82 backdrop-blur-[1.5px]" />
        </div>
        <div className="section-container !py-16 sm:!py-24">
          <AnimatedSection>
            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
              <div>
                <span className="section-label !text-[var(--dorado-suave)]">Nuestra historia</span>
                <h1 className="!text-white">Acción local para una crisis global.</h1>
              </div>
              <p className="border-t border-white/25 pt-6 text-lg leading-relaxed text-white/72">
                Somos una fundación correntina nacida de la urgencia climática y de la convicción de que organizarse transforma el territorio.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-container grid gap-9 !py-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:items-end sm:!py-20">
          <AnimatedSection>
            <CrossfadeImages
              images={comunidadImages}
              sizes="(max-width: 1024px) 100vw, 58vw"
              quality={90}
              intervalSeconds={5.5}
              className="aspect-[4/3] bg-[var(--verde-palido)]"
            />
          </AnimatedSection>
          <AnimatedSection delay={120}>
            <div className="border-t border-[var(--border-strong)] pt-6">
              <span className="section-label">Comunidad en acción</span>
              <h2 className="text-3xl sm:text-4xl">Asamblea en defensa del Parque Caraguatá.</h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--gris-calido)] sm:text-lg">
                <p>Casi 100 vecinos participaron de una asamblea histórica para defender el último pulmón verde de Resistencia.</p>
                <p>Nos reunimos vecinos, activistas, investigadores y biólogos para expresar la preocupación por el desmonte que afectó parte del espacio destinado a ser Reserva Municipal, aprobada por ordenanza de manera unánime.</p>
                <p>De manera conjunta se decidió presentar un petitorio ante la Municipalidad y seguir trabajando para que el Caraguatá sea una reserva natural para la comunidad.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-container grid gap-0 !py-16 md:grid-cols-2 sm:!py-20">
          <AnimatedSection>
            <article className="border-y border-[var(--border-strong)] py-8 md:pr-10">
              <Target size={28} className="text-[var(--verde-hoja)]" />
              <h2 className="mt-6 text-3xl">Misión</h2>
              <p className="mt-4 leading-relaxed text-[var(--gris-calido)]">
                Generar acción climática real en Corrientes mediante educación ambiental, participación ciudadana e incidencia en políticas públicas, fortaleciendo la resiliencia de comunidades y ecosistemas.
              </p>
            </article>
          </AnimatedSection>
          <AnimatedSection delay={120}>
            <article className="border-b border-[var(--border-strong)] py-8 md:border-l md:border-t md:pl-10">
              <Eye size={28} className="text-[var(--dorado)]" />
              <h2 className="mt-6 text-3xl">Visión</h2>
              <p className="mt-4 leading-relaxed text-[var(--gris-calido)]">
                Ser una referencia en acción climática en el Nordeste argentino y acompañar una transición que proteja tanto al ambiente como a las comunidades que lo habitan.
              </p>
            </article>
          </AnimatedSection>
        </div>
      </section>

      <section className="paper-section border-y border-[var(--border)]">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-6 border-b border-[var(--border-strong)] pb-8 lg:grid-cols-2 lg:items-end">
              <div><span className="section-label">Lo que nos guía</span><h2 className="section-title">Valores puestos en práctica.</h2></div>
              <p className="text-[var(--gris-calido)]">Principios para decidir cómo trabajamos, con quiénes nos aliamos y de qué manera rendimos cuentas.</p>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((valor, i) => {
              const Icon = valor.Icon;
              return <AnimatedSection key={valor.title} delay={i * 60}>
                <article className={`grid min-h-44 grid-cols-[2rem_minmax(0,1fr)] gap-4 border-b border-[var(--border)] py-7 sm:px-6 ${i % 3 !== 0 ? "lg:border-l" : ""}`}>
                  <Icon size={23} className="text-[var(--verde-hoja)]" />
                  <div><h3 className="text-lg">{valor.title}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--gris-calido)]">{valor.description}</p></div>
                </article>
              </AnimatedSection>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-12 lg:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:items-start">
              <div>
                <span className="section-label">Las personas</span>
                <h2 className="section-title !text-3xl sm:!text-4xl lg:!text-5xl !leading-[1.1]">
                  Una organización, muchas formas de participar.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[var(--gris-calido)]">
                  Un equipo interdisciplinario que combina conducción estratégica, coordinación operativa y la fuerza del voluntariado en el territorio.
                </p>
              </div>
              <div className="space-y-0">
                <div className="border-y border-[var(--border-strong)] py-8">
                  <h3 className="text-2xl sm:text-3xl">Consejo de Administración</h3>
                  <p className="mt-2 text-sm text-[var(--gris-calido)]">
                    Conducción institucional y decisiones estratégicas de la fundación.
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
                    {consejo.map((miembro) => (
                      <div key={miembro.nombre} className="flex flex-col">
                        <p className="font-sans text-sm font-bold leading-tight text-[var(--verde-profundo)] sm:text-base">
                          {miembro.nombre}
                        </p>
                        <span className="mt-1.5 inline-block text-[11px] font-extrabold uppercase tracking-[0.08em] text-[var(--verde-hoja)]">
                          {miembro.rol}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-8 border-b border-[var(--border-strong)] py-8 sm:grid-cols-2 sm:gap-10">
                  <div className="flex flex-col">
                    <h3 className="text-xl sm:text-2xl">Equipo de Coordinación</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--gris-calido)]">
                      Lidera, organiza y acompaña los proyectos para asegurar su desarrollo e impacto.
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl sm:text-2xl">Voluntariado</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--gris-calido)]">
                      Más de 90 personas aportan tiempo y energía en distintos puntos del NEA.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="warm-section border-t border-[var(--dorado)]/25">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="mb-12 max-w-3xl"><span className="section-label">Nuestro camino</span><h2 className="section-title">Hitos que explican quiénes somos.</h2></div>
          </AnimatedSection>
          <div className="mx-auto max-w-4xl border-t border-[var(--verde-profundo)]">
            {hitos.map((hito, i) => (
              <AnimatedSection key={`${hito.year}-${hito.title}`} delay={Math.min(i * 70, 280)}>
                <article className="grid gap-3 border-b border-[var(--border-strong)] py-7 sm:grid-cols-[5rem_minmax(12rem,0.6fr)_minmax(0,1.4fr)] sm:gap-7">
                  <p className="font-extrabold text-[var(--verde-hoja)]">{hito.year}</p>
                  <h3 className="!text-xl">{hito.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--gris-calido)]">{hito.text}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
