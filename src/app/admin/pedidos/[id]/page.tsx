"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getOrden, marcarOrdenProcesada } from "@/app/admin/pedidos/actions";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Download } from "lucide-react";
import { ClockCircle } from "reicon-react";
import type { Orden } from "@/types/database";

export default function PedidoDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "error" | "success"; message: string } | null>(null);

  useEffect(() => {
    getOrden(id).then(({ data }) => {
      if (data) setOrden(data);
      setLoading(false);
    });
  }, [id]);

  async function handleMarcarProcesado() {
    if (!orden) return;
    const res = await marcarOrdenProcesada(orden.id);
    if (res.error) {
      setFeedback({ type: "error", message: res.error });
      return;
    }
    setOrden({ ...orden, estado: "procesado" });
    setFeedback({ type: "success", message: "El pedido quedó marcado como procesado." });

    // Send email notification stub
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: orden.cliente_email,
          subject: `Orden ${orden.numero_orden} - Procesada`,
          html: `<p>Hola ${orden.cliente_nombre}, tu orden ${orden.numero_orden} fue procesada.</p>`,
        }),
      });
    } catch {
      // Ignore email errors if email provider not yet configured
    }
  }

  function descargarTicket() {
    if (!orden) return;
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

  if (loading) return <p role="status" className="border-b border-gray-200 py-8 text-sm text-gray-500">Cargando pedido...</p>;
  if (!orden) return <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">Pedido no encontrado.</p>;

  return (
    <div>
      <Link href="/admin/pedidos" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver a pedidos
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-300 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Detalle del pedido</p><h1 className="mt-2 text-3xl font-bold text-gray-950">{orden.numero_orden}</h1>
          <p className="text-sm text-gray-400">
            {new Date(orden.creado_en).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={descargarTicket} className="inline-flex min-h-11 items-center gap-2 border-b border-gray-500 px-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-950 hover:text-gray-950">
            <Download className="w-4 h-4" />
            Descargar Ticket
          </button>
          {orden.estado === "pendiente" && (
            <button onClick={handleMarcarProcesado} className="inline-flex min-h-11 items-center gap-2 bg-green-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-green-800">
              <CheckCircle className="w-4 h-4" />
              Marcar Procesado
            </button>
          )}
        </div>
      </div>
      {feedback && <p role={feedback.type === "error" ? "alert" : "status"} className={`mb-6 border-l-2 px-4 py-3 text-sm ${feedback.type === "error" ? "border-red-600 bg-red-50 text-red-700" : "border-green-600 bg-green-50 text-green-800"}`}>{feedback.message}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="border-y border-gray-300 bg-white py-6">
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
        </section>

        <section className="border-y border-gray-300 bg-white py-6">
          <h2 className="font-bold text-gray-900 mb-4">Estado</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className={`flex w-fit items-center gap-1.5 border-b px-1 py-1.5 text-sm font-semibold ${
              orden.estado === "procesado" ? "border-green-600 text-green-700" : "border-amber-500 text-amber-700"
            }`}>
              {orden.estado === "procesado" ? <><CheckCircle className="h-4 w-4" /> Procesado</> : <><ClockCircle size={16} /> Pendiente</>}
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--verde-profundo)]">
            ${Number(orden.total).toLocaleString("es-AR")}
          </div>
        </section>
      </div>

      <section className="mt-8 border-y border-gray-300 bg-white py-6">
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
      </section>
    </div>
  );
}
