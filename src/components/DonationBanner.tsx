import Link from "next/link";
import { ArrowRight, Leaf } from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";

const ways = ["Educación ambiental", "Trabajo territorial", "Incidencia climática"];

export default function DonationBanner() {
  return <section id="donar" className="warm-section border-y border-[var(--dorado)]/25">
    <div className="section-container !py-14 sm:!py-20">
      <AnimatedSection><div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-end"><div><span className="section-label"><Leaf size={16} /> Sostener el trabajo</span><h2 className="section-title max-w-4xl">Una comunidad que cuida su territorio puede cambiar su futuro.</h2><p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--gris-calido)]">Cada aporte ayuda a sostener programas y equipos que trabajan de manera continua en Corrientes y el NEA.</p></div><div className="border-t border-[var(--verde-profundo)] pt-6"><p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--verde-hoja)]">Tu apoyo acompaña</p><ul className="mt-5 divide-y divide-[var(--border)]">{ways.map((way) => <li key={way} className="py-3 font-semibold text-[var(--verde-profundo)]">{way}</li>)}</ul><Link href="/donaciones" className="action-primary mt-7">Cómo colaborar <ArrowRight size={18} /></Link></div></div></AnimatedSection>
    </div>
  </section>;
}
