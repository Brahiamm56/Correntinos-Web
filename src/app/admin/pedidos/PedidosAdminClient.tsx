"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import type { Orden } from "@/types/database";

interface Props {
  ordenes: Orden[];
}

export default function PedidosAdminClient({ ordenes }: Props) {
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const filtered = ordenes.filter((o) => {
    const matchSearch =
      o.numero_orden?.toLowerCase().includes(search.toLowerCase()) ||
      o.cliente_nombre.toLowerCase().includes(search.toLowerCase()) ||
      o.cliente_email.toLowerCase().includes(search.toLowerCase());
    const matchEstado = !filterEstado || o.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  function exportCSV() {
    const headers = [
      "Nro Orden",
      "Fecha",
      "Cliente",
      "Email",
      "Teléfono",
      "Dirección",
      "Ciudad",
      "Productos",
      "Total",
      "Estado",
    ];

    const rows = filtered.map((o) => [
      o.numero_orden,
      new Date(o.creado_en).toLocaleDateString("es-AR"),
      o.cliente_nombre,
      o.cliente_email,
      o.cliente_telefono,
      `"${o.cliente_direccion}"`,
      o.cliente_ciudad,
      `"${o.productos.map((p) => `${p.nombre} x${p.cantidad}`).join(", ")}"`,
      o.total,
      o.estado,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por orden, nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[var(--verde-claro)] focus:outline-none"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-[var(--verde-claro)] focus:outline-none"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesado">Procesado</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No se encontraron pedidos.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-medium text-gray-500">Orden</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden md:table-cell">Cliente</th>
                <th className="text-left p-4 font-medium text-gray-500 hidden lg:table-cell">Fecha</th>
                <th className="text-right p-4 font-medium text-gray-500">Total</th>
                <th className="text-center p-4 font-medium text-gray-500">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((orden) => (
                <tr key={orden.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <Link href={`/admin/pedidos/${orden.id}`} className="font-medium text-[var(--verde-hoja)] hover:underline">
                      {orden.numero_orden}
                    </Link>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="font-medium">{orden.cliente_nombre}</p>
                    <p className="text-xs text-gray-400">{orden.cliente_email}</p>
                  </td>
                  <td className="p-4 text-gray-400 hidden lg:table-cell">
                    {new Date(orden.creado_en).toLocaleDateString("es-AR")}
                  </td>
                  <td className="p-4 text-right font-bold">${Number(orden.total).toLocaleString("es-AR")}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      orden.estado === "procesado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {orden.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
