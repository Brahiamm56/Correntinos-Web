"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import type { Orden } from "@/types/database";

export default function PerfilPage() {
  const { user, profile, signOut, loading } = useAuthStore();
  const router = useRouter();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [nombre, setNombre] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/perfil");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("ordenes")
      .select("*")
      .eq("usuario_id", user.id)
      .order("creado_en", { ascending: false })
      .then(({ data }) => {
        if (data) setOrdenes(data);
      });
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const nextNombre = nombre ?? profile?.nombre ?? "";
    setSaving(true);
    const supabase = createClient();
    await supabase.from("usuarios").update({ nombre: nextNombre }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-pulse text-[var(--gris-calido)]">Cargando...</div>
      </div>
    );
  }

  // Si no hay user, el useEffect redirige a login
  if (!user) return null;

  // Si el profile aún no cargó, mostrar página mínima con opción de salir
  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--crema)] pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-[var(--section-padding-x)]">
          <h1 className="text-3xl mb-8">Mi Perfil</h1>
          <div className="glass-card p-8 text-center">
            <p className="text-[var(--gris-calido)] mb-6">No se pudo cargar el perfil. Probá cerrando sesión e ingresando nuevamente.</p>
            <button onClick={handleSignOut} className="btn-secondary">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--crema)] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-[var(--section-padding-x)]">
        <h1 className="text-3xl mb-8">Mi Perfil</h1>

        <div className="glass-card p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            {profile.foto_perfil ? (
              <Image
                src={profile.foto_perfil}
                alt="Perfil"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--verde-palido)] flex items-center justify-center text-2xl font-bold text-[var(--verde-profundo)]">
                {(profile.nombre || profile.email)[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold text-lg">{profile.nombre || "Sin nombre"}</p>
              <p className="text-sm text-[var(--gris-calido)]">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre ?? profile.nombre ?? ""}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              {saved && <span className="text-green-600 text-sm">✓ Guardado</span>}
            </div>
          </form>
        </div>

        {/* Historial de compras */}
        <h2 className="text-xl mb-4">Historial de Compras</h2>
        {ordenes.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-[var(--gris-calido)] mb-4">Aún no tenés compras.</p>
            <Link href="/tienda" className="btn-primary">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {ordenes.map((orden) => (
              <div key={orden.id} className="glass-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{orden.numero_orden}</span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      orden.estado === "procesado"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {orden.estado === "procesado" ? "Procesado" : "Pendiente"}
                  </span>
                </div>
                <div className="text-sm text-[var(--gris-calido)] space-y-1">
                  <p>
                    {new Date(orden.creado_en).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    {orden.productos.length} producto{orden.productos.length !== 1 ? "s" : ""} — <strong className="text-[var(--verde-profundo)]">${orden.total.toLocaleString("es-AR")}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <button onClick={handleSignOut} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
