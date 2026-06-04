"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { TopBar } from "@/components/shell/TopBar";
import { ProgressBar } from "@/components/ui/Progress";
import { PrincipleCard } from "@/components/principles/PrincipleCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { PRINCIPLES } from "@/lib/mock/principles";
import { track } from "@/lib/analytics";
import type { PrincipleStatus } from "@/lib/types";
import { Crown, Lock } from "lucide-react";

export default function PrinciplesPage() {
  const progress = useStore((s) => s.progress);
  const unlocked = useStore((s) => s.unlockedCount());
  const plan = useStore((s) => s.user.plan);
  const completed = useStore((s) => s.completedCount());
  const [paywall, setPaywall] = useState(false);

  function statusFor(id: number): PrincipleStatus {
    const p = progress[id];
    if (p?.status) return p.status;
    // Free: princípios 1–3 liberados; demais aparecem bloqueados com preview de valor.
    const planLocked = plan === "free" && id > 3;
    const progressLocked = id > unlocked;
    return planLocked || progressLocked ? "locked" : "not_started";
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

        {plan === "free" && (
          <button
            onClick={() => {
              track("paywall_seen", { source: "principles_grid" });
              setPaywall(true);
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-left"
          >
            <Crown className="text-gold" size={22} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">Desbloqueie os 13 princípios</p>
              <p className="text-xs text-ink-muted">
                No plano Pro você acessa todos os exercícios e o coach IA.
              </p>
            </div>
            <Lock size={16} className="text-gold" />
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.id}
              onClick={() => {
                if (statusFor(p.id) === "locked" && plan === "free" && p.id > 3) {
                  track("paywall_seen", { source: "locked_card" });
                  setPaywall(true);
                }
              }}
            >
              <PrincipleCard principle={p} status={statusFor(p.id)} index={i} />
            </div>
          ))}
        </div>
      </div>

      <Modal open={paywall} onClose={() => setPaywall(false)} title="Desbloqueie tudo no Pro">
        <PaywallContent onClose={() => setPaywall(false)} />
      </Modal>
    </div>
  );
}

function PaywallContent({ onClose }: { onClose: () => void }) {
  const setPlan = useStore((s) => s.setPlan);
  return (
    <div className="space-y-4">
      <ul className="space-y-2 text-sm text-ink-muted">
        {[
          "Todos os 13 princípios e exercícios",
          "Coach IA ilimitado, 24/7",
          "Diário completo e dashboard avançado",
        ].map((f) => (
          <li key={f} className="flex items-center gap-2">
            <Crown size={16} className="text-gold" /> {f}
          </li>
        ))}
      </ul>
      <div className="rounded-2xl bg-night-700/50 p-4 text-center">
        <p className="font-display text-3xl text-ink">R$ 29,90</p>
        <p className="text-xs text-ink-faint">por mês · ou R$ 239/ano</p>
      </div>
      <Button
        className="w-full"
        size="lg"
        onClick={() => {
          setPlan("pro");
          track("subscription_started", { plan: "pro" });
          onClose();
        }}
      >
        Assinar o Pro
      </Button>
    </div>
  );
}
