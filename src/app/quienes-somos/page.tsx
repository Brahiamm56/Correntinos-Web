import type { Metadata } from "next";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conocé la misión, visión y valores de la Fundación Correntinos Contra el Cambio Climático. Un equipo comprometido con la acción climática en Corrientes.",
};

const valores = [
  { icon: "🔬", title: "Evidencia", description: "Basamos cada acción en datos científicos verificables." },
  { icon: "🌍", title: "Compromiso", description: "Trabajamos con convicción por el futuro de nuestra tierra." },
  { icon: "🤲", title: "Comunidad", description: "Creemos en el poder de la acción colectiva y participativa." },
  { icon: "📢", title: "Transparencia", description: "Rendimos cuentas de cada proyecto y cada recurso utilizado." },
  { icon: "🌱", title: "Sustentabilidad", description: "Pensamos a largo plazo en cada decisión que tomamos." },
  { icon: "⚖️", title: "Justicia socioambiental", description: "Entendemos que la crisis climática también es social, y promovemos soluciones inclusivas y equitativas." },
];

const consejo = [
  { nombre: "Guido Paparella", rol: "Presidente" },
  { nombre: "Camila Núñez", rol: "Secretaria" },
  { nombre: "Deborah Iserre", rol: "Tesorera" },
  { nombre: "Nicolás Duarte", rol: "Fundador" },
];

const hitos = [
  { year: "2020", title: "El inicio", text: "Un grupo de amigos, preocupados por la crisis climática y la falta de acción en Corrientes, decide organizarse y comenzar a actuar de manera colectiva. Así nace Correntinos Contra el Cambio Climático." },
  { year: "2020", title: "Red de Emprendedores Sustentables", text: "Uno de los primeros programas de la organización. Surge con el objetivo de acompañar y fortalecer a emprendedores que desarrollan productos con una mirada ambiental, promoviendo el trabajo articulado y la construcción de una economía circular." },
  { year: "2020", title: "Ordenanza \"Corrientes sin colillas\"", text: "Tras un año de trabajo —desde la redacción del proyecto hasta su impulso en el Concejo Deliberante y en las calles— logramos la aprobación de una ordenanza municipal destinada a reducir el impacto ambiental de las colillas de cigarrillo." },
  { year: "2022", title: "Cumbre Climática de las Juventudes (LCOY)", text: "Nos propusimos un objetivo ambicioso: organizar uno de los encuentros ambientales juveniles más importantes del país. Reunimos a más de 400 jóvenes de 20 provincias para debatir, intercambiar ideas y construir propuestas frente a la crisis climática." },
  { year: "2022", title: "Participación internacional", text: "La organización de la LCOY nos abrió las puertas a espacios internacionales clave. Participamos en la RCOY en Costa Rica, la COY en Egipto y el C40 en Buenos Aires, llevando la voz del litoral y visibilizando las problemáticas ambientales que enfrenta nuestra región en el contexto de la crisis climática global." },
  { year: "2023", title: "Formalización", text: "Consolidamos nuestro crecimiento con la constitución legal de la organización como fundación." },
  { year: "2025", title: "Educación ambiental", text: "Lanzamos el programa \"Ñangareko Yvy\", a través del cual desarrollamos charlas, talleres y actividades lúdicas, alcanzando a más de 300 jóvenes de 10 escuelas." },
  { year: "2026", title: "Acción legal ambiental", text: "Dimos un paso clave en la defensa del ambiente al involucrarnos en nuestra primera demanda judicial, en el marco de la causa por desmontes ilegales en el Parque Caraguatá, en Resistencia." },
];

export default function QuienesSomosPage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #071f17 0%, #0B3D2E 40%, #1A5C3A 100%)" }}
      >
        <div aria-hidden className="absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-[var(--dorado)] opacity-[0.04] blur-[100px] pointer-events-none" />
        <div aria-hidden className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-[var(--verde-menta)] opacity-[0.06] blur-[80px] pointer-events-none" />
        <div className="section-container relative z-10 text-center max-w-3xl mx-auto">
          <AnimatedSection>
            <span className="section-label justify-center !text-[var(--dorado-suave)]">Nuestra Historia</span>
            <h1 className="!text-white mb-6">
              Quiénes <span className="text-[var(--dorado)]">Somos</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mx-auto">
              Somos una fundación correntina nacida de la urgencia climática y la
              convicción de que la acción local tiene impacto global.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── MISSION & VISION ─── */}
      <section className="bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="glass-card p-8 sm:p-10 h-full border-t-4 border-t-[var(--verde-hoja)]">
                <div className="w-14 h-14 rounded-2xl bg-[var(--verde-palido)] flex items-center justify-center text-2xl mb-6">🎯</div>
                <h2 className="text-2xl mb-4">Misión</h2>
                <p className="text-[var(--gris-calido)] leading-relaxed">
                  Generar acción climática real en la provincia de Corrientes a través de la educación ambiental,
                  la investigación científica y la incidencia en políticas públicas, fortaleciendo la resiliencia
                  de las comunidades y los ecosistemas ante el cambio climático.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className="glass-card p-8 sm:p-10 h-full border-t-4 border-t-[var(--dorado)]">
                <div className="w-14 h-14 rounded-2xl bg-[var(--dorado-claro)] flex items-center justify-center text-2xl mb-6">🔭</div>
                <h2 className="text-2xl mb-4">Visión</h2>
                <p className="text-[var(--gris-calido)] leading-relaxed">
                  Ser la organización de referencia en acción climática en el Nordeste argentino, liderando la
                  transición hacia un modelo de desarrollo sustentable que proteja los ecosistemas únicos de
                  Corrientes y garantice un futuro digno para las próximas generaciones.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="bg-[var(--crema)]">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="section-label justify-center">Lo que nos guía</span>
              <h2>Nuestros Valores</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {valores.map((valor, i) => (
              <AnimatedSection key={valor.title} delay={i * 70}>
                <div className="glass-card p-6 h-full flex gap-4 items-start">
                  <span className="text-2xl mt-0.5 flex-shrink-0">{valor.icon}</span>
                  <div>
                    <h3 className="text-base mb-1">{valor.title}</h3>
                    <p className="text-sm text-[var(--gris-calido)] leading-relaxed">{valor.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="bg-white">
        <div className="section-container">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="section-label justify-center">Las personas detrás</span>
              <h2>Nuestro Equipo</h2>
            </div>
          </AnimatedSection>

          {/* Consejo de Administración */}
          <div className="mb-16">
            <AnimatedSection>
              <h3 className="text-xl text-center mb-4">Consejo de Administración</h3>
              <p className="text-[var(--gris-calido)] text-center max-w-2xl mx-auto mb-8 text-sm">
                El órgano responsable de la conducción institucional y la toma de decisiones estratégicas de la fundación.
              </p>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {consejo.map((miembro, i) => (
                <AnimatedSection key={miembro.nombre} delay={i * 80}>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-[var(--verde-profundo)] mb-1">{miembro.nombre}</h4>
                    <p className="text-sm font-medium text-[var(--dorado)]">{miembro.rol}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Equipo de Coordinación */}
          <div className="mb-16">
            <AnimatedSection delay={200}>
              <h3 className="text-xl text-center mb-4">Equipo de Coordinación</h3>
              <p className="text-[var(--gris-calido)] text-center max-w-2xl mx-auto text-sm">
                Integrado por miembros comprometidos que lideran, organizan y dan seguimiento a los distintos proyectos de la fundación, asegurando su desarrollo e impacto en el territorio.
              </p>
            </AnimatedSection>
          </div>

          {/* Voluntariado */}
          <div>
            <AnimatedSection delay={300}>
              <h3 className="text-xl text-center mb-4">Voluntariado</h3>
              <p className="text-[var(--gris-calido)] text-center max-w-2xl mx-auto text-sm">
                Una red de más de 90 voluntarios en toda la región del NEA que, con compromiso y vocación colectiva, aportan su tiempo y energía para construir un futuro más sostenible.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--verde-profundo) 0%, var(--verde-selva) 100%)" }}
      >
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--dorado)] opacity-[0.05] blur-3xl pointer-events-none" />
        <div className="section-container relative z-10">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="section-label justify-center !text-[var(--dorado-suave)]">Nuestro Camino</span>
              <h2 className="!text-white">Hitos Importantes</h2>
            </div>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto">
            {hitos.map((hito, i) => (
              <AnimatedSection key={hito.year} delay={i * 130}>
                <div className="flex gap-0 items-stretch">
                  {/* Left: year badge + connector line */}
                  <div className="flex flex-col items-center mr-6 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--dorado)] flex items-center justify-center font-bold text-[var(--verde-profundo)] shadow-lg text-sm flex-shrink-0 z-10">
                      {hito.year}
                    </div>
                    {i < hitos.length - 1 && (
                      <div className="w-0.5 flex-1 my-2 bg-gradient-to-b from-[var(--dorado)]/60 to-white/10 min-h-[2rem]" />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className={`pb-${i < hitos.length - 1 ? "10" : "0"} pt-3 flex-1`}>
                    <h3 className="!text-white text-lg mb-1">{hito.title}</h3>
                    <p className="text-white/70 leading-relaxed text-sm">{hito.text}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
