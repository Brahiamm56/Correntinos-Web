import type { Metadata } from "next";
import Image from "next/image";
import type { ComponentType } from "react";
import { ArrowRight, ChatRound, Envelope, Instagram, MapPoint, Phone } from "reicon-react";
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
    { Icon: ChatRound, label: "WhatsApp", value: configuration.whatsapp, href: `https://wa.me/${configuration.whatsapp.replace(/[^\d]/g, "")}` },
    { Icon: Instagram, label: "Instagram", value: "@correntinosclim", href: "https://www.instagram.com/correntinosclim/" },
    { Icon: MapPoint, label: "Ubicación", value: configuration.location, href: `https://maps.google.com/?q=${encodeURIComponent(configuration.location)}` },
  ];

  return (
    <div className="pt-[4.75rem]">
      <section className="page-hero relative isolate overflow-hidden dark-section">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/contacto/contacto-fondo.jpg"
            alt="Integrantes de Correntinos Contra el Cambio Climático"
            fill
            sizes="100vw"
            quality={90}
            loading="eager"
            className="object-cover object-[center_54%]"
          />
          <div className="photo-shade absolute inset-0" />
        </div>
        <div className="section-container !py-16 sm:!py-24">
          <AnimatedSection>
            <div className="grid gap-9 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
              <div>
                <span className="section-label !text-[var(--dorado-suave)]">Hablemos</span>
                <h1 className="!text-white">Toda gran idea empieza con una charla.</h1>
              </div>
              <p className="border-t border-white/25 pt-6 text-lg leading-relaxed text-white/72">
                Consultas, propuestas, prensa o ganas de sumarte: elegí el canal que te resulte más cómodo.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-white">
        <div className="section-container !py-16 sm:!py-20">
          <div className="contact-grid mx-auto max-w-5xl">
            {contactInfo.map((item, i) => {
              const Icon = item.Icon;
              return (
                <AnimatedSection key={item.label} delay={i * 90}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="contact-card group"
                  >
                    <span className="impact-icon !h-11 !w-11"><Icon size={23} /></span>
                    <div className="min-w-0"><p className="contact-label">{item.label}</p><p className="font-semibold">{item.value}</p></div>
                    <ArrowRight size={18} aria-hidden />
                  </a>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
