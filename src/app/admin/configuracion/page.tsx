"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save } from "lucide-react";

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
    const supabase = createClient();
    supabase
      .from("configuracion")
      .select("*")
      .order("actualizado_en", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
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

    const supabase = createClient();
    const { error } = await supabase
      .from("configuracion")
      .update({
        email_fundacion: form.email_fundacion,
        telefono_fundacion: form.telefono_fundacion,
        texto_home: form.texto_home,
      })
      .eq("id", form.id);

    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  }

  if (fetching) return <div className="text-gray-400">Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email de la fundación
            </label>
            <input
              id="email"
              type="email"
              value={form.email_fundacion}
              onChange={(e) => setForm({ ...form, email_fundacion: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
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
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--verde-claro)] focus:ring-1 focus:ring-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--verde-profundo)] text-white font-medium hover:bg-[var(--verde-selva)] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Guardando..." : "Guardar Configuración"}
          </button>
          {saved && <span className="text-green-600 text-sm font-medium">✓ Guardado correctamente</span>}
        </div>
      </form>
    </div>
  );
}
