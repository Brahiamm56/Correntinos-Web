"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ChatRound, Envelope, Instagram, Menu, ShoppingCart, User, X } from "reicon-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tienda", label: "Tienda" },
  { href: "/contacto", label: "Contacto" },
];

const subscribeToScroll = (callback: () => void) => {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
};
const getScrollSnapshot = () => window.scrollY > 24;
const getServerScrollSnapshot = () => false;
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerClientSnapshot = () => false;

export default function Header() {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const clientReady = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerClientSnapshot);
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrollSnapshot, getServerScrollSnapshot);
  const menuOpen = openPath === pathname;
  const { user, profile } = useAuthStore();
  const storedCartCount = useCartStore((state) => state.getCount());
  const cartCount = clientReady ? storedCartCount : 0;
  const hideChrome = pathname.startsWith("/admin");
  const isTransparent = pathname === "/" && !scrolled;
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) {
      window.requestAnimationFrame(() => {
        menuPanelRef.current?.querySelector<HTMLElement>("[data-menu-first]")?.focus();
      });
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !menuPanelRef.current) return;
      const focusable = Array.from(menuPanelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);
  if (hideChrome) return null;

  const mobileMenu = (
    <>
      <button ref={menuButtonRef} type="button" onClick={() => setOpenPath((path) => path === pathname ? null : pathname)} className={`fixed right-[var(--section-padding-x)] top-4 z-[100] grid h-11 w-11 place-items-center transition-colors lg:hidden ${menuOpen || isTransparent ? "text-white" : "text-[var(--verde-profundo)]"}`} aria-controls="mobile-navigation" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} title={menuOpen ? "Cerrar menú" : "Abrir menú"} data-navigation-ready={clientReady ? "true" : undefined}>
        {menuOpen ? <X size={22} /> : <Menu size={23} />}
      </button>
      {cartCount > 0 && !menuOpen && (
        <Link href="/tienda/carrito" aria-label={`Ver carrito (${cartCount})`} className={`cart-pop fixed right-[calc(var(--section-padding-x)+3.5rem)] top-4 z-[99] grid h-11 w-11 place-items-center transition-colors lg:hidden ${isTransparent ? "text-white" : "text-[var(--verde-profundo)]"}`} title="Ver carrito">
          <ShoppingCart size={21} /><span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center bg-[var(--dorado)] px-1 text-[9px] font-bold text-[var(--verde-profundo)]">{cartCount}</span>
        </Link>
      )}
      <div ref={menuPanelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navegación principal" className={`fixed inset-0 z-[90] overflow-y-auto bg-[#0a2f23] px-[var(--section-padding-x)] py-28 transition-opacity duration-300 lg:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!menuOpen}>
        <div className="mx-auto flex min-h-full max-w-md flex-col justify-between">
          <div>
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.12em] text-[var(--dorado-suave)]">Fundación Correntinos</p>
            <nav aria-label="Navegación principal móvil"><ul className="space-y-2">
              {navLinks.map((link, index) => <li key={link.href} className={`transition-all duration-500 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`} style={{ transitionDelay: menuOpen ? `${80 + index * 55}ms` : "0ms" }}>
                <Link data-menu-first={index === 0 ? "true" : undefined} href={link.href} className={`flex items-center justify-between border-b border-white/10 py-4 text-[2rem] transition-colors ${isActive(link.href) ? "text-[var(--dorado)]" : "text-white"}`} style={{ fontFamily: "var(--font-heading)" }}>
                  {link.label}<ArrowRight size={22} weight="Outline" />
                </Link>
              </li>)}
            </ul></nav>
          </div>
          <div className="pt-12">
            <Link href="/donaciones" className="action-primary w-full">Quiero colaborar <ArrowRight size={18} /></Link>
            <Link href="/trabaja-con-nosotros" className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-white/35 text-sm font-bold text-white">Sumarme como voluntario <ArrowRight size={17} /></Link>
            <div className="mt-8 flex items-center gap-3 text-white/70">
              <a href="https://www.instagram.com/correntinosclim/" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram"><Instagram size={22} /></a>
              <a href="https://wa.me/543794059015" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp"><ChatRound size={22} /></a>
              <a href="mailto:correntinosclim@gmail.com" title="Correo electrónico" aria-label="Correo electrónico"><Envelope size={22} /></a>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <>
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${isTransparent ? "border-transparent bg-transparent" : "border-[var(--border)] bg-white/95 shadow-[0_8px_28px_rgba(16,60,46,0.06)] backdrop-blur-xl"}`}>
      <nav className="mx-auto flex h-[4.75rem] max-w-[var(--container-max)] items-center justify-between px-[var(--section-padding-x)]" aria-label="Navegación principal">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3" aria-label="Ir al inicio">
          <Image
            src="/correntinos-logo.png"
            alt="Fundación Correntinos Contra el Cambio Climático"
            width={64}
            height={64}
            quality={95}
            priority
            className="h-11 w-11 sm:h-12 sm:w-12 object-contain shrink-0"
          />
          <span
            className={`text-base font-bold leading-tight sm:hidden ${
              isTransparent ? "text-white" : "text-[var(--verde-profundo)]"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Correntinos Contra el Cambio Climático
          </span>
          <span
            className={`hidden text-sm leading-tight sm:block ${
              isTransparent ? "text-white" : "text-[var(--verde-profundo)]"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Correntinos
            <span className="mt-0.5 block font-sans text-[9px] font-bold uppercase tracking-[0.1em] opacity-70">
              Contra el cambio climático
            </span>
          </span>
        </Link>
        <ul className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => <li key={link.href}><Link href={link.href} className={`relative py-2 text-sm font-bold transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-[var(--dorado)] after:transition-transform ${isActive(link.href) ? `${isTransparent ? "text-white" : "text-[var(--verde-profundo)]"} after:scale-x-100` : `${isTransparent ? "text-white/75 hover:text-white" : "text-[var(--gris-medio)] hover:text-[var(--verde-profundo)]"} after:scale-x-0 hover:after:scale-x-100`}`}>{link.label}</Link></li>)}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/tienda/carrito" className={`relative grid h-10 w-10 place-items-center transition-colors ${isTransparent ? "text-white hover:text-[var(--dorado)]" : "text-[var(--verde-profundo)] hover:text-[var(--verde-hoja)]"}`} aria-label="Ver carrito" title="Ver carrito"><ShoppingCart size={21} />{cartCount > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center bg-[var(--dorado)] px-1 text-[9px] font-bold text-[var(--verde-profundo)]">{cartCount}</span>}</Link>
          {user ? <Link href={profile?.rol === "admin" ? "/admin" : "/perfil"} className={`grid h-11 w-11 place-items-center transition-colors ${isTransparent ? "text-white hover:text-[var(--dorado)]" : "text-[var(--verde-profundo)] hover:text-[var(--verde-hoja)]"}`} aria-label="Mi perfil" title="Mi perfil"><User size={21} /></Link> : <Link href="/auth/login" className={`action-quiet px-2 ${isTransparent ? "!text-white" : ""}`}>Ingresar</Link>}
          <Link href="/donaciones" className="action-primary ml-1">Colaborar <ArrowRight size={16} /></Link>
        </div>
        <div className="h-11 w-11 lg:hidden" aria-hidden />
      </nav>
    </header>
    {mobileMenu}
  </>;
}
