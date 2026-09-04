"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatRound, Envelope, Instagram, MapPoint } from "reicon-react";

const navigation = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tienda", label: "Tienda" },
];
const getInvolved = [
  { href: "/donaciones", label: "Donaciones" },
  { href: "/trabaja-con-nosotros", label: "Trabajá con nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer({ email, phone }: { email: string; phone: string }) {
  const pathname = usePathname();
  const phoneHref = phone.replace(/[^+\d]/g, "");
  if (pathname.startsWith("/admin")) return null;
  return <footer className="bg-[#0a2f23] text-white">
    <div className="section-container !pb-8 !pt-16">
      <div className="mb-14 border-b border-white/15 pb-12 md:grid md:grid-cols-[1.4fr_0.6fr] md:items-end md:gap-12">
        <div><p className="section-label !text-[var(--dorado-suave)]">Corrientes, Argentina</p><h2 className="max-w-3xl !text-[2.4rem] !text-white sm:!text-[3.6rem]">La acción climática también se construye desde casa.</h2></div>
        <Link href="/donaciones" className="mt-8 inline-flex min-h-11 items-center border-b border-[var(--dorado)] pb-2 text-sm font-bold text-[var(--dorado-suave)] md:mt-0 md:justify-self-end">Conocé cómo colaborar</Link>
      </div>
      <div className="grid gap-12 md:grid-cols-[minmax(0,1.7fr)_repeat(2,minmax(0,0.7fr))]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Ir al inicio"><Image src="/correntinos-logo.png" alt="Fundación Correntinos Contra el Cambio Climático" width={64} height={64} quality={95} className="h-14 w-14 object-contain" /><span className="text-lg leading-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>Fundación Correntinos<span className="mt-1 block font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-white/55">Contra el cambio climático</span></span></Link>
          <p className="mt-5 text-sm leading-relaxed text-white/65">Impulsamos educación ambiental, participación ciudadana e incidencia pública para cuidar los ecosistemas y comunidades del Nordeste argentino.</p>
          <div className="mt-7 flex items-center gap-5 text-white/80"><a href="https://www.instagram.com/correntinosclim/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram" className="grid h-11 w-11 place-items-center border border-white/20 transition-colors hover:border-[var(--dorado)] hover:text-[var(--dorado)]"><Instagram size={21} /></a><a href={`https://wa.me/${phoneHref.replace("+", "")}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp" className="grid h-11 w-11 place-items-center border border-white/20 transition-colors hover:border-[var(--dorado)] hover:text-[var(--dorado)]"><ChatRound size={21} /></a><a href={`mailto:${email}`} aria-label="Correo electrónico" title="Correo electrónico" className="grid h-11 w-11 place-items-center border border-white/20 transition-colors hover:border-[var(--dorado)] hover:text-[var(--dorado)]"><Envelope size={21} /></a></div>
        </div>
        <div><h3 className="font-sans text-xs font-bold uppercase tracking-[0.1em] !text-[var(--dorado-suave)]">Navegación</h3><ul className="mt-5 space-y-3">{navigation.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-white/65 transition-colors hover:text-white">{item.label}</Link></li>)}</ul></div>
        <div><h3 className="font-sans text-xs font-bold uppercase tracking-[0.1em] !text-[var(--dorado-suave)]">Involucrate</h3><ul className="mt-5 space-y-3">{getInvolved.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-white/65 transition-colors hover:text-white">{item.label}</Link></li>)}</ul></div>
      </div>
      <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/65 sm:flex-row sm:items-center"><p>© {new Date().getFullYear()} Fundación Correntinos Contra el Cambio Climático.</p><p className="flex items-center gap-1.5"><MapPoint size={15} /> Corrientes, Argentina</p></div>
    </div>
  </footer>;
}
