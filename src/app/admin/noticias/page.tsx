"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Newspaper } from "lucide-react";
import {
  getNoticias,
  createNoticia,
  updateNoticia,
  deleteNoticia,
  toggleNoticiaPublicada,
} from "./actions";
import Drawer from "@/components/admin/Drawer";
import RichEditor from "@/components/admin/RichEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Noticia } from "@/types/database";

interface DrawerState {
  open: boolean;
  mode: "create" | "edit";
  item: Noticia | null;
}

const emptyForm = {
  titulo: "",
  contenido: "",
  imagen_url: "",
  publicada: true,
};

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState<DrawerState>({ open: false, mode: "create", item: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  async function refreshNoticias() {
    const { data, error } = await getNoticias();
    if (error) {
      setSaveError(error);
      setNoticias([]);
      setLoading(false);
      return;
    }
    setNoticias(data);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function loadNoticias() {
      const { data, error } = await getNoticias();
      if (!active) return;

      if (error) {
        setSaveError(error);
        setNoticias([]);
        setLoading(false);
        return;
      }

      setNoticias(data);
      setLoading(false);
    }

    void loadNoticias();

    return () => {
      active = false;
    };
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setSaveError("");
    setDrawer({ open: true, mode: "create", item: null });
  }

  function openEdit(noticia: Noticia) {
    setForm({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      imagen_url: noticia.imagen_url || "",
      publicada: noticia.publicada,
    });
    setSaveError("");
    setDrawer({ open: true, mode: "edit", item: noticia });
  }

  function closeDrawer() {
    setDrawer((d) => ({ ...d, open: false }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setSaveError("Título y contenido son obligatorios");
      return;
    }
    setSaving(true);
    setSaveError("");

    const payload = {
      titulo: form.titulo.trim(),
      contenido: form.contenido,
      imagen_url: form.imagen_url || null,
      publicada: form.publicada,
      fecha_publicacion: form.publicada ? new Date().toISOString() : null,
    };

    let result;
    if (drawer.mode === "create") {
      result = await createNoticia(payload);
    } else if (drawer.item) {
      result = await updateNoticia(drawer.item.id, payload);
    }

    if (result?.error) {
      setSaveError(result.error);
      setSaving(false);
      return;
    }
    await refreshNoticias();
    closeDrawer();
    setSaving(false);
  }

  async function togglePublicada(id: string, publicada: boolean) {
    const result = await toggleNoticiaPublicada(id, publicada);
    if (result.error) {
      setSaveError(result.error);
      return;
    }
    await refreshNoticias();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta noticia? Esta acción no se puede deshacer.")) return;
    const result = await deleteNoticia(id);
    if (result.error) {
      setSaveError(result.error);
      return;
    }
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Noticias</h1>
            <p className="text-sm text-gray-400 mt-0.5">{noticias.length} artículos en total</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--verde-profundo)] text-white text-sm font-medium hover:bg-[var(--verde-selva)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Noticia
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título..."
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
              <Newspaper className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">{search ? "Sin resultados." : "No hay noticias. Creá la primera."}</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-4 font-medium text-gray-500">Noticia</th>
                  <th className="text-left p-4 font-medium text-gray-500 hidden lg:table-cell">Fecha</th>
                  <th className="text-left p-4 font-medium text-gray-500">Estado</th>
                  <th className="text-right p-4 font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((noticia) => (
                  <tr key={noticia.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {noticia.imagen_url ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                            <Image src={noticia.imagen_url} alt={noticia.titulo} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <p className="font-medium line-clamp-2 leading-snug max-w-xs">{noticia.titulo}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 hidden lg:table-cell whitespace-nowrap">
                      {new Date(noticia.fecha_creacion).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => togglePublicada(noticia.id, noticia.publicada)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          noticia.publicada ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {noticia.publicada ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {noticia.publicada ? "Publicada" : "Borrador"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(noticia)} title="Editar" className="p-2 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(noticia.id)} title="Eliminar" className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
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

      {/* Drawer — RIGHT side */}
      <Drawer
        open={drawer.open}
        onClose={closeDrawer}
        title={drawer.mode === "create" ? "Nueva Noticia" : "Editar Noticia"}
        side="right"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de portada</label>
            <ImageUpload
              value={form.imagen_url}
              onChange={(url) => setForm((f) => ({ ...f, imagen_url: url }))}
              folder="noticias"
            />
          </div>

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1.5">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              id="titulo"
              type="text"
              required
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
              placeholder="Título de la noticia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contenido <span className="text-red-500">*</span>
            </label>
            <RichEditor
              value={form.contenido}
              onChange={(html) => setForm((f) => ({ ...f, contenido: html }))}
              placeholder="Escribí el contenido de la noticia..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group select-none">
            <button
              type="button"
              role="switch"
              aria-checked={form.publicada}
              onClick={() => setForm((f) => ({ ...f, publicada: !f.publicada }))}
              className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.publicada ? "bg-[var(--verde-hoja)]" : "bg-gray-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.publicada ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {form.publicada ? "Publicar inmediatamente" : "Guardar como borrador"}
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
              {saving ? "Guardando..." : drawer.mode === "create" ? "Crear Noticia" : "Guardar Cambios"}
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
