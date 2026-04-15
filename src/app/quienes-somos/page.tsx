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
  { icon: "💡", title: "Innovación", description: "Buscamos soluciones creativas a los desafíos ambientales." },
];

const equipo = [
  {
    nombre: "Guido Paparella",
    rol: "Presidente",
    bio: "Fundador y líder de la iniciativa. Apasionado por la acción climática y el desarrollo sustentable en la provincia de Corrientes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden>
        <circle cx="24" cy="18" r="9" fill="currentColor" opacity="0.9" />
        <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M34 10l3 3-3 3" stroke="var(--dorado)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: "var(--verde-hoja)",
  },
  {
    nombre: "Equipo Técnico",
    rol: "Investigación y Proyectos",
    bio: "Un grupo multidisciplinario de profesionales comprometidos con la generación de datos y la implementación de proyectos ambientales.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden>
        <circle cx="16" cy="20" r="7" fill="currentColor" opacity="0.7" />
        <circle cx="32" cy="20" r="7" fill="currentColor" opacity="0.9" />
        <path d="M2 40c0-7.18 6.268-13 14-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M46 40c0-7.18-6.268-13-14-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M16 27c2.4-1.3 5-2 8-2s5.6.7 8 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
      </svg>
    ),
    accent: "var(--verde-selva)",
  },
  {
    nombre: "Voluntarios",
    rol: "Red de Acción",
    bio: "Más de 30 voluntarios activos que llevan la misión de la fundación a cada rincón de Corrientes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" aria-hidden>
        <path d="M24 6C14 6 6 14 6 24s8 18 18 18 18-8 18-18S34 6 24 6z" fill="currentColor" opacity="0.15" />
        <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 24h4M36 24h4M24 8v4M24 36v4" stroke="var(--dorado)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    accent: "var(--verde-claro)",
  },
];

const hitos = [
  { year: "2024", title: "El inicio", text: "Nace la idea de crear una fundación climática en Corrientes, impulsada por la urgencia de los incendios en los Esteros del Iberá." },
  { year: "2025", title: "Formalización", text: "Constitución legal de la fundación y lanzamiento de los primeros proyectos de educación ambiental en escuelas rurales." },
  { year: "2026", title: "Escala", text: "Primer inventario provincial de emisiones GEI y expansión del programa educativo a 12 escuelas, alcanzando 500+ estudiantes." },
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {equipo.map((miembro, i) => (
              <AnimatedSection key={miembro.nombre} delay={i * 100}>
                <div className="text-center flex flex-col items-center">
                  {/* Illustrated role avatar */}
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${miembro.accent}22, ${miembro.accent}44)`,
                      border: `2px solid ${miembro.accent}33`,
                      color: miembro.accent,
                    }}
                  >
                    {miembro.icon}
                  </div>
                  <h3 className="text-lg mb-1">{miembro.nombre}</h3>
                  <p className="text-sm font-semibold text-[var(--dorado)] mb-3">{miembro.rol}</p>
                  <p className="text-sm text-[var(--gris-calido)] leading-relaxed">{miembro.bio}</p>
                </div>
              </AnimatedSection>
            ))}
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
