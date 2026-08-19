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
      o.cliente_direccion,
      o.cliente_ciudad,
      o.productos.map((p) => `${p.nombre} x${p.cantidad}`).join(", "),
      o.total,
      o.estado,
    ]);

    const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-300 pb-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Tienda</p><h1 className="mt-2 text-3xl font-bold text-gray-950">Pedidos</h1><p className="mt-1 text-sm text-gray-500">{ordenes.length} pedidos registrados</p></div>
        <button
          onClick={exportCSV}
          className="inline-flex min-h-11 items-center gap-2 border-b border-gray-500 px-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="mb-5 mt-7 grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por orden, nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-b border-gray-300 bg-transparent py-3 pl-10 pr-4 text-sm focus:border-[var(--verde-hoja)] focus:outline-none"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="border-b border-gray-300 bg-transparent px-3 py-3 text-sm focus:border-[var(--verde-hoja)] focus:outline-none"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="procesado">Procesado</option>
        </select>
      </div>

      <div className="overflow-hidden border-t border-gray-300 bg-white">
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
                    <span className={`inline-flex items-center gap-1.5 border-b px-1 py-1 text-xs font-semibold ${
                      orden.estado === "procesado" ? "border-green-600 text-green-700" : "border-amber-500 text-amber-700"
                    }`}>
                      <span className={`h-1.5 w-1.5 ${orden.estado === "procesado" ? "bg-green-600" : "bg-amber-500"}`} aria-hidden="true" />
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
