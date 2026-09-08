"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, ChatRound, Envelope, Instagram, Menu, ShoppingCart, User, X } from "reicon-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { gsap, registerGsap } from "@/lib/gsap";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/noticias", label: "Noticias" },
  { href: "/tienda", label: "Tienda" },
  { href: "/contacto", label: "Contacto" },
];
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerClientSnapshot = () => false;

export default function Header({ whatsapp, email }: { whatsapp: string; email: string }) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const clientReady = useSyncExternalStore(subscribeToClient, getClientSnapshot, getServerClientSnapshot);
  const menuOpen = openPath === pathname;
  const { user, profile } = useAuthStore();
  const storedCartCount = useCartStore((state) => state.getCount());
  const cartCount = clientReady ? storedCartCount : 0;
  const accountHref = user ? (profile?.rol === "admin" ? "/admin" : "/perfil") : "/auth/login";
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = document.querySelectorAll<HTMLElement>("#contenido, .site-footer, .site-header, .skip-link");
    background.forEach((element) => { element.inert = true; });
    menuPanelRef.current?.querySelector<HTMLElement>("[data-menu-first]")?.focus();
    const frame = window.requestAnimationFrame(() => menuPanelRef.current?.querySelector<HTMLElement>("[data-menu-first]")?.focus());
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setOpenPath(null); };
    desktop.addEventListener("change", onResize);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPath(null);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      if (event.key !== "Tab" || !menuPanelRef.current) return;
      const focusable = Array.from(menuPanelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      background.forEach((element) => { element.inert = false; });
      desktop.removeEventListener("change", onResize);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  useLayoutEffect(() => {
    if (!menuOpen || !menuPanelRef.current) return;
    registerGsap();
    const context = gsap.context(() => {
      gsap.fromTo(menuPanelRef.current, { opacity: 0, yPercent: -1.5 }, { opacity: 1, yPercent: 0, duration: 0.42, ease: "power3.out" });
      gsap.fromTo("[data-menu-item]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.055, delay: 0.08, ease: "power3.out" });
      gsap.fromTo("[data-menu-action]", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.36, stagger: 0.06, delay: 0.35, ease: "power2.out" });
    }, menuPanelRef);
    return () => context.revert();
  }, [menuOpen]);

  return <>
    <header className="site-header">
      <nav className="header-inner" aria-label="Navegación principal">
        <Link href="/" className="brand" aria-label="Fundación Correntinos · Ir al inicio">
          <Image src="/cccclogo.png" alt="" width={48} height={48} quality={95} priority className="brand-symbol" />
          <span className="brand-wordmark">Correntinos<span>Contra el cambio climático</span></span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => <li key={link.href}><Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className="nav-link">{link.label}</Link></li>)}
        </ul>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link href="/tienda/carrito" className="icon-button relative" aria-label="Ver carrito" title="Ver carrito">
            <ShoppingCart size={21} />{cartCount > 0 && <span className="cart-badge cart-pop">{cartCount}</span>}
          </Link>
          <Link href={accountHref} className="icon-button hidden lg:inline-flex" aria-label={user ? "Mi perfil" : "Ingresar"} title={user ? "Mi perfil" : "Ingresar"}><User size={21} /></Link>
          <Link href="/donaciones" className="action-primary !hidden lg:!inline-flex">Colaborar <ArrowRight size={16} /></Link>
          <button ref={menuButtonRef} type="button" onClick={() => setOpenPath(pathname)} className="icon-button lg:!hidden" aria-controls="mobile-navigation" aria-label="Abrir menú" aria-expanded={menuOpen} data-navigation-ready={clientReady ? "true" : undefined}><Menu size={23} /></button>
        </div>
      </nav>
    </header>
    {menuOpen && <div ref={menuPanelRef} id="mobile-navigation" role="dialog" aria-modal="true" aria-label="Navegación principal" className="mobile-menu">
      <div className="mobile-menu-top"><Link href="/" className="mobile-menu-brand" aria-label="Fundación Correntinos · Ir al inicio" onClick={() => setOpenPath(null)}><Image src="/cccclogo.png" alt="" width={44} height={44} quality={95} className="mobile-menu-logo" /><span className="brand-wordmark">Correntinos<span>Una comunidad en acción</span></span></Link><button type="button" className="icon-button" aria-label="Cerrar menú" onClick={() => { setOpenPath(null); window.requestAnimationFrame(() => menuButtonRef.current?.focus()); }}><X size={23} /></button></div>
      <nav aria-label="Navegación principal móvil"><ul>
        {navLinks.map((link, index) => <li key={link.href}><Link data-menu-first={index === 0 ? "true" : undefined} data-menu-item href={link.href} onClick={() => setOpenPath(null)} aria-current={isActive(link.href) ? "page" : undefined} className="mobile-nav-link"><span className="mobile-nav-index" aria-hidden="true">0{index + 1}</span><span className="mobile-nav-label">{link.label}</span><ArrowRight size={20} /></Link></li>)}
      </ul></nav>
      <div className="mobile-menu-actions">
        <Link data-menu-action href="/donaciones" onClick={() => setOpenPath(null)} className="action-primary w-full">Quiero colaborar <ArrowRight size={18} /></Link>
        <Link data-menu-action href="/trabaja-con-nosotros" onClick={() => setOpenPath(null)} className="action-link">Sumarme como voluntario <ArrowRight size={17} /></Link>
        <Link data-menu-action href={accountHref} onClick={() => setOpenPath(null)} className="mobile-account"><User size={20} />{user ? "Mi cuenta" : "Ingresar a mi cuenta"}<ArrowRight size={17} /></Link>
        <div data-menu-action className="flex gap-2">
          <a href="https://www.instagram.com/correntinosclim/" target="_blank" rel="noopener noreferrer" className="icon-button" aria-label="Instagram"><Instagram size={21} /></a>
          <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="icon-button" aria-label="WhatsApp"><ChatRound size={21} /></a>
          <a href={`mailto:${email}`} className="icon-button" aria-label="Correo electrónico"><Envelope size={21} /></a>
        </div>
      </div>
    </div>}
  </>;
}
