"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PasswordField from "@/components/PasswordField";
import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth";

function RegisterForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { initialize } = useAuthStore();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: nombre,
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message || "Error al crear la cuenta");
        setLoading(false);
        return;
      }

      await initialize();
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="auth-page flex items-center justify-center px-5 pb-12 pt-28 sm:py-32">
      <div className="w-full max-w-md">
        <div className="auth-card">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Image src="/cccclogo.png" alt="Fundación Correntinos Contra el Cambio Climático" width={80} height={80} quality={95} className="h-12 w-12 object-contain" />
            </Link>
            <h1 className="text-2xl mb-2">Sumate a la comunidad.</h1>
            <p className="text-sm text-[var(--gris-calido)]">
              Registrate para comprar y apoyar la causa
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                Nombre completo
              </label>
              <input
                id="nombre" autoComplete="name"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="field text-sm"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1.5 text-[var(--gris-medio)]">
                Email
              </label>
              <input
                id="email"
                type="email" autoComplete="email"
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
              <PasswordField
                id="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field text-sm"
                placeholder="Mínimo 8 caracteres"
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
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--gris-calido)] mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-[var(--verde-hoja)] font-semibold hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--crema)]"><div className="text-[var(--gris-calido)]">Cargando...</div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
