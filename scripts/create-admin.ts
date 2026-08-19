/**
 * Crea o promueve un usuario administrador en NeonDB con Better Auth.
 * Uso:
 *   pnpm tsx scripts/create-admin.ts --email admin@correntinosclim.org --password "TuClaveSegura" --nombre "Administrador"
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "../src/lib/auth";
import { hashPassword } from "better-auth/crypto";
import { randomBytes } from "node:crypto";

function readArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

const ADMIN_EMAIL = readArg("--email") || process.env.ADMIN_EMAIL || "admin@correntinosclim.org";
const ADMIN_PASSWORD = readArg("--password") || process.env.ADMIN_PASSWORD || "Admin123456!";
const ADMIN_NOMBRE = readArg("--nombre") || process.env.ADMIN_NOMBRE || "Administrador";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const CREDENTIAL_ISSUER = "local:credential";

function generateAccountId() {
  return randomBytes(16).toString("hex");
}

async function ensurePasswordAccount(userId: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const now = new Date();

  const existingAccount = await db
    .select()
    .from(schema.account)
    .where(
      and(
        eq(schema.account.userId, userId),
        eq(schema.account.providerId, "credential"),
        eq(schema.account.issuer, CREDENTIAL_ISSUER),
        eq(schema.account.accountId, userId)
      )
    )
    .limit(1);

  if (existingAccount.length === 0) {
    await db.insert(schema.account).values({
      id: generateAccountId(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hashedPassword,
      issuer: CREDENTIAL_ISSUER,
      createdAt: now,
      updatedAt: now,
    });
    return "created";
  }

  await db
    .update(schema.account)
    .set({ password: hashedPassword, updatedAt: now })
    .where(eq(schema.account.id, existingAccount[0].id));

  return "updated";
}

async function main() {
  console.log(`\nConfigurando usuario admin: ${ADMIN_EMAIL}\n`);

  try {
    const existing = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, ADMIN_EMAIL))
      .limit(1);

    if (existing.length === 0) {
      await auth.api.signUpEmail({
        body: {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          name: ADMIN_NOMBRE,
        },
      });

      await db
        .update(schema.user)
        .set({ role: "admin" })
        .where(eq(schema.user.email, ADMIN_EMAIL));

      const created = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, ADMIN_EMAIL))
        .limit(1);

      if (created[0]) {
        await ensurePasswordAccount(created[0].id, ADMIN_PASSWORD);
      }

      console.log("✅ Usuario admin creado exitosamente!\n");
      console.log("  Email:      " + ADMIN_EMAIL);
      console.log("  Contraseña: " + ADMIN_PASSWORD);
      console.log("  Panel:      http://localhost:3000/admin\n");
    } else {
      await db
        .update(schema.user)
        .set({ role: "admin", name: ADMIN_NOMBRE })
        .where(eq(schema.user.email, ADMIN_EMAIL));

      const passwordStatus = await ensurePasswordAccount(existing[0].id, ADMIN_PASSWORD);

      console.log("✅ Usuario existente configurado como admin!\n");
      console.log("  Email:      " + ADMIN_EMAIL);
      console.log("  Credencial: " + (passwordStatus === "created" ? "creada" : "actualizada"));
      console.log("  Panel:      http://localhost:3000/admin\n");
    }
  } catch (error) {
    console.error("Error al configurar usuario admin:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
