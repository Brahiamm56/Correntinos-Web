import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../src/lib/auth";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Sembrando datos iniciales en NeonDB...");

  // 1. Categorías iniciales
  const categoriasIniciales = [
    { nombre: "Remeras", descripcion: "Remeras de la fundación" },
    { nombre: "Accesorios", descripcion: "Accesorios y merchandise" },
    { nombre: "Plantines", descripcion: "Plantines y semillas nativas" },
  ];

  for (const cat of categoriasIniciales) {
    const existing = await db
      .select()
      .from(schema.categorias)
      .where(eq(schema.categorias.nombre, cat.nombre))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(schema.categorias).values(cat);
      console.log(`✓ Categoría creada: ${cat.nombre}`);
    } else {
      console.log(`- Categoría existente: ${cat.nombre}`);
    }
  }

  // 2. Configuración inicial
  const existingConfig = await db.select().from(schema.configuracion).limit(1);
  if (existingConfig.length === 0) {
    await db.insert(schema.configuracion).values({
      email_fundacion: "correntinosclim@gmail.com",
      telefono_fundacion: "+54 379 405 9015",
      texto_home: "Somos una fundación socioambiental comprometida con la acción climática en la provincia de Corrientes, Argentina.",
    });
    console.log("✓ Configuración del sitio inicializada.");
  } else {
    console.log("- Configuración del sitio ya existe.");
  }

  // 3. Crear usuario administrador por defecto si no existe
  const adminEmail = process.env.ADMIN_EMAIL || "admin@correntinosclim.org";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456!";
  const adminName = process.env.ADMIN_NOMBRE || "Administrador Correntinos";

  try {
    const existingUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, adminEmail))
      .limit(1);

    if (existingUser.length === 0) {
      // Usamos el API de better auth para registrarlo con hash de password
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      // Actualizamos el rol a admin
      await db
        .update(schema.user)
        .set({ role: "admin" })
        .where(eq(schema.user.email, adminEmail));

      console.log(`\n🎉 Usuario administrador creado exitosamente:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`   Rol: admin`);
    } else {
      // Aseguramos rol admin
      await db
        .update(schema.user)
        .set({ role: "admin" })
        .where(eq(schema.user.email, adminEmail));
      console.log(`\n- Usuario administrador ${adminEmail} ya existe (rol verificado como admin).`);
    }
  } catch (err) {
    console.warn("Nota sobre creación de admin:", err instanceof Error ? err.message : err);
  }

  console.log("\n✅ Seed completado con éxito.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
