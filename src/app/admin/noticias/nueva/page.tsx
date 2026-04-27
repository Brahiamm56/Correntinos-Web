"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NuevaNoticiaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [publicada, setPublicada] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.from("noticias").insert({
      titulo,
      contenido,
      imagen_url: imagenUrl || null,
      publicada,
      fecha_publicacion: publicada ? new Date().toISOString() : null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/noticias");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/noticias" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a noticias
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nueva Noticia</h1>

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
              placeholder="Título de la noticia"
            />
          </div>

          <div>
            <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1.5">URL de imagen (opcional)</label>
            <input
              id="imagen"
              type="url"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
              placeholder="https://..."
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
              placeholder="<p>Contenido de la noticia...</p>"
            />
            <p className="text-xs text-gray-400 mt-1">Podés usar HTML básico: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;strong&gt;, &lt;em&gt;, etc.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={publicada}
              onChange={(e) => setPublicada(e.target.checked)}
              className="rounded border-gray-300 text-[var(--verde-hoja)] focus:ring-[var(--verde-claro)]"
            />
            <span className="text-sm font-medium text-gray-700">Publicar inmediatamente</span>
          </label>
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>
        )}

        <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-[var(--verde-profundo)] text-white font-medium hover:bg-[var(--verde-selva)] transition-colors disabled:opacity-50">
          {loading ? "Creando..." : "Crear Noticia"}
        </button>
      </form>
    </div>
  );
}
