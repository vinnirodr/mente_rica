export function FullScreenLoader() {
  return (
    <div className="app-shell flex flex-col items-center justify-center gap-6">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 rounded-full border-2 border-gold/30" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold/40" />
        <span className="absolute inset-0 flex items-center justify-center font-display text-2xl gold-text">
          M
        </span>
      </div>
      <p className="text-sm text-ink-faint">Preparando sua jornada…</p>
    </div>
  );
}
