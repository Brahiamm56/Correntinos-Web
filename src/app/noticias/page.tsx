import { db } from "@/db";
import { noticias } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import NoticiasClient from "./NoticiasClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Noticias",
  description: "Últimas noticias de la Fundación Correntinos sobre medio ambiente y cambio climático.",
};

async function loadNoticias() {
  try {
    const [noticiasRows, countResult] = await Promise.all([
      db
        .select({
          id: noticias.id,
          titulo: noticias.titulo,
          contenido: noticias.contenido,
          imagen_url: noticias.imagen_url,
          fecha_publicacion: noticias.fecha_publicacion,
        })
        .from(noticias)
        .where(eq(noticias.publicada, true))
        .orderBy(desc(noticias.fecha_publicacion)),
      db
        .select({ value: count() })
        .from(noticias)
        .where(eq(noticias.publicada, true)),
    ]);

    const formattedNoticias = noticiasRows.map((n) => ({
      ...n,
      fecha_publicacion: n.fecha_publicacion ? n.fecha_publicacion.toISOString() : null,
    }));

    return { noticias: formattedNoticias, total: countResult[0]?.value ?? 0 };
  } catch (error) {
    console.error("Error cargando noticias públicas:", error);
    return { noticias: [], total: 0 };
  }
}

export default async function NoticiasPage() {
  const data = await loadNoticias();
  return <NoticiasClient noticias={data.noticias} total={data.total} />;
}
