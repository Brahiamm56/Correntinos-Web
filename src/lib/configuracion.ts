import "server-only";

import { cache } from "react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { configuracion } from "@/db/schema";

export type PublicConfiguration = {
  email: string;
  phone: string;
  homeIntro: string;
};

const defaults: PublicConfiguration = {
  email: "correntinosclim@gmail.com",
  phone: "+54 379 405 9015",
  homeIntro:
    "Somos una fundación socioambiental que transforma conocimiento, participación y alianzas en acción climática concreta para Corrientes y el NEA.",
};

export const getPublicConfiguration = cache(async (): Promise<PublicConfiguration> => {
  try {
    const [row] = await db
      .select()
      .from(configuracion)
      .orderBy(desc(configuracion.actualizado_en))
      .limit(1);

    if (!row) return defaults;

    return {
      email: row.email_fundacion?.trim() || defaults.email,
      phone: row.telefono_fundacion?.trim() || defaults.phone,
      homeIntro: row.texto_home?.trim() || defaults.homeIntro,
    };
  } catch (error) {
    console.error("No se pudo cargar la configuración pública:", error);
    return defaults;
  }
});
