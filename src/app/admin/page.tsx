import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, Newspaper, DollarSign, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: totalOrdenes },
    { data: ultimasOrdenes },
    { data: ultimasNoticias },
    { data: ventasData },
  ] = await Promise.all([
    supabase.from("ordenes").select("*", { count: "exact", head: true }),
    supabase.from("ordenes").select("*").order("creado_en", { ascending: false }).limit(5),
    supabase.from("noticias").select("*").order("fecha_creacion", { ascending: false }).limit(5),
    supabase.from("ordenes").select("total"),
  ]);

  const totalVentas = ventasData?.reduce((sum, o) => sum + Number(o.total), 0) || 0;
  const pendientes = ultimasOrdenes?.filter((o) => o.estado === "pendiente").length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Ventas", value: `$${totalVentas.toLocaleString("es-AR")}`, icon: DollarSign, color: "bg-green-100 text-green-700" },
          { label: "Órdenes", value: totalOrdenes || 0, icon: Package, color: "bg-blue-100 text-blue-700" },
          { label: "Pendientes", value: pendientes, icon: Clock, color: "bg-yellow-100 text-yellow-700" },
          { label: "Noticias", value: ultimasNoticias?.length || 0, icon: Newspaper, color: "bg-purple-100 text-purple-700" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Últimas órdenes */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Últimas Órdenes</h2>
            <Link href="/admin/pedidos" className="text-sm text-[var(--verde-hoja)] font-medium hover:underline">
              Ver todas →
            </Link>
          </div>
          {!ultimasOrdenes || ultimasOrdenes.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin órdenes aún</p>
          ) : (
            <div className="space-y-3">
              {ultimasOrdenes.map((orden) => (
                <Link
                  key={orden.id}
                  href={`/admin/pedidos/${orden.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{orden.numero_orden}</p>
                    <p className="text-xs text-gray-400">{orden.cliente_nombre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${Number(orden.total).toLocaleString("es-AR")}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      orden.estado === "procesado" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {orden.estado}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Últimas noticias */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Últimas Noticias</h2>
            <Link href="/admin/noticias" className="text-sm text-[var(--verde-hoja)] font-medium hover:underline">
              Ver todas →
            </Link>
          </div>
          {!ultimasNoticias || ultimasNoticias.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin noticias aún</p>
          ) : (
            <div className="space-y-3">
              {ultimasNoticias.map((noticia) => (
                <Link
                  key={noticia.id}
                  href={`/admin/noticias/${noticia.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{noticia.titulo}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(noticia.fecha_creacion).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    noticia.publicada ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {noticia.publicada ? "Publicada" : "Borrador"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
