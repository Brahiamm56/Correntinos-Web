"use client";

import Link from "next/link";
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
import { useState } from "react";

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
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[var(--verde-profundo)] text-white transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6">
          <Link href="/admin" className="block">
            <h2 className="text-lg font-bold text-white mb-1">Admin Panel</h2>
            <p className="text-xs text-white/50">Fundación Correntinos</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/10"
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
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {(profile?.nombre || profile?.email || "A")[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{profile?.nombre || "Admin"}</p>
              <p className="text-[10px] text-white/40 truncate">{profile?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 text-center text-xs text-white/50 hover:text-white py-2 rounded-lg hover:bg-white/10 transition-colors">
              Ver sitio
            </Link>
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-1 text-xs text-white/50 hover:text-red-300 py-2 rounded-lg hover:bg-white/10 transition-colors"
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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
