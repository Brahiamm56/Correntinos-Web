"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Email o contraseña incorrectos"
        : error.message);
      setLoading(false);
      return;
    }

    // Si hay redirect explícito (ej: venía de /admin), usarlo
    if (redirect !== "/") {
      router.push(redirect);
      router.refresh();
      return;
    }

    // Si no hay redirect, verificar rol y redirigir según corresponda
    if (data.user) {
      const { data: profile } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", data.user.id)
        .single();

      if (profile?.rol === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
    router.refresh();
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--crema)]" style={{ paddingTop: 100 }}>
      <div className="w-full max-w-md mx-4">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Image src="/correntinos-logo.png" alt="Logo" width={56} height={56} />
            </Link>
            <h1 className="text-2xl mb-2">Iniciar Sesión</h1>
            <p className="text-sm text-[var(--gris-calido)]">
              Ingresá a tu cuenta para continuar
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-[var(--border-strong)] bg-white hover:bg-gray-50 transition-colors mb-6 font-semibold text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--surface)] px-3 text-[var(--gris-calido)]">
                o con email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-white focus:border-[var(--verde-claro)] focus:outline-none transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--gris-calido)] mt-6">
            ¿No tenés cuenta?{" "}
            <Link href={`/auth/register?redirect=${encodeURIComponent(redirect)}`} className="text-[var(--verde-hoja)] font-semibold hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--crema)]"><div className="text-[var(--gris-calido)]">Cargando...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
