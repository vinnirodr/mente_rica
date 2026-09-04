import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-shell flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-6xl text-gold">404</p>
      <h1 className="font-display text-2xl text-ink">Página não encontrada</h1>
      <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
        O endereço que você abriu não existe ou foi movido.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-2xl bg-gold px-6 py-3 text-sm font-semibold text-night"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
