"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Noticia } from "@/types/database";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default function NoticiasAdminList({ noticias: initial }: { noticias: Noticia[] }) {
  const [noticias, setNoticias] = useState(initial);

  async function togglePublicada(id: string, publicada: boolean) {
    const supabase = createClient();
    await supabase.from("noticias").update({
      publicada: !publicada,
      fecha_publicacion: !publicada ? new Date().toISOString() : null,
    }).eq("id", id);

    setNoticias((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, publicada: !publicada, fecha_publicacion: !publicada ? new Date().toISOString() : null } : n
      )
    );
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar esta noticia?")) return;
    const supabase = createClient();
    await supabase.from("noticias").delete().eq("id", id);
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {noticias.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          No hay noticias. Creá la primera.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left p-4 font-medium text-gray-500">Título</th>
              <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Fecha</th>
              <th className="text-left p-4 font-medium text-gray-500">Estado</th>
              <th className="text-right p-4 font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map((noticia) => (
              <tr key={noticia.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-medium line-clamp-1">{noticia.titulo}</p>
                </td>
                <td className="p-4 text-gray-400 hidden md:table-cell">
                  {new Date(noticia.fecha_creacion).toLocaleDateString("es-AR")}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => togglePublicada(noticia.id, noticia.publicada)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      noticia.publicada ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {noticia.publicada ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {noticia.publicada ? "Publicada" : "Borrador"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/noticias/${noticia.id}`}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(noticia.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                    >
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
  );
}
