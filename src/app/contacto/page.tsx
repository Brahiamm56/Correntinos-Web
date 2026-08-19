import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Envelope, Instagram, MapPoint, MessageCircle, Phone } from "reicon-react";
import AnimatedSection from "@/components/AnimatedSection";
import { getPublicConfiguration } from "@/lib/configuracion";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá a la Fundación Correntinos Contra el Cambio Climático. Encontrá nuestros datos de contacto, redes sociales y ubicación.",
};

type IconComponent = ComponentType<{ size?: number; className?: string }>;

export default async function ContactoPage() {
  const configuration = await getPublicConfiguration();
  const phoneHref = configuration.phone.replace(/[^+\d]/g, "");
  const contactInfo: { Icon: IconComponent; label: string; value: string; href: string }[] = [
    { Icon: Envelope, label: "Email", value: configuration.email, href: `mailto:${configuration.email}` },
    { Icon: Phone, label: "Teléfono", value: configuration.phone, href: `tel:${phoneHref}` },
    { Icon: Instagram, label: "Instagram", value: "@correntinosclim", href: "https://www.instagram.com/correntinosclim/" },
    { Icon: MapPoint, label: "Ubicación", value: "Corrientes, Argentina", href: "https://maps.google.com/?q=Corrientes,Argentina" },
  ];

  return (
    <div className="pt-[4.75rem]">
      <section className="dark-section">
        <div className="section-container !py-16 sm:!py-24">
          <AnimatedSection>
            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
              <div><span className="section-label !text-[var(--dorado-suave)]">Hablemos</span><h1 className="!text-white">Las buenas alianzas empiezan con una conversación.</h1></div>
              <p className="border-t border-white/25 pt-6 text-lg leading-relaxed text-white/72">Consultas, propuestas, prensa o ganas de sumarte: elegí el canal que te resulte más cómodo.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white">
        <div className="section-container !py-16 sm:!py-20">
          <div className="mx-auto max-w-5xl border-t border-[var(--border-strong)]">
            {contactInfo.map((item, i) => {
              const Icon = item.Icon;
              return (
                <AnimatedSection key={item.label} delay={i * 90}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group grid min-h-24 grid-cols-[2.5rem_minmax(6rem,0.5fr)_minmax(0,1.5fr)] items-center gap-4 border-b border-[var(--border)] py-5 transition-colors hover:text-[var(--verde-hoja)] sm:gap-8"
                  >
                    <Icon size={24} className="text-[var(--verde-hoja)]" />
                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[var(--gris-calido)]">{item.label}</p>
                    <p className="break-words font-semibold text-[var(--verde-profundo)] transition-colors group-hover:text-[var(--verde-hoja)]">{item.value}</p>
                  </a>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="warm-section border-t border-[var(--dorado)]/25">
        <div className="section-container !py-16 sm:!py-20">
          <AnimatedSection>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div><MessageCircle size={28} className="text-[var(--verde-hoja)]" /><h2 className="section-title mt-5">¿Preferís WhatsApp?</h2><p className="mt-4 text-lg text-[var(--gris-calido)]">Escribinos directamente para consultas, propuestas o colaboraciones.</p></div>
              <a
                href={`https://wa.me/${phoneHref.replace("+", "")}?text=${encodeURIComponent("Hola, me interesa saber más sobre la fundación.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="action-primary"
              >
                <MessageCircle size={20} />
                Escribinos por WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
