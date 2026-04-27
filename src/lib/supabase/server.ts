import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import "server-only";

export class AuthorizationError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cannot set cookies
          }
        },
      },
    }
  );
}

export async function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

export async function getAuthenticatedUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthorizationError("Necesitás iniciar sesión");
  }

  return user;
}

export async function requireAdminUser(): Promise<User> {
  const user = await getAuthenticatedUser();
  const serviceClient = await createServiceClient();
  const { data: profile, error } = await serviceClient
    .from("usuarios")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (error || profile?.rol !== "admin") {
    throw new AuthorizationError("Necesitás permisos de administrador");
  }

  return user;
}
