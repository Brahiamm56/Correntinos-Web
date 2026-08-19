import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import * as dotenv from "dotenv";

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: ".env.local" });
  dotenv.config({ path: ".env" });
}

function createMissingDatabaseProxy(): NeonHttpDatabase<typeof schema> {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "DATABASE_URL no está configurada. Agregá la variable de entorno en Vercel para habilitar la base de datos.",
        );
      },
    },
  ) as NeonHttpDatabase<typeof schema>;
}

export const db = process.env.DATABASE_URL
  ? drizzle(neon(process.env.DATABASE_URL), { schema })
  : createMissingDatabaseProxy();
