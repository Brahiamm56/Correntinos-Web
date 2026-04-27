"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface ProductoAdmin {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  imagen_url: string | null;
  activo: boolean;
  categoria: { nombre: string } | null;
  creado_en: string;
}

export default function ProductosAdminList({ productos: initial }: { productos: ProductoAdmin[] }) {
  const [productos, setProductos] = useState(initial);

  async function toggleActivo(id: string, activo: boolean) {
    const supabase = createClient();
    await supabase.from("productos").update({ activo: !activo }).eq("id", id);
    setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !activo } : p)));
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    const supabase = createClient();
    await supabase.from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {productos.length === 0 ? (
        <div className="p-8 text-center text-gray-400">No hay productos.</div>
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
            {productos.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.imagen_url ? (
                        <Image src={p.imagen_url} alt={p.nombre} width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">🌿</div>
                      )}
                    </div>
                    <span className="font-medium line-clamp-1">{p.nombre}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-400 hidden md:table-cell">{p.categoria?.nombre || "—"}</td>
                <td className="p-4 text-right font-medium">${Number(p.precio).toLocaleString("es-AR")}</td>
                <td className="p-4 text-right">
                  <span className={`font-medium ${p.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleActivo(p.id, p.activo)}
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {p.activo ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/productos/${p.id}`} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
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
