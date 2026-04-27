/**
 * Crea un usuario administrador en Supabase.
 * Uso:
 *   node --env-file=.env.local scripts/create-admin.mjs --email admin@correntinos.org --password "TuClaveSegura" --nombre "Administrador"
 */

import { createClient } from "@supabase/supabase-js";

function readArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = readArg("--email") || process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = readArg("--password") || process.env.ADMIN_PASSWORD;
const ADMIN_NOMBRE = readArg("--nombre") || process.env.ADMIN_NOMBRE || "Administrador";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY en el entorno.");
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Indicá --email y --password, o definí ADMIN_EMAIL y ADMIN_PASSWORD en el entorno.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log(`\nCreando usuario admin: ${ADMIN_EMAIL}\n`);

  // 1. Crear usuario en auth.users
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true, // confirma el email automáticamente
      user_metadata: { nombre: ADMIN_NOMBRE },
    });

  if (authError) {
    if (authError.message.includes("already been registered")) {
      console.log("⚠️  El email ya existe. Buscando el usuario...");
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users.find((u) => u.email === ADMIN_EMAIL);
      if (!existing) {
        console.error("No se pudo encontrar el usuario existente.");
        process.exit(1);
      }
      await setAdminRole(existing.id, existing.email);
      return;
    }
    console.error("Error al crear usuario:", authError.message);
    process.exit(1);
  }

  await setAdminRole(authData.user.id, authData.user.email);
}

async function setAdminRole(userId, email) {
  // 2. Upsert en tabla usuarios con rol = admin
  const { error: profileError } = await supabase.from("usuarios").upsert(
    {
      id: userId,
      email: email,
      nombre: ADMIN_NOMBRE,
      rol: "admin",
    },
    { onConflict: "id" }
  );

  if (profileError) {
    console.error("Error al asignar rol admin:", profileError.message);
    process.exit(1);
  }

  console.log("✅ Usuario admin creado exitosamente!\n");
  console.log("  Email:      " + ADMIN_EMAIL);
  console.log("  Contraseña: " + ADMIN_PASSWORD);
  console.log("  Panel:      http://localhost:3000/admin\n");
  console.log(
    "⚠️  Cambiá la contraseña desde el panel de Supabase después del primer ingreso.\n"
  );
}

main();
