"use client";

import { useState, useEffect } from "react";
import { getConfiguracion, updateConfiguracion } from "@/app/admin/configuracion/actions";
import { CheckCircle, Save } from "lucide-react";
import Link from "next/link";

export default function AdminConfiguracionPage() {
  const [form, setForm] = useState({
    id: "",
    email_fundacion: "",
    telefono_fundacion: "",
    whatsapp_contacto: "",
    ubicacion_fundacion: "",
    direccion_retiro: "",
    instrucciones_pedido: "",
    texto_home: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getConfiguracion().then(({ data }) => {
      if (data) {
        setForm({
          id: data.id,
          email_fundacion: data.email_fundacion || "",
          telefono_fundacion: data.telefono_fundacion || "",
          whatsapp_contacto: data.whatsapp_contacto || "+54 379 405 9015",
          ubicacion_fundacion: data.ubicacion_fundacion || "Corrientes, Argentina",
          direccion_retiro: data.direccion_retiro || "Retiro o entrega a coordinar por WhatsApp",
          instrucciones_pedido: data.instrucciones_pedido || "Después de enviar el pedido, coordinamos el pago y la entrega por WhatsApp.",
          texto_home: data.texto_home || "",
        });
      }
      setFetching(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await updateConfiguracion(form.id, {
      email_fundacion: form.email_fundacion,
      telefono_fundacion: form.telefono_fundacion,
      whatsapp_contacto: form.whatsapp_contacto,
      ubicacion_fundacion: form.ubicacion_fundacion,
      direccion_retiro: form.direccion_retiro,
      instrucciones_pedido: form.instrucciones_pedido,
      texto_home: form.texto_home,
    });

    if (res.error) {
      setError(res.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  if (fetching) return <p role="status" className="border-b border-gray-200 py-8 text-sm text-gray-500">Cargando configuración...</p>;

  return (
    <div>
      <header className="flex flex-col gap-4 border-b border-gray-300 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Sitio público</p><h1 className="mt-2 text-3xl font-bold text-gray-950">Configuración</h1><p className="mt-2 max-w-2xl text-sm text-gray-500">Estos datos actualizan el home, el pie, Contacto, Donaciones y los pedidos de la tienda.</p></div><Link href="/" target="_blank" className="text-sm font-semibold text-[var(--verde-hoja)] hover:underline">Ver sitio</Link></header>

      <form onSubmit={handleSubmit} className="mt-8 max-w-3xl space-y-5">
        <div className="space-y-6 border-y border-gray-300 bg-white px-5 py-6 sm:px-7">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email de la fundación
            </label>
            <input
              id="email"
              type="email"
              value={form.email_fundacion}
              onChange={(e) => setForm({ ...form, email_fundacion: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1.5">
              Teléfono de contacto
            </label>
            <input
              id="telefono"
              type="tel"
              value={form.telefono_fundacion}
              onChange={(e) => setForm({ ...form, telefono_fundacion: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1.5">
              WhatsApp para contacto y pedidos
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={form.whatsapp_contacto}
              onChange={(e) => setForm({ ...form, whatsapp_contacto: e.target.value })}
              placeholder="+54 379 405 9015"
              className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-gray-500">Se usa para el botón de WhatsApp, donaciones y pedidos de la tienda.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1.5">
                Ubicación pública
              </label>
              <input
                id="ubicacion"
                type="text"
                value={form.ubicacion_fundacion}
                onChange={(e) => setForm({ ...form, ubicacion_fundacion: e.target.value })}
                placeholder="Corrientes, Argentina"
                className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="retiro" className="block text-sm font-medium text-gray-700 mb-1.5">
                Punto de retiro o entrega
              </label>
              <input
                id="retiro"
                type="text"
                value={form.direccion_retiro}
                onChange={(e) => setForm({ ...form, direccion_retiro: e.target.value })}
                placeholder="A coordinar por WhatsApp"
                className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="instrucciones_pedido" className="block text-sm font-medium text-gray-700 mb-1.5">
              Instrucciones para pedidos
            </label>
            <textarea
              id="instrucciones_pedido"
              value={form.instrucciones_pedido}
              onChange={(e) => setForm({ ...form, instrucciones_pedido: e.target.value })}
              rows={3}
              placeholder="Después de enviar el pedido, coordinamos el pago y la entrega por WhatsApp."
              className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="texto_home" className="block text-sm font-medium text-gray-700 mb-1.5">
              Texto de bienvenida (home)
            </label>
            <textarea
              id="texto_home"
              value={form.texto_home}
              onChange={(e) => setForm({ ...form, texto_home: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none"
            />
          </div>
        </div>

        {error && <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center gap-2 bg-[var(--verde-profundo)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--verde-selva)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Guardando..." : "Guardar Configuración"}
          </button>
          {saved && <span role="status" className="inline-flex items-center gap-2 text-sm font-medium text-green-700"><CheckCircle className="h-4 w-4" />Guardado correctamente</span>}
        </div>
      </form>
    </div>
  );
}
