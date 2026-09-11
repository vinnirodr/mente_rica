"use client";

import { useStore } from "@/lib/store";
import { TopBar } from "@/components/shell/TopBar";
import { ProgressBar } from "@/components/ui/Progress";
import { PrincipleCard } from "@/components/principles/PrincipleCard";
import { PRINCIPLES } from "@/lib/mock/principles";
import type { PrincipleStatus } from "@/lib/types";

export default function PrinciplesPage() {
  const progress = useStore((s) => s.progress);
  const unlocked = useStore((s) => s.unlockedCount());
  const completed = useStore((s) => s.completedCount());
  const recommendedId = useStore((s) => s.recommendedPrincipleId());

  function statusFor(id: number): PrincipleStatus {
    const p = progress[id];
    if (p?.status) return p.status;
    // O princípio recomendado pelo diagnóstico é sempre a porta de entrada.
    if (id === recommendedId) return "not_started";
    // Desbloqueio progressivo pela prática — não é paywall: no beta tudo é gratuito.
    return id > unlocked ? "locked" : "not_started";
  }

  return (
    <div>
      <TopBar title="Princípios" />
      <div className="space-y-5 px-5 pb-6">
        <div className="card-surface space-y-2 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">Progresso da jornada</span>
            <span className="font-semibold text-gold">
              {completed} de {PRINCIPLES.length}
            </span>
          </div>
          <ProgressBar value={(completed / PRINCIPLES.length) * 100} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {PRINCIPLES.map((p, i) => (
            <PrincipleCard
              key={p.id}
              principle={p}
              status={statusFor(p.id)}
              index={i}
              recommended={p.id === recommendedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
