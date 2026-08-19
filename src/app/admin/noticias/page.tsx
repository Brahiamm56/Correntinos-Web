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
import ConfirmDialog from "@/components/admin/ConfirmDialog";
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
  const [deleteTarget, setDeleteTarget] = useState<Noticia | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteNoticia(deleteTarget.id);
    if (result.error) {
      setSaveError(result.error);
      setDeleting(false);
      return;
    }
    setNoticias((prev) => prev.filter((n) => n.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  }

  const filtered = noticias.filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-300 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Contenido</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">Noticias</h1>
            <p className="text-sm text-gray-400 mt-0.5">{noticias.length} artículos en total</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex min-h-11 items-center gap-2 bg-[var(--verde-profundo)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--verde-selva)]"
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
          className="w-full border-b border-gray-300 bg-transparent py-3 pl-10 pr-4 text-sm focus:border-[var(--verde-hoja)] focus:outline-none"
          />
        </div>

        <div className="border-t border-gray-300 bg-white">
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
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100">
                            <Image src={noticia.imagen_url} alt={noticia.titulo} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-gray-100">
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
                        className={`inline-flex items-center gap-1.5 border-b px-1 py-1 text-xs font-semibold transition-colors ${
                          noticia.publicada ? "border-green-600 text-green-700" : "border-gray-400 text-gray-500"
                        }`}
                      >
                        {noticia.publicada ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {noticia.publicada ? "Publicada" : "Borrador"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(noticia)} aria-label={`Editar ${noticia.titulo}`} title="Editar" className="p-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(noticia)} aria-label={`Eliminar ${noticia.titulo}`} title="Eliminar" className="p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
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
            className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
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
            <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p>
          )}

          <div className="flex gap-3 pt-2 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[var(--verde-profundo)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--verde-selva)] disabled:opacity-50"
            >
              {saving ? "Guardando..." : drawer.mode === "create" ? "Crear Noticia" : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={closeDrawer}
              className="border-b border-gray-400 px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-950"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Drawer>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar noticia"
        description={`Vas a eliminar “${deleteTarget?.titulo ?? "esta noticia"}”. Esta acción no se puede deshacer.`}
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
