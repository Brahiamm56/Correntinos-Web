import type { MetadataRoute } from "next";
import { getPublishedNoticias } from "@/lib/noticias";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://correntinosclim.org";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/quienes-somos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/noticias`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/trabaja-con-nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const noticias = await getPublishedNoticias();
  const noticiaPages: MetadataRoute.Sitemap = noticias.map((noticia) => ({
    url: `${baseUrl}/noticias/${noticia.id}`,
    lastModified: noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...noticiaPages];
}
