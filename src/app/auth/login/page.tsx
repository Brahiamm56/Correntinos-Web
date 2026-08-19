"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { initialize } = useAuthStore();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        setError(
          signInError.message?.includes("Invalid") || signInError.message?.includes("credentials")
            ? "Email o contraseña incorrectos"
            : signInError.message || "Error al iniciar sesión"
        );
        setLoading(false);
        return;
      }

      await initialize();

      const user = data?.user as { role?: string } | undefined;
      if (redirect !== "/") {
        router.push(redirect);
      } else if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirect !== "/" ? redirect : "/admin",
      });
      if (result.error) setError("El ingreso con Google no está disponible en este momento.");
    } catch {
      setError("El ingreso con Google no está disponible en este momento.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--papel)] px-5 pb-16 pt-32">
      <div className="w-full max-w-md">
        <div className="border-y border-[var(--border)] py-9 sm:px-3">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Image src="/correntinos-logo.png" alt="Fundación Correntinos Contra el Cambio Climático" width={64} height={64} className="h-16 w-16 object-contain" />
            </Link>
            <h1 className="text-2xl mb-2">Iniciar Sesión</h1>
            <p className="text-sm text-[var(--gris-calido)]">
              Ingresá a tu cuenta para continuar
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="mb-6 flex min-h-12 w-full items-center justify-center gap-3 border border-[var(--border-strong)] bg-transparent px-4 py-3 text-sm font-semibold transition-colors hover:border-[var(--verde-hoja)] hover:bg-white"
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
                className="field text-sm"
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
                className="field text-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="border-l-2 border-red-600 py-2 pl-3 text-sm text-red-700">{error}</p>
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
