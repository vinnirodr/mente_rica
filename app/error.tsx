"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="app-shell flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-2xl text-ink">Algo deu errado</h1>
      <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
        Tivemos um problema ao carregar esta tela. Seus dados continuam salvos neste
        navegador.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-2xl bg-gold px-6 py-3 text-sm font-semibold text-night"
      >
        Tentar novamente
      </button>
    </main>
  );
}
