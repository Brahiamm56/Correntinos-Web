"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  busy = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [busy, onCancel, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/45 px-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !busy) onCancel();
    }}>
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-md border-t-4 border-red-600 bg-white p-6 shadow-2xl">
        <h2 id={titleId} className="font-sans text-xl font-bold text-gray-950">{title}</h2>
        <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-gray-600">{description}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} disabled={busy} className="min-h-11 border-b border-gray-500 px-3 text-sm font-semibold text-gray-700 disabled:opacity-50">Cancelar</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="min-h-11 bg-red-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50">{busy ? "Procesando..." : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
