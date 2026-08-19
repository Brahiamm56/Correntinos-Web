"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "reicon-react";

function ExitoContent() {
  const searchParams = useSearchParams();
  const orden = searchParams.get("orden");

  return (
    <div className="min-h-screen bg-[var(--papel)] pt-28 pb-20">
      <div className="mx-auto max-w-lg px-[var(--section-padding-x)]">
        <div className="border-y border-[var(--border-strong)] py-10">
          <CheckCircle className="mb-6 h-14 w-14 text-[var(--verde-hoja)]" />
          <h1 className="text-2xl mb-3">Pedido registrado</h1>
          <p className="text-[var(--gris-calido)] mb-6">
            Guardamos tu pedido. Conservá el número de orden para consultar su estado.
          </p>
          {orden && (
            <div className="mb-8 border-y border-[var(--border)] py-4">
              <p className="text-xs text-[var(--gris-calido)] mb-1">Número de orden</p>
              <p className="font-bold text-lg text-[var(--verde-profundo)]">{orden}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contacto" className="btn-secondary">
              Consultar por mi pedido
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
