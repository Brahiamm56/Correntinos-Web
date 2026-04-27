"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

function ExitoContent() {
  const searchParams = useSearchParams();
  const orden = searchParams.get("orden");

  return (
    <div className="min-h-screen bg-[var(--crema)] pt-28 pb-20">
      <div className="max-w-lg mx-auto px-[var(--section-padding-x)] text-center">
        <div className="glass-card p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl mb-3">¡Compra confirmada!</h1>
          <p className="text-[var(--gris-calido)] mb-6">
            Tu pedido fue registrado exitosamente. Recibirás un email con los detalles.
          </p>
          {orden && (
            <div className="bg-[var(--verde-palido)] rounded-xl p-4 mb-8 border border-[var(--border)]">
              <p className="text-xs text-[var(--gris-calido)] mb-1">Número de orden</p>
              <p className="font-bold text-lg text-[var(--verde-profundo)]">{orden}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/perfil" className="btn-secondary">
              Ver mis pedidos
            </Link>
            <Link href="/tienda" className="btn-primary">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--crema)]"><div className="text-[var(--gris-calido)]">Cargando...</div></div>}>
      <ExitoContent />
    </Suspense>
  );
}
