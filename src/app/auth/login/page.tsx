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
