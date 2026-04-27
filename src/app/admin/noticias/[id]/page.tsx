"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getNoticia, updateNoticia } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditarNoticiaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [publicada, setPublicada] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getNoticia(id).then(({ data }) => {
      if (data) {
        setTitulo(data.titulo);
        setContenido(data.contenido);
        setImagenUrl(data.imagen_url || "");
        setPublicada(data.publicada);
      }
      setFetching(false);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateNoticia(id, {
      titulo,
      contenido,
      imagen_url: imagenUrl || null,
      publicada,
      fecha_publicacion: publicada ? new Date().toISOString() : null,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/admin/noticias");
    router.refresh();
  }

  if (fetching) {
    return <div className="text-gray-400">Cargando...</div>;
  }

  return (
    <div>
      <Link href="/admin/noticias" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a noticias
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Noticia</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
            <input
              id="titulo"
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1.5">URL de imagen</label>
            <input
              id="imagen"
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-1.5">Contenido (HTML)</label>
            <textarea
              id="contenido"
              required
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={publicada}
              onChange={(e) => setPublicada(e.target.checked)}
              className="rounded border-gray-300 text-[var(--verde-hoja)] focus:ring-[var(--verde-claro)]"
            />
            <span className="text-sm font-medium text-gray-700">Publicada</span>
          </label>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
        )}

        <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-[var(--verde-profundo)] text-white font-medium hover:bg-[var(--verde-selva)] transition-colors disabled:opacity-50">
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
