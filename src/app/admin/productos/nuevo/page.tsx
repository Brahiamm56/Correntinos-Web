"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Categoria } from "@/types/database";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "0",
    imagen_url: "",
    categoria_id: "",
    activo: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("categorias").select("*").order("nombre").then(({ data }) => {
      if (data) setCategorias(data);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("productos").insert({
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      imagen_url: form.imagen_url || null,
      categoria_id: form.categoria_id || null,
      activo: form.activo,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/productos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a productos
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Producto</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
            <input id="nombre" type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea id="descripcion" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1.5">Precio ($)</label>
              <input id="precio" type="number" required min="0" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
              <input id="stock" type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1.5">URL de imagen</label>
            <input id="imagen" type="url" value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm" placeholder="https://..." />
          </div>
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
            <select id="categoria" value={form.categoria_id} onChange={(e) => setForm({ ...form, categoria_id: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm">
              <option value="">Sin categoría</option>
              {categorias.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="rounded border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Activo (visible en tienda)</span>
          </label>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-[var(--verde-profundo)] text-white font-medium hover:bg-[var(--verde-selva)] transition-colors disabled:opacity-50">
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}
