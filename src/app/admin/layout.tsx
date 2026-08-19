"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import {
  LayoutDashboard,
  Newspaper,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/productos", label: "Productos", icon: ShoppingBag },
  { href: "/admin/pedidos", label: "Pedidos", icon: Package },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, profile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sidebarOpen) return;
    sidebarRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleSignOut() {
    await signOut();
    setSidebarOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile toggle */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 border border-gray-200 bg-white p-2 shadow-sm lg:hidden"
        aria-expanded={sidebarOpen}
        aria-controls="admin-sidebar"
        aria-label={sidebarOpen ? "Cerrar navegación" : "Abrir navegación"}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="admin-sidebar"
        aria-label="Navegación de administración"
        className={`fixed inset-y-0 left-0 w-64 bg-[var(--verde-profundo)] text-white transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="border-b border-white/10 p-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/correntinos-logo.png" alt="" width={42} height={42} className="h-10 w-10 object-contain" />
            <div><h2 className="font-sans text-sm font-bold !text-white">Administración</h2><p className="text-[11px] text-white/50">Fundación Correntinos</p></div>
          </Link>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 border-l-2 px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-[var(--dorado)] bg-white/10 text-white"
                    : "border-transparent text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center border border-white/20 text-xs font-bold">
              {(profile?.nombre || profile?.email || "A")[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{profile?.nombre || "Admin"}</p>
              <p className="text-[10px] text-white/40 truncate">{profile?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 py-2 text-center text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white">
              Ver sitio
            </Link>
            <button
              onClick={handleSignOut}
              className="flex flex-1 items-center justify-center gap-1 py-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-red-300"
            >
              <LogOut className="w-3 h-3" />
              Salir
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="px-5 pb-10 pt-20 sm:px-7 lg:p-9">{children}</div>
      </main>
    </div>
  );
}
