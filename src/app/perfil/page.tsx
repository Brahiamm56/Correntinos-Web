"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserOrders, updateUserName } from "@/app/perfil/actions";
import Image from "next/image";
import Link from "next/link";
import type { Orden } from "@/types/database";
import { CheckCircle } from "reicon-react";

export default function PerfilPage() {
  const { user, profile, signOut, loading, initialize } = useAuthStore();
  const router = useRouter();
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [nombre, setNombre] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/perfil");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getUserOrders().then(({ data }) => {
      if (data) setOrdenes(data);
    });
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const nextNombre = nombre ?? profile?.nombre ?? "";
    setSaving(true);
    setError("");
    const res = await updateUserName(nextNombre);
    setSaving(false);
    if (!res.error) {
      setSaved(true);
      await initialize();
      setTimeout(() => setSaved(false), 2000);
    } else {
      setError(res.error);
    }
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

  if (!user) return null;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-[var(--section-padding-x)]">
          <h1 className="text-3xl mb-8">Mi Perfil</h1>
          <div className="border-y border-[var(--border-strong)] py-8">
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
    <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-[var(--section-padding-x)]">
        <h1 className="text-3xl mb-8">Mi Perfil</h1>

        <section className="mb-10 border-y border-[var(--border-strong)] py-8">
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
                className="field"
              />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              {saved && <span role="status" className="inline-flex items-center gap-2 text-sm text-green-700"><CheckCircle size={17} />Guardado</span>}
            </div>
            {error && <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          </form>
        </section>

        <h2 className="text-xl mb-4">Historial de pedidos</h2>
        {ordenes.length === 0 ? (
          <div className="border-y border-[var(--border)] py-8">
            <p className="text-[var(--gris-calido)] mb-4">Aún no tenés pedidos.</p>
            <Link href="/tienda" className="btn-primary">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="border-t border-[var(--border-strong)]">
            {ordenes.map((orden) => (
              <div key={orden.id} className="border-b border-[var(--border)] py-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{orden.numero_orden}</span>
                  <span
                    className={`inline-flex items-center gap-2 border-b px-1 py-1 text-xs font-semibold ${
                      orden.estado === "procesado"
                        ? "border-green-600 text-green-700"
                        : "border-amber-500 text-amber-700"
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
                    {orden.productos.length} producto{orden.productos.length !== 1 ? "s" : ""} — <strong className="text-[var(--verde-profundo)]">${Number(orden.total).toLocaleString("es-AR")}</strong>
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
