"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import type { Orden } from "@/types/database";

export default function PedidoDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("ordenes")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) setOrden(data as Orden);
        setLoading(false);
      });
  }, [id]);

  async function marcarProcesado() {
    if (!orden) return;
    const supabase = createClient();
    await supabase.from("ordenes").update({ estado: "procesado" }).eq("id", orden.id);
    setOrden({ ...orden, estado: "procesado" });

    // Stub: send email notification
    await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: orden.cliente_email,
        subject: `Orden ${orden.numero_orden} - Procesada`,
        html: `<p>Hola ${orden.cliente_nombre}, tu orden ${orden.numero_orden} fue procesada.</p>`,
      }),
    });
  }

  function descargarTicket() {
    if (!orden) return;
    // Generate a simple text ticket for download
    const ticket = `
═══════════════════════════════════════
  FUNDACIÓN CORRENTINOS
  CONTRA EL CAMBIO CLIMÁTICO
═══════════════════════════════════════

  TICKET DE COMPRA

  Orden: ${orden.numero_orden}
  Fecha: ${new Date(orden.creado_en).toLocaleDateString("es-AR")}
  Estado: ${orden.estado.toUpperCase()}

───────────────────────────────────────
  CLIENTE
───────────────────────────────────────
  Nombre: ${orden.cliente_nombre}
  Email: ${orden.cliente_email}
  Teléfono: ${orden.cliente_telefono}
  Dirección: ${orden.cliente_direccion}
  Ciudad: ${orden.cliente_ciudad}

───────────────────────────────────────
  PRODUCTOS
───────────────────────────────────────
${orden.productos.map((p) => `  ${p.nombre} x${p.cantidad}  $${(p.precio * p.cantidad).toLocaleString("es-AR")}`).join("\n")}

───────────────────────────────────────
  TOTAL: $${Number(orden.total).toLocaleString("es-AR")}
═══════════════════════════════════════
    `.trim();

    const blob = new Blob([ticket], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${orden.numero_orden}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div className="text-gray-400">Cargando...</div>;
  if (!orden) return <div className="text-gray-400">Orden no encontrada</div>;

  return (
    <div>
      <Link href="/admin/pedidos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a pedidos
      </Link>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{orden.numero_orden}</h1>
          <p className="text-sm text-gray-400">
            {new Date(orden.creado_en).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={descargarTicket} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4" />
            Descargar Ticket
          </button>
          {orden.estado === "pendiente" && (
            <button onClick={marcarProcesado} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Marcar Procesado
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cliente */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Datos del Cliente</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Nombre", orden.cliente_nombre],
              ["Email", orden.cliente_email],
              ["Teléfono", orden.cliente_telefono],
              ["Dirección", orden.cliente_direccion],
              ["Ciudad", orden.cliente_ciudad],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4">
                <dt className="text-gray-400 w-24 flex-shrink-0">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Estado */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Estado</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
              orden.estado === "procesado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {orden.estado === "procesado" ? "✓ Procesado" : "⏳ Pendiente"}
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--verde-profundo)]">
            ${Number(orden.total).toLocaleString("es-AR")}
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mt-6">
        <h2 className="font-bold text-gray-900 mb-4">Productos</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-3 font-medium text-gray-500">Producto</th>
              <th className="text-right pb-3 font-medium text-gray-500">Precio</th>
              <th className="text-right pb-3 font-medium text-gray-500">Cant.</th>
              <th className="text-right pb-3 font-medium text-gray-500">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.productos.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-3 font-medium">{p.nombre}</td>
                <td className="py-3 text-right text-gray-500">${Number(p.precio).toLocaleString("es-AR")}</td>
                <td className="py-3 text-right">{p.cantidad}</td>
                <td className="py-3 text-right font-bold">${(p.precio * p.cantidad).toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-4 text-right font-bold text-gray-700">Total</td>
              <td className="pt-4 text-right text-lg font-bold text-[var(--verde-profundo)]">
                ${Number(orden.total).toLocaleString("es-AR")}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
