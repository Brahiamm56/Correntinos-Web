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
      <header className="flex flex-col gap-4 border-b border-gray-300 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Sitio público</p><h1 className="mt-2 text-3xl font-bold text-gray-950">Configuración</h1><p className="mt-2 max-w-2xl text-sm text-gray-500">Estos datos actualizan el hero, el pie, Contacto y Donaciones.</p></div><Link href="/" target="_blank" className="text-sm font-semibold text-[var(--verde-hoja)] hover:underline">Ver sitio</Link></header>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
        <div className="space-y-5 border-y border-gray-300 bg-white py-6">
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
