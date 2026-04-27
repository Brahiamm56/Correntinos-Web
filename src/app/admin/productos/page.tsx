"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, ShoppingBag, AlertTriangle } from "lucide-react";
import Drawer from "@/components/admin/Drawer";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Categoria } from "@/types/database";

interface ProductoAdmin {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen_url: string | null;
  categoria_id: string | null;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  categoria: Categoria | null;
}

interface DrawerState {
  open: boolean;
  mode: "create" | "edit";
  item: ProductoAdmin | null;
}

const emptyForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagen_url: "",
  categoria_id: "",
  activo: true,
};

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState<DrawerState>({ open: false, mode: "create", item: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function refreshData() {
    const supabase = createClient();
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("productos").select("*, categoria:categorias(*)").order("creado_en", { ascending: false }),
      supabase.from("categorias").select("*").order("nombre"),
    ]);
    setProductos((prods || []) as ProductoAdmin[]);
    setCategorias(cats || []);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function loadData() {
      const supabase = createClient();
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase
          .from("productos")
          .select("*, categoria:categorias(*)")
          .order("creado_en", { ascending: false }),
        supabase.from("categorias").select("*").order("nombre"),
      ]);

      if (!active) return;

      setProductos((prods || []) as ProductoAdmin[]);
      setCategorias(cats || []);
      setLoading(false);
    }

    void loadData();

    return () => {
      active = false;
    };
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setSaveError("");
    setDrawer({ open: true, mode: "create", item: null });
  }

  function openEdit(producto: ProductoAdmin) {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen_url: producto.imagen_url || "",
      categoria_id: producto.categoria_id || "",
      activo: producto.activo,
    });
    setSaveError("");
    setDrawer({ open: true, mode: "edit", item: producto });
  }

  function closeDrawer() {
    setDrawer((d) => ({ ...d, open: false }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.precio) {
      setSaveError("Nombre y precio son obligatorios");
      return;
    }
    setSaving(true);
    setSaveError("");
    const supabase = createClient();

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion || null,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock) || 0,
      imagen_url: form.imagen_url || null,
      categoria_id: form.categoria_id || null,
      activo: form.activo,
    };

    let error;
    if (drawer.mode === "create") {
      ({ error } = await supabase.from("productos").insert(payload));
    } else if (drawer.item) {
      ({ error } = await supabase.from("productos").update(payload).eq("id", drawer.item.id));
    }

    if (error) {
      setSaveError(error.message);
      setSaving(false);
      return;
    }
    await refreshData();
    closeDrawer();
    setSaving(false);
  }

  async function toggleActivo(id: string, activo: boolean) {
    const supabase = createClient();
    await supabase.from("productos").update({ activo: !activo }).eq("id", id);
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !activo } : p)));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    const supabase = createClient();
    await supabase.from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.categoria?.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm";

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-400 mt-0.5">{productos.length} productos en total</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--verde-profundo)] text-white text-sm font-medium hover:bg-[var(--verde-selva)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[var(--verde-claro)] focus:outline-none bg-white"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-[var(--verde-hoja)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Cargando...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">{search ? "Sin resultados." : "No hay productos. Creá el primero."}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-500">Producto</th>
                  <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Categoría</th>
                  <th className="text-right p-4 font-medium text-gray-500">Precio</th>
                  <th className="text-right p-4 font-medium text-gray-500">Stock</th>
                  <th className="text-center p-4 font-medium text-gray-500">Estado</th>
                  <th className="text-right p-4 font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                          {p.imagen_url ? (
                            <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{p.nombre}</p>
                          {p.descripcion && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{p.descripcion}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 hidden md:table-cell">{p.categoria?.nombre || "—"}</td>
                    <td className="p-4 text-right font-medium">${Number(p.precio).toLocaleString("es-AR")}</td>
                    <td className="p-4 text-right">
                      <span className={`font-medium inline-flex items-center gap-1 ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>
                        {p.stock <= 5 && <AlertTriangle className="w-3 h-3" />}
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleActivo(p.id, p.activo)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          p.activo ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {p.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {p.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} title="Editar" className="p-2 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} title="Eliminar" className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Drawer — LEFT side */}
      <Drawer
        open={drawer.open}
        onClose={closeDrawer}
        title={drawer.mode === "create" ? "Nuevo Producto" : "Editar Producto"}
        side="left"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
            <ImageUpload
              value={form.imagen_url}
              onChange={(url) => setForm((f) => ({ ...f, imagen_url: url }))}
              folder="productos"
              aspectRatio="1/1"
            />
          </div>

          <div>
            <label htmlFor="p-nombre" className="block text-sm font-medium text-gray-700 mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              id="p-nombre"
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className={inputClass}
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label htmlFor="p-desc" className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
            <textarea
              id="p-desc"
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              rows={3}
              className={inputClass}
              placeholder="Descripción breve del producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="p-precio" className="block text-sm font-medium text-gray-700 mb-1.5">
                Precio ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="p-precio"
                type="number"
                required
                min="0"
                step="0.01"
                value={form.precio}
                onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="p-stock" className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
              <input
                id="p-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="p-cat" className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
            <select
              id="p-cat"
              value={form.categoria_id}
              onChange={(e) => setForm((f) => ({ ...f, categoria_id: e.target.value }))}
              className={inputClass}
            >
              <option value="">Sin categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <button
              type="button"
              role="switch"
              aria-checked={form.activo}
              onClick={() => setForm((f) => ({ ...f, activo: !f.activo }))}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.activo ? "bg-[var(--verde-hoja)]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {form.activo ? "Visible en la tienda" : "Oculto en la tienda"}
            </span>
          </label>

          {saveError && (
            <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{saveError}</p>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-lg bg-[var(--verde-profundo)] text-white font-medium hover:bg-[var(--verde-selva)] transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? "Guardando..." : drawer.mode === "create" ? "Crear Producto" : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="px-5 py-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Drawer>
    </>
  );
}
